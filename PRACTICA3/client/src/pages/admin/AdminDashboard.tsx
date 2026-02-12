import React from 'react';
import { 
  Users, 
  Store, 
  DollarSign, 
  TrendingUp, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminStat } from '../../interfaces/admin-state.interface';


const AdminDashboard: React.FC = () => {
  const { user, loading } = useAuth();

  // 2. Bloque de carga para evitar destellos de UI vacía
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-900">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Datos mock (Más adelante vendrán de tu API de NestJS)
  const stats: AdminStat[] = [
    { 
      label: 'Ventas Totales', 
      value: '$12,450.00', 
      icon: <DollarSign className="text-emerald-400" />, 
      change: '+12%', 
      isPositive: true 
    },
    { 
      label: 'Comercios Activos', 
      value: '48', 
      icon: <Store className="text-blue-400" />, 
      change: '+3', 
      isPositive: true 
    },
    { 
      label: 'Repartidores', 
      value: '124', 
      icon: <Users className="text-indigo-400" />, 
      change: '-2%', 
      isPositive: false 
    },
  ];

  return (
    <div className="p-6 md:p-10 bg-slate-950 min-h-[calc(100vh-80px)] text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header con Identidad de Admin */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="text-indigo-500" size={20} />
              <span className="text-indigo-500 font-black text-xs uppercase tracking-[0.3em]">Sistema Central</span>
            </div>
            <h1 className="text-4xl font-black italic tracking-tighter">
              ADMIN<span className="text-indigo-500 underline decoration-indigo-500/30">DASHBOARD</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Bienvenido, Super Administrador {
                user?.name || 'Admin'
              }</p>
          </div>

          {/* Acciones Rápidas */}
          <div className="flex gap-3">
            <Link 
              to="/admin/register-company"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <PlusCircle size={20} /> Registrar Empresa
            </Link>
          </div>
        </header>

        {/* Grid de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-slate-800 rounded-3xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${
                  stat.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">{stat.label}</p>
              <h2 className="text-4xl font-black tracking-tight">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Sección Inferior: Control de Repartidores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-slate-900 p-8 rounded-[3rem] border border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black italic flex items-center gap-2">
                <BarChart3 className="text-indigo-500" /> Rendimiento Global
              </h3>
              <select className="bg-slate-800 border-none rounded-xl text-xs font-bold text-slate-300 px-4 py-2 outline-none cursor-pointer">
                <option>Últimos 7 días</option>
                <option>Últimos 30 días</option>
              </select>
            </div>
            
            {/* Gráfico Placeholder */}
            <div className="h-48 bg-slate-800/50 rounded-[2rem] border-2 border-dashed border-slate-700 flex items-center justify-center">
              <p className="text-slate-500 font-bold italic">Cargando visualización de datos...</p>
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-8 rounded-[3rem] border border-indigo-500/20 flex flex-col justify-center">
            <h3 className="text-2xl font-black mb-4">Gestión de Flota</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Tienes <span className="text-white font-bold">12 repartidores</span> esperando aprobación de documentos para ingresar a la plataforma.
            </p>
            <Link 
              to="/admin/register-delivery" 
              className="w-full py-4 bg-white text-slate-900 text-center rounded-[1.5rem] font-black text-sm hover:bg-slate-100 transition-colors uppercase tracking-widest"
            >
              Revisar Solicitudes
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;