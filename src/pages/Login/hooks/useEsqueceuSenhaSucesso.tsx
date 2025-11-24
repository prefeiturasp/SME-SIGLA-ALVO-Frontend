import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useEsqueceuSenhaSucesso = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const usuarioEmail = location.state?.usuarioEmail;
  const usuarioRf = location.state?.usuarioRf;

  useEffect(() => {
    if (!usuarioRf && !usuarioEmail) {
      navigate('/login');
      return;
    }
  }, [usuarioRf, usuarioEmail, navigate]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    loading: false,
    usuarioEmail,
    usuarioRf,
    handleBackToLogin,
  };
};
