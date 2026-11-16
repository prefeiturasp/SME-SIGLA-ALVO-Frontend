import { useEffect } from "react";
import { redirecionarParaLogin } from "../utils/autenticacao";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = Boolean(localStorage.getItem("TOKEN"));

  useEffect(() => {
    if (!isAuthenticated) {
      redirecionarParaLogin();
    }
  }, [isAuthenticated]);

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  });

  return isAuthenticated ? <>{children}</> : null;
}
