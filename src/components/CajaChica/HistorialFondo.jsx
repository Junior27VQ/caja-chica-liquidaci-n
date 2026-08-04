import React from "react";
import "../../styles/HistorialFondo.css";

export default function HistorialFondo({ historial }) {
  return (
    <div className="historial-fondo">
      <h3>Historial de cambios del fondo</h3>
      {historial && historial.length > 0 ? (
        <ul>
          {historial.map((h, i) => (
            <li key={i}>
              <span className="fecha">{h.fecha}</span> – 
              <span className="usuario">{h.usuario}</span> estableció el fondo en 
              <span className="valor"> ${h.valor}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay cambios registrados en el fondo inicial.</p>
      )}
    </div>
  );
}
