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
  precio: 50 + (i * 10),
  imagen: `/producto${i + 1}.png`,
}));

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const localUsers = localStorage.getItem("users");
    return localUsers ? JSON.parse(localUsers) : usuariosBase;
  });

  const [ventas, setVentas] = useState(() => {
    const localVentas = localStorage.getItem("ventas");
    return localVentas ? JSON.parse(localVentas) : [];
  });

  const [usuarioActual, setUsuarioActual] = useState(() => {
    const localUsuario = localStorage.getItem("usuarioActual");
    return localUsuario ? JSON.parse(localUsuario) : null;
  });

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("ventas", JSON.stringify(ventas));
  }, [ventas]);

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
    if (!validarClienteExiste(venta.clienteId)) return false;
    setVentas((prev) => {
      const nuevasVentas = [...prev, venta];
      localStorage.setItem("ventas", JSON.stringify(nuevasVentas));
      return nuevasVentas;
    });
    return true;
  }

  function obtenerRecibosCliente(idCliente) {
    const localVentas = JSON.parse(localStorage.getItem("ventas")) || ventas;
    return localVentas.filter((v) => v.clienteId === idCliente);
  }

  function obtenerTodasLasVentas() {
    const localVentas = JSON.parse(localStorage.getItem("ventas")) || ventas;
    return localVentas;
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
