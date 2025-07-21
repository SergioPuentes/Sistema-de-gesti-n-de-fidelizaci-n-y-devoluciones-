import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function CalificarProductosCliente() {
  const { usuarioActual, obtenerProductosParaCalificar, registrarCalificacionProducto } = useAuth();
  const [productosPendientes, setProductosPendientes] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (usuarioActual?.id) {
      
      const productos = obtenerProductosParaCalificar(usuarioActual.id);
      setProductosPendientes(productos);
    } else {
      setProductosPendientes([]);
    }
  }, [usuarioActual, obtenerProductosParaCalificar]);

  if (!usuarioActual || usuarioActual.role !== "cliente") {
    return <p>Debes iniciar sesión como cliente para calificar productos.</p>;
  }

  const manejarCambio = (productoId, valor) => {
    setCalificaciones((prev) => ({
      ...prev,
      [productoId]: Number(valor),
    }));
  };

  const enviarCalificaciones = () => {
    
    for (const producto of productosPendientes) {
      if (!calificaciones[producto.id]) {
        setMensaje(`Por favor califica el producto: ${producto.nombre}`);
        return;
      }
    }

    
    productosPendientes.forEach((producto) => {
     
      registrarCalificacionProducto(usuarioActual.id, producto.id, {
        calificacion: calificaciones[producto.id],
      });
    });

    setMensaje("Gracias por tus calificaciones.");
    setProductosPendientes([]);
    setCalificaciones({});
  };

  if (productosPendientes.length === 0) {
    return <p>No tienes productos pendientes por calificar.</p>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Calificar Productos</h2>

      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

      {productosPendientes.map((producto) => (
        <div
          key={producto.id}
          className="border rounded p-4 mb-4 flex items-center gap-4 bg-white shadow calificar-grid"
        >
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-24 h-24 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{producto.nombre}</h3>
            <p className="text-sm text-gray-600">{producto.descripcion}</p>
          </div>
          <div>
            <label
              htmlFor={`calificacion-${producto.id}`}
              className="block mb-1 font-semibold"
            >
              Calificación (1 a 5):
            </label>
            <select
              id={`calificacion-${producto.id}`}
              value={calificaciones[producto.id] || ""}
              onChange={(e) => manejarCambio(producto.id, e.target.value)}
              className="border p-1 rounded"
            >
              <option value="">Selecciona</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        onClick={enviarCalificaciones}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Enviar Calificaciones
      </button>
    </div>
  );
}
