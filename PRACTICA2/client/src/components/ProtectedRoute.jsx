import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Mientras el contexto lee las cookies, no mostramos nada o un spinner
  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario, al login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si hay roles permitidos y el del usuario no está en la lista, rebotarlo
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // O al dashboard básico
  }

  return children;
};
