import React from 'react';
import { Package, MapPin, Star, ChevronRight, Clock, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// 1. Interfaz para el tipado de órdenes
interface Order {
  id: string;
  restaurant: string;
  status: 'En camino' | 'Entregado' | 'Cancelado';
  total: string;
  date: string;
}

const UserDashboard: React.FC = () => {
  // Extraemos user y loading del contexto (esto soluciona el error previo)
  const { user, loading } = useAuth();

  // 2. Estado de carga: Mientras se valida el token o se recupera de las cookies
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-[#5842F4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-slate-500 font-bold animate-pulse">Preparando tu cocina...</p>
        </div>
      </div>
    );
  }

  // Datos Mock tipados
  const recentOrders: Order[] = [
    { id: '#1234', restaurant: 'Pizza Palace', status: 'En camino', total: '$25.50', date: 'Hoy' },
    { id: '#1233', restaurant: 'Sushi Roll', status: 'Entregado', total: '$42.00', date: 'Ayer' },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header con saludo seguro y split corregido */}
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">
            ¡Hola, <span className="text-[#5842F4]">
                {/* El uso de ?. previene el error 'properties of undefined' */}
                {user?.name?.split(' ')[0] || 'Chef'}
            </span>! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">¿Qué vamos a pedir para hoy?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna Principal: Órdenes y Actividad */}
          <div className="lg:col-span-2 space-y-8">

            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <Package className="text-[#5842F4]" size={24} />
                  </div>
                  Órdenes Recientes
                </h2>
                <button className="text-[#5842F4] font-bold text-sm hover:underline">Ver todas</button>
              </div>

              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-5 bg-slate-50 hover:bg-white hover:shadow-md hover:shadow-indigo-100/50 transition-all rounded-3xl border border-transparent hover:border-indigo-100 group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#5842F4] transition-colors">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-lg">{order.restaurant}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                            <span>{order.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {order.date}</span>
                            <span>•</span>
                            <span className="text-slate-900 font-bold">{order.total}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                            order.status === 'En camino'
                            ? 'bg-amber-100 text-amber-600'
                            : 'bg-green-100 text-green-600'
                          }`}>
                          {order.status}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-[#5842F4] transition-colors" size={20} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-slate-400 font-medium italic">Aún no has realizado pedidos.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Columna Lateral: Stats y Tarjetas */}
          <div className="space-y-8">

            {/* Banner Premium Fast Pass */}
            <section className="bg-[#5842F4] p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
              <div className="relative z-10">
                <Star className="mb-4 text-amber-300 fill-amber-300 animate-pulse" size={28} />
                <h3 className="text-2xl font-black mb-2 italic">Fast Pass Pro</h3>
                <p className="text-indigo-100 text-sm mb-6 leading-relaxed font-medium">
                  ¡Tienes envíos gratis ilimitados por ser tu primera semana! Aprovecha ahora.
                </p>
                <button className="w-full py-4 bg-white text-[#5842F4] rounded-[1.5rem] font-black text-sm hover:bg-indigo-50 transition-all shadow-lg shadow-black/10 active:scale-95">
                  VER BENEFICIOS
                </button>
              </div>
              {/* Decoración abstracta de fondo */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
            </section>

            {/* Dirección de entrega */}
            <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <MapPin size={18} className="text-slate-400" />
                </div>
                Dirección de Entrega
              </h3>

              <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500 italic text-center py-2 font-medium">
                  No has agregado una dirección todavía.
                </p>
              </div>

              <button className="mt-6 w-full py-4 text-[#5842F4] text-xs font-black border-2 border-[#5842F4]/10 hover:border-[#5842F4] hover:bg-indigo-50 rounded-2xl transition-all tracking-widest uppercase">
                + AGREGAR DIRECCIÓN
              </button>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;