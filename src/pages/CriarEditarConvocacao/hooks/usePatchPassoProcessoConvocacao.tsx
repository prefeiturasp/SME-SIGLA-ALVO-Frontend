import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../../../services";

export const usePatchPassoProcessoConvocacao = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ processoUuid, passo }: { processoUuid: string; passo: 1 | 2 | 3 | 4 }) =>
      API.Convocacao.patchAtualizarPassoProcesso(processoUuid, passo).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getProcessosConvocacao"] });
      queryClient.invalidateQueries({ queryKey: ["getProcessosConvocacaoOptions"] });
    },
  });
};
