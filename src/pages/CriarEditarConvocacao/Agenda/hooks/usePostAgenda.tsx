import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IAgendaCreate } from "../../../../services/resources/agenda/IAgenda";

export const usePostAgenda = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (payload: IAgendaCreate | IAgendaCreate[]) =>
      API.Agenda.postAgenda(payload).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAgendas"] });
      notification.success({
        message: "Agendas Criadas",
        description: "As agendas foram criadas com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao Criar Agendas",
        description: error?.message || "Ocorreu um erro ao criar as agendas. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};