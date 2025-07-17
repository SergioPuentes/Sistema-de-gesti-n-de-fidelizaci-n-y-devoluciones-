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

  const [descuento, setDescuento] = useState(0);
  const [totalFinal, setTotalFinal] = useState(0);

  const buscarCliente = () => {
    setError("");
    if (!validarClienteExiste(clienteId)) return setError("Cliente no existente");
    const cli = obtenerClientePorId(clienteId);
    setClienteData(cli);
    setMensaje("Cliente listo");
  };

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
        : [...prev, { id: productoId, nombre: prod.nombre, precio: prod.precio, cantidad, imagen: prod.imagen }];
    });

    setMensaje("Añadido al carrito");
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const calcularSubtotal = () =>
    carrito.reduce((sum, p) => sum + p.precio * p.cantidad, 0);

  function obtenerDescuentoPorVentaAnterior(clienteId, subtotalActual) {
    const ventas = obtenerTodasLasVentas();
    const ventasCliente = ventas
      .filter((v) => v.clienteId === clienteId)
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    if (ventasCliente.length === 0) return 0;

    const ultimaVenta = ventasCliente[0];
    const totalUltimaVenta = ultimaVenta.totalFinal ?? ultimaVenta.subtotal;

    const descuento8 = totalUltimaVenta * 0.08;
    const max50 = subtotalActual * 0.5;

    return Math.min(descuento8, max50);
  }

  const generarResumen = () => {
    setError("");
    if (!clienteData) return setError("Cliente inválido");
    if (carrito.length === 0) return setError("Carrito vacío");
    if (!metodoPago) return setError("Seleccione método de pago");

    const subtotal = calcularSubtotal();
    const descuentoCalculado = obtenerDescuentoPorVentaAnterior(clienteId, subtotal);
    let totalConDescuento = subtotal - descuentoCalculado;

    if (totalConDescuento < subtotal * 0.5) {
      totalConDescuento = subtotal * 0.5;
    }

    setDescuento(descuentoCalculado);
    setTotalFinal(totalConDescuento);
    setResumenVisible(true);
  };

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
    setMensaje(`Compra registrada con código ${codigo}, descuento: $${descuento.toFixed(2)}`);
    setCarrito([]);
    setResumenVisible(false);
  };

  return (
    <div className="p-4">
      {compraConfirmada && (
        <div className="bg-green-200 p-2 mb-4 rounded">✅ Compra registrada con éxito.</div>
      )}

      <div className="mb-4 space-y-2">
        <label>Cédula:</label>
        <input
          className="border px-2 py-1 rounded"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        />
        <button className="ml-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={buscarCliente}>
          Buscar Cliente
        </button>
        {clienteData && <span className="ml-2 font-semibold">{clienteData.nombre}</span>}
      </div>

      <div className="mb-4 space-x-2">
        <select
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          className="border px-2 py-1 rounded"
        >
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
          className="border px-2 py-1 w-16 rounded"
        />
        <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={agregarProducto}>
          Agregar
        </button>
      </div>

      {mensaje && <div className="text-green-600">{mensaje}</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* Carrito */}
      {carrito.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h3 className="text-lg font-bold mb-2">🛒 Carrito</h3>
          <ul>
            {carrito.map((c) => (
              <li key={c.id} className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <img src={c.imagen} alt={c.nombre} className="w-10 h-10 object-cover rounded carritofoto" />
                  <span>{c.nombre} x {c.cantidad} = ${c.precio * c.cantidad}</span>
                </div>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => eliminarProducto(c.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-2">Subtotal: ${calcularSubtotal().toFixed(2)}</div>
          <div className="mt-2">
            <label>Método de pago:</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="border px-2 py-1 ml-2 rounded"
            >
              <option value="">--</option>
              <option value="efectivo">Efectivo</option>
              <option value="tarjeta">Tarjeta</option>
            </select>
          </div>

          {!resumenVisible && (
            <button onClick={generarResumen} className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
              Ver Resumen
            </button>
          )}

          {resumenVisible && (
            <div className="border p-2 mt-2 rounded bg-white">
              <h4 className="font-bold">Resumen de Compra</h4>
              <div>Cliente: {clienteData?.nombre}</div>
              <div>Subtotal: ${calcularSubtotal().toFixed(2)}</div>
              <div>Descuento aplicado: ${descuento.toFixed(2)}</div>
              <div>Total a pagar: ${totalFinal.toFixed(2)}</div>
              <div className="space-x-2 mt-2">
                <button onClick={confirmarCompra} className="bg-green-600 text-white px-3 py-1 rounded">
                  Confirmar Compra
                </button>
                <button onClick={() => setResumenVisible(false)} className="bg-gray-400 text-white px-3 py-1 rounded">
                  Editar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inventario (abajo del todo) */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">📦 Inventario</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventario.map((p) => (
            <div key={p.id} className="border p-2 rounded shadow-sm">
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-full h-24 object-cover mb-2 rounded"
              />
              <div className="font-semibold">{p.nombre}</div>
              <div>${p.precio}</div>
              <div>Stock: {p.stock}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
