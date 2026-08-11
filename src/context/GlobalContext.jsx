import React, { createContext, useState, useContext, useEffect } from "react";
import { 
  initialUsuarios, 
  initialEmpleados, 
  initialGastosCajaChica, 
  initialLiquidaciones,
  initialAuditoria 
} from "../data/mockData";

export const GlobalContext = createContext();

export default function GlobalProvider({ children }) {
  // ==========================================
  // 1. ESTADOS CON PERSISTENCIA EN LOCALSTORAGE
  // ==========================================
  const [usuarios] = useState(initialUsuarios);

  const [usuario, setUsuario] = useState(() => {
    const saved = localStorage.getItem("sys_sesion_usuario");
    return saved ? JSON.parse(saved) : null;
  });

  const [empleados, setEmpleados] = useState(() => {
    const saved = localStorage.getItem("sys_empleados");
    return saved ? JSON.parse(saved) : initialEmpleados;
  });
  
  const [fondoCajaChica, setFondoCajaChica] = useState(() => {
    const saved = localStorage.getItem("sys_fondo");
    return saved ? JSON.parse(saved) : 500.00;
  });

  const [gastos, setGastos] = useState(() => {
    const saved = localStorage.getItem("sys_gastos");
    return saved ? JSON.parse(saved) : initialGastosCajaChica;
  });

  const [liquidaciones, setLiquidaciones] = useState(() => {
    const saved = localStorage.getItem("sys_liquidaciones");
    return saved ? JSON.parse(saved) : initialLiquidaciones; 
  });

  const [auditoria, setAuditoria] = useState(() => {
    const saved = localStorage.getItem("sys_auditoria");
    return saved ? JSON.parse(saved) : initialAuditoria;
  });

  const [mensajesSoporte, setMensajesSoporte] = useState(() => {
    const saved = localStorage.getItem("sys_mensajes_soporte");
    return saved ? JSON.parse(saved) : [
      { id: 1, usuario: "Carlos Gómez", rol: "Empleado", mensaje: "No puedo iniciar sesión con mi contraseña temporal.", fecha: "2026-08-10 08:30" }
    ];
  });

  const [historialFondo, setHistorialFondo] = useState(() => {
    const saved = localStorage.getItem("sys_historial_fondo");
    return saved ? JSON.parse(saved) : [];
  });

  const [notificaciones, setNotificaciones] = useState(() => {
    const saved = localStorage.getItem("sys_notificaciones");
    return saved ? JSON.parse(saved) : []; 
  });

  // ==========================================
  // 2. SINCRONIZACIÓN AUTOMÁTICA CON LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("sys_sesion_usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("sys_sesion_usuario");
    }
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem("sys_empleados", JSON.stringify(empleados));
  }, [empleados]);

  useEffect(() => {
    localStorage.setItem("sys_gastos", JSON.stringify(gastos));
  }, [gastos]);
  
  useEffect(() => {
    localStorage.setItem("sys_fondo", JSON.stringify(fondoCajaChica));
  }, [fondoCajaChica]);

  useEffect(() => {
    localStorage.setItem("sys_liquidaciones", JSON.stringify(liquidaciones));
  }, [liquidaciones]);

  useEffect(() => {
    localStorage.setItem("sys_auditoria", JSON.stringify(auditoria));
  }, [auditoria]);

  useEffect(() => {
    localStorage.setItem("sys_mensajes_soporte", JSON.stringify(mensajesSoporte));
  }, [mensajesSoporte]);

  useEffect(() => {
    localStorage.setItem("sys_historial_fondo", JSON.stringify(historialFondo));
  }, [historialFondo]);

  useEffect(() => {
    localStorage.setItem("sys_notificaciones", JSON.stringify(notificaciones));
  }, [notificaciones]);

  // ==========================================
  // 3. MÉTODOS DE AUDITORÍA INTERNA
  // ==========================================
  const registrarAuditoria = (accion, detalles) => {
    const nuevoEvento = {
      id: Date.now(),
      usuario_id: usuario ? usuario.id : null,
      usuarioNombre: usuario ? usuario.nombre : "Sistema / Anónimo",
      rol: usuario ? usuario.role : "Invitado",
      accion,
      detalles,
      fecha: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    setAuditoria((prev) => [nuevoEvento, ...prev]);
  };
  
  // Función para agregar notificaciones dinámicamente desde cualquier componente
  const agregarNotificacion = (titulo, descripcion, tipo = "gasto") => {
    const nueva = {
      id: Date.now(),
      titulo,
      descripcion,
      hora: "Hace un momento",
      leida: false,
      tipo
    };
    setNotificaciones((prev) => [nueva, ...prev]);
  };
  // Función para eliminar notificación al abrirse o leerse
  const eliminarNotificacion = (id) => {
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  // ==========================================
  // 4. MÉTODOS DE AUTENTICACIÓN
  // ==========================================
  const login = (nombreUsuarioInput, passwordInput) => {
    const encontrado = usuarios.find(
      (u) => 
        (u.usuario.toLowerCase() === nombreUsuarioInput.toLowerCase() || 
         u.nombre.toLowerCase() === nombreUsuarioInput.toLowerCase()) && 
        u.password === passwordInput
    );

    if (encontrado) {
      setUsuario(encontrado);
      // Registrar en auditoría
      const evento = {
        id: Date.now(),
        usuario_id: encontrado.id,
        usuarioNombre: encontrado.nombre,
        rol: encontrado.role,
        accion: "LOGIN_EXITOSO",
        detalles: `El usuario ${encontrado.nombre} inició sesión correctamente.`,
        fecha: new Date().toISOString().replace("T", " ").substring(0, 19),
      };
      setAuditoria((prev) => [evento, ...prev]);
      return { success: true };
    }
    return { success: false, message: "Usuario o contraseña incorrectos." };
  };

  const logout = () => {
    if (usuario) {
      registrarAuditoria("LOGOUT", `El usuario ${usuario.nombre} cerró sesión.`);
    }
    setUsuario(null);
    localStorage.removeItem("sys_sesion_usuario");
  };

  // ==========================================
  // 5. MÉTODOS DE NEGOCIO (CAJA CHICA Y GASTOS)
  // ==========================================
  const crearGasto = (concepto, monto, descripcion = "") => {
    if (!usuario) return { success: false, message: "No autorizado" };

    // 1. Buscamos el empleado. 
    // Si no existe, usamos el id del usuario como respaldo para evitar nulos
    const empleadoAsociado = empleados.find((e) => e.usuario_id === usuario.id);
    const empleadoId = empleadoAsociado ? empleadoAsociado.id : usuario.id; 

    const nuevoGasto = {
      id: Date.now(),
      // IMPORTANTE: Aseguramos que empleado_id nunca sea null
      empleado_id: empleadoId, 
      responsable: usuario.nombre || "Desconocido",
      concepto,
      monto: Number(monto || 0),
      descripcion,
      // Formato de fecha completo para consistencia
      fecha: new Date().toISOString().replace("T", " ").substring(0, 16),
      estado: "Pendiente",
      aprobado_por_usuario_id: null,
    };

    // 2. Persistencia en el estado
    setGastos((prev) => [nuevoGasto, ...prev]);

    // 3. Registro de auditoría con detalles claros
    registrarAuditoria(
      "CREAR_GASTO", 
      `El usuario ${usuario.nombre} registró un gasto en '${concepto}' por un monto de $${monto}`
    );

    return { success: true };
  };

  const cambiarEstadoGasto = (gastoId, nuevoEstado) => {
    if (!usuario) return { success: false, message: "No autorizado" };

    let gastoModificado = null;

    const gastosActualizados = gastos.map((g) => {
      if (g.id === gastoId) {
        gastoModificado = g;
        return { 
          ...g, 
          estado: nuevoEstado, 
          aprobado_por_usuario_id: nuevoEstado === "Aprobado" ? usuario.id : g.aprobado_por_usuario_id 
        };
      }
      return g;
    });

    if (!gastoModificado) return { success: false, message: "Gasto no encontrado" };

    setGastos(gastosActualizados);
    
    // Registramos la acción en la auditoría del sistema
    registrarAuditoria(
      "CAMBIO_ESTADO_GASTO",
      `El usuario ${usuario.nombre} (${usuario.role}) cambió el estado del gasto #${gastoId} (${gastoModificado.concepto}) a '${nuevoEstado}'.`
    );

    return { success: true };
  };
  // Función para manejar la exportación y notificar al sistema/administrador
  const exportarReporteGastos = (gastos, saldoDisponible, usuarioActual) => {
    const fechaActual = new Date().toISOString().replace("T", " ").substring(0, 19);
    const nombreUsuario = usuarioActual?.nombre || "Usuario Anónimo";
    const rolUsuario = usuarioActual?.role || "Invitado";

    // Registrar en la auditoría general
    registrarAuditoria(
      "EXPORTAR_REPORTE_GASTOS",
      `El usuario ${nombreUsuario} (${rolUsuario}) exportó el reporte de gastos y resumen financiero.`
    );

    // Agregar la notificación para el Navbar
    agregarNotificacion(
      "Reporte de Gastos Exportado",
      `El usuario ${nombreUsuario} generó el reporte. Saldo actual: $${Number(saldoDisponible).toFixed(2)}`,
      "gasto"
    );

    alert(`¡Reporte exportado con éxito!\nFecha: ${fechaActual}\nUsuario:${nombreUsuario}\nSe ha notificado al administrador.`);
    
    return { success: true };
  };

  // ==========================================
  // 6. MÉTODOS DE NEGOCIO (LIQUIDACIONES)
  // ==========================================
  const calcularLiquidacionEmpleado = (empleadoId, horasExtras = 0, descuentosExtra = 0) => {
    const empleado = empleados.find((e) => e.id === empleadoId);
    if (!empleado) return null;

    const datosUsuario = usuarios.find((u) => u.id === empleado.usuario_id);
    
    // Sumar gastos aprobados de caja chica del empleado que no han sido reembolsados
    const gastosAprobados = gastos
      .filter((g) => g.empleado_id === empleadoId && g.estado === "Aprobado")
      .reduce((acc, g) => acc + g.monto, 0);

    const montoHorasExtras = horasExtras * empleado.tarifaHoraExtra;
    const aportesLey = empleado.sueldoBase * 0.0945; // 9.45% IESS estándar
    const totalDescuentos = aportesLey + Number(descuentosExtra);
    
    const totalPagar = (empleado.sueldoBase + montoHorasExtras + gastosAprobados) - totalDescuentos;

    const resultado = {
      empleadoId: empleado.id,
      nombre: datosUsuario ? datosUsuario.nombre : "Desconocido",
      sueldoBase: empleado.sueldoBase,
      horasExtras: horasExtras,
      montoHorasExtras: Number(montoHorasExtras.toFixed(2)),
      gastosReembolsables: Number(gastosAprobados.toFixed(2)),
      descuentos: Number(totalDescuentos.toFixed(2)),
      totalPagar: Number(totalPagar.toFixed(2)),
      fechaGeneracion: new Date().toISOString().replace("T", " ").substring(0, 16) // Fecha para el historial
    };

    setLiquidaciones((prev) => [
      { id: Date.now(), ...resultado }, 
      ...prev
    ]);

    return resultado;
  };
  // ==========================================
  // Metodo para vaciar historiales y liberar localStorage
  // ==========================================
  const limpiarReportesSistema = (tipo) => {
    if (tipo === "gastos") {
      setGastos([]); // O puedes dejarlo con un array vacío o mock inicial
      localStorage.removeItem("sys_gastos");
    } else if (tipo === "liquidaciones") {
      setLiquidaciones([]);
      localStorage.removeItem("sys_liquidaciones");
    }
    
    // Registrar la acción en la auditoría del sistema
    registrarAuditoria(
      "LIMPIAR_REPORTES", 
      `El administrador ${usuario?.nombre} vació el historial de ${tipo}.`
    );
  };

  const limpiarAuditoria = () => {
    setAuditoria([]);
    localStorage.removeItem("sys_auditoria");

    console.log("Historial de auditoría vaciado por:", usuario?.nombre);
  };
  // ==========================================
  // Metodo de mensajes al soporte
  // ==========================================
  const enviarMensajeSoporte = (nombre, rol, mensaje) => {
    const nuevoMensaje = {
      id: Date.now(),
      usuario: nombre || "Usuario Anónimo",
      rol: rol || "Invitado",
      mensaje,
      fecha: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    setMensajesSoporte((prev) => [nuevoMensaje, ...prev]);
    registrarAuditoria("SOPORTE", `Se envió un reporte de fallo: "${mensaje.substring(0, 30)}..."`);
  };
  // ==========================================
  // VALORES Y MÉTODOS EXPUESTOS AL FRONTEND
  // ==========================================
  return (
    <GlobalContext.Provider
      value={{
        // Estado Global Core
        usuario,
        usuarios,
        empleados,
        gastos,
        liquidaciones,
        auditoria,
        fondoCajaChica, setFondoCajaChica,
        historialFondo, setHistorialFondo,
        notificaciones, setNotificaciones, 
        mensajesSoporte,

        // Métodos 
        login,
        logout,
        crearGasto,
        calcularLiquidacionEmpleado,
        registrarAuditoria,
        enviarMensajeSoporte,
        cambiarEstadoGasto,
        exportarReporteGastos,
        agregarNotificacion,
        eliminarNotificacion,
        limpiarReportesSistema,
        limpiarAuditoria
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useAuth() {
  return useContext(GlobalContext);
}