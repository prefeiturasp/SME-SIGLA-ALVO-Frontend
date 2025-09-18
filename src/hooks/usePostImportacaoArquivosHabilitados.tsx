import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../services";
import type { IImportacaoHabilitadosPayload } from "../pages/ImportacaoDados/Habilitados/hooks/types";

export const usePostImportacaoArquivosHabilitados = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IImportacaoHabilitadosPayload) =>
      API.ImportacaoDados.postImportacaoArquivosHabilitados(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getImportacaoArquivosHabilitados"] });
      notification.success({
        message: "Importação Realizada",
        description: "A importação dos dados foi processada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro na Importação",
        description: "Ocorreu um erro ao processar a importação dos dados. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


