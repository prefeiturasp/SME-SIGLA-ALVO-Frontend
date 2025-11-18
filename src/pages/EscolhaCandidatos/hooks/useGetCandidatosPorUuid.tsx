import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { IBuscarPorUuidsResponse } from "../../../services/resources/candidatos/ICandidatos";
import type {
  UseGetCandidatosPorUuidParams,
  UseGetCandidatosPorUuidOptions,
} from "./types";

export const useGetCandidatosPorUuid = (
  params: UseGetCandidatosPorUuidParams,
  options?: UseGetCandidatosPorUuidOptions
) => {
  const queryEnabled =
    (options?.enabled ?? false) &&
    Boolean(params.uuids && params.uuids.length > 0);

  const queryArgs = [
    "getCandidatosPorUuid",
    params.uuids,
    params.refreshToken ?? 0,
  ] as const;

  const {
    data: candidatosData,
    isLoading: candidatosIsLoading,
    isFetching: candidatosIsFetching,
    error: candidatosError,
    refetch: refetchCandidatos,
  } = useQuery<IBuscarPorUuidsResponse>({
    queryKey: queryArgs,
    queryFn: ({ signal }) =>
      API.Candidatos.postBuscarPorUuids(
        { uuids: params.uuids },
        { signal }
      ).response as Promise<IBuscarPorUuidsResponse>,
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  return {
    candidatosData,
    candidatosIsLoading,
    candidatosIsFetching,
    candidatosError,
    refetchCandidatos,
  };
};

