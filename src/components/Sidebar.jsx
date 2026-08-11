// src/components/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import "../styles/Sidebar.css";

export default function Sidebar({ sidebarExpandido, onToggle }) {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  if (!usuario) return null;

  // Definimos la configuración de navegación y sus permisos
  const menuItems = [
    { path: "/dashboard", icon: "fa-tachograph-digital", label: "Dashboard", roles: ["Administrador", "Supervisor", "Empleado"] },
    { path: "/dashboard/caja-chica", icon: "fa-wallet", label: "Caja Chica", roles: ["Administrador", "Supervisor", "Empleado"] },
    { path: "/dashboard/liquidacion", icon: "fa-file-invoice-dollar", label: "Liquidación", roles: ["Administrador", "Supervisor", "Contador"] },
    { path: "/dashboard/reportes", icon: "fa-chart-pie", label: "Informes", roles: ["Administrador", "Supervisor", "Contador", "Empleado"] },
    { path: "/dashboard/auditoria", icon: "fa-shield-alt", label: "Auditoría", roles: ["Administrador"] },
  ];

  return (
    <aside className={`app-sidebar ${sidebarExpandido ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        {sidebarExpandido && <span className="brand-text">Caja Chica</span>}
        <button className="sidebar-btn-toggle" onClick={onToggle} aria-label="Toggle sidebar">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <nav className="sidebar-nav-container">
        <ul className="sidebar-nav flex-column">
          {menuItems.map((item) => {
            // Validar si el usuario tiene permiso para ver este item
            if (!item.roles.includes(usuario.role)) return null;

            return (
              <li className="sidebar-nav-item" key={item.path}>
                <button 
                  className="sidebar-btn-link" 
                  onClick={() => navigate(item.path)} 
                  title={item.label}
                >
                  <i className={`fas ${item.icon} sidebar-icon`}></i>
                  <span className={`sidebar-text ${!sidebarExpandido ? "d-none" : ""}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}