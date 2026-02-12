import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Package, DollarSign, AlignLeft,
    Save, CheckCircle2, XCircle
} from 'lucide-react';
import { CreateMenuItemDto } from '../../interfaces/company/crate-menu-item.dto';
import { createMenuItem } from '../../services/company-service';

const CreateProduct: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<CreateMenuItemDto>({
        name: '',
        description: '',
        price: 0,
        currency: 'GTQ',
        isAvailable: true,
        categoryIds: [] // ! Por ahora vacío, pero se podrían agregar categorías en el futuro para organizar mejor el menú
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createMenuItem(formData);
            navigate('/merchant/products'); // * Volver a la lista tras exito en creación
        } catch (error) {
            alert("Hubo un error al guardar el producto.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = `
        w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 
        outline-none transition-all duration-300
        placeholder:text-slate-300
        focus:bg-white focus:ring-4 focus:ring-merchant-main/10 focus:border-merchant-main focus:shadow-xl
    `;

    const labelStyle = "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4 mb-2 block";

    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 text-slate-400 transition-all active:scale-90"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">
                        Nuevo <span className="text-merchant-main">Producto</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Agrega un platillo al menú</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/40 border border-slate-100 p-8 md:p-12 relative overflow-hidden">

                <div className="grid gap-8">

                    {/* Nombre del Producto */}
                    <div>
                        <label className={labelStyle}>Nombre del Platillo *</label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                maxLength={120}
                                className={inputStyle}
                                placeholder="Ej. Hamburguesa Doble"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className={labelStyle}>Descripción</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-6 text-slate-300" size={18} />
                            <textarea
                                maxLength={255}
                                rows={3}
                                className={`${inputStyle} pl-12 resize-none`}
                                placeholder="Detalla los ingredientes o tamaño..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Precio */}
                        <div>
                            <label className={labelStyle}>Precio (GTQ) *</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className={inputStyle}
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>

                        {/* Disponibilidad (Toggle Estilizado) */}
                        <div>
                            <label className={labelStyle}>Disponibilidad Inicial</label>
                            <div className="flex gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isAvailable: true })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${formData.isAvailable
                                        ? 'bg-white text-emerald-500 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <CheckCircle2 size={14} /> Disponible
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isAvailable: false })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!formData.isAvailable
                                        ? 'bg-white text-red-500 shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <XCircle size={14} /> Agotado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botón de Acción */}
                <div className="mt-12">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-merchant-main text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-merchant-main/20 hover:bg-merchant-dark hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={20} /> Crear Producto
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default CreateProduct;