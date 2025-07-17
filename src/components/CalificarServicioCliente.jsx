import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function CalificarServicioCliente() {
  const { registrarCalificacionServicio, usuarioActual } = useAuth();
  const [yaCalifico, setYaCalifico] = useState(false);
  const [respuestas, setRespuestas] = useState({ sede: 3, personal: 3, recomendacion: 3 });
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("calificacionesServicio")) || [];
    const ya = data.some((c) => c.idCliente === usuarioActual?.id);
    setYaCalifico(ya);
  }, [usuarioActual]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRespuestas({ ...respuestas, [name]: parseInt(value) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registrarCalificacionServicio(respuestas);
    setMensaje("Gracias por calificar el servicio.");
    setYaCalifico(true);
  };

  if (!usuarioActual) return <p className="p-4">Inicia sesión para calificar.</p>;
  if (yaCalifico) return <p className="p-4">Ya has calificado el servicio. ¡Gracias!</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calificar Servicio</h2>
      {mensaje && <p className="text-green-500">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label>Atención en la sede (1-5)</label>
          <input
            type="number"
            name="sede"
            min="1"
            max="5"
            value={respuestas.sede}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>Personal (1-5)</label>
          <input
            type="number"
            name="personal"
            min="1"
            max="5"
            value={respuestas.personal}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label>¿Recomendaría la tienda? (1-5)</label>
          <input
            type="number"
            name="recomendacion"
            min="1"
            max="5"
            value={respuestas.recomendacion}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar Calificación
        </button>
      </form>
    </div>
  );
}

