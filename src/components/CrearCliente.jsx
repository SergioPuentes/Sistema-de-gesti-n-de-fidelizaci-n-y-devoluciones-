import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CrearCliente() {
  const { crearCliente } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const creado = crearCliente(id, password);

    if (!creado) {
      setError("Ya existe un usuario con ese ID.");
    } else {
      setMensaje("Cliente creado exitosamente.");
      setId("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="crear-cliente">
      <h2>Crear Cliente</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID de Cliente:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Cliente</button>
      </form>
    </div>
  );
}