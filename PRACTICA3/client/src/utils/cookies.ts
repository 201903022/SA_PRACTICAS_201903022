import Cookies from "js-cookie";

// Definimos los nombres de las cookies como constantes para evitar errores de dedo
export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

/**
 * Guarda un token en las cookies con configuración de seguridad
 * @param name Nombre de la cookie
 * @param value Valor del token
 * @param expires Días para expirar (ej: 1 para access, 14 para refresh)
 */
export const setCookieToken = (
  name: string,
  value: string,
  expires: number = 1,
): void => {
  Cookies.set(name, value, {
    expires, // Tiempo en días
    secure: true, // Solo se envía por HTTPS
    sameSite: "strict", // Previene ataques CSRF
    path: "/", // Disponible en toda la app
  });
};

/**
 * Obtiene el valor de una cookie
 */
export const getCookieToken = (name: string): string | undefined => {
  return Cookies.get(name);
};

/**
 * Elimina una cookie específica
 */
export const removeCookieToken = (name: string): void => {
  Cookies.remove(name);
};

/**
 * Limpia todos los datos de sesión
 */
export const clearAuthCookies = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  Cookies.remove(USER_KEY);

};
