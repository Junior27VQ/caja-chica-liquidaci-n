// src/components/Navbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import UserInfo from "./UserInfo"; // <--- Importa tu componente UserInfo (ajusta la ruta si es necesario)
import "../styles/Navbar.css";

export default function Navbar() {
  const { usuario, logout, notificaciones, eliminarNotificacion } = useAuth(); 
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false); 

  const {role} = usuario;
  const admin = role === "Administrador";

  if (!usuario) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenNotificationDetail = (notif) => {
    setSelectedNotification(notif);
    setShowNotificationsMenu(false); 
    eliminarNotificacion(notif.id);
  };

  const unreadCount = (notificaciones || []).filter(n => !n.leida).length;

  return (
    <header className="app-navbar">
      
      {/* Logotipo y Título interactivo */}
      <div 
        className="navbar-brand-container" 
        onClick={() => navigate("/dashboard")}
      >
        <div className="company-logo-badge">CC</div>
        <div className="navbar-title-wrapper">
          <h1>Caja Chica & Liquidación</h1>
          <span className="navbar-user-role">Panel de Control</span>
        </div>
      </div>

      {/* Controles de la derecha (Notificaciones, Avatar y Cerrar Sesión) */}
      <div className="navbar-right-section">
        
        {/* Centro de Notificaciones */}
        
        <div className="notification-dropdown-wrapper">
          {admin && (
          <button 
            className="btn-notification-icon"
            onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
            aria-label="Notificaciones"
          >
            <i className="fas fa-bell"></i>
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          )}

          {/* Menú Desplegable de Notificaciones */}
          {showNotificationsMenu && (
            <div className="notification-menu animate-fade">
              <div className="notification-header">
                <span>Notificaciones del Sistema</span>
                <span className="notification-count-tag">{unreadCount} nuevas</span>
              </div>
              <div className="notification-list">
                {!notificaciones || notificaciones.length === 0 ? (
                  <p className="no-notifications">No hay notificaciones</p>
                ) : (
                  notificaciones.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${!notif.leida ? "unread" : ""}`}
                      onClick={() => handleOpenNotificationDetail(notif)}
                    >
                      <div className="notif-icon-container">
                        <i className={`fas ${notif.tipo === 'gasto' ? 'fa-wallet text-primary' : notif.tipo === 'liquidacion' ? 'fa-file-invoice-dollar text-success' : 'fa-shield-alt text-info'}`}></i>
                      </div>
                      <div className="notif-content">
                        <p className="notif-title">{notif.titulo}</p>
                        <span className="notif-time">{notif.hora}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Información del Usuario y Avatar (Interactivo para abrir UserInfo) */}
        <div 
          className="navbar-user-profile" 
          onClick={() => setShowUserInfoModal(true)} 
          style={{ cursor: "pointer" }}
          title="Ver información de perfil"
        >
          <div className="user-avatar-circle">
            {usuario.nombre ? usuario.nombre.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="user-meta">
            <span className="user-name">{usuario.nombre || "Usuario"}</span>
            <span className="user-role-badge">{usuario.role}</span>
          </div>
        </div>

        {/* Botón Cerrar Sesión */}
        <button 
          className="btn-logout-interactive" 
          onClick={() => setShowLogoutModal(true)}
          title="Cerrar Sesión"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Salir</span>
        </button>
      </div>

      {/* Modal / Overlay para mostrar el componente UserInfo */}
      {showUserInfoModal && (
        <div className="logout-overlay" onClick={() => setShowUserInfoModal(false)}>
          <div className="logout-card animate-scale p-4" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "450px", width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="m-0 text-dark fs-5">Perfil de Usuario</h3>
              <button 
                className="btn-close" 
                onClick={() => setShowUserInfoModal(false)}
                aria-label="Cerrar"
              ></button>
            </div>
            
            {/* Componente UserInfo integrado */}
            <UserInfo />
            
            <div className="mt-4 text-end">
              <button className="btn btn-secondary btn-sm px-4" onClick={() => setShowUserInfoModal(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalle de Notificación */}
      {selectedNotification && (
        <div className="logout-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="logout-card animate-scale" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-icon text-primary mb-2">
              <i className="fas fa-info-circle fa-2x"></i>
            </div>
            <h3 className="text-dark">{selectedNotification.titulo}</h3>
            <p className="text-muted text-start bg-light p-3 rounded mt-2">
              {selectedNotification.descripcion}
            </p>
            <div className="text-end text-muted small mb-3">
              <i className="far fa-clock"></i> {selectedNotification.hora}
            </div>
            <div className="logout-actions">
              <button className="btn btn-primary w-100" onClick={() => setSelectedNotification(null)}>
                Entendido (Eliminar)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de Cierre de Sesión */}
      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-card animate-scale">
            <h3>¿Desea cerrar sesión?</h3>
            <p>Usuario actual: <strong>{usuario?.nombre}</strong></p>
            <div className="logout-actions">
              <button className="btn btn-primary" onClick={handleLogout}>
                Sí, cerrar sesión
              </button>
              <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}