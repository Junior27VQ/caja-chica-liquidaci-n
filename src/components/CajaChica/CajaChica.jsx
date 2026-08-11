import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/GlobalContext";
import ResumenCajaChica from "./ResumenCajaChica";
import ListaGastos from "./ListaGastos";
import HistorialFondo from "./HistorialFondo";
import ModalGasto from "./ModalGasto";
import "../../styles/CajaChica.css";

export default function CajaChica() {
  const {
    gastos,
    fondoCajaChica,
    historialFondo,
    usuario,
    crearGasto,
    cambiarEstadoGasto,
    exportarReporteGastos
  } = useAuth();

  const [showModal, setShowModal] = useState(false);

  // 1. Filtrado de gastos robusto y flexible para el empleado
  const gastosFiltrados = useMemo(() => {
    if (!usuario) return [];
    
    // Si es Administrador, Supervisor o Contador, ven todo el historial
    if (["Administrador", "Supervisor", "Contador"].includes(usuario.role)) {
      return gastos || [];
    }

    // Si es Empleado, filtramos de forma flexible (por ID numérico/string o por nombre de responsable)
    return (gastos || []).filter((g) => {
      const coincideId = String(g.empleado_id) === String(usuario.id);
      const coincideNombre = g.responsable && usuario.nombre && 
        g.responsable.trim().toLowerCase() === usuario.nombre.trim().toLowerCase();
      
      return coincideId || coincideNombre;
    });
  }, [gastos, usuario]);

  // 2. Definición de permisos
  const esAdminOSupervisor = usuario?.role === "Administrador" || usuario?.role === "Supervisor";
  const puedeRegistrar = usuario !== null && usuario?.role !== "Contador";

  // 3. Totales dinámicos basados estrictamente en los gastos del empleado (o totales si es admin)
  const { totalPendiente, totalAprobado, totalRechazado, saldoDisponible } = useMemo(() => {
    const pendientes = gastosFiltrados
      .filter((g) => g.estado?.toLowerCase() === "pendiente")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const aprobados = gastosFiltrados
      .filter((g) => g.estado?.toLowerCase() === "aprobado")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const rechazados = gastosFiltrados
      .filter((g) => g.estado?.toLowerCase() === "rechazado")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const fondoNum = Number(fondoCajaChica || 0);

    // Nota: Si es empleado, el saldo disponible puede ser el fondo general o informativo, 
    // pero mantenemos la lógica general restando los aprobados de su vista o del total.
    return {
      totalPendiente: pendientes,
      totalAprobado: aprobados,
      totalRechazado: rechazados,
      saldoDisponible: fondoNum - aprobados,
    };
  }, [gastosFiltrados, fondoCajaChica]);

  // 4. Funciones protegidas
  const cambiarEstado = (id, nuevoEstado) => {
    if (esAdminOSupervisor) {
      cambiarEstadoGasto(id, nuevoEstado);
    }
  };

  const agregarGasto = (nuevo) => {
    if (puedeRegistrar) {
      crearGasto(nuevo.concepto, nuevo.monto, nuevo.descripcion || "");
    }
  };

  return (
    <div className="caja-chica-wrapper">
      <div className="card caja-chica shadow-sm border-0 bg-white p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Caja Chica</h2>
          {puedeRegistrar && (
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              <i className="fas fa-plus-circle me-2"></i> Registrar nuevo gasto
            </button>
          )}
        </div>

        {/* Resumen Financiero adaptado al rol del usuario */}
        <ResumenCajaChica
          fondoInicial={fondoCajaChica}
          totalPendiente={totalPendiente}
          totalAprobado={totalAprobado}
          totalRechazado={totalRechazado}
          saldoDisponible={saldoDisponible}
        />

        {/* Tabla que listará únicamente los gastos que le corresponden al empleado */}
        <ListaGastos
          gastos={gastosFiltrados}
          cambiarEstado={esAdminOSupervisor ? cambiarEstado : null}
          usuario={usuario}
          saldoDisponible={saldoDisponible}
          exportarReporteGastos={exportarReporteGastos}
        />

        {/* Historial de fondo general (opcionalmente visible o exclusivo para control) */}
        <HistorialFondo historial={historialFondo} />

        {showModal && (
          <ModalGasto
            onClose={() => setShowModal(false)}
            onSave={agregarGasto}
            usuario={usuario}
            gastos={gastos}
          />
        )}
      </div>
    </div>
  );
}