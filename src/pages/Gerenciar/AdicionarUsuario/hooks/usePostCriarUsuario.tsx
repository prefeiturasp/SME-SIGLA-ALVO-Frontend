import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { postCriarUsuario } from "../../../../services/resources/usuarios";
import type { ICriarUsuarioRequest } from "../../../../services/resources/usuarios";

type UsePostCriarUsuarioOptions = {
  onSuccess?: () => void;
};

export const usePostCriarUsuario = (options?: UsePostCriarUsuarioOptions) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: ICriarUsuarioRequest) =>
      postCriarUsuario(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUsuariosComGrupos"] });
      notification.success({
        message: "Usuário Cadastrado",
        description: "O usuário foi cadastrado com sucesso!",
        placement: "top",
        duration: 3.5,
      });
      options?.onSuccess?.();
    },
  });
};
