// src/components/CajaChica/HistorialFondo.jsx
import React from "react";
import "../../styles/HistorialFondo.css";

export default function HistorialFondo({ historial }) {
  return (
    <div className="fund-history-container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="fund-history-title m-0">Historial de Cambios del Fondo</h3>
        <span className="badge bg-secondary">{historial ? historial.length : 0} Registros</span>
      </div>

      <div className="fund-history-card">
        {historial && historial.length > 0 ? (
          <div className="table-responsive">
            <table className="table fund-history-table mb-0">
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Usuario</th>
                  <th>Modificación / Nuevo Fondo</th>
                </tr>
              </thead>
              <tbody>
                {historial.map((h, i) => (
                  <tr key={i}>
                    <td>
                      <span className="text-muted small"><i className="far fa-clock me-1"></i> {h.fecha || "Reciente"}</span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark">{h.usuario || h.usuarioNombre || "Sistema"}</span>
                    </td>
                    <td>
                      Estableció el fondo en <span className="fw-bold text-primary">${Number(h.valor || h.nuevoFondo || 0).toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted">
            <p className="mb-0">No hay cambios registrados en el fondo inicial.</p>
          </div>
        )}
      </div>
    </div>
  );
}