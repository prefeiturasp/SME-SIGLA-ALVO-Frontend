import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import type { AxiosRequestConfig } from "axios";
import { postHabilitadoEliminar } from "../../../services/resources/candidatos";

type Payload = { candidato_uuid: string; motivo: string };

export const usePostHabilitadoEliminar = (axiosRequestConfig?: AxiosRequestConfig) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["postHabilitadoEliminar"],
    mutationFn: async (payload: Payload) => {
      const { response } = postHabilitadoEliminar(payload, axiosRequestConfig);
      return await response;
    },
    onSuccess: async () => {
      // Recarregar lista de habilitados
      await queryClient.invalidateQueries({ queryKey: ["getHabilitados"] });
      notification.success({
        message: "Candidato eliminado com sucesso",
        placement: "top",
        duration: 2,
      });
    },
  });
};

