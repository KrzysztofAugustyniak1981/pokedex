import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


//nie ma usera to wywal na login
const ProtectedRoute = () => {
    const { user } = useAuth();

    if (!user) {
        //replace usuwa cofnięcie do poprzedniej strony
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;