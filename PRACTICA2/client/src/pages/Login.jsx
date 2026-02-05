import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../services/auth.service"; // Asegúrate que este sea el nombre correcto
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth(); // Para guardar el usuario en el contexto global
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Llamada al servicio
      const response = await loginUser(formData);
      
      // 2. Guardar en el Contexto (Token y User)
      login(response.user, response.access_token);

      // 3. Redirección inteligente por ROL
      const { role } = response.user;
      console.log("Sesión iniciada como:", role);

      switch (role) {
        case 'ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'DRIVER':
          navigate('/driver/orders');
          break;
        case 'MERCHANT':
          navigate('/merchant/store');
          break;
        case 'CUSTOMER':
          navigate('/home');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      console.error("Error en login", err);
      setError(err.response?.data?.message || "Credenciales incorrectas o error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-2xl shadow-indigo-100 rounded-[2.5rem] border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900">¡Hola de nuevo!</h2>
            <p className="text-slate-500 mt-2">Ingresa tus credenciales para entrar</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Contraseña</label>
                <a href="#" className="text-xs text-indigo-600 hover:underline">¿La olvidaste?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={formData.password}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={20} /> Iniciar Sesión</>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-500 text-sm">
            ¿No tienes una cuenta? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;