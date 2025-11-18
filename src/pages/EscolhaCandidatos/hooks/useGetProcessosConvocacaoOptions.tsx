import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";
import type { IBackendWithSubOptions } from "../../../types/IListRequest";

export const useGetProcessosConvocacaoOptions = () => {
  const {
    data: processosConvocacaoOptions,
    isLoading: processosConvocacaoOptionsIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacaoOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacaoOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const safeOptions = Array.isArray(processosConvocacaoOptions)
    ? processosConvocacaoOptions
    : processosConvocacaoOptions
      ? [processosConvocacaoOptions]
      : [];

  return {
    processosConvocacaoOptions:
      safeOptions as IBackendWithSubOptions[],
    processosConvocacaoOptionsIsLoading,
  };
};


