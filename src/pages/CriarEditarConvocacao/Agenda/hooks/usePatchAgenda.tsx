import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IAgendaCreate } from "../../../../services/resources/agenda/IAgenda";

export const usePatchAgenda = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: Partial<IAgendaCreate> }) =>
      API.Agenda.patchAgenda(uuid, payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAgendas"] });
      notification.success({
        message: "Agenda Atualizada",
        description: "A agenda foi atualizada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao Atualizar Agenda",
        description: error?.message || "Ocorreu um erro ao atualizar a agenda. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
