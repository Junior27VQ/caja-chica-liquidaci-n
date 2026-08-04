import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false); // Estado para controlar el menú móvil

  if (!usuario) return null;

  const accesos = {
    Administrador: ["Caja Chica", "Liquidación", "Reportes", "Auditoría"],
    Supervisor: ["Caja Chica", "Liquidación", "Reportes"],
    Contador: ["Liquidación", "Reportes"],
    Empleado: ["Liquidación", "Reportes"],
  };

  const links = [
    { titulo: "Caja Chica", ruta: "/dashboard/caja-chica" },
    { titulo: "Liquidación", ruta: "/dashboard/liquidacion" },
    { titulo: "Reportes", ruta: "/dashboard/reportes" },
    { titulo: "Auditoría", ruta: "/dashboard/auditoria" },
  ];

  const handleLogout = () => {
    setUsuario(null);
    navigate("/");
  };

  // Cierra el menú móvil al hacer clic en una opción
  const cerrarMenuMovil = () => {
    setMenuAbierto(false);
  };

  return (
    <nav className="navbar-modern">
      {/* Logotipo y Título interactivo */}
      <div 
        className="navbar-brand-container" 
        onClick={() => { navigate("/dashboard"); cerrarMenuMovil(); }}
      >
        <div className="company-logo-badge">CC</div>
        <div className="navbar-title-wrapper">
          <h1>Caja Chica & Liquidación</h1>
          <span className="navbar-user-role">Rol: <strong>{usuario.role}</strong></span>
        </div>
      </div>

      {/* Botón de Hamburguesa para Móviles */}
      <button 
        className={`hamburger-btn ${menuAbierto ? "open" : ""}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú de navegación"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Contenedor de Enlaces y Acciones (Se convierte en menú desplegable en móvil) */}
      <div className={`navbar-collapse-container ${menuAbierto ? "active" : ""}`}>
        <ul className="navbar-links-list">
          {links
            .filter((l) => accesos[usuario.role]?.includes(l.titulo))
            .map((l, i) => (
              <li key={i}>
                <NavLink 
                  to={l.ruta} 
                  className={({ isActive }) => `nav-item-link ${isActive ? "active" : ""}`}
                  onClick={cerrarMenuMovil}
                >
                  {l.titulo}
                </NavLink>
              </li>
            ))}
        </ul>

        <div className="navbar-actions-container">
          <button className="btn-logout-interactive" onClick={() => { setShowModal(true); cerrarMenuMovil(); }}>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="logout-overlay">
          <div className="logout-card animate-scale">
            <h3>¿Desea cerrar sesión?</h3>
            <p>Usuario actual: <strong>{usuario?.nombre}</strong></p>
            <div className="logout-actions">
              <button className="btn btn-primary" onClick={handleLogout}>
                Sí, cerrar sesión
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}