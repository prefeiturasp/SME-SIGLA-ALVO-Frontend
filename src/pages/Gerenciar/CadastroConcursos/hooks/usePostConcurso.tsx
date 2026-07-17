import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IConcursoPayload } from "../../../../services/resources/concursos/IConcursos";
import { ehErroNumeroProcessoDuplicado } from "../utils/erroConcurso";

export const usePostConcurso = (silencioso = false) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: Partial<IConcursoPayload>) =>
      API.Concursos.postConcurso(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listarConcursos"] });
      if (silencioso) return;
      notification.success({
        message: "Concurso cadastrado",
        description: "O concurso foi cadastrado com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error) => {

      if (ehErroNumeroProcessoDuplicado(error)) return;

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
