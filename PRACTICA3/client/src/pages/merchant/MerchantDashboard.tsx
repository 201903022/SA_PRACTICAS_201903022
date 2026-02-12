import React from 'react';
import { Store, PackagePlus, ClipboardList, TrendingUp, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const MerchantDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-orange-50/30">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-[#FFFBF7] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Seccción */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <span className="text-orange-600 font-black text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
              Panel de Control
            </span>
            <h1 className="text-4xl font-black flex items-center gap-3 text-slate-900 mt-3 italic tracking-tighter">
              <Store className="text-orange-600" size={36} /> 
              {user?.name || 'Mi Comercio'}
            </h1>
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-orange-600 transition-colors shadow-sm">
            <Settings size={24} />
          </button>
        </header>

        {/* Grid de Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          <div className="bg-orange-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-orange-200 flex justify-between items-center relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-5xl font-black mb-1">12</p>
              <p className="text-sm font-bold opacity-90 uppercase tracking-wider">Pedidos para hoy</p>
            </div>
            <ClipboardList size={48} className="opacity-20 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-5xl font-black text-slate-900 mb-1">$450</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ventas del día</p>
            </div>
            <div className="p-4 bg-green-50 rounded-3xl text-green-600">
              <TrendingUp size={32} />
            </div>
          </div>

          {/* Botón de Acción Principal */}
          <button className="bg-white p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-center items-center gap-3 border-4 border-dashed border-orange-100 hover:border-orange-600 hover:bg-orange-50 transition-all group group">
            <div className="p-4 bg-orange-100 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <PackagePlus size={32} />
            </div>
            <span className="font-black text-orange-900 uppercase text-sm tracking-widest">Añadir Producto</span>
          </button>

        </div>

        {/* Sección de Pedidos Pendientes (Placeholder) */}
        <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 italic">Últimos Pedidos</h2>
            <button className="text-orange-600 font-bold text-sm">Ver historial completo</button>
          </div>
          
          <div className="text-center py-20 border-2 border-dashed border-slate-50 rounded-[2rem]">
            <p className="text-slate-400 font-medium italic">No hay pedidos pendientes en este momento.</p>
          </div>
        </section>
        
      </div>
    </div>
  );
};

export default MerchantDashboard;