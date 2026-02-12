import React, { useEffect, useState } from 'react';
import {
    Package, Plus, Search, Edit3, Trash2,
    CheckCircle2, XCircle, Filter, MoreVertical, Loader2
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { getMyProducts } from '../../services/company-service';
import { Product } from '../../interfaces/company/product.interface';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getMyProducts()
            .then(res => setProducts(res))
            .finally(() => setLoading(false));
    }, []);

    // Filtrado básico por nombre
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-merchant-main" size={40} />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sincronizando menú...</p>
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto animate-in fade-in duration-700">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">
                        Mis <span className="text-merchant-main">Productos</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
                        {products.length} platos registrados en el sistema
                    </p>
                </div>

                <NavLink
                    to="/merchant/products/new"
                    className="bg-merchant-main text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-merchant-main/20 hover:bg-merchant-dark hover:scale-105 transition-all flex items-center gap-3 text-xs"
                >
                    <Plus size={18} strokeWidth={3} /> Agregar Producto
                </NavLink>
            </div>

            {/* Buscador */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar en el menú..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-merchant-main/20 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Listado o Empty State */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                        <Package size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-400 italic uppercase">No se encontraron productos</h3>
                    <p className="text-slate-300 text-sm font-bold mb-8">Comienza agregando tu primer plato al menú</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col"
                        >
                            {/* Status */}
                            <div className="flex justify-between items-start mb-6">
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${product.isAvailable
                                    ? 'bg-emerald-50 text-emerald-500 border border-emerald-100'
                                    : 'bg-red-50 text-red-500 border border-red-100'
                                    }`}>
                                    {product.isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                    {product.isAvailable ? 'En Stock' : 'Agotado'}
                                </div>
                                <button className="text-slate-300 hover:text-slate-600 transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            {/* Info */}
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-merchant-light/30 rounded-2xl flex items-center justify-center text-merchant-main mb-4">
                                    <Package size={24} />
                                </div>
                                <h3 className="text-lg font-black text-slate-800 tracking-tight mb-1">{product.name}</h3>
                                <p className="text-slate-400 text-xs font-medium line-clamp-2">{product.description}</p>
                            </div>

                            {/* Price Footer */}
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                                <div>
                                    <p className="text-[10px] font-black text-slate-300 uppercase">Precio</p>
                                    <p className="text-xl font-black text-slate-900 italic">
                                        <span className="text-merchant-main text-sm not-italic mr-0.5">{product.currency}</span>
                                        {product.price}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-merchant-main hover:text-white transition-all active:scale-90">
                                        <Edit3 size={18} />
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-90">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;