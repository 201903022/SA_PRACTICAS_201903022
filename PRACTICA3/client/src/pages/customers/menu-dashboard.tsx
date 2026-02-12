import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Clock, MapPin, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { getAllMenus } from '../../services/meu-service';
import { MenuCategory } from '../../interfaces/menu/Menu.interfaces';
import { useCart } from '../../context/CarteContext';

const MenuDashboard: React.FC = () => {
    const [menus, setMenus] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        getAllMenus().then(setMenus).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-20 text-center animate-pulse font-black text-brand-primary">CARGANDO MENÚS...</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 space-y-12">

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto bg-brand-primary rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-brand-primary/20">
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-black italic tracking-tighter mb-4 leading-none">¿Qué se te antoja hoy?</h1>
                    <p className="text-brand-light/80 font-bold uppercase tracking-widest text-xs">Los mejores comercios de la ciudad a un clic</p>
                </div>
                <UtensilsCrossed className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 w-64 h-64 rotate-12" />
            </section>

            {/* Renderizado de Menús por Restaurante */}
            <div className="max-w-7xl mx-auto space-y-16">
                {menus.map((group) => (
                    <section key={group.restaurant.id} className="space-y-6">

                        {/* Header del Restaurante */}
                        <div className="flex justify-between items-end px-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-3xl font-black italic text-slate-900 tracking-tighter uppercase">{group.restaurant.name}</h2>
                                    <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Abierto</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {group.restaurant.address.split(',')[0]}</span>
                                    <span className="flex items-center gap-1"><Clock size={14} /> {group.restaurant.openingHours || 'Consultar'}</span>
                                </div>
                            </div>
                            <button className="text-brand-primary font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                Ver todo <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Listado de Productos (Scroll Horizontal en Mobile) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {group.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="group bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                                >
                                    <div className="aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center text-slate-200 group-hover:bg-brand-light/30 group-hover:text-brand-primary transition-colors">
                                        <ShoppingBag size={40} />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-black text-slate-800 tracking-tight leading-tight mb-1">{item.name}</h3>
                                        <p className="text-slate-400 text-[11px] font-medium line-clamp-2 mb-4">{item.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <span className="text-lg font-black text-slate-900 italic">
                                            <span className="text-brand-primary text-xs not-italic mr-0.5">{item.currency}</span>
                                            {item.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => addToCart({
                                                menuItemId: item.id,
                                                name: item.name,
                                                price: item.price,
                                                quantity: 1
                                            }, group.restaurant.id, group.restaurant.name)}
                                            className="bg-slate-900 text-white p-3 rounded-xl hover:bg-brand-primary transition-all"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

const Plus = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default MenuDashboard;