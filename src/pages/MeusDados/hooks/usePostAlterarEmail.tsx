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
    onError: (error: any) => {
      const data = error?.response?.data;
      const fieldError = Array.isArray(data?.novo_email)
        ? data.novo_email[0]
        : undefined;
      const detail =
        typeof data?.detail === "string" ? data.detail : undefined;
      const mensagem =
        fieldError ?? detail ?? "Erro ao alterar o e-mail. Tente novamente.";

      notification.error({
        message: "Erro ao alterar e-mail",
        description: mensagem,
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
