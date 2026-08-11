// 1. TABLA: Usuarios (Autenticación y Credenciales)
export const initialUsuarios = [
  {
    id: 1,
    nombre: "Fabian Velez",
    usuario: "admin",
    password: "123",
    role: "Administrador",
    departamento: "Sistemas",
    correo: "admin@empresa.com",
    telefono: "0991111111",
    fechaIngreso: "2020-01-10",
    activo: true,
  },
  {
    id: 2,
    nombre: "Juan Pérez",
    usuario: "jperez",
    password: "123",
    role: "Supervisor",
    departamento: "Operaciones",
    correo: "juan.perez@empresa.com",
    telefono: "0992222222",
    fechaIngreso: "2021-05-12",
    activo: true,
  },
  {
    id: 3,
    nombre: "María López",
    usuario: "mlopez",
    password: "123",
    role: "Contador",
    departamento: "Finanzas",
    correo: "maria.lopez@empresa.com",
    telefono: "0993333333",
    fechaIngreso: "2022-03-15",
    activo: true,
  },
  {
    id: 4,
    nombre: "Carlos Gómez",
    usuario: "cgomez",
    password: "123",
    role: "Empleado",
    departamento: "Operaciones",
    correo: "carlos.gomez@empresa.com",
    telefono: "0994444444",
    fechaIngreso: "2023-07-01",
    activo: true,
  },
];

// 2. TABLA: Empleados (Información Salarial y Laboral)
export const initialEmpleados = [
  { id: 101, usuario_id: 1, sueldoBase: 1200.00, tarifaHoraExtra: 10.00 },
  { id: 102, usuario_id: 2, sueldoBase: 800.00, tarifaHoraExtra: 8.00 },
  { id: 103, usuario_id: 3, sueldoBase: 900.00, tarifaHoraExtra: 8.50 },
  { id: 104, usuario_id: 4, sueldoBase: 450.00, tarifaHoraExtra: 5.00 },
];

// 3. TABLA: Gastos de Caja Chica
export const initialGastosCajaChica = [
  {
    id: 1,
    empleado_id: 103,
    concepto: "Transporte para entrega de documentos",
    monto: 20.00,
    fecha: "2026-08-01",
    estado: "Aprobado", 
    aprobado_por_usuario_id: 2, 
    comprobanteUrl: null,
  },
  {
    id: 2,
    empleado_id: 104,
    concepto: "Suministros de oficina urgentes",
    monto: 35.50,
    fecha: "2026-08-02",
    estado: "Pendiente",
    aprobado_por_usuario_id: null,
    comprobanteUrl: null,
  },
];

// 4. TABLA: Liquidaciones Calculadas
export const initialLiquidaciones = [
  {
    id: 501,
    empleado_id: 104, // Carlos Gómez
    periodo: "2026-07",
    horasExtrasTrabajadas: 8,
    montoHorasExtras: 40.00, // 8 hrs * $5.00
    descuentosLey: 42.75,    // iess / aportes
    reembolsoCajaChica: 20.00, // Gastos aprobados del periodo
    totalPagar: 467.25,      // (450 + 40 - 42.75 + 20)
    calculado_por_usuario_id: 3, // María López (Contador)
    fechaGeneracion: "2026-07-31 16:00",
  },
];

// 5. TABLA: Auditoría de Eventos del Sistema
export const initialAuditoria = [
  {
    id: 1001,
    usuario_id: 1,
    accion: "CREAR_USUARIO",
    detalles: "Se creó el usuario Carlos Gómez con rol Empleado",
    fecha: "2026-08-01 09:00:00",
  },
  {
    id: 1002,
    usuario_id: 2,
    accion: "APROBAR_GASTO",
    detalles: "Aprobó el gasto #1 de $20.00 perteneciente al empleado ID 104",
    fecha: "2026-08-01 10:15:00",
  },
  {
    id: 1003,
    usuario_id: 3,
    accion: "GENERAR_LIQUIDACION",
    detalles: "Generó la liquidación #501 para el empleado ID 104 correspondiente a 2026-07",
    fecha: "2026-08-02 14:30:00",
  },
];