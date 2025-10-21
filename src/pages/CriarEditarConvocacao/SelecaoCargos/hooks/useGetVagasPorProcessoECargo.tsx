import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import useListRequest from "../../../../hooks/useListRequest";
import type { IEscolhasFiltro } from "../../../../services/resources/escolhas/IEscolhas";

export const useGetVagasPorProcessoECargo = (  
  processoUuid?: string,
  cargoCodigo?: string,
  enabled: boolean = true
) => {
  const { listRequest } = useListRequest<IEscolhasFiltro>({
    pagination: { page: 1, page_size: 10 },
  });

  const { data: vagasData, isLoading: vagasIsLoading, refetch: vagasRefetch } = useQuery({
    queryKey: ["getVagasPorProcessoECargo", processoUuid, cargoCodigo],
    queryFn: ({ signal }) =>
      API.Escolhas.getVagasEscolas(
        { processo_uuid: processoUuid!, cargo_codigo: cargoCodigo! },
        listRequest,  
        { signal }
      ).response,
    enabled: enabled && !!processoUuid && !!cargoCodigo,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const buscarVagas = () => {
    if (processoUuid && cargoCodigo) {
      vagasRefetch();
    }
  };
  
  return {
    vagasData,
    vagasIsLoading,
    buscarVagas,
    totalVagas: vagasData?.total_vagas || 0,
  };
};
