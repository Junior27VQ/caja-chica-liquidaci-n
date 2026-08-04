import React, { useState } from "react";
import "../../styles/ModalGasto.css";

export default function ModalGasto({ onClose, onSave, usuario, gastos }) {
  const categorias = ["Transporte", "Materiales", "Alimentación", "Viáticos"];

  const [nuevoGasto, setNuevoGasto] = useState({
    concepto: "",
    monto: "",
    fecha: "",
    descripcion: "",
    comprobante: null
  });

  const handleChange = (e) => {
    setNuevoGasto({ ...nuevoGasto, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setNuevoGasto({ ...nuevoGasto, comprobante: e.target.files[0] });
  };

  const handleSubmit = () => {
    if (!nuevoGasto.concepto || !nuevoGasto.monto || !nuevoGasto.fecha) {
      alert("Todos los campos obligatorios deben completarse");
      return;
    }
    if (isNaN(nuevoGasto.monto) || Number(nuevoGasto.monto) <= 0) {
      alert("El monto debe ser un número positivo");
      return;
    }

    const nuevo = {
      id: gastos.length + 1,
      concepto: nuevoGasto.concepto,
      monto: Number(nuevoGasto.monto),
      fecha: nuevoGasto.fecha,
      descripcion: nuevoGasto.descripcion,
      estado: "pendiente",
      responsable: usuario?.nombre,
      comprobante: nuevoGasto.comprobante || null
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content small">
        <h3>Registrar nuevo gasto</h3>
        <select
          name="concepto"
          value={nuevoGasto.concepto}
          onChange={handleChange}
        >
          <option value="">Seleccione categoría</option>
          {categorias.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          name="monto"
          placeholder="Monto"
          value={nuevoGasto.monto}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fecha"
          value={nuevoGasto.fecha}
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción (opcional)"
          value={nuevoGasto.descripcion}
          onChange={handleChange}
        />

        <input
          type="file"
          name="comprobante"
          onChange={handleFileChange}
        />

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSubmit}>Guardar</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
