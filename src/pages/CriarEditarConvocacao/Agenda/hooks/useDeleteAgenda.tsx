import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";

export const useDeleteAgenda = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (uuid: string) =>
      API.Agenda.deleteAgenda(uuid).response,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAgendas"] });
      notification.success({
        message: "Agenda Removida",
        description: "A agenda foi removida com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro ao Remover Agenda",
        description: error?.message || "Ocorreu um erro ao remover a agenda. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });
};
