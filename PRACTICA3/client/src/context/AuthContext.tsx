import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { 
  getCookieToken, 
  setCookieToken, 
  removeCookieToken, 
  clearAuthCookies,
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY 
} from "../utils/cookies";
import { AuthContextProps } from "../interfaces/auth.context.props.interface";
import { UserRole } from "../enums/roles.enum";
import { jwtDecode } from 'jwt-decode';
import { User } from "../interfaces/user.interface";
import { JwtPayload } from "../interfaces/jwt.interface";

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usamos tu función para obtener el access_token
    const accessToken = getCookieToken(ACCESS_TOKEN_KEY);
    
    if (accessToken) {
      processToken(accessToken);
    }
    
    setLoading(false);
  }, []);

  const processToken = (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Verificación de expiración
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      setUser({
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role as UserRole,
      });
    } catch (error) {
      console.error("Error al procesar el token:", error);
      logout();
    }
  };

  const login = (accessToken: string, refreshToken: string) => {
    // Usamos tus funciones de cookies con sus tiempos de expiración
    setCookieToken(ACCESS_TOKEN_KEY, accessToken, 1);    // 1 día
    setCookieToken(REFRESH_TOKEN_KEY, refreshToken, 14); // 14 días
    processToken(accessToken);
  };

  const logout = () => {
    // Usamos tu función que limpia ambas cookies de un golpe
    clearAuthCookies();
    setUser(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token: getCookieToken(ACCESS_TOKEN_KEY) || null, 
        loading, 
        login, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);