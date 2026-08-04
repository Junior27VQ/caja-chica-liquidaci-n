// Usuarios del sistema (login)
export const usuarios = [
  { id: 1, nombre: "Admin", role: "Administrador", password: "1234" },
  { id: 2, nombre: "Juan Pérez", role: "Supervisor", password: "1234" },
  { id: 3, nombre: "María López", role: "Contador", password: "1234" },
  { id: 4, nombre: "Carlos Gómez", role: "Empleado", password: "1234" },
  { id: 5, nombre: "Ana Torres", role: "Empleado", password: "1234" },
];

// Empleados registrados para liquidación
export const empleados = [
  { id: 1, nombre: "Juan Pérez", sueldo: 500, horasExtras: 10, descuentos: 50 },
  { id: 2, nombre: "María López", sueldo: 600, horasExtras: 5, descuentos: 30 },
  { id: 3, nombre: "Carlos Gómez", sueldo: 450, horasExtras: 8, descuentos: 20 },
  { id: 4, nombre: "Ana Torres", sueldo: 550, horasExtras: 6, descuentos: 40 },
];

// Gastos de caja chica
export const gastosCajaChica = [
  { id: 1, concepto: "Transporte", monto: 20, fecha: "2026-08-01", descripcion: "", estado: "", responsable: "Carlos Gómez", comprobante: null },
  { id: 2, concepto: "Materiales", monto: 35, fecha: "2026-08-02", descripcion: "", estado: "", responsable: "Ana Torres", comprobante: null },
];

// Reportes simulados
export const reportes = {
  liquidaciones: [
    { empleado: "Juan Pérez", total: 550 },
    { empleado: "María López", total: 595 },
    { empleado: "Carlos Gómez", total: 470 },
    { empleado: "Ana Torres", total: 560 },
  ],
  cajaChica: [
    { concepto: "Transporte", monto: 20 },
    { concepto: "Materiales", monto: 35 },
  ],
};

// Auditoría simulada
export const auditoria = [
  { id: 1, usuario: "Admin", rol: "Administrador", accion: "Creó empleado Carlos Gómez", fecha: "2026-08-01 09:00" },
  { id: 2, usuario: "Juan Pérez", rol: "Supervisor", accion: "Aprobó gasto de transporte", fecha: "2026-08-01 10:15" },
  { id: 3, usuario: "María López", rol: "Contador", accion: "Calculó liquidación de Ana Torres", fecha: "2026-08-02 14:30" },
];

// Datos del usuario
export const perfilUsuario = [
  { 
    id: 1, nombre: "Admin", role: "Administrador", password: "1234",
    departamento: "Sistemas", correo: "admin@empresa.com", telefono: "0991111111",
    fechaIngreso: "2020-01-10", ultimoAcceso: "2026-08-03 20:00"
  },
  { 
    id: 2, nombre: "Juan Pérez", role: "Supervisor", password: "1234",
    departamento: "Operaciones", correo: "juan.perez@empresa.com", telefono: "0992222222",
    fechaIngreso: "2021-05-12", ultimoAcceso: "2026-08-03 19:30"
  },
  { 
    id: 3, nombre: "María López", role: "Contador", password: "1234",
    departamento: "Finanzas", correo: "maria.lopez@empresa.com", telefono: "0993333333",
    fechaIngreso: "2022-03-15", ultimoAcceso: "2026-08-03 18:45"
  },
  { 
    id: 4, nombre: "Carlos Gómez", role: "Empleado", password: "1234",
    departamento: "Operaciones", correo: "carlos.gomez@empresa.com", telefono: "0994444444",
    fechaIngreso: "2023-07-01", ultimoAcceso: "2026-08-03 17:20"
  },
];

