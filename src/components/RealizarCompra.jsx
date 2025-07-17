import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

function generarCodigoUnico() {
  return (
    "F-" +
    Date.now().toString(36).toUpperCase() +
    "-" +
    Math.random().toString(36).slice(2, 7).toUpperCase()
  );
}

export default function RealizarCompra() {
  const {
    inventario,
    validarClienteExiste,
    obtenerClientePorId,
    registrarVenta,
    obtenerTodasLasVentas,
  } = useAuth();

  const [clienteId, setClienteId] = useState("");
  const [clienteData, setClienteData] = useState(null);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("");
  const [resumenVisible, setResumenVisible] = useState(false);
  const [compraConfirmada, setCompraConfirmada] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // Estados para descuento y total con descuento
  const [descuento, setDescuento] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  // Buscar cliente por ID
  const buscarCliente = () => {
    setError("");
    if (!validarClienteExiste(clienteId)) return setError("Cliente no existente");
    const cli = obtenerClientePorId(clienteId);
    setClienteData(cli);
    setMensaje("Cliente listo");
  };

  // Agregar producto al carrito
  const agregarProducto = () => {
    setError("");
    const prod = inventario.find((p) => p.id === productoId);
    if (!prod) return setError("Producto inválido");
    const total = (carrito.find((c) => c.id === productoId)?.cantidad || 0) + cantidad;
    if (total > prod.stock) return setError("Stock insuficiente");
    setCarrito((prev) => {
      const exists = prev.find((c) => c.id === productoId);
      return exists
        ? prev.map((c) => (c.id === productoId ? { ...c, cantidad: total } : c))
        : [...prev, { id: productoId, nombre: prod.nombre, precio: prod.precio, cantidad }];
    });
    setMensaje("Añadido al carrito");
  };

  // Calcular subtotal del carrito
  const calcularSubtotal = () =>
    carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  // Función para obtener descuento basado en venta anterior
  function obtenerDescuentoPorVentaAnterior(clienteId, subtotalActual) {
    const ventas = obtenerTodasLasVentas();
    const ventasCliente = ventas
      .filter((v) => v.clienteId === clienteId)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (ventasCliente.length === 0) return 0; // Sin ventas previas, no hay descuento

    const ultimaVenta = ventasCliente[0];
    const totalUltimaVenta = ultimaVenta.totalFinal ?? ultimaVenta.subtotal;

    const descuento8Porciento = totalUltimaVenta * 0.08;
    const maxDescuento50Porc = subtotalActual * 0.5;

    let descuentoCalculado = descuento8Porciento;

    // Limitar descuento máximo al 50% del subtotal actual
    if (descuentoCalculado > maxDescuento50Porc) {
      descuentoCalculado = maxDescuento50Porc;
    }

    return descuentoCalculado;
  }

  // Generar resumen de compra con descuento aplicado
  const generarResumen = () => {
    setError("");
    if (!clienteData) return setError("Cliente inválido");
    if (carrito.length === 0) return setError("Carrito vacío");
    if (!metodoPago) return setError("Seleccione método de pago");

    const subtotal = calcularSubtotal();
    const descuentoCalculado = obtenerDescuentoPorVentaAnterior(clienteId, subtotal);

    // Total final con descuento
    let totalConDescuento = subtotal - descuentoCalculado;

    // Asegurar que total no baje de 50% del subtotal
    if (totalConDescuento < subtotal * 0.5) {
      totalConDescuento = subtotal * 0.5;
    }

    setDescuento(descuentoCalculado);
    setTotalFinal(totalConDescuento);
    setResumenVisible(true);
  };

  // Confirmar la compra y registrar
  const confirmarCompra = () => {
    const codigo = generarCodigoUnico();
    const subtotal = calcularSubtotal();

    const venta = {
      codigoFactura: codigo,
      clienteId,
      productos: carrito.map((c) => ({ idProducto: c.id, cantidad: c.cantidad })),
      metodoPago,
      subtotal,
      descuentoAplicado: descuento,
      totalFinal,
      fecha: new Date().toLocaleString(),
    };

    registrarVenta(venta);

    setCompraConfirmada(true);
    setMensaje(
      `Compra registrada con código ${codigo}, descuento aplicado: $${descuento.toFixed(
        2
      )}`
    );
    setCarrito([]);
    setResumenVisible(false);
  };

  return (
    <div className="p-4">
      {compraConfirmada && (
        <div className="bg-green-200 p-2 mb-4">✅ Compra registrada con éxito.</div>
      )}

      <div>
        <label>Cédula:</label>
        <input value={clienteId} onChange={(e) => setClienteId(e.target.value)} />
        <button onClick={buscarCliente}>Buscar Cliente</button>
        {clienteData && <span> {clienteData.nombre}</span>}
      </div>

      <hr />

      <div>
        <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
          <option value="">--Producto--</option>
          {inventario.map((p) => (
            <option key={p.id} value={p.id} disabled={!p.stock}>
              {p.nombre} (${p.precio}) – stock: {p.stock}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(+e.target.value)}
        />
        <button onClick={agregarProducto}>Agregar</button>
      </div>

      {mensaje && <div className="text-green-600">{mensaje}</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="mt-4">
        <h3>Inventario</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {inventario.map((p) => (
            <div key={p.id} className="border p-2">
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-24 object-cover mb-2"
              />
              <div>
                <strong>{p.nombre}</strong>
              </div>
              <div>${p.precio}</div>
              <div>Stock: {p.stock}</div>
            </div>
          ))}
        </div>
      </div>

      {carrito.length > 0 && (
        <div className="mt-4">
          <h3>Carrito</h3>
          <ul>
            {carrito.map((c) => (
              <li key={c.id}>
                {c.nombre} x {c.cantidad} = ${c.precio * c.cantidad}
              </li>
            ))}
          </ul>
          <div>Subtotal: ${calcularSubtotal().toFixed(2)}</div>
          <label>Método de pago:</label>
          <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
            <option value="">--</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>

          {!resumenVisible && (
            <button onClick={generarResumen} className="ml-2">
              Ver Resumen
            </button>
          )}

          {resumenVisible && (
            <div className="border p-2 mt-2">
              <h4>Resumen de Compra</h4>
              <div>Cliente: {clienteData?.nombre}</div>
              <div>Subtotal: ${calcularSubtotal().toFixed(2)}</div>
              <div>Descuento aplicado: ${descuento.toFixed(2)}</div>
              <div>Total a pagar: ${totalFinal.toFixed(2)}</div>
              <button onClick={confirmarCompra}>Confirmar Compra</button>
              <button onClick={() => setResumenVisible(false)}>Editar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
