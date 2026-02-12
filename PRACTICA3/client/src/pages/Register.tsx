import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { UserRole } from '../enums/roles.enum';
import { registerUser } from '../services/auth-service';
import {validatePassword,PASSWORD_REQUIREMENT_TEXT} from '../utils/validator'

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado tipado
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: UserRole.CUSTOMER // Usamos el Enum por defecto
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tipado del evento Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Tipado del evento Submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    if (!validatePassword(formData.password)) {
      return setError(PASSWORD_REQUIREMENT_TEXT);
    }

    setLoading(true);
    try {
      // Mapeamos 'phone' a 'phone_number' si tu backend lo requiere así
      const dataToSubmit = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        role: formData.role
      };

      await registerUser(dataToSubmit);
      navigate('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-indigo-100 rounded-[2.5rem] border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">Crear Cuenta</h2>
            <p className="text-slate-500 mt-2 font-medium">Ingresa tus datos para empezar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2 animate-shake">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Input Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Input Teléfono */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none"
                  placeholder="+502 0000 0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Contraseña */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                  <input
                    name="password"
                    type={showPass ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5842F4]"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Input Confirmar Contraseña */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Confirmar</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPass ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5842F4]"
                  >
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5842F4] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-[#4633d1] transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={20} /> Registrarme
                </>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-[#5842F4] font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;