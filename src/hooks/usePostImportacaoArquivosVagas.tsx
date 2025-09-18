import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../services";
import type { IImportacaoVagasPayload } from "../pages/ImportacaoDados/Vagas/hooks/types";

type UsePostImportacaoArquivosVagasOptions = {
  onSuccess?: () => void;
};

export const usePostImportacaoArquivosVagas = (
  options?: UsePostImportacaoArquivosVagasOptions
) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IImportacaoVagasPayload) =>
      API.ImportacaoDados.postImportacaoArquivosVagas(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getImportacaoArquivosVagas"] });
      notification.success({
        message: "Importação Realizada",
        description: "A importação dos dados foi processada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
      options?.onSuccess?.();
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


