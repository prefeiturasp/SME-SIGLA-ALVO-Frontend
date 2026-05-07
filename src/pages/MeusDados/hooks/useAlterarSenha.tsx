import { useMutation } from "@tanstack/react-query";
import { postAlterarSenha } from "../../../services/resources/usuarios";
import type { IAlterarSenhaRequest } from "../../../services/resources/usuarios";

export const useAlterarSenha = () => {
  return useMutation({
    mutationFn: (payload: IAlterarSenhaRequest) =>
      postAlterarSenha(payload).response,
  });
};
