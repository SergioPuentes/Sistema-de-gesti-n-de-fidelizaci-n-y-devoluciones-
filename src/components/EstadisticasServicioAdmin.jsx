import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function EstadisticasServicio() {
  const { obtenerEstadisticasServicio } = useAuth();
  const [estadisticas, setEstadisticas] = useState([]);

  useEffect(() => {
    const data = obtenerEstadisticasServicio();
    setEstadisticas(data);
  }, [obtenerEstadisticasServicio]);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de Servicio</h2>
      <table className="w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-1">Criterio de evaluación</th>
            <th className="border border-gray-400 px-2 py-1">Promedio</th>
            <th className="border border-gray-400 px-2 py-1">Total</th>
          </tr>
        </thead>
        <tbody>
          {estadisticas.map(({ pregunta, promedio, total }) => (
            <tr key={pregunta}>
              <td className="border border-gray-400 px-2 py-1">{pregunta}</td>
              <td className="border border-gray-400 px-2 py-1">{promedio}</td>
              <td className="border border-gray-400 px-2 py-1">{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}