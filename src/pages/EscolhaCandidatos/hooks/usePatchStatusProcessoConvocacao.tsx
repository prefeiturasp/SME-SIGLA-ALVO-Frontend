import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../../../services";

export const usePatchStatusProcessoConvocacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) =>
      API.Convocacao.patchProcessoConvocacao(uuid, {
        status: "EM_ANDAMENTO",
      }).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProcessosConvocacaoOptions"] });
    },
  });
};
