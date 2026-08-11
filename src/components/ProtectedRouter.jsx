// src/components/ProtectedRouter.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";

export default function ProtectedRouter({ rolesPermitidos, children }) {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/" replace />;
  }

  if (!rolesPermitidos.includes(usuario.role)) {
    return <h2 className="text-center text-danger mt-5">Acceso denegado. No tiene permisos suficientes.</h2>;
  }

  // Si pasa las validaciones, renderiza los hijos (el Layout y la vista correspondiente)
  return children ? children : <Outlet />;
}