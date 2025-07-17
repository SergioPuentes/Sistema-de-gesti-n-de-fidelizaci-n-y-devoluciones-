import { useAuth } from "../context/AuthContext";

export default function EstadisticasProductoAdmin() {
  const { obtenerEstadisticasProductos } = useAuth();
  const estadisticas = obtenerEstadisticasProductos();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de Productos</h2>

      {estadisticas.length === 0 ? (
        <p>No hay calificaciones registradas aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {estadisticas.map((p) => (
            <div
              key={p.id}
              className="border rounded shadow p-4 flex flex-col items-center bg-white"
            >
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{p.nombre}</h3>
              <p className="text-sm text-gray-600">{p.descripcion}</p>
              <p className="font-semibold mt-2">Precio: ${p.precio}</p>
              <p className="mt-2">
                Calificación Promedio:{" "}
                <span className="font-bold">{p.promedio}</span>
              </p>
              <p>Cantidad de Calificaciones: {p.cantidad}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
