import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { usuarios } from "../data/mockData";

export default function Login() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const [formData, setFormData] = useState({ nombre: "", password: "" });
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Limpiar error al volver a escribir
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setCargando(true);

    // Simulamos un breve retraso para dar sensación de procesamiento real
    setTimeout(() => {
      const user = usuarios.find(
        (u) => u.nombre.trim().toLowerCase() === formData.nombre.trim().toLowerCase() && 
               u.password === formData.password
      );

      if (user) {
        setUsuario(user);
        navigate("/dashboard");
      } else {
        setError("Usuario o contraseña incorrectos. Por favor, verifique sus datos.");
        setCargando(false);
      }
    }, 400);
  };

  // Función auxiliar opcional para autocompletar en desarrollo (Testing UX)
  const seleccionarUsuarioPrueba = (userMock) => {
    setFormData({ nombre: userMock.nombre, password: userMock.password });
    setError("");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar Sesión</h2>
          <p>Ingrese sus credenciales para acceder al sistema</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Campo Usuario con Label Accesible */}
          <div className="form-group">
            <label htmlFor="nombre">Usuario</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Ej. Admin, Juan..."
              value={formData.nombre}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          {/* Campo Contraseña con Label Accesible */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Notificación de Error */}
          {error && <div className="notification error" role="alert">{error}</div>}

          {/* Botón de Envío con Estado de Carga */}
          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={cargando}
          >
            {cargando ? "Verificando..." : "Ingresar"}
          </button>
        </form>

        {/* Enlace para volver al Inicio */}
        <div className="login-footer">
          <Link to="/" className="back-home-link">← Volver al inicio</Link>
        </div>

        {/* Sección de Ayuda para Pruebas Locales (Mock Data Helper) */}
        <div className="mock-helper-box" style={{ marginTop: "20px", fontSize: "0.85rem", background: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
          <p style={{ margin: "0 0 6px 0", fontWeight: "bold", color: "#555" }}>Accesos rápidos de prueba:</p>
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {usuarios.map((u, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => seleccionarUsuarioPrueba(u)}
                style={{ fontSize: "0.75rem", padding: "4px 8px", cursor: "pointer", background: "#e2e8f0", border: "none", borderRadius: "4px" }}
                title={`Rol: ${u.role}`}
              >
                {u.nombre} ({u.role})
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}