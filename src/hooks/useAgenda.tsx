// src/pages/Processos/NovaConvocacaoCandidatos/hooks/useConcursos.tsx
import { useQuery } from "@tanstack/react-query";
import { API } from "../services";

export const useAgenda= (processoUuid: string) => {
  const { data: agendaData, isLoading: agendaIsLoading } = useQuery({
    queryKey: ["getAgenda", processoUuid],
    queryFn: ({ signal }) =>
      API.Agenda.getAgenda(processoUuid, { signal }).response,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 0,
  });
  return {
    agendaData: agendaData || [],
    agendaIsLoading
  };
};
