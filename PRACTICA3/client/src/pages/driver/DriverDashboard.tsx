import React, { useState } from 'react';
import { Bike, MapPin, Package, Navigation, CheckCircle, Power } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// 1. Interfaz para los pedidos (Mock por ahora)
interface OrderRequest {
  id: string;
  restaurant: string;
  address: string;
  distance: string;
  earnings: string;
}

const DriverDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [isOnline, setIsOnline] = useState(false);

  // Datos de prueba para pedidos entrantes
  const pendingOrders: OrderRequest[] = [
    { 
      id: "ORD-772", 
      restaurant: "Pizzería La Estación", 
      address: "Calle Falsa 123, Zona 10", 
      distance: "2.4 km",
      earnings: "Q 15.00"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-md mx-auto">
        
        {/* Header con Toggle de Disponibilidad */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-2">
              <Bike className="text-indigo-600" size={32} /> 
              HOLA, {user?.name?.split(' ')[0].toUpperCase() || 'DRIVER'}
            </h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
              {isOnline ? '🟢 Estás en línea' : '🔴 Estás desconectado'}
            </p>
          </div>
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`p-4 rounded-2xl transition-all shadow-lg ${
              isOnline 
                ? 'bg-red-50 text-red-600 shadow-red-100' 
                : 'bg-green-50 text-green-600 shadow-green-100'
            }`}
          >
            <Power size={24} />
          </button>
        </header>

        {/* Resumen de Ganancias Hoy */}
        <section className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-black opacity-80 uppercase tracking-widest">Ganancias hoy</p>
            <h2 className="text-4xl font-black italic tracking-tighter mt-1">Q 185.50</h2>
          </div>
          <Package className="absolute right-[-10px] bottom-[-10px] w-32 h-32 opacity-10 rotate-12" />
        </section>

        {/* Lista de Pedidos Disponibles */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-2">
            Pedidos Disponibles ({isOnline ? pendingOrders.length : 0})
          </h3>
          
          {!isOnline ? (
            <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
              <p className="text-slate-400 font-bold italic italic">Conéctate para empezar a recibir pedidos</p>
            </div>
          ) : (
            pendingOrders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 animate-in slide-in-from-bottom-4"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg uppercase">
                      {order.id}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-1">{order.restaurant}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-indigo-600 font-black italic">{order.earnings}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{order.distance}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <MapPin size={16} className="text-indigo-400" />
                    <span className="truncate">{order.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                    Ver Mapa
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                    <CheckCircle size={16} /> Aceptar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer de Navegación Rápida (Estilo App) */}
        <nav className="fixed bottom-6 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-[2rem] flex justify-around items-center border border-white/10 shadow-2xl">
          <button className="text-indigo-400"><Bike size={24} /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><Navigation size={24} /></button>
          <button className="text-slate-500 hover:text-white transition-colors"><CheckCircle size={24} /></button>
        </nav>
      </div>
    </div>
  );
};

export default DriverDashboard;