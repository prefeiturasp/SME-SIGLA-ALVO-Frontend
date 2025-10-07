import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEsqueceuSenhaSchema } from "../formValidacaoSchema";
import { usePostEsqueceuSenha } from "./usePostEsqueceuSenha";
import type { IEsqueceuSenhaRequest, IEsqueceuSenhaResponse } from "../../../services/resources/login/esqueceuSenha";

export const useEsqueceuSenha = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const schema = useEsqueceuSenhaSchema();
  const esqueceuSenhaMutation = usePostEsqueceuSenha();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEsqueceuSenhaRequest>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      rf: "",
    },
  });

  const rfValue = watch("rf");
  const isValidRF = rfValue && /^\d+$/.test(rfValue.trim());
  const isButtonDisabled = !isValidRF;

  const onFinish = async (values: IEsqueceuSenhaRequest) => {
    setAlert(null);
    
    esqueceuSenhaMutation.mutate(values, {
      onSuccess: (data: IEsqueceuSenhaResponse) => {
        navigate('/esqueci-minha-senha-sucesso', {
          state: {
            solicitacaoId: data.solicitacao_id,
            usuarioEmail: data.usuario?.email,
            usuarioNome: data.usuario?.nome,
            usuarioRf: data.usuario?.rf,
          }
        });
      },
      onError: (error: any) => {
        setAlert({ 
          type: 'error', 
          message: error.message || 'Erro ao enviar e-mail de recuperação. Tente novamente.' 
        });
      },
    });
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return {
    loading: esqueceuSenhaMutation.isPending,
    alert,

    control,
    handleSubmit: handleSubmit(onFinish),
    errors,

    isButtonDisabled,

    handleBackToLogin,
  };
};
