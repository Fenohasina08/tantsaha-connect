import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../../tantsaha-backend/src/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { token } = useAuthStore();

  // Si la route nécessite une authentification et qu'on n'a pas de token
  if (requireAuth && !token) {
    return <Navigate to="/" replace />;
  }

  // Si on est déjà authentifié et qu'on essaie d'accéder à la page login
  if (!requireAuth && token) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;