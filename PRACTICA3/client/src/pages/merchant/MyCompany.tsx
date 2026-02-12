import React, { useEffect, useState } from 'react';
import { Building2, PlusCircle, MapPin, Phone, Clock, Tag, ShieldCheck, ShieldAlert } from 'lucide-react';
import { getCompanyInfo } from '../../services/company-service';
import { NavLink } from 'react-router-dom';

const MyCompany: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCompanyInfo()
            .then(res => setData(res))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center font-black animate-pulse text-merchant-main tracking-widest uppercase text-sm">
                Cargando datos de empresa...
            </div>
        </div>
    );

    const r = data?.restaurant;

    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {data?.found ? (
                <div className="bg-white rounded-form shadow-2xl shadow-merchant-main/10 border border-slate-100 overflow-hidden">
                    {/* Header con Badge de Estado */}
                    <div className="bg-merchant-main p-8 text-white flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Mi Empresa</h2>
                            <p className="opacity-80 font-bold text-xs uppercase tracking-widest">Gestión de perfil comercial</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md ${r.isActive ? 'bg-emerald-500/20 text-emerald-100' : 'bg-red-500/20 text-red-100'}`}>
                            {r.isActive ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                            {r.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>

                    <div className="p-8 grid gap-6">
                        {/* Nombre y Alias */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="bg-white p-3 rounded-2xl text-merchant-main shadow-sm"><Building2 /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Nombre Comercial</p>
                                    <p className="font-black text-lg text-slate-800">{r.name || 'No registrado'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                                <div className="bg-white p-3 rounded-2xl text-merchant-main shadow-sm"><Tag /></div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Alias / Username</p>
                                    <p className={`font-black text-lg ${r.alias ? 'text-slate-800' : 'text-slate-300 italic'}`}>
                                        {r.alias ? `@${r.alias}` : 'n/a'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Detallada */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Dirección */}
                            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <MapPin className="text-slate-300" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Dirección Física</p>
                                    <p className={`text-sm font-bold ${r.address ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {r.address || 'Sin dirección registrada'}
                                    </p>
                                </div>
                            </div>

                            {/* Teléfono */}
                            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Phone className="text-slate-300" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Línea de contacto</p>
                                    <p className={`text-sm font-bold ${r.phone ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {r.phone || 'No disponible'}
                                    </p>
                                </div>
                            </div>

                            {/* Horarios */}
                            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <Clock className="text-slate-300" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Horario de Atención</p>
                                    <p className={`text-sm font-bold ${r.openingHours ? 'text-slate-700' : 'text-slate-300'}`}>
                                        {r.openingHours || 'Horario no definido'}
                                    </p>
                                </div>
                            </div>

                            {/* ID Tipo */}
                            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                                <ShieldCheck className="text-slate-300" size={20} />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Categoría Principal</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 truncate w-40">
                                        {r.merchantTypeId}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Botón Editar (Opcional por si quieres agregarlo luego) */}
                        <div className="mt-4 pt-6 border-t border-slate-100 flex justify-end">
                            <button className="text-xs font-black uppercase tracking-widest text-merchant-main hover:bg-merchant-light px-6 py-3 rounded-xl transition-all">
                                Editar Información
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* VISTA: REGISTRO (Ya optimizada) */
                <div className="text-center py-20 bg-white rounded-form border-2 border-dashed border-slate-200 shadow-inner">
                    <div className="bg-merchant-light w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-merchant-main ring-8 ring-merchant-light/30">
                        <Building2 size={48} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 italic uppercase tracking-tighter">¡Aún no tienes una empresa!</h2>
                    <p className="text-slate-500 mb-8 font-medium max-w-xs mx-auto">Configura tu comercio hoy mismo para empezar a recibir pedidos.</p>

                    <button className="bg-merchant-main text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-merchant-main/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto">
                        <PlusCircle size={20} /> Registrar Mi Empresa
                        <NavLink to="/merchant/register" className="absolute inset-0" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyCompany;