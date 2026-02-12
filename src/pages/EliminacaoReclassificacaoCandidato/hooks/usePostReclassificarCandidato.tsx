import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import type { AxiosRequestConfig } from "axios";
import { postReclassificarCandidato } from "../../../services/resources/candidatos";

type Payload = { candidato_uuid: string; desclassificar_de: string; motivo: string };

export const usePostReclassificarCandidato = (axiosRequestConfig?: AxiosRequestConfig) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["postReclassificarCandidato"],
    mutationFn: async (payload: Payload) => {
      const { response } = postReclassificarCandidato(payload, axiosRequestConfig);
      return await response;
    },
    onSuccess: async () => {
      // Recarregar lista de habilitados
      await queryClient.invalidateQueries({ queryKey: ["getHabilitados"] });
      notification.success({
        message: "Candidato reclassificado com sucesso",
        placement: "top",
        duration: 2,
      });
    },
  });
};

