import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { IHistoricoCandidatosItem } from "../../../services/resources/convocacao/IConvocacao";

export function usePostHistoricoCandidatos(processosUuids: string[]) {
  const uuidsOrdenados = useMemo(
    () => [...processosUuids].filter(Boolean).sort(),
    [processosUuids],
  );

  return useQuery({
    queryKey: ["postHistoricoCandidatos", uuidsOrdenados],
    queryFn: async ({ signal }) => {
      const resposta = await API.Convocacao.postHistoricoCandidatos(
        { processos_uuids: uuidsOrdenados },
        { signal },
      ).response;
      return resposta as IHistoricoCandidatosItem[];
    },
    enabled: uuidsOrdenados.length > 0,
    staleTime: 0,
    retry: 1,
  });
}

export default usePostHistoricoCandidatos;
