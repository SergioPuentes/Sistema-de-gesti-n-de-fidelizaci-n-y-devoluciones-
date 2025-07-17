import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SolicitudDevolucion() {
  const { registrarDevolucion, obtenerTodasLasVentas, obtenerDevoluciones, inventario } = useAuth();
  const [factura, setFactura] = useState("");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [foto, setFoto] = useState(null);
  const [razones, setRazones] = useState({
    noEsperado: false,
    material: false,
    talla: false,
    otro: "",
    buenEstado: false,
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  function validar() {
    setError("");
    setMensaje("");
    if (!factura) return setError("Ingrese código de factura.");
    if (!producto) return setError("Seleccione producto.");
    if (!foto) return setError("Debe subir una foto.");
    if (!razones.buenEstado) return setError("Debe confirmar que el producto está en buen estado.");

    const razonesSeleccionadas = [razones.noEsperado, razones.material, razones.talla, razones.otro.trim() !== ""];
    if (!razonesSeleccionadas.some(Boolean)) {
      return setError("Debe seleccionar al menos una razón para la devolución.");
    }

    const ventas = obtenerTodasLasVentas();
    const venta = ventas.find(v => v.codigoFactura === factura);
    if (!venta) return setError("Factura no encontrada.");

    // Validar fecha (no más de 30 días)
    const fechaVenta = new Date(venta.fecha);
    const ahora = new Date();
    const diffDias = (ahora - fechaVenta) / (1000 * 60 * 60 * 24);
    if (diffDias > 30) return setError("La devolución solo se acepta hasta 30 días después de la compra.");

    // Validar que el producto está en la compra
    const productoCompra = venta.productos.find(p => p.idProducto === producto);
    if (!productoCompra) return setError("El producto no está en la factura.");

    // ** Validar cantidad no mayor a la cantidad comprada menos la ya devuelta **
    const devoluciones = obtenerDevoluciones();
    const cantidadYaDevuelta = devoluciones
      .filter(d => d.factura === factura && d.producto === producto)
      .reduce((acc, d) => acc + d.cantidad, 0);

    const maxDevolver = productoCompra.cantidad - cantidadYaDevuelta;
    if (cantidad > maxDevolver) {
      return setError(`No puedes devolver más de ${maxDevolver} unidades de este producto. Ya has devuelto ${cantidadYaDevuelta}.`);
    }

    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errorValidacion = validar();
    if (errorValidacion) return;

    registrarDevolucion({
      factura,
      producto,
      cantidad,
      foto: URL.createObjectURL(foto),
      razones,
      estado: "pendiente",
      fecha: new Date().toLocaleString(),
    });
    setMensaje("Solicitud enviada.");
    setFactura("");
    setProducto("");
    setCantidad(1);
    setFoto(null);
    setRazones({
      noEsperado: false,
      material: false,
      talla: false,
      otro: "",
      buenEstado: false,
    });
  }

  // Para mostrar opciones de productos de la factura ingresada
  const ventas = obtenerTodasLasVentas();
  const ventaSeleccionada = ventas.find(v => v.codigoFactura === factura);
  const productosFactura = ventaSeleccionada
    ? ventaSeleccionada.productos.map(pv => {
        const prod = inventario.find(i => i.id === pv.idProducto);
        return { id: pv.idProducto, nombre: prod?.nombre || "Producto desconocido", maxCantidad: pv.cantidad };
      })
    : [];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Solicitar Devolución</h2>
      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        placeholder="Código de factura"
        value={factura}
        onChange={(e) => setFactura(e.target.value)}
        required
      />

      {ventaSeleccionada && (
        <>
          <select value={producto} onChange={(e) => setProducto(e.target.value)} required>
            <option value="">-- Seleccione producto --</option>
            {productosFactura.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} (Max {p.maxCantidad})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            max={
              // Aquí el max se actualiza dinámicamente para no permitir exceder devoluciones
              (() => {
                const devoluciones = obtenerDevoluciones();
                const cantidadYaDevuelta = devoluciones
                  .filter(d => d.factura === factura && d.producto === producto)
                  .reduce((acc, d) => acc + d.cantidad, 0);
                const maxDevolver = productosFactura.find(p => p.id === producto)?.maxCantidad || 1;
                return maxDevolver - cantidadYaDevuelta;
              })()
            }
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
          />
        </>
      )}

      <input type="file" onChange={(e) => setFoto(e.target.files[0])} required />

      <fieldset>
        <legend>Razones para la devolución (al menos una):</legend>
        <label>
          <input
            type="checkbox"
            checked={razones.noEsperado}
            onChange={(e) => setRazones({ ...razones, noEsperado: e.target.checked })}
          />
          No era lo que esperaba
        </label>
        <label>
          <input
            type="checkbox"
            checked={razones.material}
            onChange={(e) => setRazones({ ...razones, material: e.target.checked })}
          />
          No me gustó el material
        </label>
        <label>
          <input
            type="checkbox"
            checked={razones.talla}
            onChange={(e) => setRazones({ ...razones, talla: e.target.checked })}
          />
          Problemas con la talla
        </label>
        <label>
          Otro:
          <input
            type="text"
            value={razones.otro}
            onChange={(e) => setRazones({ ...razones, otro: e.target.value })}
            placeholder="Especifique"
          />
        </label>
      </fieldset>

      <label>
        <input
          type="checkbox"
          checked={razones.buenEstado}
          onChange={(e) => setRazones({ ...razones, buenEstado: e.target.checked })}
          required
        />
        Producto en buen estado (obligatorio)
      </label>

      <button type="submit">Enviar Solicitud</button>
    </form>
  );
}
