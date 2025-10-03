import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { ILoginRequest } from "../../../services/resources/login";
import useLoginTelaSchema from "../useLoginTelaSchema";
import { usePostLogin } from "./usePostLogin";

export const useLogin = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const navigate = useNavigate();
  const schema = useLoginTelaSchema();
  const loginMutation = usePostLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      usuario: "",
      senha: "",
    },
  });

  const onFinish = async (values: ILoginRequest) => {
    setAlert(null);
    
    loginMutation.mutate(values, {
      onSuccess: () => {
        navigate("/");
      },
      onError: () => {
        setAlert({ type: 'error', message: 'Usuário ou senha inválidos.' });
      },
    });
  };

  return {
    // Estados
    loading: loginMutation.isPending,
    alert,
    
    // Form handling
    control,
    handleSubmit: handleSubmit(onFinish),
    errors,
  };
};
