import { useMutation } from "@tanstack/react-query";
import { postNovaSenha } from "../../../services/resources/login/novaSenha";
import type { INovaSenhaRequest } from "../../../services/resources/login/novaSenha";

export const usePostNovaSenha = () => {
  return useMutation({
    mutationFn: (payload: INovaSenhaRequest) => postNovaSenha(payload).response,
    onSuccess: (data) => {
      console.log("Senha alterada com sucesso:", data);
    },
    onError: (error: any) => {
      console.error("Erro ao alterar senha:", error);
    },
  });
};

