import { createContext, useContext, useEffect, useState } from "react";
import zapato1 from "../assets/zapatos1.png";
import zapato2 from "../assets/zapatos2.png";
import zapato3 from "../assets/zapatos3.png";
import zapato4 from "../assets/zapatos4.png";
import zapato5 from "../assets/zapatos5.png";

const AuthContext = createContext();

const usuariosBase = [
  { id: "cliente", password: "1234", role: "cliente" },
  { id: "cajero1", password: "1234", role: "cajero" },
  { id: "cajero2", password: "1234", role: "cajero" },
  { id: "admin", password: "1234", role: "admin" },
];

const inventarioBase = [
  { id: "1", nombre: "Zapato Casual", descripcion: "Zapato para uso diario", precio: 100, imagen: zapato1, stock: 50 },
  { id: "2", nombre: "Zapato Deportivo", descripcion: "Ideal para correr", precio: 150, imagen: zapato2, stock: 30 },
  { id: "3", nombre: "Botas", descripcion: "Botas impermeables", precio: 200, imagen: zapato3, stock: 20 },
  { id: "4", nombre: "Sandalias", descripcion: "Para clima cálido", precio: 50, imagen: zapato4, stock: 40 },
  { id: "5", nombre: "Zapato Formal", descripcion: "Para eventos especiales", precio: 180, imagen: zapato5, stock: 15 },
];

