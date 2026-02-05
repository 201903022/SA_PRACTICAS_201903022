import React from 'react';
import { Package, MapPin, Clock, Star } from 'lucide-react';

const UserDashboard = () => {
  // Datos quemados (Mock Data)
  const user = { name: "Usuario Nuevo", email: "nuevo@ejemplo.com" };
  const recentOrders = [
    { id: '#1234', restaurant: 'Pizza Palace', status: 'En camino', total: '$25.50' },
    { id: '#1233', restaurant: 'Sushi Roll', status: 'Entregado', total: '$42.00' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Bienvenido, {user.name} 👋</h1>
          <p className="text-slate-500">¿Qué se te antoja pedir hoy?</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Principal: Órdenes */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Package className="text-indigo-600" /> Órdenes Recientes
              </h2>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-900">{order.restaurant}</p>
                      <p className="text-sm text-slate-500">{order.id} • {order.total}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-xs font-bold ${
                      order.status === 'En camino' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Columna Lateral: Perfil/Promos */}
          <div className="space-y-6">
            <section className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
              <Star className="mb-4 text-amber-300 fill-amber-300" />
              <h3 className="text-xl font-bold mb-2">Fast Pass Pro</h3>
              <p className="text-indigo-100 text-sm mb-4">¡Tienes envíos gratis ilimitados por ser tu primera semana!</p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm">
                Ver Beneficios
              </button>
            </section>
            
            <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-slate-400" /> Dirección Actual
              </h3>
              <p className="text-sm text-slate-600 italic">No has agregado una dirección todavía.</p>
              <button className="mt-4 text-indigo-600 text-sm font-bold">+ Agregar Dirección</button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;