import React, { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { loginUser } from "../services/auth-service";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/roles.enum";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tipado de eventos de cambio en inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Tipado del evento de envío del formulario
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Llamada al servicio (Ya tipado en auth.service.ts)
      const response = await loginUser(formData);
      console.log(response)

      // 2. Guardar en el Contexto
      // Nota: Ajustamos el llamado a login() según lo que definimos en AuthContext
      login(response.access_token, response.refresh_token);

      // 3. Redirección inteligente por ROL usando el Enum
      const { role } = response.user;

      switch (role) {
        case UserRole.ADMIN:
          navigate("/admin-dashboard");
          break;
        case UserRole.DRIVER:
          navigate("/driver/orders");
          break;
        case UserRole.MERCHANT:
          navigate("/merchant/store");
          break;
        case UserRole.CUSTOMER:
          navigate("/home");
          break;
        default:
          navigate("/");
      }
    } catch (err: any) {
      console.error("Error en login", err);
      // Capturamos el mensaje de error que configuramos en el servicio
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Card Principal */}
        <div className="bg-white py-10 px-8 shadow-2xl shadow-indigo-100 rounded-[2.5rem] border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">
              ¡Hola de nuevo!
            </h2>
            <p className="text-slate-500 mt-2 font-medium">
              Ingresa tus credenciales para entrar
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2 animate-pulse">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none text-slate-800"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">
                  Contraseña
                </label>
                <Link to="/forgot-password" aria-setsize="sm" className="text-xs font-bold text-[#5842F4] hover:underline">
                  ¿La olvidaste?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5842F4] transition-colors w-5 h-5" />
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-[#5842F4] transition-all outline-none text-slate-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#5842F4] transition-colors"
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5842F4] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 hover:bg-[#4633d1] hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} /> Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Registro Link */}
          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm font-medium">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-[#5842F4] font-bold hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;