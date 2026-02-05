import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { registerUser } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación simple de UI que no requiere lógica pesada
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      const result = await registerUser(formData);
      console.log('Usuario creado con éxito:', result);
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-indigo-100 rounded-[2.5rem] border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900">Crear Cuenta</h2>
            <p className="text-slate-500 mt-2">Ingresa tus datos para empezar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600" /> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Input Nombre */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Input Teléfono */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="phone"
                  type="tel"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="+502 0000 0000"
                />
              </div>
            </div>

            {/* Input Contraseña */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Input Confirmar Contraseña */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] mt-4"
            >
              Registrarse
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;