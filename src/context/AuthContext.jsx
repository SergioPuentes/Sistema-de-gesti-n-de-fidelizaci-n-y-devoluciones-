import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const usuariosBase = [
  { id: "cliente", password: "1234", role: "cliente" },
  { id: "cajero1", password: "1234", role: "cajero" },
  { id: "cajero2", password: "1234", role: "cajero" },
  { id: "admin", password: "1234", role: "admin" },
];

const productosBase = Array.from({ length: 10 }, (_, i) => ({
  id: (i + 1).toString(),
  nombre: `Producto ${i + 1}`,
  descripcion: `Descripción del producto ${i + 1}`,
  precio: 50 + i * 10,
  imagen: `/producto${i + 1}.png`,
}));

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem("users");
    return localUsers ? JSON.parse(localUsers) : usuariosBase;
  });

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const localUsuario = localStorage.getItem("usuarioActual");
    return localUsuario ? JSON.parse(localUsuario) : null;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem("usuarioActual");
    }
  }, [usuarioActual]);

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

  function crearCliente(id, password) {
    const yaExiste = users.some((u) => u.id === id);
    if (yaExiste) return false;
    setUsers([...users, { id, password, role: "cliente" }]);
    return true;
  }

  function validarClienteExiste(idCliente) {
    return users.some((u) => u.id === idCliente && u.role === "cliente");
  }

  function registrarVenta(venta) {
    const numeroFactura = Date.now();
    const ventaConFecha = { ...venta, fecha: new Date().toLocaleString(), numeroFactura };
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
    ventasGuardadas.push(ventaConFecha);
    localStorage.setItem("ventas", JSON.stringify(ventasGuardadas));
    return numeroFactura;
  }

  function obtenerRecibosCliente(idCliente) {
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
    return ventasGuardadas.filter((v) => v.clienteId === idCliente);
  }

  function obtenerTodasLasVentas() {
    const ventasGuardadas = JSON.parse(localStorage.getItem("ventas")) || [];
    return ventasGuardadas;
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

  function registrarCalificacionProducto(idCliente, idProducto, estrellas) {
    const calificaciones = JSON.parse(localStorage.getItem("calificacionesProducto")) || [];
    calificaciones.push({ idCliente, idProducto, estrellas });
    localStorage.setItem("calificacionesProducto", JSON.stringify(calificaciones));
  }

  function obtenerProductosParaCalificar(idCliente) {
    const recibos = obtenerRecibosCliente(idCliente);
    const calificaciones = JSON.parse(localStorage.getItem("calificacionesProducto")) || [];

    const productosComprados = new Set();
    recibos.forEach(r => {
      r.productos.forEach(p => productosComprados.add(p.idProducto));
    });

    const productosCalificados = new Set(
      calificaciones.filter(c => c.idCliente === idCliente).map(c => c.idProducto)
    );

    const pendientes = [...productosComprados].filter(id => !productosCalificados.has(id));
    return productosBase.filter(p => pendientes.includes(p.id));
  }

  function obtenerEstadisticasProductos() {
    const calificaciones = JSON.parse(localStorage.getItem("calificacionesProducto")) || [];
    const conteo = {};

    calificaciones.forEach(({ idProducto, estrellas }) => {
      if (!conteo[idProducto]) conteo[idProducto] = { total: 0, cantidad: 0 };
      conteo[idProducto].total += estrellas;
      conteo[idProducto].cantidad += 1;
    });

    return productosBase.map((producto) => ({
      ...producto,
      promedio: conteo[producto.id] ? (conteo[producto.id].total / conteo[producto.id].cantidad).toFixed(2) : "Sin calificaciones",
      cantidad: conteo[producto.id]?.cantidad || 0,
    }));
  }

  function registrarCalificacionServicio(idCliente, respuestas) {
    const servicio = JSON.parse(localStorage.getItem("calificacionesServicio")) || [];
    servicio.push({ idCliente, respuestas });
    localStorage.setItem("calificacionesServicio", JSON.stringify(servicio));
  }

  function obtenerEstadisticasServicio() {
    return JSON.parse(localStorage.getItem("calificacionesServicio")) || [];
  }

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
        productosBase,
        registrarDevolucion,
        obtenerDevoluciones,
        actualizarEstadoDevolucion,
        registrarCalificacionProducto,
        obtenerProductosParaCalificar,
        obtenerEstadisticasProductos,
        registrarCalificacionServicio,
        obtenerEstadisticasServicio,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
