import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IListRequest } from "../../../../types/IListRequest";

const useGetImportacaoLotes = (listRequest: IListRequest) => {
  const { pagination, ...rest } = listRequest;

  const { data: importacaoLotes, isLoading: importacaoLotesIsLoading } = useQuery({
    queryKey: ["getImportacaoLotes", listRequest],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getImportacaoLotes(
        { ...pagination, ...rest },
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: "always",
    retry: 0,
  });

  return {
    importacaoLotes,
    importacaoLotesIsLoading,
  };
};

export default useGetImportacaoLotes;
