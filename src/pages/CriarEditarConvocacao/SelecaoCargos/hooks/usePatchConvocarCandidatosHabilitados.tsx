import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";

type PatchCandidatosPayload = {
  concurso_uuid: string;
  processo_uuid: string;
  candidatos: string[];
  foi_convocado: boolean;
};

export const usePatchConvocarCandidatosHabilitados = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: PatchCandidatosPayload) =>
      API.Candidatos.patchCandidatosHabilitadosConvocados(payload).response,
    onSuccess: () => {
      // invalidar lista de habilitados
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "getCandidatosHabilitados",
      });
      notification.success({
        message: "Candidatos convocados",
        description: "Lista de candidatos convocados atualizada.",
        placement: "top",
        duration: 2,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao atualizar habilitados",
        description: error?.message || "Não foi possível atualizar os candidatos habilitados.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};


export const usePatchDesconvocarCandidatosHabilitados = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: { codigo_cargo: string; processo_uuid: string; }) =>
      API.Candidatos.patchCandidatosHabilitadosDesconvocados(payload).response,
    onSuccess: () => {
      // invalidar lista de habilitados
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "getCandidatosHabilitados",
      });
      notification.success({
        message: "Candidatos desconvocados",
        description: "Lista de candidatos desconvocados atualizada.",
        placement: "top",
        duration: 2,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao desconvocar candidatos habilitados",
        description: error?.message || "Não foi possível desconvocar os candidatos habilitados.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};

