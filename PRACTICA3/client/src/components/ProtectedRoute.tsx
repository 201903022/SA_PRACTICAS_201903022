import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/roles.enum";

interface Props {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  // Si no hay usuario o el rol no coincide, redirigimos
  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/login" replace />;
  }

  // Outlet es donde se renderizarán las rutas hijas
  return <Outlet />;
};

export default ProtectedRoute;