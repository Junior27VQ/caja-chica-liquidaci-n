// src/components/CajaChica/ModalGasto.jsx
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
    setNuevoGasto({ ...nuevoGasto, comprobante: e.target.files[0] ? e.target.files[0].name : null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nuevoGasto.concepto || !nuevoGasto.monto || !nuevoGasto.fecha) {
      alert("Todos los campos obligatorios deben completarse");
      return;
    }
    if (isNaN(nuevoGasto.monto) || Number(nuevoGasto.monto) <= 0) {
      alert("El monto debe ser un número positivo");
      return;
    }

    const nuevo = {
      id: gastos && gastos.length > 0 ? Math.max(...gastos.map(g => g.id)) + 1 : 1,
      concepto: nuevoGasto.concepto,
      monto: Number(nuevoGasto.monto),
      fecha: nuevoGasto.fecha,
      descripcion: nuevoGasto.descripcion,
      estado: "Pendiente", // Estandarizado con mayúscula inicial
      responsable: usuario?.nombre || "Sistema",
      comprobante: nuevoGasto.comprobante || null
    };

    onSave(nuevo);
    onClose();
  };

  return (
    <div className="expense-modal-overlay" onClick={onClose}>
      <div className="card shadow-lg border-0 expense-modal-container animate-scale" onClick={(e) => e.stopPropagation()}>
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3 px-4">
          <h3 className="card-title fs-5 m-0"><i className="fas fa-wallet me-2"></i> Registrar Nuevo Gasto</h3>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="card-body p-4">
            
            {/* Categoría / Concepto */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Categoría / Concepto:*</label>
              <select
                name="concepto"
                className="form-select"
                value={nuevoGasto.concepto}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione categoría</option>
                {categorias.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Monto */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Monto ($):*</label>
              <input
                type="number"
                step="0.01"
                name="monto"
                className="form-control"
                placeholder="0.00"
                value={nuevoGasto.monto}
                onChange={handleChange}
                required
              />
            </div>

            {/* Fecha */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Fecha del Gasto:*</label>
              <input
                type="date"
                name="fecha"
                className="form-control"
                value={nuevoGasto.fecha}
                onChange={handleChange}
                required
              />
            </div>

            {/* Descripción */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Descripción (Opcional):</label>
              <textarea
                name="descripcion"
                className="form-control"
                rows="2"
                placeholder="Detalles adicionales del gasto menor..."
                value={nuevoGasto.descripcion}
                onChange={handleChange}
              />
            </div>

            {/* Archivo / Comprobante */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Comprobante (Opcional):</label>
              <input
                type="file"
                name="comprobante"
                className="form-control form-control-sm"
                onChange={handleFileChange}
              />
            </div>

          </div>

          <div className="card-footer bg-light px-4 py-3 d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-secondary btn-sm px-3" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary btn-sm px-4">Guardar Gasto</button>
          </div>
        </form>
      </div>
    </div>
  );
}