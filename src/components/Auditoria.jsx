import React from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Auditoria.css";

export default function Auditoria() {
  const { logsOperaciones, historialModificaciones } = useAuth();

  return (
    <div className="auditoria-container">
      <h2>Auditoría del Sistema</h2>

      {/* Logs de operaciones */}
      <div className="logs">
        <h3>Logs de Operaciones</h3>
        {logsOperaciones.length === 0 ? (
          <p>No hay operaciones registradas.</p>
        ) : (
          <div className="tabla-auditoria">
              <table className="custom-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {logsOperaciones.map((log, index) => (
                  <tr key={index}>
                    <td>{log.fecha}</td>
                    <td>{log.usuario}</td>
                    <td>{log.accion}</td>
                    <td>{log.detalle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Historial de modificaciones */}
      <div className="historial">
        <h3>Historial de Modificaciones</h3>
        {historialModificaciones.length === 0 ? (
          <p>No hay modificaciones registradas.</p>
        ) : (
          <div className="tabla-auditoria">
              <table className="custom-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Campo</th>
                  <th>Valor anterior</th>
                  <th>Valor nuevo</th>
                </tr>
              </thead>
              <tbody>
                {historialModificaciones.map((mod, index) => (
                  <tr key={index}>
                    <td>{mod.fecha}</td>
                    <td>{mod.usuario}</td>
                    <td>{mod.campo}</td>
                    <td>{mod.valorAnterior}</td>
                    <td>{mod.valorNuevo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
