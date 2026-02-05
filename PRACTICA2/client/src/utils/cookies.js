import Cookies from 'js-cookie';

// Configuraciones base (opcional)
const cookieConfig = {
  expires: 7,           // Días por defecto
  path: '/',            // Disponible en toda la app
  secure: true,         // Solo por HTTPS (Vite suele usarlo en dev también)
  sameSite: 'lax'       // Protección contra CSRF
};

export const storage = {
  // Guardar Token
  setToken: (name, token, days = 1) => {
    Cookies.set(name, token, { ...cookieConfig, expires: days });
  },

  // Obtener Token
  getToken: (name) => {
    return Cookies.get(name);
  },

  // Borrar Token (Logout)
  removeToken: (name) => {
    Cookies.remove(name, { path: '/' });
  },

  // Limpiar toda la sesión
  clearSession: () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    localStorage.removeItem('user');
  }
};