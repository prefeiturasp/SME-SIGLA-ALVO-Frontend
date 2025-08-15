import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import useListRequest, {
  removeUndefinedFields,
} from "../../../../hooks/useListRequest";

export const useProcessosConvocacao = () => {
  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const {
    data: processosConvocacaoData,
    isLoading: processosConvocacaoIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const handleSub = async (data: IFiltroProcessos) => {
    setListRequest((prevState) => ({
      ...prevState,
      page: 1,
      filters: removeUndefinedFields(data),
    }));
  };

  return {
    concursosOptions,
    concursosIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
  };
};
