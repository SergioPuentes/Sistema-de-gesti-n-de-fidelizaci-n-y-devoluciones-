import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CrearCliente() {
  const { crearCliente } = useAuth();

  const [id, setId] = useState(""); // Cédula
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const validarCorreo = (correo) => {
    const regex = /^[\w.-]+@(gmail\.com|unal\.edu\.co)$/;
    return correo === "" || regex.test(correo); // si está vacío o es válido
  };

  const validarTelefono = (tel) => {
    return /^3\d{9}$/.test(tel); // debe empezar por 3 y tener 10 dígitos
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!nombre || !id || !telefono) {
      setError("Nombre, cédula y teléfono son obligatorios.");
      return;
    }

    if (!validarTelefono(telefono)) {
      setError("El teléfono debe tener 10 dígitos y comenzar con 3.");
      return;
    }

    if (!validarCorreo(correo)) {
      setError("El correo debe ser @gmail.com o @unal.edu.co");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const creado = crearCliente(id, password, { nombre, telefono, direccion, correo });

    if (!creado) {
      setError("Ya existe un usuario con esa cédula.");
    } else {
      setMensaje("Cliente creado exitosamente.");
      setId("");
      setNombre("");
      setTelefono("");
      setDireccion("");
      setCorreo("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="crear-cliente p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear Cliente</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {mensaje && <p className="text-green-600 mb-2">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Cédula:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Teléfono:</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Dirección (opcional):</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Correo (opcional):</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="ejemplo@gmail.com o @unal.edu.co"
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Cliente
        </button>
      </form>
    </div>
  );
}