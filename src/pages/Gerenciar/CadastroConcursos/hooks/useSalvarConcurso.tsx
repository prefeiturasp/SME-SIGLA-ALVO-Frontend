import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IConcursoPayload } from "../../../../services/resources/concursos/IConcursos";

export const usePostConcurso = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IConcursoPayload) =>
      API.Concursos.postConcurso(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarConcursos"] });
      notification.success({
        message: "Concurso cadastrado",
        description: "O concurso foi cadastrado com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro ao cadastrar",
        description:
          "Ocorreu um erro ao cadastrar o concurso. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};

export const usePatchConcurso = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: Partial<IConcursoPayload>;
    }) => API.Concursos.patchConcurso(uuid, payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarConcursos"] });
      notification.success({
        message: "Concurso atualizado",
        description: "As alterações foram salvas com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: () => {
      notification.error({
        message: "Erro ao salvar",
        description:
          "Ocorreu um erro ao salvar as alterações. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
