import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MerchantDashboard from "./pages/merchant/MerchantDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserRole } from "./enums/roles.enum";
import PublicRoute from "./components/PublicRoute";
import UserDashboard from "./pages/UserDashboard";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RegisterMerchant from "./pages/admin/RegisterCompany";
import RegisterDelivery from "./pages/admin/RegisterDelivery";
import DriverDashboard from "./pages/driver/DriverDashboard";
import MyCompany from "./pages/merchant/MyCompany";
import RegisterCompany from "./pages/merchant/MyCompanyCreate";
import ProductList from "./pages/merchant/MyItems";
import CreateProduct from "./pages/merchant/CreateMenuItem";
import MenuDashboard from "./pages/customers/menu-dashboard";
import { CartDrawer } from "./components/CartDrawer";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <CartDrawer/>

      {/* Contenedor principal con padding para que el contenido no pegue al Navbar */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/menu-dashboard" element={<MenuDashboard />} />
          {/* --- RUTAS PÚBLICAS (SÓLO PARA VISITANTES) --- */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* --- RUTAS DE ADMIN --- */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/register-delivery" element={<RegisterDelivery />} />
            <Route path="/admin/register-company" element={<RegisterMerchant />} />
          </Route>

          {/* --- RUTAS DE CLIENTES --- */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.CUSTOMER]} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* <Route path="/orders" element={<Orders />} /> */}
          </Route>

          {/* --- RUTAS DE REPARTIDOR (DRIVER) --- */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.DRIVER]} />}>
            <Route path="/driver/orders" element={<DriverDashboard />} />
          </Route>

          {/* --- RUTAS DE EMPRESAS (MERCHANT) --- */}
          <Route element={<ProtectedRoute allowedRoles={[UserRole.MERCHANT]} />}>
            <Route path="/merchant/store" element={<MerchantDashboard />} />
            <Route path="/my-company" element={<MyCompany />} />
            <Route path='/merchant/products' element={<ProductList />} />
            <Route path="/merchant/register" element={<RegisterCompany />} />
            <Route path="/merchant/products/new" element={<CreateProduct />} />
          </Route>

          {/* --- FALLBACK --- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Aquí se puede agregar un Footer más adelante */}
    </div>
  );
}

export default App;