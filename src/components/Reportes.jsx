import React, { useState, useMemo } from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Reportes.css";

export default function Reportes() {
  const {
    gastos,
    empleados,
    usuarios,
    liquidaciones, 
    usuario,
    registrarAuditoria,
    agregarNotificacion,
    limpiarReportesSistema
  } = useAuth();

  const [vistaActual, setVistaActual] = useState("gastos"); // 'gastos' o 'liquidaciones'
  const [filtroEmpleado, setFiltroEmpleado] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const esEmpleado = usuario?.role === "Empleado";

  // Helper para nombre real
  const getNombreEmpleado = (empleado) => {
    const userVinculado = usuarios.find(u => u.id === empleado.usuario_id);
    if (!userVinculado) {
      const userFallback = usuarios.find(u => u.id === empleado.id);
      return userFallback ? userFallback.nombre : "Nombre no encontrado";
    }
    return userVinculado.nombre;
  };

  // --- LÓGICA DE FILTRADO (GASTOS) ---
  const gastosFiltrados = useMemo(() => {
    return (gastos || []).filter((g) => {
      const fecha = new Date(g.fecha);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;

      // Si es empleado, forzamos que el responsable coincida estrictamente con su nombre
      if (esEmpleado) {
        const matchPropio = g.responsable && usuario?.nombre && 
          g.responsable.trim().toLowerCase() === usuario.nombre.trim().toLowerCase();
        return matchPropio && (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
      }

      // Si es Admin/Supervisor/Contador, usa el filtro seleccionado
      const matchEmpleado = filtroEmpleado ? g.responsable === filtroEmpleado : true;
      return (!inicio || fecha >= inicio) && (!fin || fecha <= fin) && matchEmpleado;
    });
  }, [gastos, fechaInicio, fechaFin, filtroEmpleado, usuario, esEmpleado]);

  // --- LÓGICA DE FILTRADO (LIQUIDACIONES) ---
  const liquidacionesFiltradas = useMemo(() => {
    return (liquidaciones || []).filter((l) => {
      const fecha = new Date(l.fechaGeneracion);
      const inicio = fechaInicio ? new Date(fechaInicio) : null;
      const fin = fechaFin ? new Date(fechaFin) : null;
      const nombreEmpleadoLiq = getNombreEmpleado({ id: l.empleado_id });

      // Si es empleado, filtramos estrictamente por su liquidación
      if (esEmpleado) {
        const matchPropio = nombreEmpleadoLiq.trim().toLowerCase() === usuario?.nombre.trim().toLowerCase();
        return matchPropio && (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
      }

      const matchEmpleado = filtroEmpleado ? nombreEmpleadoLiq === filtroEmpleado : true;
      return (!inicio || fecha >= inicio) && (!fin || fecha <= fin) && matchEmpleado;
    });
  }, [liquidaciones, fechaInicio, fechaFin, filtroEmpleado, usuario, esEmpleado, empleados, usuarios]);

  const exportar = (tipo) => {
    const fecha = new Date().toLocaleString();
    
    // 1. Registro en Auditoría
    registrarAuditoria(
      "EXPORTAR_REPORTE", 
      `El usuario ${usuario?.nombre} exportó reporte de ${vistaActual} en formato ${tipo}`
    );

    // 2. Notificación en el Navbar
    if (agregarNotificacion) {
      agregarNotificacion(
        "Reporte Generado",
        `El usuario ${usuario?.nombre} exportó un reporte de ${vistaActual === 'gastos' ? 'Gastos' : 'Liquidaciones'} en formato ${tipo} a las ${fecha}.`,
        "gasto"
      );
    }

    alert(`¡Reporte de ${vistaActual} exportado exitosamente como ${tipo}!`);

    // 3. Acción exclusiva de Administrador para vaciar sistema
    if (usuario?.role === "Administrador") {
      const deseaLimpiar = window.confirm(`📄 El documento se ha exportado correctamente.\n\n¿Desea vaciar el registro actual de ${vistaActual === 'gastos' ? 'gastos' : 'liquidaciones'} para limpiar el sistema?`);
      
      if (deseaLimpiar) {
        limpiarReportesSistema(vistaActual);
        alert(`Se han vaciado los registros de ${vistaActual} correctamente.`);
      }
    }
  };

  return (
    <div className="reportes-container p-4">
      <h2 className="mb-4">
        {esEmpleado ? "Mis Informes Financieros" : "Centro de Reportes Financieros"}
      </h2>

      {/* Tabs de Navegación */}
      <div className="btn-group mb-4">
        <button className={`btn ${vistaActual === 'gastos' ? 'btn-primary' : 'btn-light'}`} onClick={() => setVistaActual('gastos')}>Gastos Caja Chica</button>
        <button className={`btn ${vistaActual === 'liquidaciones' ? 'btn-primary' : 'btn-light'}`} onClick={() => setVistaActual('liquidaciones')}>Historial Liquidaciones</button>
      </div>

      {/* Filtros Globales */}
      <div className="filtros row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="far fa-calendar-alt me-1"></i> Desde (Fecha Inicio)
          </label>
          <input type="date" className="form-control" onChange={(e) => setFechaInicio(e.target.value)} />
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="far fa-calendar-check me-1"></i> Hasta (Fecha Fin)
          </label>
          <input type="date" className="form-control" onChange={(e) => setFechaFin(e.target.value)} />
        </div>
        
        {/* Si es empleado, ocultamos el selector múltiple y mostramos su nombre estático */}
        <div className="col-md-3">
          <label className="form-label small fw-bold text-muted mb-1">
            <i className="fas fa-user me-1"></i> Filtrar por Responsable
          </label>
          {esEmpleado ? (
            <input type="text" className="form-control bg-light" value={`Empleado: ${usuario?.nombre}`} disabled />
          ) : (
            <select 
              className="form-select" 
              onChange={(e) => setFiltroEmpleado(e.target.value)}
              value={filtroEmpleado}
            >
              <option value="">Todos los Empleados</option>
              {empleados.map((e) => {
                const nombre = getNombreEmpleado(e);
                return (
                  <option key={e.id} value={nombre}>
                    {nombre}
                  </option>
                );
              })}
            </select>
          )}
        </div>

        {/* Sección de Exportación */}
        <div className="col-md-3 d-flex align-items-end">
          <div className="btn-group w-100">
            <button className="btn btn-success" onClick={() => exportar("Excel")}>
              <i className="fas fa-file-excel me-2"></i> Excel
            </button>
            <button className="btn btn-primary" onClick={() => exportar("PDF")}>
              <i className="fas fa-file-pdf me-2"></i> PDF
            </button>
          </div>
        </div>
      </div>

      {/* Vista Dinámica */}
      {vistaActual === 'gastos' ? (
        <TablaGastos datos={gastosFiltrados} />
      ) : (
        <TablaLiquidaciones datos={liquidacionesFiltradas} />
      )}
    </div>
  );
}

// Subcomponente Tabla Gastos
function TablaGastos({ datos }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr><th>Fecha</th><th>Responsable</th><th>Concepto</th><th>Monto</th><th>Estado</th></tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map(g => (
              <tr key={g.id}>
                <td>{g.fecha}</td>
                <td>{g.responsable}</td>
                <td>{g.concepto}</td>
                <td>${Number(g.monto || 0).toFixed(2)}</td>
                <td>
                  <span className={`badge bg-${g.estado === 'Aprobado' ? 'success' : g.estado === 'Rechazado' ? 'danger' : 'warning'}`}>
                    {g.estado || 'Pendiente'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5" className="text-center text-muted py-3">No hay registros de gastos disponibles.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Subcomponente Tabla Liquidaciones
function TablaLiquidaciones({ datos }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr><th>Fecha</th><th>Empleado</th><th>Horas Extras</th><th>Total Pagado</th></tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map(l => (
              <tr key={l.id}>
                <td>{l.fechaGeneracion}</td>
                <td>{l.nombre || "N/A"}</td>
                <td>{l.horasExtras}</td>
                <td>${Number(l.totalPagar || 0).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4" className="text-center text-muted py-3">No hay registros de liquidaciones disponibles.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}