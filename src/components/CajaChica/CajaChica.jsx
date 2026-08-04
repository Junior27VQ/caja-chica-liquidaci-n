import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/GlobalContext";
import ResumenCajaChica from "./ResumenCajaChica";
import ListaGastos from "./ListaGastos";
import HistorialFondo from "./HistorialFondo";
import ModalGasto from "./ModalGasto";

export default function CajaChica() {
  const {
    gastosCajaChica,
    setGastosCajaChica,
    fondoInicial,
    setFondoInicial,
    historialFondo,
    setHistorialFondo,
    usuario,
    registrarOperacion,
    registrarModificacion,
  } = useAuth();

  const [showModal, setShowModal] = useState(false);

  // Derivación de totales optimizada y síncrona con useMemo (Elimina useEffects redundantes)
  const { totalPendiente, totalAprobado, totalRechazado, totalGastos, saldoDisponible } = useMemo(() => {
    const pendientes = gastosCajaChica
      .filter((g) => g.estado === "pendiente")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const aprobados = gastosCajaChica
      .filter((g) => g.estado === "aprobado")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const rechazados = gastosCajaChica
      .filter((g) => g.estado === "rechazado")
      .reduce((sum, g) => sum + Number(g.monto || 0), 0);

    const fondoNum = Number(fondoInicial || 0);

    return {
      totalPendiente: pendientes,
      totalAprobado: aprobados,
      totalRechazado: rechazados,
      totalGastos: aprobados,
      saldoDisponible: fondoNum - aprobados,
    };
  }, [gastosCajaChica, fondoInicial]);

  // Cambiar estado de gasto asegurando inmutabilidad en el contexto global
  const cambiarEstado = (id, nuevoEstado) => {
    const gastoOriginal = gastosCajaChica.find((g) => g.id === id);
    if (!gastoOriginal) return;

    const estadoAnterior = gastoOriginal.estado;

    // Actualización inmutable del array de gastos
    const gastosActualizados = gastosCajaChica.map((g) =>
      g.id === id ? { ...g, estado: nuevoEstado } : g
    );
    
    // Forzamos la actualización en el contexto global
    setGastosCajaChica(gastosActualizados);

    // Registro seguro en auditoría
    registrarOperacion(
      usuario?.nombre || "Sistema",
      `Cambio de estado de gasto`,
      `Gasto #${id} (${gastoOriginal.concepto}) → ${nuevoEstado}`
    );
    
    registrarModificacion(
      usuario?.nombre || "Sistema",
      "estado gasto",
      estadoAnterior,
      nuevoEstado
    );
  };

  // Agregar nuevo gasto de forma inmutable
  const agregarGasto = (nuevo) => {
    const nuevoConId = { 
      ...nuevo, 
      id: Date.now(), 
      estado: "pendiente",
      monto: Number(nuevo.monto) 
    };
    
    setGastosCajaChica([...gastosCajaChica, nuevoConId]);

    registrarOperacion(
      usuario?.nombre || "Sistema",
      "Registro de gasto",
      `Nuevo gasto: ${nuevo.concepto}, $${nuevo.monto}`
    );
  };

  const puedeRegistrar =
    usuario?.role === "Administrador" || usuario?.role === "Supervisor";

  return (
    <div className="card caja-chica">
      <h2>Gastos de Caja Chica</h2>

      {puedeRegistrar && (
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          Registrar nuevo gasto
        </button>
      )}

      <ResumenCajaChica
        fondoInicial={fondoInicial}
        setFondoInicial={setFondoInicial}
        totalPendiente={totalPendiente}
        totalAprobado={totalAprobado}
        totalRechazado={totalRechazado}
        totalGastos={totalGastos}
        saldoDisponible={saldoDisponible}
        usuario={usuario}
        historialFondo={historialFondo}
        setHistorialFondo={setHistorialFondo}
      />

      <ListaGastos
        gastos={gastosCajaChica}
        cambiarEstado={cambiarEstado}
        usuario={usuario}
      />

      <HistorialFondo historial={historialFondo} />

      {showModal && (
        <ModalGasto
          onClose={() => setShowModal(false)}
          onSave={agregarGasto}
          usuario={usuario}
          gastos={gastosCajaChica}
        />
      )}
    </div>
  );
}