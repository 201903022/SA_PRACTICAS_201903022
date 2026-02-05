// src/pages/merchant/MerchantDashboard.jsx
import { Store, PackagePlus } from "lucide-react";

const MerchantDashboard = () => (
  <div className="p-6 bg-orange-50 min-h-screen">
    <h1 className="text-2xl font-black flex items-center gap-2 text-orange-900">
      <Store className="text-orange-600" /> Mi Comercio
    </h1>
    <div className="mt-6 grid grid-cols-2 gap-4">
      <button className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center gap-2 border-2 border-dashed border-orange-200 hover:bg-orange-100 transition-colors">
        <PackagePlus className="text-orange-600" size={32} />
        <span className="font-bold text-orange-900">Añadir Producto</span>
      </button>
      <div className="bg-orange-600 p-6 rounded-[2rem] text-white">
        <p className="text-3xl font-black">12</p>
        <p className="text-sm opacity-80">Pedidos hoy</p>
      </div>
    </div>
  </div>
);

export default MerchantDashboard;