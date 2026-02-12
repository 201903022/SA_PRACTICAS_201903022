import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/roles.enum";

interface Props {
    allowedRoles: UserRole[];
}

const RoleGuard = ({ allowedRoles }: Props) => {
    const { user, loading } = useAuth();

    // Mientras el Contexto recupera el token de la cookie, mostramos un loader
    if (loading) return <div className="flex justify-center py-20 italic">Verificando credenciales...</div>;

    // Si no hay usuario o su rol no está en la lista permitida
    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    // Si todo está bien, renderiza la ruta hija
    return <Outlet />;
};

export default RoleGuard;