// Función para generar un ID único para la factura
function generarIdUnico() {
  return "F-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem("users");
    return localUsers ? JSON.parse(localUsers) : usuariosBase;
  });

  const [inventario, setInventario] = useState(() => {
    const localInventario = localStorage.getItem("inventario");
    return localInventario ? JSON.parse(localInventario) : inventarioBase;
  });

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const localUsuario = localStorage.getItem("usuarioActual");
    return localUsuario ? JSON.parse(localUsuario) : null;
  });

  const [calificacionesServicio, setCalificacionesServicio] = useState(() => {
    const data = localStorage.getItem("calificacionesServicio");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("inventario", JSON.stringify(inventario));
  }, [inventario]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem("usuarioActual");
    }
  }, [usuarioActual]);

  useEffect(() => {
    localStorage.setItem("calificacionesServicio", JSON.stringify(calificacionesServicio));
  }, [calificacionesServicio]);

  function login(id, password) {
    const user = users.find((u) => u.id === id && u.password === password);
    if (user) {
      setUsuarioActual(user);
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    setUsuarioActual(null);
  }

  function crearCliente(id, password, datosExtra = {}) {
    const yaExiste = users.some((u) => u.id === id);
    if (yaExiste) return false;
    setUsers([...users, { id, password, role: "cliente", ...datosExtra }]);
    return true;
  }

  function validarClienteExiste(idCliente) {
    return users.some((u) => u.id === idCliente && u.role === "cliente");
  }

  function actualizarStock(productoId, cantidad) {
    setInventario((prevInventario) =>
      prevInventario.map((item) =>
        item.id === productoId
          ? { ...item, stock: Math.max(0, item.stock - cantidad) }
          : item
      )
    );
  }

  // Función para calcular subtotal
  function calcularSubtotal(productos, inventario) {
    return productos.reduce((acc, prod) => {
      const item = inventario.find(i => i.id === prod.idProducto);
      return acc + (item ? item.precio * prod.cantidad : 0);
    }, 0);
  }

  // Función para registrar venta con cálculo de totales y stock
  function registrarVenta(venta) {
  // Calcular subtotal
  const subtotal = calcularSubtotal(venta.productos, inventario);

  // Descuento aplicado (porcentaje)
  const descuentoAplicado = venta.descuentoAplicado || 0;

  // Total final después del descuento
  const totalFinal = subtotal - (subtotal * descuentoAplicado) / 100;

  // Agregar precio unitario a cada producto para guardarlo en la venta
  const productosConPrecio = venta.productos.map(({ idProducto, cantidad }) => {
    const item = inventario.find(i => i.id === idProducto);
    return {
      idProducto,
      cantidad,
      precio: item ? item.precio : 0,
    };
  });

  // Generar código único para la factura si no está definido
  const codigoFactura = venta.codigoFactura || `FAC-${Date.now()}`;

  const ventaCompleta = {
    ...venta,
    productos: productosConPrecio,
    subtotal,
    descuentoAplicado,
    totalFinal,
    fecha: new Date().toLocaleString(),
    codigoFactura,
  };

  // Guardar la venta en localStorage
  const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
  ventasGuardadas.push(ventaCompleta);
  localStorage.setItem("ventas", JSON.stringify(ventasGuardadas));

  // Actualizar stock de productos vendidos
  venta.productos.forEach(({ idProducto, cantidad }) =>
    actualizarStock(idProducto, cantidad)
  );

  // Retornar el código de factura generado
  return codigoFactura;
}

  function obtenerRecibosCliente(idCliente) {
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
    return ventasGuardadas.filter((v) => v.clienteId === idCliente);
  }

  function obtenerTodasLasVentas() {
    return JSON.parse(localStorage.getItem("ventas")) || [];
  }

  function registrarDevolucion(devolucion) {
    const devolucionesGuardadas = JSON.parse(localStorage.getItem("devoluciones")) || [];
    devolucionesGuardadas.push({ ...devolucion, estado: "pendiente", fecha: new Date().toLocaleString() });
    localStorage.setItem("devoluciones", JSON.stringify(devolucionesGuardadas));
  }

  function obtenerDevoluciones() {
    return JSON.parse(localStorage.getItem("devoluciones")) || [];
  }

  function actualizarEstadoDevolucion(index, estado) {
    const devoluciones = JSON.parse(localStorage.getItem("devoluciones")) || [];
    if (devoluciones[index]) {
      devoluciones[index].estado = estado;
      localStorage.setItem("devoluciones", JSON.stringify(devoluciones));
    }
  }

  function registrarCalificacionProducto(clienteId, productoId, calificacion) {
    const data = JSON.parse(localStorage.getItem("calificacionesProducto")) || {};
    if (!Array.isArray(data[productoId])) {
      data[productoId] = [];
    }

    const yaCalificado = data[productoId].some(entry => entry.clienteId === clienteId);
    if (!yaCalificado) {
      data[productoId].push({ ...calificacion, clienteId });
      localStorage.setItem("calificacionesProducto", JSON.stringify(data));
    }
  }

  function obtenerProductosParaCalificar(clienteId) {
    const ventas = JSON.parse(localStorage.getItem("ventas")) || [];
    const inventarioLocal = JSON.parse(localStorage.getItem("inventario")) || [];
    const calificaciones = JSON.parse(localStorage.getItem("calificacionesProducto")) || {};

    const productosYaCalificados = new Set();

    Object.entries(calificaciones).forEach(([productoId, lista]) => {
      if (lista.some(c => c.clienteId === clienteId)) {
        productosYaCalificados.add(productoId);
      }
    });

    const ventasCliente = ventas.filter(v => v.clienteId === clienteId);
    const productosComprados = ventasCliente.flatMap(venta => venta.productos.map(p => p.idProducto));

    const productosPendientes = [...new Set(productosComprados)]
      .filter(id => !productosYaCalificados.has(id))
      .map(id => inventarioLocal.find(p => p.id === id))
      .filter(Boolean);

    return productosPendientes;
  }

  function obtenerEstadisticasProducto() {
    const data = JSON.parse(localStorage.getItem("calificacionesProducto")) || {};
    const resultado = [];

    Object.entries(data).forEach(([productoId, calificaciones]) => {
      if (!Array.isArray(calificaciones)) return;

      let sumaTotal = 0;
      let cantidad = 0;

      calificaciones.forEach((calificacion) => {
        Object.entries(calificacion).forEach(([clave, valor]) => {
          if (clave !== "clienteId") {
            sumaTotal += Number(valor);
            cantidad++;
          }
        });
      });

      resultado.push({
        productoId,
        promedio: cantidad > 0 ? (sumaTotal / cantidad).toFixed(2) : "Sin calificaciones",
        total: cantidad,
      });
    });

    return resultado;
  }

  function registrarCalificacionServicio(respuestas) {
    const respuestasConCliente = { idCliente: usuarioActual?.id, ...respuestas };
    setCalificacionesServicio(prev => [...prev, respuestasConCliente]);
  }

  function obtenerEstadisticasServicio() {
    const data = JSON.parse(localStorage.getItem("calificacionesServicio")) || [];
    const estadisticas = {};

    data.forEach((respuestas) => {
      Object.entries(respuestas).forEach(([pregunta, valor]) => {
        if (pregunta !== "idCliente" && !isNaN(parseFloat(valor))) {
          if (!estadisticas[pregunta]) estadisticas[pregunta] = [];
          estadisticas[pregunta].push(Number(valor));
        }
      });
    });

    const resultado = Object.entries(estadisticas).map(([pregunta, valores]) => {
      const suma = valores.reduce((a, b) => a + b, 0);
      const promedio = valores.length > 0 ? (suma / valores.length).toFixed(2) : "0";
      return { pregunta, promedio, total: valores.length };
    });

    return resultado;
  }

  const obtenerClientePorId = (id) => {
    return users.find(u => u.id === id && u.role === "cliente");
  };

  return (
    <AuthContext.Provider
      value={{
        userType: usuarioActual?.role || null,
        usuarioActual,
        login,
        logout,
        crearCliente,
        registrarVenta,
        obtenerRecibosCliente,
        obtenerTodasLasVentas,
        validarClienteExiste,
        inventario,
        registrarDevolucion,
        obtenerDevoluciones,
        actualizarEstadoDevolucion,
        registrarCalificacionProducto,
        obtenerProductosParaCalificar,
        obtenerEstadisticasProducto,
        registrarCalificacionServicio,
        obtenerEstadisticasServicio,
        calificacionesServicio,
        obtenerClientePorId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
