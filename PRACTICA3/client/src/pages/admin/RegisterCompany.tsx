import React, { useState, ChangeEvent, FormEvent } from "react";
import { Building2, Mail, Phone, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { registerCompany } from "../../services/admin-service";
import { RegisterMerchantDTO } from "../../interfaces/register-merchatn.dto";
import {validatePassword,PASSWORD_REQUIREMENT_TEXT} from '../../utils/validatePassword'

interface StatusState {
  type: "success" | "error" | "";
  msg: string;
}

const RegisterMerchant: React.FC = () => {
  const [formData, setFormData] = useState<RegisterMerchantDTO & { confirmPassword: string }>({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: ""
  });

  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState<StatusState>({ type: "", msg: "" });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status.msg) setStatus({ type: "", msg: "" });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setStatus({ type: "error", msg: "Las contraseñas no coinciden." });
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation) {
      return setStatus({ type: "error", msg: PASSWORD_REQUIREMENT_TEXT });
    }

    setStatus({ type: "", msg: "" });
    setLoading(true);

    try {
      await registerCompany({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      setStatus({
        type: "success",
        msg: `¡Empresa "${formData.name}" registrada con éxito!`
      });

      setFormData({ name: "", email: "", phone_number: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        msg: err.response?.data?.message || err.message || "Error al registrar la empresa."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10 text-center md:text-left">
        <div className="inline-flex bg-amber-100 p-3 rounded-2xl mb-4">
          <Building2 className="text-amber-600 w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter text-slate-900 uppercase">
          NUEVA <span className="text-amber-500">EMPRESA</span>
        </h2>
        <p className="text-slate-500 mt-2 font-medium italic">Panel de Alta de Comercios Aliados</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-amber-900/5 border border-slate-100 space-y-6"
      >
        {status.msg && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
            status.type === "success" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
            }`}>
            {status.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold text-sm">{status.msg}</span>
          </div>
        )}

        {/* Nombre Comercial */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Nombre Comercial</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
            <input
              name="name"
              type="text"
              required
              placeholder="Ej. Pizzería 'La Estación'"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-amber-500 transition-all outline-none font-medium"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Email Corporativo</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                placeholder="contacto@negocio.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-amber-500 transition-all outline-none font-medium text-sm"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Teléfono</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
              <input
                name="phone_number"
                type="tel"
                required
                placeholder="+502 0000-0000"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-amber-500 transition-all outline-none font-medium text-sm"
                onChange={handleChange}
                value={formData.phone_number}
              />
            </div>
          </div>
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="********"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-amber-500 transition-all outline-none font-medium"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-2 tracking-widest">Confirmar</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
                <input
                  name="confirmPassword"
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="********"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-amber-500 transition-all outline-none font-medium"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              </div>
            </div>
          </div>

          {/* Selector de mostrar contraseñas debajo de los campos */}
          <div className="flex justify-end px-2">
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-slate-400 hover:text-amber-500 transition-colors group"
            >
              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{showPass ? "Ocultar contraseñas" : "Mostrar contraseñas"}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-widest mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            "Dar de Alta Comercio"
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterMerchant;