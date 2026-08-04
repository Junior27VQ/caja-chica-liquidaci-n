import React from "react";
import { useAuth } from "../context/GlobalContext";
import "../styles/UserInfo.css";
import { perfilUsuario } from "../data/mockData";

export default function UserInfo() {
  const { usuario } = useAuth();

  // Buscar el perfil que coincida con el usuario logueado
  const perfil = perfilUsuario.find((p) => p.nombre === usuario?.nombre);

  if (!perfil) {
    return (
      <div className="user-profile-card">
        <div className="user-card-header">
          <h3>Información del Usuario</h3>
        </div>
        <p className="user-empty-text">No hay información disponible para este usuario.</p>
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

  // Campos detallados estructurados
  const camposDetalle = [
    { label: "Departamento", value: perfil.departamento, icono: "🏢" },
    { label: "Correo electrónico", value: perfil.correo, icono: "✉️" },
    { label: "Teléfono", value: perfil.telefono, icono: "📞" },
    { label: "Fecha de ingreso", value: perfil.fechaIngreso, icono: "📅" },
    { label: "Último acceso", value: perfil.ultimoAcceso, icono: "🕒" },
  ];

  return (
    <div className="user-profile-card">
      {/* Cabecera del Perfil con Avatar y Rol */}
      <div className="user-profile-header">
        <div className="user-avatar">
          {perfil.avatar ? (
            <img src={perfil.avatar} alt={perfil.nombre} />
          ) : (
            <span>{obtenerIniciales(perfil.nombre)}</span>
          )}
        </div>
        <div className="user-main-info">
          <h3>{perfil.nombre}</h3>
          <span className={`user-role-badge role-${perfil.role?.toLowerCase()}`}>
            {perfil.role || usuario?.role}
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