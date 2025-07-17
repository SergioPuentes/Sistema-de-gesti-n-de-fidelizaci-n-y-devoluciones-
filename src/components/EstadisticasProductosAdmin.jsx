import { useAuth } from "../context/AuthContext";

export default function EstadisticasProductosAdmin() {
  const { obtenerEstadisticasProducto, inventario } = useAuth();
  const estadisticas = obtenerEstadisticasProducto();

  if (!Array.isArray(inventario) || inventario.length === 0) {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Estadísticas de Productos</h2>
        <p>No hay productos en el inventario.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Estadísticas de Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {inventario.map((producto) => {
          const stats = estadisticas.find((e) => e.productoId === producto.id);

          const promedio = stats?.promedio || "Sin calificaciones";
          const totalCalificaciones = stats?.total || 0;

          return (
            <div
              key={producto.id}
              className="border rounded shadow p-4 flex flex-col items-center bg-white"
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <h3 className="font-bold">{producto.nombre}</h3>
              <p className="text-sm text-gray-600">{producto.descripcion}</p>
              <p className="font-semibold mt-2">Precio: ${producto.precio}</p>
              <p>Stock: {producto.stock}</p>
              <p className="mt-2">
                Calificación Promedio:{" "}
                <span className="font-bold">{promedio}</span>
              </p>
              <p>Cantidad de Calificaciones: {totalCalificaciones}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
