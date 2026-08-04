import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import GlobalProvider, { useAuth } from './context/GlobalContext';
import CajaChica from "./components/CajaChica/CajaChica";
import Liquidacion from "./components/Liquidacion";
import Reportes from "./components/Reportes";
import Auditoria from "./components/Auditoria";

// Componente de Orden Superior (HOC) o Wrapper para proteger rutas por Autenticación y Roles
function ProtectedRoute({ children, allowedRoles }) {
  const { usuario } = useAuth();

  // 1. Si no hay sesión, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se exigen roles específicos y el usuario no los tiene, redirigir al dashboard general o vista de no autorizado
  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function AppContent() {
  const { usuario } = useAuth();

  return (
    <Router>
      {/* El Navbar solo aparece si hay sesión activa */}
      {usuario && <Navbar />}
      
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas Protegidas del Dashboard */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Submódulos protegidos individualmente por rol según tu matriz de accesos */}
          <Route 
            path="caja-chica" 
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Supervisor"]}>
                <CajaChica />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="liquidacion" 
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Supervisor", "Contador", "Empleado"]}>
                <Liquidacion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="reportes" 
            element={
              <ProtectedRoute allowedRoles={["Administrador", "Supervisor", "Contador", "Empleado"]}>
                <Reportes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="auditoria" 
            element={
              <ProtectedRoute allowedRoles={["Administrador"]}>
                <Auditoria />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Ruta comodín para redireccionar URLs inválidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}