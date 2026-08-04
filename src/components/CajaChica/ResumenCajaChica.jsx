import React, { useState} from "react";
import "../../styles/ResumenCajaChica.css";

export default function ResumenCajaChica({
  fondoInicial,
  setFondoInicial,
  totalPendiente,
  totalAprobado,
  totalRechazado,
  totalGastos,
  saldoDisponible,
  usuario,
  historialFondo,
  setHistorialFondo
}) {
  const puedeEditarFondo = usuario?.role === "Administrador";
  const [valorTemporal, setValorTemporal] = useState(fondoInicial);

  const guardarFondo = () => {
    setFondoInicial(valorTemporal);
    setHistorialFondo([
      ...historialFondo,
      {
        fecha: new Date().toLocaleString(),
        usuario: usuario?.nombre || "Sistema",
        valor: valorTemporal
      }
    ]);
  };

  return (
    <div className="resumen-caja">
      <h3>Resumen de Caja Chica</h3>
      <p>
        Fondo inicial: ${fondoInicial}
        {puedeEditarFondo && (
            <>
          <input
            type="number"
            value={valorTemporal}
            onChange={(e) => setValorTemporal(Number(e.target.value))}
            className="input-fondo"
          />
          <button className="btn btn-primary" onClick={guardarFondo}>
              Guardar
            </button>
            </>
        )}
      </p>
      <p className="pendiente">Pendiente: ${totalPendiente}</p>
      <p className="aprobado">Aprobado: ${totalAprobado}</p>
      <p className="rechazado">Rechazado: ${totalRechazado}</p>
      <p><strong>Total Gastos:</strong> ${totalGastos}</p>
      <p><strong>Saldo disponible:</strong> ${saldoDisponible}</p>
    </div>
  );
}
