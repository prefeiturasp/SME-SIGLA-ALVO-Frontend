import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../../../../services";
import { message } from "antd";

export const useDeleteProcessoConvocacao = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deletarProcesso,
    isPending: isDeleting,
  } = useMutation({
    mutationFn: (uuid: string) =>
      API.Convocacao.deleteProcessoConvocacao(uuid).response,
    onSuccess: () => {
      message.success("Processo excluído com sucesso.");
      // Invalida todas as listagens de processos de convocação
      queryClient.invalidateQueries({ queryKey: ["getProcessosConvocacao"] });
    },
    onError: (err: any) => {
      const detail =
        err?.response?.data?.detail ||
        err?.message ||
        "Não foi possível excluir o processo.";
      message.error(detail);
    },
  });

  return {
    deletarProcesso,
    isDeleting,
  };
};

export default useDeleteProcessoConvocacao;

