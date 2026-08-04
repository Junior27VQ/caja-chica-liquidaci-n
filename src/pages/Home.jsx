import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-content">
        {/* Identidad visual y subtítulo más claro */}
        <div className="brand-badge">Sistema Empresarial</div>
        <h1>Caja Chica & Liquidación</h1>
        <p>
          Plataforma centralizada para la automatización de liquidaciones de 
          trabajadores y el control inteligente de gastos menores de la empresa.
        </p>

        {/* Acciones principales claras y jerarquizadas */}
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary btn-lg">
            <span>Iniciar Sesión</span>
            <span className="btn-icon">→</span>
          </Link>
          
          <Link to="/registro" className="btn btn-secondary btn-lg">
            Solicitar Registro
          </Link>
        </div>

        {/* Elemento de confianza o soporte inferior */}
        <div className="home-footer-help">
          <p>¿Problemas para acceder? <span className="help-link">Contacta al administrador</span></p>
        </div>
      </div>
    </div>
  );
}