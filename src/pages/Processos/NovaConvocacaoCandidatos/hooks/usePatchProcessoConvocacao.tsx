import { useMutation } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IPostProcessoConvocacaoPayload } from "../../../../services/resources/convocacao/IConvocacao";
import { App } from "antd";

export const usePatchProcessoConvocacao = () => {
  const { notification } = App.useApp();
  return useMutation({
    mutationFn: ({uuid,payload}: {uuid:string,payload: Partial<IPostProcessoConvocacaoPayload>}) =>
      API.Convocacao.patchProcessoConvocacao(uuid, payload).response,
    onSuccess: () => {
      notification.success({
        message: "Convocação Atualizada",
        description: "A convocação foi atualizada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro na Atualização da Convocação",
        description: "Ocorreu um erro ao atualizar a convocação dos dados. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


