import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IPostProcessoConvocacaoPayload } from "../../../../services/resources/convocacao/IConvocacao";

export const usePostProcessoConvocacao = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IPostProcessoConvocacaoPayload) =>
      API.Convocacao.postProcessoConvocacao(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProcessoConvocacao"] });
      notification.success({
        message: "Convocação Realizada",
        description: "A convocação dos dados foi processada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro na Convocação",
        description: "Ocorreu um erro ao processar a convocação dos dados. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


