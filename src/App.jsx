// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import GlobalProvider from './context/GlobalContext';
import Layout from './components/Layout';
import CajaChica from "./components/CajaChica/CajaChica";
import Liquidacion from "./components/Liquidacion";
import Reportes from "./components/Reportes";
import Auditoria from "./components/Auditoria";
import ProtectedRouter from "./components/ProtectedRouter";

export default function App() {
  return (
    <GlobalProvider>
      <Router>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Ruta principal del Dashboard con Layout y protección por roles */}
          <Route path="/dashboard" element={
            <ProtectedRouter rolesPermitidos={["Administrador", "Supervisor", "Contador", "Empleado"]}>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRouter>
          } />

          {/* Sub-rutas protegidas que también usan el Layout global */}
          <Route path="/dashboard/caja-chica" element={
            <ProtectedRouter rolesPermitidos={["Administrador", "Supervisor", "Empleado"]}>
              <Layout>
                <CajaChica />
              </Layout>
            </ProtectedRouter>
          } />

          <Route path="/dashboard/liquidacion" element={
            <ProtectedRouter rolesPermitidos={["Administrador", "Supervisor", "Contador"]}>
              <Layout>
                <Liquidacion />
              </Layout>
            </ProtectedRouter>
          } />

          <Route path="/dashboard/reportes" element={
            <ProtectedRouter rolesPermitidos={["Administrador", "Supervisor", "Contador", "Empleado"]}>
              <Layout>
                <Reportes />
              </Layout>
            </ProtectedRouter>
          } />

          <Route path="/dashboard/auditoria" element={
            <ProtectedRouter rolesPermitidos={["Administrador"]}>
              <Layout>
                <Auditoria />
              </Layout>
            </ProtectedRouter>
          } />
        </Routes>
      </Router>
    </GlobalProvider>
  );
}