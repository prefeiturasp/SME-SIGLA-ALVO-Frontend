import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { ICargoProcesso } from "../../../../services/resources/convocacao/IConvocacao";

export const usePostCargo = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({
      processoUuid,
      payload,
      porcentagem_nna,
      porcentagem_pcd,
    }: {
      processoUuid: string;
      payload: Array<ICargoProcesso>;
      porcentagem_nna?: number;
      porcentagem_pcd?: number;
    }) =>
      {
        const body = {
          ...(typeof porcentagem_nna === "number" ? { porcentagem_nna } : {}),
          ...(typeof porcentagem_pcd === "number" ? { porcentagem_pcd } : {}),
          cargos: payload,
        };
        return API.Convocacao.postCargosProcesso(processoUuid, body as any).response;
      },
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

