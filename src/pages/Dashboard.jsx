import React, { useMemo } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/GlobalContext";
import { Bar, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from "chart.js";
import UserInfo from "../components/UserInfo";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Definición centralizada de accesos y configuración de módulos
const ACCESOS_ROLES = {
  Administrador: ["Caja Chica", "Liquidación", "Reportes", "Auditoría"],
  Supervisor: ["Caja Chica", "Liquidación", "Reportes"],
  Contador: ["Liquidación", "Reportes"],
  Empleado: ["Liquidación", "Reportes"],
};

const CONFIG_TARJETAS = [
  {
    titulo: "Caja Chica",
    descripcion: "Registro y control de gastos menores.",
    ruta: "caja-chica", // Sin barra inicial para evitar errores de concatenación
    icono: "💰",
    color: "card-blue",
  },
  {
    titulo: "Liquidación",
    descripcion: "Cálculo automático de sueldos y pagos.",
    ruta: "liquidacion",
    icono: "📊",
    color: "card-green",
  },
  {
    titulo: "Reportes",
    descripcion: "Generación de reportes y analíticas.",
    ruta: "reportes",
    icono: "📑",
    color: "card-orange",
  },
  {
    titulo: "Auditoría",
    descripcion: "Historial de operaciones y trazabilidad.",
    ruta: "auditoria",
    icono: "🔍",
    color: "card-purple",
  },
];

export default function Dashboard() {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!usuario) {
    return (
      <div className="access-denied-container">
        <h2>Acceso denegado</h2>
        <p>Por favor, inicie sesión para continuar.</p>
      </div>
    );
  }

  const mostrarTarjetasPrincipal = location.pathname === "/dashboard" || location.pathname === "/dashboard/";

  // Filtrar tarjetas según el rol del usuario usando useMemo para optimizar rendimiento
  const tarjetasVisibles = useMemo(() => {
    const permitidos = ACCESOS_ROLES[usuario.role] || [];
    return CONFIG_TARJETAS.filter((t) => permitidos.includes(t.titulo));
  }, [usuario.role]);

  const irAModulo = (ruta) => {
    navigate(`/dashboard/${ruta}`);
  };

  // Datos simulados para gráficos
  const dataLiquidacion = {
    labels: ["Juan Pérez", "María López", "Carlos Gómez", "Ana Torres"],
    datasets: [
      {
        label: "Liquidaciones ($)",
        data: [550, 595, 470, 560],
        backgroundColor: ["#004aad", "#ff9800", "#00aaff", "#4caf50"],
      },
    ],
  };

  const dataReportes = {
    labels: ["Aprobados", "Pendientes", "Rechazados"],
    datasets: [
      {
        data: [120, 45, 30],
        backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  };

  return (
    <div className="container dashboard-container">
      <header className="dashboard-header">
        <h2>Bienvenido, {usuario.nombre}</h2>
        <span className={`badge role-${usuario.role?.toLowerCase()}`}>
          Rol: {usuario.role}
        </span>
      </header>

      {mostrarTarjetasPrincipal && (
        <main className="dashboard-content">
          <UserInfo />

          {/* Tarjetas principales de navegación */}
          <section className="dashboard-grid">
            {tarjetasVisibles.map((t) => (
              <div 
                key={t.titulo} 
                className={`card ${t.color} interactive-card`}
                onClick={() => irAModulo(t.ruta)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-icon">{t.icono}</div>
                <h3>{t.titulo}</h3>
                <p>{t.descripcion}</p>
                <button 
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.stopPropagation(); // Evita doble disparo por burbujeo
                    irAModulo(t.ruta);
                  }}
                >
                  Acceder
                </button>
              </div>
            ))}
          </section>

          {/* Sección de Analíticas / Gráficos según el rol */}
          <section className="dashboard-analytics">
            {(usuario.role === "Administrador" || usuario.role === "Supervisor") && (
              <div className="card card-analytics">
                <div className="card-header-flex">
                  <h3>Resumen de Liquidaciones</h3>
                  <span className="card-icon">📊</span>
                </div>
                <div className="chart-container" style={{ position: "relative", height: "250px" }}>
                  <Bar data={dataLiquidacion} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            )}

            {usuario.role === "Contador" && (
              <div className="card card-analytics">
                <div className="card-header-flex">
                  <h3>Estado de Reportes</h3>
                  <span className="card-icon">📑</span>
                </div>
                <div className="chart-container" style={{ position: "relative", height: "250px" }}>
                  <Pie data={dataReportes} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Renderizado de rutas hijas (submódulos) */}
      <Outlet />
    </div>
  );
}