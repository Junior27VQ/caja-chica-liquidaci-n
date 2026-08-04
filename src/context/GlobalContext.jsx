import React, { createContext, useState, useContext } from "react";
import { empleados, gastosCajaChica as gastosIniciales, reportes, auditoria } from "../data/mockData";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  const [empleadosState, setEmpleados] = useState(empleados);
  const [gastosCajaChica, setGastosCajaChica] = useState(gastosIniciales);
  const [reportesState, setReportes] = useState(reportes);
  const [auditoriaState, setAuditoria] = useState(auditoria);
  const [usuario, setUsuario] = useState(null);
  const [fondoInicial, setFondoInicial] = useState(500); // ejemplo: $500
  const [historialFondo, setHistorialFondo] = useState([]);
  const [logsOperaciones, setLogsOperaciones] = useState([]);
  const [historialModificaciones, setHistorialModificaciones] = useState([]);

  // Registrar una operación general
    const registrarOperacion = (usuario, accion, detalle) => {
    const nuevoLog = {
        fecha: new Date().toLocaleString(),
        usuario,
        accion,
        detalle,
    };
    setLogsOperaciones((prev) => [...prev, nuevoLog]);
    };

    // Registrar una modificación con valores anteriores/nuevos
    const registrarModificacion = (usuario, campo, valorAnterior, valorNuevo) => {
    const nuevaModificacion = {
        fecha: new Date().toLocaleString(),
        usuario,
        campo,
        valorAnterior,
        valorNuevo,
    };
    setHistorialModificaciones((prev) => [...prev, nuevaModificacion]);
    };

  return (
    <GlobalContext.Provider value={{
        empleados: empleadosState, setEmpleados,
        gastosCajaChica, setGastosCajaChica,
        reportes: reportesState, setReportes,
        auditoria: auditoriaState, setAuditoria,
        fondoInicial, setFondoInicial,
        historialFondo, setHistorialFondo,
        logsOperaciones, historialModificaciones,
        registrarOperacion, registrarModificacion,
        usuario, setUsuario}}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useAuth(){
    return useContext(GlobalContext);
}
