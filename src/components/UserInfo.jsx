// src/components/UserInfo.jsx
import React from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/UserInfo.css";

export default function UserInfo() {
  const { usuario } = useAuth();

  if (!usuario) {
    return (
      <div className="user-profile-card">
        <div className="user-card-header">
          <h3>Información del Usuario</h3>
        </div>
        <p className="user-empty-text">No hay información disponible. Inicie sesión.</p>
      </div>
    );
  }

  // Obtener iniciales para el avatar en caso de que no haya imagen
  const obtenerIniciales = (nombre) => {
    if (!nombre) return "U";
    const partes = nombre.trim().split(" ");
    if (partes.length >= 2) {
      return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
    }
    return nombre.substring(0, 2).toUpperCase();
  };

  // Campos detallados estructurados directamente del usuario logueado
  const camposDetalle = [
    { label: "Departamento", value: usuario.departamento, icono: "🏢" },
    { label: "Correo electrónico", value: usuario.correo, icono: "✉️" },
    { label: "Teléfono", value: usuario.telefono, icono: "📞" },
    { label: "Fecha de ingreso", value: usuario.fechaIngreso, icono: "📅" },
    { label: "Último acceso", value: usuario.ultimoAcceso, icono: "🕒" },
  ];

  return (
    <div className="user-profile-card">
      {/* Cabecera del Perfil con Avatar y Rol */}
      <div className="user-profile-header">
        <div className="user-avatar">
          {usuario.avatar ? (
            <img src={usuario.avatar} alt={usuario.nombre} />
          ) : (
            <span>{obtenerIniciales(usuario.nombre)}</span>
          )}
        </div>
        <div className="user-main-info">
          <h3>{usuario.nombre}</h3>
          <span className={`user-role-badge role-${usuario.role?.toLowerCase()}`}>
            {usuario.role}
          </span>
        </div>
      </div>

      <hr className="user-divider" />

      {/* Cuadrícula o lista limpia de detalles */}
      <div className="user-details-grid">
        {camposDetalle
          .filter((c) => c.value) // Solo mostrar si tiene valor
          .map((c, i) => (
            <div key={i} className="user-detail-item">
              <span className="detail-icon" aria-hidden="true">{c.icono}</span>
              <div className="detail-content">
                <span className="detail-label">{c.label}</span>
                <span className="detail-value">{c.value}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}