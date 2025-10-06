import { useMutation } from "@tanstack/react-query";
import { postEsqueceuSenha } from "../../../services/resources/login/esqueceuSenha";
import type { IEsqueceuSenhaRequest } from "../../../services/resources/login/esqueceuSenha";

export const usePostEsqueceuSenha = () => {
  return useMutation({
    mutationFn: (payload: IEsqueceuSenhaRequest) => postEsqueceuSenha(payload).response,
    onSuccess: (data) => {
      console.log("E-mail de recuperação enviado:", data);
    },
    onError: (error: any) => {
      console.error("Erro ao enviar e-mail de recuperação:", error);
    },
  });
};
