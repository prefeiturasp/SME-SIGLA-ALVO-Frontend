import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IImportacaoEscolhasPayload } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";

interface UsePostImportacaoEscolhaOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onSettled?: () => void;
}

const usePostImportacaoEscolha = (options?: UsePostImportacaoEscolhaOptions) => {
  const { notification } = App.useApp();

  const importacaoMutation = useMutation({
    mutationFn: (payload: IImportacaoEscolhasPayload) =>
      API.ImportacaoDados.postImportacaoEscolhas(payload).response,
    onSuccess: (data) => {
      notification.success({
        message: "Importação Realizada",
        description: "Importação realizada com sucesso!",
        placement: "top",
        duration: 4,
      });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro na Importação",
        description: "Erro na importação. Tente novamente.",
        placement: "top",
        duration: 5,
      });
      options?.onError?.(error);
    },
    onSettled: () => {
      options?.onSettled?.();
    },
  });

  return {
    importacaoMutation,
    isPending: importacaoMutation.isPending,
  };
};

export default usePostImportacaoEscolha;

