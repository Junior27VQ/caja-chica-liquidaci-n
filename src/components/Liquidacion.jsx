// src/components/Liquidacion.jsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Liquidacion.css";

export default function Liquidacion() {
  const {
    empleados,
    usuarios,               // <-- Importante: Traemos usuarios para cruzar los nombres
    fondoCajaChica,
    gastos,
    usuario,
    calcularLiquidacionEmpleado,
    registrarAuditoria,
    exportarReporteGastos,
    agregarNotificacion     // Si lo tienes integrado, sino usamos solo alert
  } = useAuth();

  // Estados para formulario
  const [empleadoId, setEmpleadoId] = useState("");
  const [horasExtras, setHorasExtras] = useState("");
  const [descuentosExtra, setDescuentosExtra] = useState("");
  const [resultadoEmpleado, setResultadoEmpleado] = useState(null);

  // Cálculo síncrono de gastos aprobados y saldo
  const { gastosAprobados, saldoDisponible } = useMemo(() => {
    const aprobados = (gastos || [])
      .filter((g) => (g.estado || "").toLowerCase() === "aprobado")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const fondoNum = Number(fondoCajaChica || 0);

    return {
      gastosAprobados: aprobados,
      saldoDisponible: fondoNum - aprobados,
    };
  }, [gastos, fondoCajaChica]);

  // Función para obtener el nombre del empleado
  const obtenerNombreEmpleado = (empleado) => {
  if (!usuarios) return `Empleado #${empleado.id}`;
  // Buscamos el usuario cuyo ID coincida con empleado.usuario_id
  const userVinculado = usuarios.find(u => u.id === empleado.usuario_id);
  return userVinculado ? userVinculado.nombre : `Empleado #${empleado.id}`;
};

  const handleCalcularLiquidacion = () => {
    if (!empleadoId) {
      alert("Seleccione un empleado");
      return;
    }
    if (isNaN(horasExtras) || isNaN(descuentosExtra)) {
      alert("Horas extras y descuentos deben ser números válidos");
      return;
    }

    const resultado = calcularLiquidacionEmpleado(
      Number(empleadoId),
      Number(horasExtras || 0),
      Number(descuentosExtra || 0)
    );

    if (!resultado) {
      alert("No se pudo calcular la liquidación.");
      return;
    }

    // Le inyectamos el nombre real obtenido al resultado para mostrarlo en el recibo
    const empleadoBase = empleados.find(e => e.id === Number(empleadoId));
    resultado.nombreReal = obtenerNombreEmpleado(empleadoBase);

    setResultadoEmpleado(resultado);

    if (registrarAuditoria) {
      registrarAuditoria(
        "CALCULO_LIQUIDACION",
        `El usuario ${usuario?.nombre} calculó la liquidación para ${resultado.nombreReal}.`
      );
    }
  };

  const handleExportarLiquidacion = () => {
    const fechaActual = new Date().toISOString().replace("T", " ").substring(0, 19);
    
    // Alerta solicitada
    alert(`📥 ¡Liquidación exportada con éxito!\n\n📅 Fecha: ${fechaActual}\n👤 Generado por: ${usuario?.nombre} (${usuario?.role})\n📄 Empleado Liquidado: ${resultadoEmpleado.nombreReal}\n💰 Total a Pagar: $${Number(resultadoEmpleado.totalPagar).toFixed(2)}\n\nSe ha notificado al sistema.`);
    
    // Si tienes el sistema de notificaciones del paso anterior, lo disparamos:
    if (agregarNotificacion) {
      agregarNotificacion(
        "Liquidación Exportada",
        `${usuario?.nombre} exportó la liquidación de ${resultadoEmpleado.nombreReal} por $${Number(resultadoEmpleado.totalPagar).toFixed(2)}`,
        "liquidacion"
      );
    }
  };

  const puedeCalcular = usuario?.role === "Administrador" || usuario?.role === "Supervisor" || usuario?.role === "Contador";
  const puedeVer = puedeCalcular || usuario?.role === "Empleado";

  return (
    <div className="fin-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fin-main-title m-0">Módulo de Liquidación y Cierres</h2>
      </div>

      {/* Resumen de Caja Chica */}
      {puedeVer && (
        <div className="fin-card mb-4">
          <h3 className="fin-card-title">Resumen Financiero (Caja Chica)</h3>
          <div className="row g-3">
            <div className="col-md-4">
              <div className="fin-stat-box box-primary">
                <span className="fin-stat-label">Fondo Inicial Asignado</span>
                <strong className="fin-stat-value">${Number(fondoCajaChica || 0).toFixed(2)}</strong>
              </div>
            </div>
            <div className="col-md-4">
              <div className="fin-stat-box box-info">
                <span className="fin-stat-label">Total Gastos Aprobados</span>
                <strong className="fin-stat-value">${Number(gastosAprobados).toFixed(2)}</strong>
              </div>
            </div>
            <div className="col-md-4">
              <div className="fin-stat-box box-success">
                <span className="fin-stat-label">Saldo Neto Disponible</span>
                <strong className="fin-stat-value">${Number(saldoDisponible).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de Liquidación de Empleado */}
      {puedeCalcular && (
        <div className="fin-card mb-4">
          <h3 className="fin-card-title">Generar Planilla de Liquidación</h3>
          
          <div className="fin-form-group mb-3">
            <label className="fin-label">Seleccionar Colaborador:</label>
            <select
              className="fin-input form-select"
              value={empleadoId}
              onChange={(e) => setEmpleadoId(e.target.value)}
            >
              <option value="">-- Seleccione un empleado del sistema --</option>
              {empleados && empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {obtenerNombreEmpleado(e)} 
                </option>
              ))}
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="fin-label">Horas Extras Reportadas:</label>
              <input
                type="number"
                step="1"
                className="fin-input form-control"
                placeholder="Ej. 10"
                value={horasExtras}
                onChange={(e) => setHorasExtras(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="fin-label">Deducciones Adicionales (USD):</label>
              <input
                type="number"
                step="0.01"
                className="fin-input form-control"
                placeholder="0.00"
                value={descuentosExtra}
                onChange={(e) => setDescuentosExtra(e.target.value)}
              />
            </div>
          </div>

          <button className="fin-btn-primary mt-2" onClick={handleCalcularLiquidacion}>
            <i className="fas fa-file-invoice-dollar me-2"></i> Procesar Liquidación
          </button>
        </div>
      )}

      {/* Comprobante Estilo Factura/Recibo */}
      {resultadoEmpleado && puedeVer && (
        <div className="fin-receipt-card">
          <div className="fin-receipt-header">
            <div className="fin-receipt-brand">
              <i className="fas fa-check-circle me-2"></i> Liquidación Aprobada
            </div>
            <button className="fin-btn-export" onClick={handleExportarLiquidacion}>
              <i className="fas fa-print me-2"></i> Exportar Documento
            </button>
          </div>
          
          <div className="fin-receipt-body">
            <div className="row">
              <div className="col-sm-6 mb-3">
                <span className="fin-receipt-label">Colaborador</span>
                <div className="fin-receipt-data text-uppercase">{resultadoEmpleado.nombreReal}</div>
              </div>
              <div className="col-sm-6 mb-3">
                <span className="fin-receipt-label">Fecha de Emisión</span>
                <div className="fin-receipt-data">{new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div className="fin-receipt-table-wrapper mt-3">
              <table className="table fin-receipt-table">
                <tbody>
                  <tr>
                    <td>Sueldo Base Contractual</td>
                    <td className="text-end fw-bold">${Number(resultadoEmpleado.sueldoBase || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Remuneración por Horas Extras ({resultadoEmpleado.horasExtras} hrs)</td>
                    <td className="text-end text-success">+ ${Number(resultadoEmpleado.montoHorasExtras || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Reembolso de Gastos (Caja Chica)</td>
                    <td className="text-end text-success">+ ${Number(resultadoEmpleado.gastosReembolsables || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Deducciones y Aportes (Ley + Extras)</td>
                    <td className="text-end text-danger">- ${Number(resultadoEmpleado.descuentos || 0).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="fin-receipt-footer">
            <span>Neto a Pagar</span>
            <span className="fin-receipt-total">${Number(resultadoEmpleado.totalPagar || 0).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Mensaje para empleados */}
      {usuario?.role === "Empleado" && !resultadoEmpleado && (
        <div className="alert alert-secondary mt-3 shadow-sm border-0">
          <i className="fas fa-info-circle me-2 text-primary"></i> 
          Módulo de visualización activa. Seleccione generar liquidación o comuníquese con RRHH para emitir su recibo.
        </div>
      )}
    </div>
  );
}