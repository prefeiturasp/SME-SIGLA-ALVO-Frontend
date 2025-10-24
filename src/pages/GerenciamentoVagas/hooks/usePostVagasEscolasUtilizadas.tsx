import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../services";

export type VagaUtilizada = { uuid: string; vagas_precarias_utilizadas: number; vagas_definitivas_utilizadas: number };

type UsePostVagasEscolasUtilizadasOptions = {
  onSuccess?: () => void;
};

export const usePostVagasEscolasUtilizadas = (
  options?: UsePostVagasEscolasUtilizadasOptions
) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: VagaUtilizada[]) =>
      API.Escolhas.patchVagasEscolasUtilizadas(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getDadosVagasNasEscolas"] });
      notification.success({
        message: "Vagas atualizadas",
        description: "As vagas utilizadas foram salvas com sucesso!",
        placement: "top",
        duration: 3.5,
      });
      options?.onSuccess?.();
    },
    onError: () => {
      notification.error({
        message: "Erro ao salvar",
        description: "Não foi possível salvar as vagas utilizadas.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


