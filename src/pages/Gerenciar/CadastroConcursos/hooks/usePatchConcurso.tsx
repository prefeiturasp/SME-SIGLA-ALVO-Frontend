import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IConcursoPayload } from "../../../../services/resources/concursos/IConcursos";
import { ehErroNumeroProcessoDuplicado } from "../utils/erroConcurso";

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
    onSuccess: (_data, { uuid }) => {
      queryClient.invalidateQueries({ queryKey: ["listarConcursos"] });
      queryClient.invalidateQueries({
        queryKey: ["getConcursoByUuid", uuid],
      });
      notification.success({
        message: "Concurso atualizado",
        description: "As alterações foram salvas com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error) => {
      // Erro de numero de processo duplicado ja e exibido inline no
      // formulario; nao exibir notificacao generica redundante.
      if (ehErroNumeroProcessoDuplicado(error)) return;

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
