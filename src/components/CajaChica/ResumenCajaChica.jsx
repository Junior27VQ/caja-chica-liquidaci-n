// src/components/CajaChica/ResumenCajaChica.jsx
import React from "react";
import "../../styles/ResumenCajaChica.css"; // Importamos su estilo exclusivo

export default function ResumenCajaChica({
  fondoInicial,
  totalPendiente,
  totalAprobado,
  totalRechazado,
  saldoDisponible,
}) {
  return (
    <div className="resumen-container mb-4">
      <h3 className="resumen-title mb-3">Resumen Financiero</h3>
      
      <div className="row g-3">
        {/* Tarjeta Fondo Asignado */}
        <div className="col-md-3 col-sm-6">
          <div className="resumen-card border-left-primary">
            <span className="resumen-label">Fondo Asignado</span>
            <h4 className="resumen-value text-primary">${Number(fondoInicial || 0).toFixed(2)}</h4>
            <span className="resumen-subtext">Capital base</span>
          </div>
        </div>

        {/* Tarjeta Saldo Disponible */}
        <div className="col-md-3 col-sm-6">
          <div className="resumen-card border-left-success">
            <span className="resumen-label">Saldo Disponible</span>
            <h4 className="resumen-value text-success">${Number(saldoDisponible || 0).toFixed(2)}</h4>
            <span className="resumen-subtext">Restante actual</span>
          </div>
        </div>

        {/* Tarjeta Gastos Aprobados */}
        <div className="col-md-3 col-sm-6">
          <div className="resumen-card border-left-info">
            <span className="resumen-label">Gastos Aprobados</span>
            <h4 className="resumen-value text-info">${Number(totalAprobado || 0).toFixed(2)}</h4>
            <span className="resumen-subtext">Validados</span>
          </div>
        </div>

        {/* Tarjeta Gastos Pendientes */}
        <div className="col-md-3 col-sm-6">
          <div className="resumen-card border-left-warning">
            <span className="resumen-label">Gastos Pendientes</span>
            <h4 className="resumen-value text-warning">${Number(totalPendiente || 0).toFixed(2)}</h4>
            <span className="resumen-subtext">En revisión</span>
          </div>
        </div>

        {/* Tarjeta Gastos Rechazados */}
        <div className="col-lg-3 col-md-6 col-sm-12">
          <div className="resumen-card border-left-danger">
            <span className="resumen-label">Rechazados</span>
            <h4 className="resumen-value text-danger">${Number(totalRechazado || 0).toFixed(2)}</h4>
            <span className="resumen-subtext">Anulados</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}