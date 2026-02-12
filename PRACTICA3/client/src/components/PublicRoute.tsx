import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../enums/roles.enum";

const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // O un spinner de carga

    // Si el usuario ya está logueado, lo redirigimos según su rol
    if (user) {
        switch (user.role) {
            case UserRole.ADMIN:
                return <Navigate to="/admin-dashboard" replace />;
            case UserRole.DRIVER:
                return <Navigate to="/driver/orders" replace />;
            case UserRole.MERCHANT:
                return <Navigate to="/merchant/store" replace />;
            default:
                return <Navigate to="/home" replace />;
        }
    }

    // Si no hay usuario, permitimos ver el Login/Register
    return <Outlet />;
};

export default PublicRoute;