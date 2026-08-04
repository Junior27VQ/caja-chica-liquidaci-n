import React, { useState, useMemo } from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Reportes.css";

export default function Reportes() {
  const {
    gastosCajaChica,
    empleados,
    usuario,
    registrarOperacion,
    registrarModificacion,
  } = useAuth();

  // Estados de filtros
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mesSeleccionado, setMesSeleccionado] = useState("");

  // Filtrar por período manual
  const gastosFiltrados = useMemo(() => {
    return gastosCajaChica.filter((g) => {
      const fecha = new Date(g.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;

      return (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });
  }, [gastosCajaChica, fechaInicio, fechaFin]);

  // Filtrar por mes automático
  const gastosPorMes = useMemo(() => {
    if (!mesSeleccionado) return gastosFiltrados;
    return gastosFiltrados.filter((g) => {
      const fecha = new Date(g.fecha);
      const mes = fecha.getMonth() + 1; // Enero = 0
      const año = fecha.getFullYear();
      const [añoSel, mesSel] = mesSeleccionado.split("-");
      return año === Number(añoSel) && mes === Number(mesSel);
    });
  }, [gastosFiltrados, mesSeleccionado]);

  // Filtrar por empleado
  const gastosPorEmpleado = filtroEmpleado
    ? gastosPorMes.filter((g) => g.responsable === filtroEmpleado)
    : gastosPorMes;

  // Totales
  const totalAprobado = gastosPorEmpleado
    .filter((g) => g.estado === "aprobado")
    .reduce((sum, g) => sum + Number(g.monto), 0);

  const totalRechazado = gastosPorEmpleado
    .filter((g) => g.estado === "rechazado")
    .reduce((sum, g) => sum + Number(g.monto), 0);

  const totalPendiente = gastosPorEmpleado
    .filter((g) => g.estado === "pendiente")
    .reduce((sum, g) => sum + Number(g.monto), 0);

  // Exportar (simulación futura con auditoría)
  const exportarReporte = (tipo) => {
    alert(`Exportando reporte en formato ${tipo}...`);

    registrarOperacion(
      usuario?.nombre || "Sistema",
      "Exportación de reporte",
      `Formato: ${tipo}, Filtro empleado: ${filtroEmpleado || "Todos"}`
    );

    registrarModificacion(
      usuario?.nombre || "Sistema",
      "Generación de reporte",
      "sin exportación previa",
      `Exportado en ${tipo} con filtros aplicados`
    );
  };

  // Restricciones por rol
  const puedeVer =
    usuario?.role === "Administrador" ||
    usuario?.role === "Supervisor" ||
    usuario?.role === "Empleado";

  const puedeExportar =
    usuario?.role === "Administrador" || usuario?.role === "Supervisor";

  return (
    <div className="reportes-container">
      <h2>Reportes de Caja Chica</h2>

      {puedeVer && (
        <>
          {/* Filtros */}
          <div className="filtros">
            <label>Fecha inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <label>Fecha fin:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <label>Mes:</label>
            <input
              type="month"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
            />

            <label>Empleado:</label>
            <select
              value={filtroEmpleado}
              onChange={(e) => setFiltroEmpleado(e.target.value)}
            >
              <option value="">Todos</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.nombre}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Totales */}
          <div className="totales">
            <p><strong>Total Aprobado:</strong> ${totalAprobado}</p>
            <p><strong>Total Rechazado:</strong> ${totalRechazado}</p>
            <p><strong>Total Pendiente:</strong> ${totalPendiente}</p>
          </div>

          {/* Exportación (simulada) */}
          {puedeExportar && (
            <div className="exportar">
              <button
                className="btn btn-primary"
                onClick={() => exportarReporte("PDF")}
              >
                Exportar PDF
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => exportarReporte("Excel")}
              >
                Exportar Excel
              </button>
            </div>
          )}

          {/* Tabla detallada */}
          {gastosPorEmpleado.length === 0 ? (
            <p>No hay registros en este período.</p>
          ) : (
            <div className="tabla-reportes">
              <table className="custom-table">
                <thead >
                  <tr>
                    <th>Fecha</th>
                    <th>Empleado/Responsable</th>
                    <th>Concepto</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosPorEmpleado.map((g) => (
                    <tr key={g.id}>
                      <td>{g.fecha}</td>
                      <td>{g.responsable}</td>
                      <td>{g.concepto}</td>
                      <td>${g.monto}</td>
                      <td className={`estado ${g.estado}`}>{g.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {usuario?.role === "Empleado" && !puedeExportar && (
        <p>Solo puede consultar sus propios reportes, no exportarlos.</p>
      )}
    </div>
  );
}
