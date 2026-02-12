import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;
const API_PREFIX = import.meta.env.VITE_API_PREFIX;

const api = axios.create({
  baseURL: `${API_URL}${API_PREFIX}`,
});

// 1. INTERCEPTOR DE PETICIONES: Agregamos el token a la cabecera
api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. INTERCEPTOR DE RESPUESTAS: Detectamos si el token es falso o expiró
api.interceptors.response.use(
  (response) => response, // Si todo sale bien, pasamos la respuesta
  (error: AxiosError) => {
    // Si el backend responde 401 (No autorizado) o 403 (Prohibido/Token alterado)
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Sesión inválida o token manipulado. Redirigiendo...");

      // Borramos las cookies para que el usuario no quede "atrapado" como falso admin
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("user");

      // Redirigimos al login y limpiamos el historial para evitar volver atrás
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?error=unauthorized";
      }
    }
    return Promise.reject(error);
  }
);

export default api;