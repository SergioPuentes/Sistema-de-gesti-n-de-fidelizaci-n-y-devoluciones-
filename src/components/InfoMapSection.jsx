
import React from "react";

export default function InfoMapSection() {
  return (
    <section className="info-map-section">
      {/* Info */}
      <div className="info-section">
        <div className="info-item">
          <h2>Horario</h2>
          <ul>
            <li>Lun–Jue: 10:00–20:00</li>
            <li>Vie–Sáb: 10:00–21:00</li>
            <li>Dom: 11:00–18:00</li>
          </ul>
        </div>
        <div className="info-item">
          <h2>Dirección</h2>
          <p>C.C. Sandiego – Local 1638, Medellín</p>
        </div>
        <div className="info-item">
          <h2>Contacto</h2>
          <p>Tel: 2324383</p>
          <p>Email: springstep@sandiego.com.co</p>
        </div>
      </div>

      {/* Mapa */}
      <div className="map-section">
        <iframe
          title="Mapa Spring Step Medellín"
          src="https://www.google.com/maps?q=Centro+Comercial+Sandiego+Medellin&output=embed"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </section>
  );
}
