import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-indigo-600">FastDelivery</Link>

      <div className="flex items-center gap-6">
        {user ? (
          <>
            {/* Si es ADMIN, le mostramos un link especial */}
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="text-slate-600 font-medium flex items-center gap-1 hover:text-indigo-600">
                <LayoutDashboard size={18} /> Panel Admin
              </Link>
            )}
            
            <div className="flex items-center gap-2 text-slate-700 font-bold">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                <User size={16} />
              </div>
              <span>{user.name}</span>
            </div>

            <button 
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 font-bold hover:text-indigo-600">Ingresar</Link>
            <Link to="/register" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all">
              Registrarme
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;