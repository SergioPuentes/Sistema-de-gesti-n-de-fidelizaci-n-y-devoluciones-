import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SolicitudDevolucion() {
  const { registrarDevolucion } = useAuth();
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

  function handleSubmit(e) {
    e.preventDefault();
    if (!foto) return setMensaje("Debe subir una foto.");
    registrarDevolucion({
      factura,
      producto,
      cantidad,
      foto: URL.createObjectURL(foto),
      razones,
    });
    setMensaje("Solicitud enviada.");
    setFactura("");
    setProducto("");
    setCantidad(1);
    setFoto(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Solicitar Devolución</h2>
      {mensaje && <p>{mensaje}</p>}
      <input placeholder="Factura" value={factura} onChange={(e) => setFactura(e.target.value)} required />
      <input placeholder="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} required />
      <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} min="1" required />
      <input type="file" onChange={(e) => setFoto(e.target.files[0])} required />
      <label>
        <input type="checkbox" checked={razones.noEsperado} onChange={(e) => setRazones({ ...razones, noEsperado: e.target.checked })} />
        No era lo que esperaba
      </label>
      <label>
        <input type="checkbox" checked={razones.material} onChange={(e) => setRazones({ ...razones, material: e.target.checked })} />
        No me gustó el material
      </label>
      <label>
        <input type="checkbox" checked={razones.talla} onChange={(e) => setRazones({ ...razones, talla: e.target.checked })} />
        Problemas con la talla
      </label>
      <input placeholder="Otro..." value={razones.otro} onChange={(e) => setRazones({ ...razones, otro: e.target.value })} />
      <label>
        <input type="checkbox" checked={razones.buenEstado} onChange={(e) => setRazones({ ...razones, buenEstado: e.target.checked })} />
        Producto en buen estado
      </label>
      <button type="submit">Enviar Solicitud</button>
    </form>
  );
}