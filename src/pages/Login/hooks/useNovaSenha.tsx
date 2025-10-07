import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNovaSenhaSchema } from "../formValidacaoSchema";
import { usePostNovaSenha } from "./usePostNovaSenha";
import type { INovaSenhaRequest, INovaSenhaResponse } from "../../../services/resources/login/novaSenha";

interface INovaSenhaFormData {
  nova_senha: string;
  confirmar_senha: string;
}

export const useNovaSenha = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const schema = useNovaSenhaSchema();
  const novaSenhaMutation = usePostNovaSenha();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<INovaSenhaFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      nova_senha: "",
      confirmar_senha: "",
    },
  });

  const novaSenhaValue = watch("nova_senha");
  const confirmarSenhaValue = watch("confirmar_senha");

  const hasMinLength = Boolean(novaSenhaValue && novaSenhaValue.length >= 8 && novaSenhaValue.length <= 12);
  const hasLowerCase = Boolean(novaSenhaValue && /[a-z]/.test(novaSenhaValue));
  const hasUpperCase = Boolean(novaSenhaValue && /[A-Z]/.test(novaSenhaValue));
  const hasNumber = Boolean(novaSenhaValue && /[0-9]/.test(novaSenhaValue));
  const hasSpecialChar = Boolean(novaSenhaValue && /[#$@!%&*?]/.test(novaSenhaValue));
  const hasNoSpaces = novaSenhaValue ? !/\s/.test(novaSenhaValue) : true;
  const hasNoAccents = novaSenhaValue ? !/[áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(novaSenhaValue) : true;

  const isButtonDisabled = 
    !novaSenhaValue || 
    !confirmarSenhaValue || 
    !hasMinLength || 
    !hasLowerCase || 
    !hasUpperCase || 
    !hasNumber || 
    !hasSpecialChar || 
    !hasNoSpaces || 
    !hasNoAccents ||
    novaSenhaValue !== confirmarSenhaValue;

  const onFinish = async (values: INovaSenhaFormData) => {
    setAlert(null);
    
    if (!token) {
      setAlert({ 
        type: 'error', 
        message: 'Token de recuperação inválido.' 
      });
      return;
    }

    const payload: INovaSenhaRequest = {
      token: token,
      nova_senha: values.nova_senha,
      confirmar_senha: values.confirmar_senha,
    };

    novaSenhaMutation.mutate(payload, {
      onSuccess: (data: INovaSenhaResponse) => {
        setAlert({ 
          type: 'success', 
          message: data.message || 'Senha alterada com sucesso!' 
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      },
      onError: (error: any) => {
        setAlert({ 
          type: 'error', 
          message: error.message || 'Erro ao alterar senha. Tente novamente.' 
        });
      },
    });
  };

  const handleCancel = () => {
    navigate("/login");
  };

  return {
    loading: novaSenhaMutation.isPending,
    alert,
    control,
    handleSubmit: handleSubmit(onFinish),
    errors,
    isButtonDisabled,
    hasMinLength,
    hasLowerCase,
    hasUpperCase,
    hasNumber,
    hasSpecialChar,
    hasNoSpaces,
    hasNoAccents,

    handleCancel,
  };
};

