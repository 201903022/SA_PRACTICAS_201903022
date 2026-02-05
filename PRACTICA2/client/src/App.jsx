import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import RegisterCompany from "./pages/admin/RegisterCompany";
import RegisterDelivery from "./pages/admin/RegisterDelivery";
import DriverDashboard from "./pages/driver/DriverDashboard";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* Rutas de Cliente */}
        <Route
          path="/home"
          element={
            <ProtectedRoute roleRequired="CUSTOMER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas de Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/register-delivery"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RegisterDelivery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/register-company"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <RegisterCompany />
            </ProtectedRoute>
          }
        />
        {/* Rutas de Repartidor (Driver) */}
          <Route path="/driver/orders" element={<DriverDashboard />} />

          {/* Rutas de Empresas (Merchant) */}
          <Route path="/merchant/store" element={<MerchantDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
