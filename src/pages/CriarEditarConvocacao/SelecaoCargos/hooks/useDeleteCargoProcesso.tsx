import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";

export const useDeleteCargoProcesso = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ processoUuid, cargoUuid }: { processoUuid: string; cargoUuid: string }) =>
      API.Convocacao.deleteCargoProcesso(processoUuid, cargoUuid).response,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getCargosProcesso", variables.processoUuid] });
      notification.success({
        message: "Cargo removido",
        description: "O cargo foi removido com sucesso do processo.",
        placement: "top",
        duration: 2,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao remover cargo",
        description: error?.message || "Não foi possível remover o cargo do processo.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


