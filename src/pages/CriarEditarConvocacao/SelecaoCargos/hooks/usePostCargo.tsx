import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { ICargoProcesso } from "../../../../services/resources/convocacao/IConvocacao";

export const usePostCargo = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ processoUuid, payload }: { processoUuid: string; payload: Array<ICargoProcesso> }) =>
      API.Convocacao.postCargosProcesso(processoUuid, payload).response,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getCargosProcesso", variables.processoUuid] });
      notification.success({
        message: "Cargos salvos",
        description: "Os cargos foram salvos com sucesso!",
        placement: "top",
        duration: 2,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao salvar cargos",
        description: error?.message || "Não foi possível salvar os cargos no servidor.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};

