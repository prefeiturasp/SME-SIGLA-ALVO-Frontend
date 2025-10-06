import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useEsqueceuSenhaSucesso = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const solicitacaoId = location.state?.solicitacaoId;
  const usuarioEmail = location.state?.usuarioEmail;
  
  const [maskedEmail, setMaskedEmail] = useState<string>("");

  const maskEmail = (email: string): string => {
    if (!email || email.length <= 3) return email;
    
    const [localPart, domain] = email.split('@');
    if (!domain) return email;
    
    const maskedLocal = localPart.substring(0, 3) + '*'.repeat(Math.max(0, localPart.length - 3));
    return `${maskedLocal}@${domain}`;
  };

  useEffect(() => {
    if (!solicitacaoId && !usuarioEmail) {
      navigate('/login');
      return;
    }

    if (usuarioEmail) {
      setMaskedEmail(maskEmail(usuarioEmail));
    }
  }, [solicitacaoId, usuarioEmail, navigate]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    loading: false,
    maskedEmail,
    handleBackToLogin,
  };
};
