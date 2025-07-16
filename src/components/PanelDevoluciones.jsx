import { useAuth } from "../context/AuthContext";

export default function PanelDevoluciones() {
  const { obtenerDevoluciones, actualizarEstadoDevolucion } = useAuth();
  const devoluciones = obtenerDevoluciones();

  return (
    <div>
      <h2>Panel de Devoluciones</h2>
      {devoluciones.map((dev, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p>Factura: {dev.factura}</p>
          <p>Producto: {dev.producto}</p>
          <p>Cantidad: {dev.cantidad}</p>
          <img src={dev.foto} alt="Foto" style={{ maxWidth: "100px" }} />
          <pre>{JSON.stringify(dev.razones, null, 2)}</pre>
          <p>Estado: {dev.estado}</p>
          {dev.estado === "pendiente" && (
            <>
              <button onClick={() => actualizarEstadoDevolucion(index, "aceptada")}>Aceptar</button>
              <button onClick={() => actualizarEstadoDevolucion(index, "rechazada")}>Rechazar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}