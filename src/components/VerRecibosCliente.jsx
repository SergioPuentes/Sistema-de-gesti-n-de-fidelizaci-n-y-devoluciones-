import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function VerRecibosCliente() {
  const { usuarioActual, obtenerRecibosCliente } = useAuth();
  const [recibos, setRecibos] = useState([]);

  useEffect(() => {
    if (usuarioActual?.role === "cliente") {
      const recibosDelCliente = obtenerRecibosCliente(usuarioActual.id);
      console.log("Recibos cargados:", recibosDelCliente);
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
          // Calculo subtotal para ver si concuerda
          const subtotalCalculado = recibo.productos.reduce(
            (acc, p) => acc + (p.precio || 0) * (p.cantidad || 0),
            0
          );

          // Mostrar descuento en monto, no porcentaje (ajustar si es necesario)
          // Si tienes descuentoAplicado como porcentaje, cambia a monto: subtotal * (descuentoAplicado / 100)
          const descuentoMonto =
            typeof recibo.descuentoAplicado === "number" && recibo.descuentoAplicado <= 1
              ? subtotalCalculado * recibo.descuentoAplicado // si es decimal tipo 0.08 (8%)
              : typeof recibo.descuentoAplicado === "number"
              ? recibo.descuentoAplicado // si es monto directamente
              : 0;

          const totalConDescuento = subtotalCalculado - descuentoMonto;

          return (
            <div key={index} className="recibo" style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
              <h3>Factura #{recibo.codigoFactura}</h3>
              <p>Fecha: {recibo.fecha}</p>

              <ul>
                {recibo.productos.map((p, i) => (
                  <li key={i}>
                    Producto ID: {p.idProducto}, Cantidad: {p.cantidad}, Precio Unitario: ${p.precio.toFixed(2)}
                  </li>
                ))}
              </ul>

              <p>Subtotal calculado: <strong>${subtotalCalculado.toFixed(2)}</strong></p>

              {descuentoMonto > 0 && (
                <p>Descuento aplicado: <strong>${descuentoMonto.toFixed(2)}</strong></p>
              )}

              <p>Total a pagar: <strong>${totalConDescuento.toFixed(2)}</strong></p>
            </div>
          );
        })
      )}
    </div>
  );
}
