import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { AxiosRequestConfig } from "axios";

const useGetProcessosConvocacaoPorUUID = (uuid: string, axiosRequestConfig?: AxiosRequestConfig) => {
  console.log('uuid', uuid);
  const { data: processoConvocacaoData, isLoading: processoConvocacaoIsLoading } = useQuery({
    queryKey: ["getProcessoConvocacaoPorUUID", uuid],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessoConvocacaoPorUUID(
         uuid,
         { signal, ...axiosRequestConfig }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
    enabled: !!uuid, // Só executa se uuid não for vazio/undefined
  });

  console.log('processoConvocacaoData', processoConvocacaoData);
  return {
    processoConvocacaoData,
    processoConvocacaoIsLoading,
  };
};

export { useGetProcessosConvocacaoPorUUID };