import React from "react";
import "../../styles/ListaGastos.css";

export default function ListaGastos({ gastos, cambiarEstado, usuario }) {
  const puedeAprobar = usuario?.role === "Administrador" || usuario?.role === "Contador";

  return (
    <div className="lista-gastos">
      <h3>Listado de Gastos</h3>
      <ul>
        {gastos && gastos.length > 0 ? (
          gastos.map((g) => (
            <li key={g.id} className={`gasto-item ${g.estado}`}>
              <div className="gasto-info">
                <strong>{g.concepto}</strong> – ${g.monto} ({g.fecha})
                {g.descripcion && <p className="descripcion">{g.descripcion}</p>}
                <p className={`estado ${g.estado}`}>Estado: {g.estado}</p>
                <p><em>Responsable:</em> {g.responsable || "Sin responsable"}</p>
                {g.comprobante ? <p>📎 Comprobante adjunto</p> : <p>Sin comprobante</p>}
              </div>

              {puedeAprobar && g.estado === "pendiente" && (
                <div className="acciones">
                  <button
                    className="btn btn-primary"
                    onClick={() => cambiarEstado(g.id, "aprobado")}
                  >
                    Aprobar
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => cambiarEstado(g.id, "rechazado")}
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <p>No hay gastos registrados.</p>
        )}
      </ul>
    </div>
  );
}
