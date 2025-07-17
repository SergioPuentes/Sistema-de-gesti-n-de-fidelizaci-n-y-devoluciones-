import { createContext, useContext, useEffect, useState } from "react";
import producto1 from "../assets/producto1.png";
import producto2 from "../assets/producto2.png";
import producto3 from "../assets/producto3.png";
import producto4 from "../assets/producto4.png";
import producto5 from "../assets/producto5.png";
import producto6 from "../assets/producto6.png";
import producto7 from "../assets/producto7.png";
import producto8 from "../assets/producto8.png";
import producto9 from "../assets/producto9.png";
import producto10 from "../assets/producto10.png";
import producto11 from "../assets/producto11.png";
import producto12 from "../assets/producto12.png";
import producto13 from "../assets/producto13.png";
import producto14 from "../assets/producto14.png";
import producto15 from "../assets/producto15.png";




const AuthContext = createContext();

const usuariosBase = [
  { id: "cliente", password: "1234", role: "cliente" },
  { id: "cajero1", password: "1234", role: "cajero" },
  { id: "cajero2", password: "1234", role: "cajero" },
  { id: "admin", password: "1234", role: "admin" },
];

const inventarioBase = [
  { id: "1", nombre: "TENIS DEPORTIVOS HOMBRE MARCA XTEP COLOR AZUL", descripcion: "Zapato para uso diario", precio: 129.900, imagen: producto1, stock: 50 },
  { id: "2", nombre: "BOTAS OUTDOOR HOMBRE MARCA BREAKER COLOR CAFE", descripcion: "Ideal para correr", precio: 199.900, imagen: producto2, stock: 30 },
  { id: "3", nombre: "TENIS CASUAL HOMBRE MARCA BREAKER COLOR CAFÉ", descripcion: "Botas impermeables", precio: 79.900, imagen: producto3, stock: 70 },
  { id: "4", nombre: "Sandalias Para Hombre Marrón Breaker", descripcion: "Para clima cálido", precio: 149.900, imagen: producto4, stock: 40 },
  { id: "5", nombre: "TENIS DEPORTIVOS HOMBRE MARCA XTEP COLOR NEGRO", descripcion: "Para eventos especiales", precio: 139.900, imagen: producto5, stock: 55 },
  { id: "6", nombre: "SANDALIAS MUJER MARCA VIA SPRING COLOR AZUL", descripcion: "Para eventos especiales", precio: 54.900, imagen: producto6, stock: 40 },
  { id: "7", nombre: "TENIS DEPORTIVOS MUJER XTEP FUCSIA", descripcion: "Para eventos especiales", precio: 59.900, imagen: producto7, stock: 100 },
  { id: "8", nombre: "MUJER BOTIN MARCA VIA SPRING COLOR TAUPE", descripcion: "Para eventos especiales", precio: 99.900, imagen: producto8, stock: 60 },
  { id: "9", nombre: "TACONES MUJER MARCA BEIRA RIO COLOR FUCSIA", descripcion: "Para eventos especiales", precio: 139.900, imagen: producto9, stock: 27 },
  { id: "10", nombre: "TACONES MUJER MARCA BEIRA RIO COLOR NEGRO", descripcion: "Para eventos especiales", precio: 149.900, imagen: producto10, stock: 15 },
  { id: "11", nombre: "TENIS ESCOLARES MARCA XTEP COLOR BLANCO", descripcion: "Para eventos especiales", precio: 49.900, imagen: producto11, stock: 50 },
  { id: "12", nombre: "BOTA IMPERMEABLE TRANSPARENTE MUJER MAR&COR", descripcion: "Para eventos especiales", precio: 25.000, imagen: producto12, stock: 150 },
  { id: "13", nombre: "TENIS ESCOLARES MARCA CLASSTEP COLOR BLANCO", descripcion: "Para eventos especiales", precio: 139.900, imagen: producto13, stock: 60 },
  { id: "14", nombre: "TENIS DEPORTIVOS NIÑA MARCA KIDY COLOR ROSA", descripcion: "Para eventos especiales", precio: 35.000, imagen: producto14, stock: 30 },
  { id: "15", nombre: "TENIS INFANTIL NIÑA NEGRO KIDY", descripcion: "Para eventos especiales", precio: 35.00, imagen: producto15, stock: 15 },
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
