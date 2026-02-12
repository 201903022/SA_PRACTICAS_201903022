import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Phone, Clock, Tag, Briefcase, Save, ArrowLeft, ChevronDown } from 'lucide-react';
import { registerCompany, getMerchantTypes } from '../../services/company-service';
import { CompanyRegisterDTO } from '../../interfaces/company/company.register.dto';

const RegisterCompany: React.FC = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CompanyRegisterDTO>({
        name: '',
        address: '',
        phone: '',
        alias: '',
        openingHours: '',
        merchantTypeId: ''
    });

    useEffect(() => {
        getMerchantTypes()
            .then((res: any) => { // Usamos any aquí solo para la validación de la estructura
                if (res?.merchantTypes) {
                    const list = res?.merchantTypes ? res.merchantTypes : res;
                    setTypes(
                        (list ?? []).slice().sort((a: any, b: any) => a.name.localeCompare(b.name))
                    );
                } else {
                    setTypes(res);
                }
            })
            .catch(() => setTypes([]));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerCompany(formData);
            navigate('/my-company'); // Redirigir a la vista de info tras éxito
        } catch (error) {
            alert("Error al registrar la empresa. Revisa los datos.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = `
  w-full bg-slate-50 border border-slate-200 rounded-2xl px-12 py-4 text-sm font-bold text-slate-700 
  outline-none transition-all duration-300
  placeholder:text-slate-300
  focus:bg-white focus:ring-4 focus:ring-merchant-main/10 focus:border-merchant-main focus:shadow-lg
`;
    const selectBase = `
  w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-12 py-4
  text-sm font-bold outline-none transition-all duration-300
  focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500
`;

    const labelStyle =
        "text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4 mb-2 block";
    return (
        <div className="p-6 md:p-10 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate(-1)} className="p-3 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-800">Registrar Empresa</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Paso final para activar tu comercio</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-form shadow-2xl shadow-merchant-main/5 border border-slate-100 p-8 md:p-12">

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Nombre */}
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelStyle}>Nombre de la Empresa *</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                maxLength={120}
                                className={inputStyle}
                                placeholder="Ej. Taco Palace"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Alias */}
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelStyle}>Alias / Handle</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                maxLength={80}
                                className={inputStyle}
                                placeholder="@taco_palace"
                                value={formData.alias}
                                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="col-span-2">
                        <label className={labelStyle}>Dirección Completa *</label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                required
                                maxLength={255}
                                className={inputStyle}
                                placeholder="Calle, Ciudad, Referencias..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelStyle}>Teléfono de Contacto</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                maxLength={20}
                                className={inputStyle}
                                placeholder="+502 0000-0000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Tipo de Comercio */}
                    <div className="col-span-2 md:col-span-1">
                        <label className={labelStyle}>Tipo de Comercio *</label>

                        <div className="relative group">
                            {/* Icono izquierdo */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Briefcase
                                    size={18}
                                    className={`transition-colors ${formData.merchantTypeId ? "text-orange-500" : "text-slate-300"
                                        } group-focus-within:text-orange-500`}
                                />
                            </div>

                            <select
                                required
                                id="merchantType"
                                name="merchantType"
                                title='merchanType'
                                value={formData.merchantTypeId}
                                onChange={(e) => setFormData({ ...formData, merchantTypeId: e.target.value })}
                                disabled={types.length === 0}
                                className={[
                                    selectBase,
                                    "appearance-none cursor-pointer",
                                    types.length === 0 ? "opacity-60 cursor-not-allowed" : "",
                                    !formData.merchantTypeId ? "text-slate-400" : "text-slate-700",
                                ].join(" ")}
                            >
                                {/* Placeholder real */}
                                <option value="" disabled>
                                    {types.length === 0 ? "Cargando tipos..." : "Seleccionar tipo de negocio..."}
                                </option>

                                {types.map((t) => (
                                    <option key={t.id} value={t.id} className="text-slate-700 font-semibold">
                                        {t.name}
                                    </option>
                                ))}
                            </select>

                            {/* Flecha derecha */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown
                                    size={16}
                                    className="text-slate-400 transition-transform duration-300 group-focus-within:rotate-180"
                                />
                            </div>

                            {/* Glow/borde extra cuando hay seleccion (se siente mas “activo”) */}
                            {formData.merchantTypeId && (
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-orange-500/20 pointer-events-none" />
                            )}
                        </div>

                        {/* Mensaje de ayuda opcional */}
                        {!types.length && (
                            <p className="mt-2 ml-4 text-xs text-slate-400 font-semibold">
                                No hay tipos disponibles por ahora.
                            </p>
                        )}
                    </div>

                    {/* Horarios */}
                    <div className="col-span-2">
                        <label className={labelStyle}>Horas de Apertura</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                maxLength={120}
                                className={inputStyle}
                                placeholder="Lunes a Viernes 08:00 - 20:00"
                                value={formData.openingHours}
                                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                            />
                        </div>
                    </div>

                </div>

                {/* Botón Guardar */}
                <div className="mt-12">
                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-merchant-main text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-merchant-main/20 hover:bg-merchant-dark hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="animate-pulse">Procesando...</span>
                        ) : (
                            <>
                                <Save size={20} /> Guardar y Activar Empresa
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default RegisterCompany;