// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, } from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { dataLiquidacion, dataReportes } from "../data/charData";

ChartJS.register( CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement );

export default function Dashboard() {
  const { usuario, usuarios, gastos, empleados, fondoCajaChica, setFondoCajaChica, 
          mensajesSoporte, historialFondo, setHistorialFondo, registrarAuditoria } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [editandoFondo, setEditandoFondo] = useState(false);
  const [nuevoFondo, setNuevoFondo] = useState(fondoCajaChica || 500);

  if (!usuario) {
    return <h2 className="text-center mt-5">Acceso denegado. Inicie sesión primero.</h2>;
  }

  // Definición clara de accesos por rol para los módulos
  const accesos = {
    Administrador: ["Caja Chica", "Liquidación", "Reportes", "Auditoría"],
    Supervisor: ["Caja Chica", "Liquidación", "Reportes"],
    Contador: ["Liquidación", "Reportes"],
    Empleado: ["Caja Chica", "Reportes"],
  };

  const tarjetasModulos = [
    { titulo: "Caja Chica", descripcion: "Registro y control de gastos menores.", ruta: "caja-chica", icono: "fas fa-wallet", color: "bg-primary" },
    { titulo: "Liquidación", descripcion: "Cálculo automático de sueldos y pagos.", ruta: "liquidacion", icono: "fas fa-file-invoice-dollar", color: "bg-success" },
    { titulo: "Reportes", descripcion: "Generación de reportes y analítica.", ruta: "reportes", icono: "fas fa-chart-pie", color: "bg-warning text-dark" },
    { titulo: "Auditoría", descripcion: "Historial de operaciones y trazabilidad.", ruta: "auditoria", icono: "fas fa-shield-alt", color: "bg-info" },
  ];

  const irAModulo = (ruta) => {
    navigate(`/dashboard/${ruta}`);
  };

  const mostrarDashboardHome = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  // Cálculos de datos
  const totalEmpleadosCount = empleados ? empleados.length : 0;
  
  // Filtrado de gastos globales o personales según rol
  const esAdmin = usuario.role === "Administrador";
  const esSupervisorOContador = usuario.role === "Supervisor" || usuario.role === "Contador";
  const esEmpleado = usuario.role === "Empleado";

  // Si es empleado, solo ve sus propios gastos o métricas filtradas por su nombre
  const gastosFiltrados = esAdmin
    ? (gastos || [])
    : (gastos || []).filter(g => g.responsable?.toLowerCase() === usuario.nombre?.toLowerCase());

  const gastosPendientes = gastosFiltrados.filter(g => g.estado === "Pendiente");
  const gastosAprobados = gastosFiltrados.filter(g => g.estado === "Aprobado");
  const gastosRechazados = gastosFiltrados.filter(g => g.estado === "Rechazado");

  const montoTotalAprobados = gastosAprobados.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const saldoDisponible = Number(fondoCajaChica) - montoTotalAprobados;

  // Buscar información de liquidación del empleado actual si aplica
  const empleadoActual = empleados && usuarios ? empleados.find(e => {
    const userRelacionado = usuarios.find(u => u.id === e.usuario_id);
    return userRelacionado && userRelacionado.nombre.toLowerCase() === usuario.nombre.toLowerCase();
  }) : null;
  // Cálculo seguro de la liquidación personal
  const sueldoBase = Number(empleadoActual?.sueldo || empleadoActual?.sueldoBase || 0);
  const horasExtras = Number(empleadoActual?.horasExtras || 0);
  const tarifaHora = Number(empleadoActual?.tarifaHoraExtra || 5);
  const descuentos = Number(empleadoActual?.descuentos || 0);
  const totalLiquidacionPersonal = (sueldoBase + (horasExtras * tarifaHora)) - descuentos;

  const handleGuardarFondo = (e) => {
    e.preventDefault();
    const valorNuevoNum = Number(nuevoFondo);
    setFondoCajaChica(valorNuevoNum);
    
    const nuevoRegistroHistorial = {
      id: Date.now(),
      fecha: new Date().toISOString().replace("T", " ").substring(0, 19), // Fecha y hora formato "YYYY-MM-DD HH:mm:ss"
      usuario: usuario?.nombre || "Administrador",
      valor: valorNuevoNum
    };
    setHistorialFondo([nuevoRegistroHistorial, ...(historialFondo || [])]);
    if (registrarAuditoria) {
      registrarAuditoria(
        "CAMBIO_FONDO_CAJA", 
        `El usuario ${usuario?.nombre} actualizó el fondo de caja chica a $${valorNuevoNum.toFixed(2)}`
      );
    };
    setEditandoFondo(false);
    toast.success("✨ Fondo de caja chica actualizado exitosamente");
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return (
    <div className="container-fluid px-4 py-3">
      {/* Cabecera */}
      <div className="content-header mb-4 border-bottom pb-3">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <h1 className="m-0 text-dark fw-bold fs-3">Panel de Control</h1>
          </div>
          <div className="col-sm-6 text-sm-end">
            <span className="text-muted small">
              Conectado como: <strong className="text-primary">{usuario.nombre}</strong> ({usuario.role})
            </span>
          </div>
        </div>
      </div>

      <div className="content">
        {mostrarDashboardHome && (
          <>
            {/* Tarjetas de Métricas Adaptadas por Rol */}
            <div className="row g-3 mb-4">
              
              {/* 1. Tarjeta de Fondo Asignado (Solo Administrador y Supervisor) */}
              {(usuario.role === "Administrador" || usuario.role === "Supervisor") && (
                <div className="col-lg-3 col-md-6">
                  <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-primary border-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-muted small fw-bold">FONDO ASIGNADO</span>
                        {usuario.role === "Administrador" && !editandoFondo && (
                          <button className="btn btn-sm text-primary p-0" onClick={() => setEditandoFondo(true)} title="Editar Fondo">
                            <i className="fas fa-edit"></i>
                          </button>
                        )}
                      </div>
                      {editandoFondo ? (
                        <form onSubmit={handleGuardarFondo} className="mt-2">
                          <input 
                            type="number" 
                            className="form-control form-control-sm mb-2" 
                            value={nuevoFondo} 
                            onChange={(e) => setNuevoFondo(e.target.value)} 
                            required
                          />
                          <div className="d-flex gap-1">
                            <button type="submit" className="btn btn-success btn-xs py-0 px-2" style={{fontSize: "0.75rem"}}>Guardar</button>
                            <button type="button" className="btn btn-secondary btn-xs py-0 px-2" style={{fontSize: "0.75rem"}} onClick={() => setEditandoFondo(false)}>Cancelar</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <h3 className="fw-bold text-primary mb-1">${Number(fondoCajaChica).toFixed(2)}</h3>
                          <p className="text-success small mb-0">Disponibilidad: ${saldoDisponible.toFixed(2)}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Tarjeta de Total Empleados (Visible para Admin, Supervisor y Contador) */}
              {!esEmpleado && (
                <div className="col-lg-3 col-md-6">
                  <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-success border-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <span className="text-muted small fw-bold">TOTAL EMPLEADOS</span>
                      <h3 className="fw-bold text-success mb-1 mt-1">{totalEmpleadosCount}</h3>
                      <p className="text-muted small mb-0">Personal registrado</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Tarjeta de Resumen de Liquidación Personal (Especial para Empleados o roles con sueldo) */}
              {empleadoActual && (
                <div className="col-lg-3 col-md-6">
                  <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-info border-4 h-100">
                    <span className="text-muted small fw-bold">MI LIQUIDACIÓN (ESTIMADA)</span>
                    <h3 className="fw-bold text-info mb-1 mt-1">${totalLiquidacionPersonal.toFixed(2)}</h3>
                    <p className="text-muted small mb-0">Extras: {horasExtras} hrs | Desc: ${descuentos}</p>
                  </div>
                </div>
              )}

              {/* 4. Tarjetas de Estados de Gastos (Pendientes, Aprobados, Rechazados) */}
              <div className="col-lg-2 col-md-4">
                <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-warning border-4 h-100">
                  <span className="text-muted small fw-bold">PENDIENTES</span>
                  <h3 className="fw-bold text-warning mb-1 mt-1">{gastosPendientes.length}</h3>
                  <p className="text-muted small mb-0">Por revisar</p>
                </div>
              </div>

              <div className="col-lg-2 col-md-4">
                <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-info border-4 h-100">
                  <span className="text-muted small fw-bold">APROBADOS</span>
                  <h3 className="fw-bold text-info mb-1 mt-1">{gastosAprobados.length}</h3>
                  <p className="text-muted small mb-0">Validados</p>
                </div>
              </div>

              <div className="col-lg-2 col-md-4">
                <div className="small-box bg-white p-3 border rounded shadow-sm border-start border-danger border-4 h-100">
                  <span className="text-muted small fw-bold">RECHAZADOS</span>
                  <h3 className="fw-bold text-danger mb-1 mt-1">{gastosRechazados.length}</h3>
                  <p className="text-muted small mb-0">Anulados</p>
                </div>
              </div>

            </div>

            {/* Tarjetas de Navegación por Módulos (Filtradas estrictamente por rol) */}
            <div className="row g-3 mb-4">
              {tarjetasModulos
                .filter((t) => accesos[usuario?.role]?.includes(t.titulo))
                .map((t, index) => (
                  <div key={index} className="col-md-3">
                    <div className="card h-100 shadow-sm border-0">
                      <div className={`card-header ${t.color} text-white d-flex align-items-center py-3`}>
                        <i className={`${t.icono} fa-lg me-2`}></i>
                        <h3 className="card-title fs-6 fw-bold m-0">{t.titulo}</h3>
                      </div>
                      <div className="card-body d-flex flex-column justify-content-between">
                        <p className="text-muted small">{t.descripcion}</p>
                        <button
                          className="btn btn-outline-primary btn-sm w-100 mt-2 fw-semibold"
                          onClick={() => irAModulo(t.ruta)}
                        >
                          Acceder al Módulo →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Gráficos analíticos exclusivos para roles gerenciales / contables */}
            {(usuario.role === "Administrador" || usuario.role === "Supervisor" || usuario.role === "Contador") && (
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-dark text-white">
                      <h3 className="card-title fs-6 m-0">📊 Analítica de Liquidaciones</h3>
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div style={{ height: "260px", position: "relative" }}>
                        <Bar data={dataLiquidacion} options={chartOptions} />
                      </div>
                      <button className="btn btn-success btn-sm mt-3 align-self-start" onClick={() => toast.success("Registros verificados")}>
                        Verificar Registros
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-header bg-dark text-white">
                      <h3 className="card-title fs-6 m-0">📑 Distribución de Reportes</h3>
                    </div>
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div style={{ height: "260px", position: "relative" }}>
                        <Pie data={dataReportes} options={chartOptions} />
                      </div>
                      <button className="btn btn-warning btn-sm mt-3 text-dark fw-semibold align-self-start" onClick={() => toast.info("Reporte exportado")}>
                        Exportar Informe
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buzón de Soporte y Fallos del Sistema (Visible para Administradores) */}
            {usuario.role === "Administrador" && (
              <div className="row g-3 mb-4">
                <div className="col-12">
                  <div className="card shadow-sm border-0 direct-chat direct-chat-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
                      <h3 className="card-title fs-6 m-0"><i className="fas fa-comments me-2"></i> Buzón de Soporte y Fallos del Sistema</h3>
                      <span className="badge bg-light text-dark">{mensajesSoporte ? mensajesSoporte.length : 0} Mensajes</span>
                    </div>
                    <div className="card-body" style={{ height: "250px", overflowY: "auto", background: "#f8f9fa" }}>
                      <div className="direct-chat-messages p-2">
                        {mensajesSoporte && mensajesSoporte.length === 0 ? (
                          <p className="text-center text-muted my-5">No hay reportes de fallos registrados.</p>
                        ) : (
                          mensajesSoporte.map((chat) => (
                            <div key={chat.id} className="direct-chat-msg mb-3 p-3 bg-white rounded shadow-sm border">
                              <div className="direct-chat-infos clearfix d-flex justify-content-between mb-1">
                                <span className="direct-chat-name fw-bold text-dark">{chat.usuario} <small className="text-muted fw-normal">({chat.rol})</small></span>
                                <span className="direct-chat-timestamp text-muted small">{chat.fecha}</span>
                              </div>
                              <div className="direct-chat-text text-secondary bg-light p-2 rounded mt-1">
                                {chat.mensaje}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <Outlet />
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}