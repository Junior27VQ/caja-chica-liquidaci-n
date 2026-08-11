import React, { useState } from "react";
import "../../styles/ListaGastos.css";

export default function ListaGastos({ gastos, cambiarEstado, usuario, saldoDisponible, exportarReporteGastos }) {
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  
  // Determinamos si el usuario tiene permiso para ver acciones
  // Ahora dependemos de si la función 'cambiarEstado' fue pasada o es null
  const puedeAprobar = !!cambiarEstado;

  // Filtrar gastos según la pestaña seleccionada
  const gastosFiltrados = (gastos || []).filter((g) => {
    if (filtroEstado === "Todos") return true;
    return (g.estado || "").toLowerCase() === filtroEstado.toLowerCase();
  });

  const handleAprobarConValidacion = (gasto) => {
    const montoGasto = Number(gasto.monto || 0);
    // Validamos saldo antes de aprobar
    if (montoGasto > Number(saldoDisponible || 0)) {
      alert(`⚠️ Advertencia: El monto de este gasto ($${montoGasto.toFixed(2)}) supera el saldo disponible actual ($${Number(saldoDisponible || 0).toFixed(2)}).`);
    }
    // Ejecutamos la función pasada por props
    cambiarEstado(gasto.id, "Aprobado");
  };

  return (
    <div className="expenses-list-container mt-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <h3 className="expenses-title m-0">Listado de Gastos Registrados</h3>
        
        <button 
          className="btn btn-outline-dark btn-sm fw-semibold"
          onClick={() => exportarReporteGastos(gastos, saldoDisponible, usuario)}
        >
          <i className="fas fa-file-export me-2 text-primary"></i> Exportar Reporte
        </button>
      </div>

      {/* Pestañas de Filtros */}
      <div className="d-flex flex-wrap gap-1 mb-3" role="group">
        {["Todos", "Pendiente", "Aprobado", "Rechazado"].map((estado) => (
          <button
            key={estado}
            type="button"
            className={`btn btn-sm ${filtroEstado === estado ? "btn-dark" : "btn-outline-secondary"}`}
            onClick={() => setFiltroEstado(estado)}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="table-responsive expenses-table-wrapper">
        <table className="table expenses-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Responsable</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Comprobante</th>
              {puedeAprobar && <th className="text-center">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {gastosFiltrados.length > 0 ? (
              gastosFiltrados.map((g) => (
                <tr key={g.id} className="expense-row">
                  <td>
                    <div className="fw-bold text-dark">{g.concepto}</div>
                    {g.descripcion && <small className="text-muted d-block">{g.descripcion}</small>}
                  </td>
                  <td>
                    <span className="fw-bold text-success">${Number(g.monto || 0).toFixed(2)}</span>
                  </td>
                  <td>
                    <span className="text-secondary">{g.responsable || "Sin responsable"}</span>
                  </td>
                  <td>
                    <span className="text-muted small">{g.fecha || "Reciente"}</span>
                  </td>
                  <td>
                    <span className={`expense-badge-status status-${(g.estado || "Pendiente").toLowerCase()}`}>
                      {g.estado || "Pendiente"}
                    </span>
                  </td>
                  <td>
                    {g.comprobante ? (
                      <span className="text-primary small fw-semibold">
                        <i className="fas fa-paperclip me-1"></i> Adjunto
                      </span>
                    ) : (
                      <span className="text-muted small">Ninguno</span>
                    )}
                  </td>
                  
                  {puedeAprobar && (
                    <td className="text-center">
                      {(g.estado?.toLowerCase() === "pendiente") ? (
                        <div className="btn-group btn-group-sm gap-1" role="group">
                          <button className="btn btn-success px-2 py-1"
                            onClick={() => handleAprobarConValidacion(g)}
                            title="Aprobar Gasto"
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button className="btn btn-danger px-2 py-1"
                            onClick={() => cambiarEstado(g.id, "Rechazado")}
                            title="Rechazar Gasto"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted small fst-italic">Gestionado</span>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={puedeAprobar ? 7 : 6} className="text-center py-4 text-muted">
                  No hay gastos registrados con este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}