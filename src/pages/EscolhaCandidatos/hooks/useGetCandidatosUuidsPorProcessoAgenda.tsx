import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type {
  UseGetCandidatosUuidsPorProcessoAgendaParams,
  UseGetCandidatosUuidsPorProcessoAgendaOptions,
} from "./types";

export const useGetCandidatosUuidsPorProcessoAgenda = (
  params: UseGetCandidatosUuidsPorProcessoAgendaParams,
  options?: UseGetCandidatosUuidsPorProcessoAgendaOptions
) => {
  const queryEnabled =
    (options?.enabled ?? false) &&
    Boolean(params.processoUuid && params.agendaUuid);

  const queryArgs = [
    "getCandidatosUuids",
    params.processoUuid,
    params.agendaUuid,
    params.cargoCodigo,
    params.cargoUuid,
    params.refreshToken ?? 0,
  ] as const;

  const {
    data: candidatosIniciaisData,
    isLoading: candidatosIniciaisIsLoading,
    isFetching: candidatosIniciaisIsFetching,
    error: candidatosIniciaisError,
    refetch: refetchCandidatosIniciais,
  } = useQuery({
    queryKey: queryArgs,
    queryFn: ({ signal }) =>
      API.Candidatos.getCandidatos({
        signal,
        params: {
          page: 1,
          page_size: 10000,
          processo_uuid: params.processoUuid,
          agenda_uuid: params.agendaUuid,
          codigo_cargo: params.cargoCodigo,
          cargo_uuid: params.cargoUuid,
        },
      }).response as Promise<{
        results?: Array<{
          uuid?: string;
          candidato_uuid?: string;
          candidato?: { uuid?: string };
          id?: string;
        }>;
      }>,
    enabled: queryEnabled,
    retry: 0,
  });

  return {
    candidatosIniciaisData,
    candidatosIniciaisIsLoading,
    candidatosIniciaisIsFetching,
    candidatosIniciaisError,
    refetchCandidatosIniciais,
  };
};

