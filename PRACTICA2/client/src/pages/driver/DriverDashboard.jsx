// src/pages/driver/DriverDashboard.jsx
import { Bike, MapPin } from "lucide-react";

const DriverDashboard = () => (
  <div className="p-6 bg-slate-50 min-h-screen">
    <h1 className="text-2xl font-black flex items-center gap-2">
      <Bike className="text-indigo-600" /> Panel de Repartidor
    </h1>
    <div className="mt-6 grid gap-4">
      <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-indigo-500">
        <p className="font-bold">Pedido #1234</p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin size={14} /> Calle Falsa 123, Zona 10
        </p>
        <button className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm">
          Aceptar Entrega
        </button>
      </div>
    </div>
  </div>
);

export default DriverDashboard;