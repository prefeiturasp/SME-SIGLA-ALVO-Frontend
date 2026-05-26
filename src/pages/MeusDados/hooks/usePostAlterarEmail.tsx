import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { postAlterarEmail } from "../../../services/resources/usuarios";
import type { IAlterarEmailRequest } from "../../../services/resources/usuarios";

export const useAlterarEmail = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IAlterarEmailRequest) =>
      postAlterarEmail(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meus-dados"] });
      notification.success({
        message: "E-mail Alterado",
        description: "O e-mail foi alterado com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
