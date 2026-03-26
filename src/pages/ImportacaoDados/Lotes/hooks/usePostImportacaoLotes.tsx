import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IImportacaoLotesPayload } from "./types";

export const usePostImportacaoLotes = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IImportacaoLotesPayload) =>
      API.ImportacaoDados.postImportacaoLotes({
        arquivo: payload.arquivo,
        concurso_uuid: payload.concurso_uuid,
        concurso_nome: payload.concurso_nome,
      }).response,
    onSuccess: () => {
      notification.success({
        message: "Importação Realizada",
        description: "A importação dos lotes foi processada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro na Importação",
        description: "Ocorreu um erro ao processar a importação dos lotes. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["getImportacaoLotes"] });
    },
  });
};
