import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { PaginatedResponse } from "../../../types/IListRequest";
import type { IEscolhaCandidato } from "../../../services/resources/escolhas/IEscolhas";
import type { UseGetEscolhasPorCandidatosParams } from "./types";

export const useGetEscolhasPorCandidatos = ({
  candidatoUuids,
  enabled = true,
  refreshToken = 0,
}: UseGetEscolhasPorCandidatosParams) => {
  const queryEnabled = enabled && candidatoUuids.length > 0;

  const {
    data: escolhasData,
    isLoading: escolhasIsLoading,
    isFetching: escolhasIsFetching,
    error: escolhasError,
    refetch: refetchEscolhas,
  } = useQuery<PaginatedResponse<IEscolhaCandidato> | IEscolhaCandidato[]>({
    queryKey: ["postEscolhasPorCandidatos", candidatoUuids, refreshToken],
    queryFn: ({ signal }) =>
      API.Escolhas.postBuscarEscolhasPorCandidatos(candidatoUuids, { signal })
        .response as Promise<PaginatedResponse<IEscolhaCandidato> | IEscolhaCandidato[]>,
    enabled: queryEnabled,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const escolhasList = useMemo<IEscolhaCandidato[]>(() => {
    if (!escolhasData) {
      return [];
    }

    if (Array.isArray(escolhasData)) {
      return escolhasData;
    }

    return escolhasData?.results ?? [];
  }, [escolhasData]);

  return {
    escolhasData,
    escolhasList,
    escolhasIsLoading,
    escolhasIsFetching,
    escolhasError,
    refetchEscolhas,
  };
};


