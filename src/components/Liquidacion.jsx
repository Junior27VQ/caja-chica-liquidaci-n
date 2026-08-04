import React, { useState, useEffect } from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/Liquidacion.css";

export default function Liquidacion() {
  const {
    empleados,
    fondoInicial,
    gastosCajaChica,
    usuario,
    registrarOperacion,
    registrarModificacion,
  } = useAuth();

  // Estados para formulario
  const [empleadoId, setEmpleadoId] = useState("");
  const [horasExtras, setHorasExtras] = useState("");
  const [descuentos, setDescuentos] = useState("");

  // Estados para cálculos
  const [gastosAprobados, setGastosAprobados] = useState(0);
  const [resultadoCajaChica, setResultadoCajaChica] = useState(null);
  const [resultadoEmpleado, setResultadoEmpleado] = useState(null);

  // Calcular gastos aprobados y saldo de caja chica
  useEffect(() => {
    const aprobados = gastosCajaChica
      .filter((g) => g.estado === "aprobado")
      .reduce((sum, g) => sum + Number(g.monto), 0);

    setGastosAprobados(aprobados);
    setResultadoCajaChica(fondoInicial - aprobados);
  }, [gastosCajaChica, fondoInicial]);

  // Calcular liquidación de empleado
  const calcularLiquidacionEmpleado = () => {
    if (!empleadoId) {
      alert("Seleccione un empleado");
      return;
    }
    if (isNaN(horasExtras) || isNaN(descuentos)) {
      alert("Horas extras y descuentos deben ser números");
      return;
    }

    const empleado = empleados.find((e) => e.id === Number(empleadoId));
    if (!empleado) {
      alert("Empleado no encontrado");
      return;
    }

    const pagoHorasExtras = Number(horasExtras) * 5; // Simulación: $5 por hora extra
    const total = empleado.sueldo + pagoHorasExtras - Number(descuentos);

    const resultado = {
      empleado: empleado.nombre,
      sueldoBase: empleado.sueldo,
      horasExtras,
      descuentos,
      total,
    };

    setResultadoEmpleado(resultado);

    // Registrar en auditoría
    registrarOperacion(
      usuario?.nombre || "Sistema",
      "Cálculo de liquidación",
      `Empleado: ${empleado.nombre}, Total: $${total}`
    );
    registrarModificacion(
      usuario?.nombre || "Sistema",
      "Liquidación",
      "sin cálculo previo",
      `Sueldo: ${empleado.sueldo}, Extras: ${horasExtras}, Descuentos: ${descuentos}, Total: ${total}`
    );
  };

  // Restricciones por rol
  const puedeCalcular =
    usuario?.role === "Administrador" || usuario?.role === "Supervisor";
  const puedeVer =
    usuario?.role === "Administrador" ||
    usuario?.role === "Supervisor" ||
    usuario?.role === "Empleado";

  return (
    <div className="liquidacion-container">
      <h2>Liquidación</h2>

      {/* Resumen de Caja Chica */}
      {puedeVer && (
        <div className="resumen-caja">
          <h3>Resumen de Caja Chica</h3>
          <p><strong>Fondo inicial:</strong> ${fondoInicial}</p>
          <p><strong>Gastos aprobados:</strong> ${gastosAprobados}</p>
          <p><strong>Saldo disponible:</strong> ${resultadoCajaChica}</p>
        </div>
      )}

      {/* Formulario de Liquidación de Empleado */}
      {puedeCalcular && (
        <div className="form-liquidacion">
          <h3>Liquidación de Empleado</h3>

          <select
            className="textbox"
            value={empleadoId}
            onChange={(e) => setEmpleadoId(e.target.value)}
          >
            <option value="">Seleccione empleado</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>

          <input
            type="number"
            className="textbox"
            placeholder="Horas extras"
            value={horasExtras}
            onChange={(e) => setHorasExtras(e.target.value)}
          />

          <input
            type="number"
            className="textbox"
            placeholder="Descuentos"
            value={descuentos}
            onChange={(e) => setDescuentos(e.target.value)}
          />

          <button className="btn btn-primary" onClick={calcularLiquidacionEmpleado}>
            Calcular Liquidación
          </button>
        </div>
      )}

      {/* Resultado de Liquidación */}
      {resultadoEmpleado && puedeVer && (
        <div className="card comprobante">
          <h3>Comprobante de Liquidación</h3>
          <p><strong>Empleado:</strong> {resultadoEmpleado.empleado}</p>
          <p><strong>Sueldo Base:</strong> ${resultadoEmpleado.sueldoBase}</p>
          <p><strong>Horas Extras:</strong> {resultadoEmpleado.horasExtras} (x $5)</p>
          <p><strong>Descuentos:</strong> ${resultadoEmpleado.descuentos}</p>
          <hr />
          <p><strong>Total a Pagar:</strong> ${resultadoEmpleado.total}</p>
        </div>
      )}

      {/* Restricción para empleados */}
      {usuario?.role === "Empleado" && !resultadoEmpleado && (
        <p>Solo puede consultar su propia liquidación.</p>
      )}
    </div>
  );
}
