import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function VerVentas() {
  const { obtenerTodasLasVentas, inventario } = useAuth();
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const ventasGuardadas = obtenerTodasLasVentas();
    setVentas(Array.isArray(ventasGuardadas) ? ventasGuardadas : []);
  }, []);

  return (
    <div className="contenedor p-4">
      <h2 className="text-2xl font-bold mb-4">Historial de Ventas</h2>
      {ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        ventas.map((venta, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 mb-4 w-full max-w-2xl">
            <p><strong>Factura:</strong> {venta.codigoFactura}</p>
            <p><strong>Cliente:</strong> {venta.clienteId}</p>
            <p><strong>Fecha:</strong> {venta.fecha}</p>
            <p><strong>Subtotal:</strong> ${venta.subtotal?.toFixed(2) || "0.00"}</p>
            <p><strong>Descuento Aplicado:</strong> {venta.descuentoAplicado || 0}%</p>
            <p><strong>Total Final:</strong> ${venta.totalFinal?.toFixed(2) || "0.00"}</p>

            <div>
              <strong>Productos:</strong>
              {venta.productos?.map((prod, idx) => {
                const productoInfo = inventario.find(p => p.id === prod.idProducto);
                return (
                  <div key={idx} className="border p-2 my-2 rounded">
                    <p>Nombre: {productoInfo?.nombre || prod.idProducto}</p>
                    <p>Cantidad: {prod.cantidad}</p>
                    <p>Precio Unitario: ${prod.precio.toFixed(2)}</p>
                    <p>Subtotal Producto: ${(prod.precio * prod.cantidad).toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
