// src/components/Auditoria.jsx
import React from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Auditoria.css";

export default function Auditoria() {
  const { auditoria, limpiarAuditoria, usuario } = useAuth();

  const handleVaciarAuditoria = () => {
    if (window.confirm("⚠️ ¿Estás seguro de que deseas eliminar TODOS los registros de auditoría? Esta acción no se puede deshacer.")) {
      limpiarAuditoria();
      alert("Registro de auditoría vaciado con éxito.");
    }
  };

  return (
    <div className="auditoria-container p-4">
      <h2 className="mb-4">Registro de Auditoría del Sistema</h2>
      {/* Botón exclusivo para Administrador */}
        {usuario?.role === "Administrador" && (
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={handleVaciarAuditoria}
          >
            <i className="fas fa-trash-alt me-2"></i> Limpiar Registros
          </button>
        )}
      <div className="table-responsive">
        <table className="table auditoria-table align-middle">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>USUARIO</th>
              <th>ACCIÓN</th>
              <th>DETALLES</th>
            </tr>
          </thead>
          <tbody>
            {auditoria && auditoria.length > 0 ? (
              auditoria.map((log) => (
                <tr key={log.id}>
                  <td className="text-info small">{log.fecha}</td>
                  <td>
                    <span className="badge bg-primary px-2 py-1">{log.usuario || "Sistema"}</span>
                  </td>
                  <td className="fw-bold text-warning">{log.accion}</td>
                  <td className="text-light">{log.detalles}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  No hay registros de auditoría disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}