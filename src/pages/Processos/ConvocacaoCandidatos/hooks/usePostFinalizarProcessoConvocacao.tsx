import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";

export const usePostFinalizarProcessoConvocacao = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (uuid: string) =>
      API.Convocacao.postFinalizarProcessoConvocacao(uuid).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProcessosConvocacao"] });
      notification.success({
        message: "Processo finalizado com sucesso.",
        description:
          "A partir de agora só é permitido a visualização do processo.",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error: unknown) => {
      const detail =
        (error as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Não foi possível finalizar o processo. Tente novamente.";
      notification.error({
        message: "Erro ao finalizar processo",
        description: String(detail),
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
