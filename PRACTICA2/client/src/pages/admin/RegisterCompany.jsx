import React, { useState } from "react";
import { Building2, Mail, Phone, Lock, CheckCircle2, AlertCircle, User } from "lucide-react";
import { registerCompany } from "../../services/admin.service";

const RegisterMerchant = () => {
  const [formData, setFormData] = useState({
    name: "", // Nombre de la empresa
    email: "",
    phone: "",
    password: "",
  });
  
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });
    setLoading(true);

    try {
      await registerCompany({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
      });

      setStatus({ 
        type: "success", 
        msg: `¡Empresa "${formData.name}" dada de alta correctamente!` 
      });
      setFormData({ name: "", email: "", phone: "", password: "" });
    } catch (err) {
      setStatus({ 
        type: "error", 
        msg: err.response?.data?.message || "Error al registrar la empresa." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <div className="bg-amber-100 p-2 rounded-lg">
            <Building2 className="text-amber-600 w-8 h-8" />
          </div>
          Nueva Empresa / Comercio
        </h2>
        <p className="text-slate-500 mt-2">Crea una cuenta de MERCHANT para que puedan gestionar sus productos.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-5">
        {status.msg && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-bounce-short ${
            status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
          }`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium text-sm">{status.msg}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Nombre Comercial</label>
          <div className="relative">
            <Building2 className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              required
              placeholder="Ej. Pizzería 'La Estación'"
              className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              value={formData.name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Email Corporativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="email"
                required
                className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                value={formData.email}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Teléfono de Contacto</label>
            <div className="relative">
              <Phone className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="tel"
                required
                className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                value={formData.phone}
              />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Contraseña de Acceso</label>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="password"
              required
              className="w-full pl-12 p-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              value={formData.password}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-amber-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all flex justify-center items-center gap-2 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : "Registrar Empresa"}
        </button>
      </form>
    </div>
  );
};

export default RegisterMerchant;