import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = Boolean(localStorage.getItem("TOKEN"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });  

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
