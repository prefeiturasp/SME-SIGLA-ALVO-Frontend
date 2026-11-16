import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IPostEnvioEmailPayload } from "../../../../services/resources/convocacao/IConvocacao";

export const usePostEnvioEmail = () => {
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IPostEnvioEmailPayload) =>
      API.Convocacao.postEnvioEmail(payload).response,
    onSuccess: () => {
      notification.success({
        message: "Envio de e-mails iniciado.",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error: unknown) => {
      const msg =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (error as Error)?.message ??
        "Ocorreu um erro ao enviar os e-mails. Tente novamente.";
      notification.error({
        message: "Erro ao iniciar envio",
        description: String(msg),
        placement: "top",
        duration: 3.5,
      });
    },
  });
};

export default usePostEnvioEmail;

