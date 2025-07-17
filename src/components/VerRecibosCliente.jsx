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
        recibos.map((recibo, index) => {
          const subtotal = recibo.subtotal ?? recibo.productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
          const descuento = recibo.descuentoAplicado ?? 0;
          // Si descuento es monto, calculo porcentaje basado en subtotal
          const descuentoPorcentaje = subtotal ? ((descuento / subtotal) * 100).toFixed(2) : "0";

          return (
            <div key={index} className="recibo" style={{ border: "1px solid #ccc", padding: "1em", marginBottom: "1em" }}>
              <h3>Factura #{recibo.codigoFactura || recibo.numeroFactura}</h3>
              <p>Fecha: {recibo.fecha}</p>

              <ul>
                {recibo.productos.map((p, i) => (
                  <li key={i}>
                    Producto ID: {p.idProducto}, Cantidad: {p.cantidad}, Precio Unitario: ${p.precio.toFixed(2)}
                  </li>
                ))}
              </ul>

              <p>Subtotal: <strong>${subtotal.toFixed(2)}</strong></p>

              <p>
                Descuento aplicado:{" "}
                <strong>
                  {typeof recibo.descuentoAplicado === "number" && recibo.descuentoAplicado > 1
                    ? `${descuentoPorcentaje}%`
                    : `${descuento}%`}
                </strong>
              </p>

              <p>
                Total:{" "}
                <strong style={{ color: recibo.totalFinal < 0 ? "red" : "inherit" }}>
                  ${recibo.totalFinal !== undefined ? recibo.totalFinal.toFixed(2) : (subtotal - descuento).toFixed(2)}
                </strong>
              </p>
            </div>
          );
        })
      )}
    </div>
  );
}
