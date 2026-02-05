import React, { useState } from "react";
import { Truck, User, Mail, Phone, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { registerDelivery } from "../../services/admin.service";

const RegisterDelivery = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  
  // Estado unificado para el feedback
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);

    try {
      // Importante: Asegúrate de que el service envíe los nombres de campos 
      // que espera tu DTO (name, email, phone_number, password)
      await registerDelivery({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone, // Mapeo a lo que espera tu Backend
        password: formData.password,
      });

      setStatus({ 
        type: "success", 
        msg: `¡Repartidor ${formData.name} registrado con éxito!` 
      });
      
      // Limpiar formulario
      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Error al registrar repartidor. Verifica los datos." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Truck className="text-indigo-600 w-8 h-8" />
          </div>
          Nuevo Repartidor
        </h2>
        <p className="text-slate-500 mt-2">Registra una nueva cuenta de tipo DRIVER en el sistema.</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 space-y-5"
      >
        {/* MENSAJES DE FEEDBACK */}
        {status.msg && (
          <div
            className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
              status.type === "success" 
                ? "bg-green-50 border border-green-100 text-green-700" 
                : "bg-red-50 border border-red-100 text-red-700"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium text-sm">{status.msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Nombre</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                required
                placeholder="Juan Pérez"
                className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                required
                placeholder="5555-5555"
                className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                value={formData.phone}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="correo@repartidor.com"
              className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              value={formData.email}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">Contraseña Temporal</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              value={formData.password}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95 flex justify-center items-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Dar de Alta Repartidor"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterDelivery;