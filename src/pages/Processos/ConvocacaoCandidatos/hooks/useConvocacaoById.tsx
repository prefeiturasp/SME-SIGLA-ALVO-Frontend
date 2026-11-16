import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
 
const useConvocacaoById = (uuid: string) => {
 
    const {
        data: processoConvocacaoData,
        isLoading: processoConvocacaoIsLoading,
      } = useQuery({
        queryKey: ["getProcessoConvocacaoById", uuid],
        queryFn: ({ signal }) =>
          API.Convocacao.getProcessoConvocacaoById(uuid, { signal }).response,
        staleTime: 0,
        retry: 0,
      });

  return {
    processoConvocacaoData,
    processoConvocacaoIsLoading,
  };
};

export default useConvocacaoById;
