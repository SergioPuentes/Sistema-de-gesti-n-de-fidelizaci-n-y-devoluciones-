import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function VerRecibosCliente() {
  const { usuarioActual, obtenerRecibosCliente } = useAuth();
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    if (usuarioActual?.role === "cliente") {
      const recibosDelCliente = obtenerRecibosCliente(usuarioActual.id);
      setRecibos(recibosDelCliente);
    }
  }, [usuarioActual]);

  if (!usuarioActual || usuarioActual.role !== "cliente") {
    return <p>Acceso no autorizado. Solo clientes pueden ver recibos.</p>;
  }

  return (
    <div className="ver-recibos">
      <h2>Mis Recibos</h2>

      {recibos.length === 0 ? (
        <p>No tienes recibos registrados.</p>
      ) : (
        recibos.map((recibo, index) => (
          <div key={index} className="recibo">
            <h3>Recibo #{index + 1}</h3>
            <p>Fecha: {recibo.fecha}</p>
            <ul>
              {recibo.productos.map((p, i) => (
                <li key={i}>
                  Producto ID: {p.id}, Cantidad: {p.cantidad}, Precio Unitario: ${p.precio}
                </li>
              ))}
            </ul>
            <p>Total: ${recibo.totalFinal} (Descuento aplicado: {recibo.descuentoAplicado}%)</p>
          </div>
        ))
      )}
    </div>
  );
}
