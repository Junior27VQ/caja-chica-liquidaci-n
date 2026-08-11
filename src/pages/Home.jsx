// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";

export default function Home() {
  const { enviarMensajeSoporte } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [nombreReporte, setNombreReporte] = useState("");
  const [mensajeReporte, setMensajeReporte] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmitSoporte = (e) => {
    e.preventDefault();
    if (!mensajeReporte.trim()) return;
    
    enviarMensajeSoporte(nombreReporte || "Visitante Externo", "Invitado", mensajeReporte);
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      setShowModal(false);
      setMensajeReporte("");
      setNombreReporte("");
    }, 2000);
  };

  return (
    <div className="home-container">
      {/* Sección Hero / Presentación Principal */}
      <div className="home-hero">
        <div className="home-content animate-fade">
          <div className="brand-badge">Sistema Empresarial v4.0</div>
          <h1>Caja Chica & Liquidación</h1>
          <p className="hero-description">
            Plataforma centralizada para la automatización de liquidaciones de 
            trabajadores y el control inteligente de gastos menores de la empresa.
          </p>

          <div className="home-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">
              <span>Iniciar Sesión</span>
              <span className="btn-icon">→</span>
            </Link>
            
            <Link to="/login" className="btn btn-secondary btn-lg">
              <span>Panel de Acceso</span>
            </Link>
          </div>

          <div className="home-footer-help">
            <p>¿Problemas para acceder?{" "} 
              <span className="help-link"
                onClick={() => setShowModal(true)}>
                  Contacta al administrador del sistema
              </span>
            </p>
          </div>
        </div>
        {/* Modal Estilo AdminLTE para Soporte */}
        {showModal && (
          <div className="logout-overlay" onClick={() => setShowModal(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
            <div className="card shadow-lg border-0 animate-scale" style={{ width: '100%', maxWidth: '450px', background: '#fff', borderRadius: '8px', overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3 px-4">
                <h3 className="card-title fs-5 m-0"><i className="fas fa-headset me-2"></i> Reportar Fallo al Administrador</h3>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="card-body p-4">
                {enviado ? (
                  <div className="alert alert-success text-center py-4">
                    <i className="fas fa-check-circle fa-2x mb-2"></i>
                    <h5>¡Mensaje enviado con éxito!</h5>
                    <p className="small mb-0 text-muted">El administrador ha recibido tu notificación de error.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSoporte}>
                    <div className="mb-3 text-start">
                      <label className="form-label small fw-bold text-dark">Su Nombre o Usuario:</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Ej. Juan Pérez o Externo" 
                        value={nombreReporte}
                        onChange={(e) => setNombreReporte(e.target.value)}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label className="form-label small fw-bold text-dark">Descripción del Problema / Fallo:*</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        placeholder="Ej. No puedo iniciar sesión con mis credenciales..."
                        value={mensajeReporte}
                        onChange={(e) => setMensajeReporte(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowModal(false)}>Cancelar</button>
                      <button type="submit" className="btn btn-primary btn-sm px-4">Enviar Reporte</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secciones Informativas / Características del Sistema */}
      <div className="home-features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon bg-primary-soft">
              <i className="fas fa-wallet"></i>
            </div>
            <h3>Control de Caja Chica</h3>
            <p>Registro rápido, validación de comprobantes y control de gastos menores en tiempo real para cada departamento.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-success-soft">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <h3>Liquidaciones Automatizadas</h3>
            <p>Cálculo transparente de viáticos, sueldos y liquidaciones de empleados con reportes listos para auditoría.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon bg-warning-soft">
              <i className="fas fa-chart-pie"></i>
            </div>
            <h3>Informes y Trazabilidad</h3>
            <p>Generación de gráficos estadísticos y analítica avanzada para la toma de decisiones gerenciales eficientes.</p>
          </div>
        </div>
      </div>

      {/* Pie de página institucional */}
      <footer className="home-footer-brand">
        <p>&copy; 2026 Sistema de Caja Chica & Liquidación. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}