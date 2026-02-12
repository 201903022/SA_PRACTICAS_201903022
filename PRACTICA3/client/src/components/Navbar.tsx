import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/roles.enum";
import { LogOut, User, LayoutDashboard, Truck, Building2, UserPlus, Utensils } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Package, Plus, List, Settings } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // * Variables para dropdown
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Lógica de colores según el rol para los acentos
  const getRoleColor = () => {
    switch (user?.role) {
      case UserRole.ADMIN: return "text-slate-900 border-slate-900";
      case UserRole.MERCHANT: return "text-merchant-main border-merchant-main";
      case UserRole.DRIVER: return "text-driver-main border-driver-main";
      default: return "text-brand-primary border-brand-primary";
    }
  };

  const navLinkStyles = ({ isActive }: { isActive: boolean }) => {
    const activeClass = getRoleColor();
    // Extraemos solo la clase de texto (ej. "text-brand-primary") para el split seguro
    const textColor = activeClass.split(' ')[0];

    return `text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 pb-1 border-b-2 ${isActive ? `${textColor} border-current` : "text-slate-400 border-transparent hover:text-slate-600"
      }`;
  };

  // ? Implementacion de Dropdown para merchant

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-20 items-center">

          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink to="/" className="text-2xl font-black italic tracking-tighter flex items-center gap-1">
              <span className={user ? getRoleColor().split(' ')[0] : "text-brand-primary"}>FAST</span>
              <span className="text-slate-900">DELIVERY</span>
            </NavLink>
          </div>

          {/* Menú Lado Derecho */}
          <div className="hidden md:flex items-center gap-8">

            {/* RUTAS PÚBLICAS */}
            {!user && (
              <div className="flex items-center gap-4">
                <NavLink to="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-brand-primary transition-colors">
                  Ingresar
                </NavLink>
                <NavLink
                  to="/register"
                  className="bg-brand-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                >
                  <UserPlus size={16} /> Registrarme
                </NavLink>
              </div>
            )}

            {/* RUTAS PRIVADAS */}
            {user && (
              <div className="flex items-center gap-8">

                {/* Contenedor de Dropdowns con Referencia Única */}
                <div className="flex items-center gap-6 border-r border-slate-100 pr-8" ref={dropdownRef}>

                  {/* --- SECCIÓN ADMIN --- */}
                  {user.role === UserRole.ADMIN && (
                    <>
                      <NavLink to="/admin-dashboard" className={navLinkStyles}>
                        <LayoutDashboard size={16} /> Dashboard
                      </NavLink>

                      {/* DROP: REPARTIDORES */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu('repartidores')}
                          className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 pb-1 border-b-2 ${openMenu === 'repartidores' ? "text-slate-900 border-slate-900" : "text-slate-400 border-transparent hover:text-slate-600"}`}
                        >
                          <Truck size={16} /> Repartidores
                          <ChevronDown size={14} className={`transition-transform ${openMenu === 'repartidores' ? 'rotate-180' : ''}`} />
                        </button>
                        {openMenu === 'repartidores' && (
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                            <NavLink to="/admin/deliveries" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                              <List size={14} /> Ver Repartidores
                            </NavLink>
                            <NavLink to="/admin/register-delivery" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                              <Plus size={14} /> Agregar Nuevo
                            </NavLink>
                          </div>
                        )}
                      </div>

                      {/* DROP: EMPRESAS */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu('empresas')}
                          className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 pb-1 border-b-2 ${openMenu === 'empresas' ? "text-slate-900 border-slate-900" : "text-slate-400 border-transparent hover:text-slate-600"}`}
                        >
                          <Building2 size={16} /> Empresas
                          <ChevronDown size={14} className={`transition-transform ${openMenu === 'empresas' ? 'rotate-180' : ''}`} />
                        </button>
                        {openMenu === 'empresas' && (
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                            <NavLink to="/admin/companies" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                              <List size={14} /> Ver Empresas
                            </NavLink>
                            <NavLink to="/admin/register-company" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                              <Plus size={14} /> Registrar Empresa
                            </NavLink>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* --- SECCIÓN MERCHANT --- */}
                  {user.role === UserRole.MERCHANT && (
                    <>
                      <NavLink to="/merchant-dashboard" className={navLinkStyles}>
                        <LayoutDashboard size={16} /> Dashboard
                      </NavLink>
                      <NavLink to="/my-company" className={navLinkStyles}>
                        <Building2 size={16} /> Mi Empresa
                      </NavLink>

                      {/* DROP: PRODUCTOS */}
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu('productos')}
                          className={`text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 pb-1 border-b-2 ${openMenu === 'productos' ? "text-merchant-main border-merchant-main" : "text-slate-400 border-transparent hover:text-slate-600"}`}
                        >
                          <Package size={16} /> Productos
                          <ChevronDown size={14} className={`transition-transform ${openMenu === 'productos' ? 'rotate-180' : ''}`} />
                        </button>
                        {openMenu === 'productos' && (
                          <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-200">
                            <NavLink to="/merchant/products" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-merchant-light hover:text-merchant-main transition-colors">
                              <List size={14} /> Ver Productos
                            </NavLink>
                            <NavLink to="/merchant/products/new" onClick={() => setOpenMenu(null)} className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-merchant-light hover:text-merchant-main transition-colors">
                              <Plus size={14} /> Agregar Producto
                            </NavLink>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                {/* --- SECCIÓN CUSTOMER (AÑADIDO) --- */}
                {user.role === UserRole.CUSTOMER && (
                  <>
                    <NavLink to="/user/dashboard" className={navLinkStyles}>
                      <LayoutDashboard size={16} /> Dashboard
                    </NavLink>
                    <NavLink to="/menu-dashboard" className={navLinkStyles}>
                      <Utensils size={16} /> Explorar Menú
                    </NavLink>
                  </>
                )}
                {/* --- PERFIL Y LOGOUT --- */}
                <div className="flex items-center gap-4">
                  <div className="text-right leading-none">
                    <p className={`text-[10px] font-black uppercase tracking-tighter ${getRoleColor().split(' ')[0]}`}>
                      {user.role}
                    </p>
                    <p className="text-sm font-black text-slate-900 italic tracking-tight">
                      {user?.name ? user.name.split(' ')[0].toUpperCase() : 'USUARIO'}
                    </p>
                  </div>

                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm ${user.role === UserRole.ADMIN ? "bg-slate-50 border-slate-200 text-slate-900" :
                    user.role === UserRole.MERCHANT ? "bg-amber-50 border-amber-500 text-amber-500" :
                      "bg-brand-light border-brand-primary text-brand-primary"
                    }`}>
                    <User size={20} />
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                    title="Cerrar Sesión"
                  >
                    <LogOut size={22} />
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;