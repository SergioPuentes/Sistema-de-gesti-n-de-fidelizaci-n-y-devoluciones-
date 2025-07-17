import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function CalificarProductoCliente() {
  const { usuarioActual, obtenerProductosParaCalificar, registrarCalificacionProducto } = useAuth();
  const [productosPendientes, setProductosPendientes] = useState([]);
  const [calificaciones, setCalificaciones] = useState({});

  useEffect(() => {
    if (usuarioActual) {
      const pendientes = obtenerProductosParaCalificar(usuarioActual.id);
      setProductosPendientes(pendientes);
    }
  }, [usuarioActual]);

  const handleChange = (idProducto, estrellas) => {
    setCalificaciones(prev => ({ ...prev, [idProducto]: estrellas }));
  };

  const handleSubmit = () => {
    Object.entries(calificaciones).forEach(([idProducto, estrellas]) => {
      if (estrellas) {
        registrarCalificacionProducto(usuarioActual.id, idProducto, Number(estrellas));
      }
    });
    alert("Calificación guardada.");
    const pendientes = obtenerProductosParaCalificar(usuarioActual.id);
    setProductosPendientes(pendientes);
    setCalificaciones({});
  };

  if (!productosPendientes.length) {
    return <p>No hay productos pendientes por calificar.</p>;
  }

  return (
    <div className="calificar-producto">
      <h2>Calificar Productos</h2>
      {productosPendientes.map((producto) => (
        <div key={producto.id} className="producto-calificar">
          <h3>{producto.nombre}</h3>
          <p>{producto.descripcion}</p>
          <img src={producto.imagen} alt={producto.nombre} style={{ width: 150 }} />
          <select value={calificaciones[producto.id] || ""} onChange={(e) => handleChange(producto.id, e.target.value)}>
            <option value="">Selecciona estrellas</option>
            <option value="1">★☆☆☆☆ (1)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="5">★★★★★ (5)</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Guardar Calificaciones</button>
    </div>
  );
}