import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function PanelDevoluciones() {
  const { obtenerDevoluciones, actualizarEstadoDevolucion } = useAuth();
  const [filtro, setFiltro] = useState("pendientes"); // opciones: pendientes, recientes, antiguas

  let devoluciones = obtenerDevoluciones();

  // Filtrar
  if (filtro === "pendientes") {
    devoluciones = devoluciones.filter(d => d.estado === "pendiente");
  } else if (filtro === "recientes") {
    devoluciones = devoluciones.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  } else if (filtro === "antiguas") {
    devoluciones = devoluciones.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  const renderRazones = (razones) => {
    return (
      <ul>
        <li>
          <input type="checkbox" checked={razones.noEsperado || false} readOnly /> No era lo que esperaba
        </li>
        <li>
          <input type="checkbox" checked={razones.material || false} readOnly /> No me gustó el material
        </li>
        <li>
          <input type="checkbox" checked={razones.talla || false} readOnly /> Problemas con la talla
        </li>
        <li>
          <input type="checkbox" checked={razones.otro?.trim() !== ""} readOnly /> Otro: {razones.otro}
        </li>
        <li>
          <input type="checkbox" checked={razones.buenEstado || false} readOnly /> Producto en buen estado
        </li>
      </ul>
    );
  };

  return (
    <div>
      <h2>Panel de Devoluciones</h2>

      <div>
        <label>Filtrar por: </label>
        <select value={filtro} onChange={e => setFiltro(e.target.value)}>
          <option value="pendientes">Pendientes</option>
          <option value="recientes">Más recientes</option>
          <option value="antiguas">Más antiguas</option>
        </select>
      </div>

      {devoluciones.length === 0 && <p>No hay devoluciones que mostrar.</p>}

      {devoluciones.map((dev, index) => (
        <div key={index} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p><strong>Factura:</strong> {dev.factura}</p>
          <p><strong>Producto:</strong> {dev.producto}</p>
          <p><strong>Cantidad:</strong> {dev.cantidad}</p>
          <img src={dev.foto} alt="Foto devolución" style={{ maxWidth: "100px" }} />
          <div><strong>Razones:</strong> {renderRazones(dev.razones)}</div>
          <p><strong>Estado:</strong> {dev.estado}</p>
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
