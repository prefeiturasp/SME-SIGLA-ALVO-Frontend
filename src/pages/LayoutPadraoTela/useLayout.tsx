import { useQuery } from "@tanstack/react-query";
import { API } from "../../services";


const useLayout = (tipo: string) => {
  // Query para buscar importações com parâmetros
  const { data: dataLayout, isLoading: layoutIsLoading } = useQuery({
    queryKey: ["getLayout"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getLayout(
        {
          tipo: tipo,
        },
        { signal }
      ).response,
    staleTime: 0,
    retry: 0,
  });

  return {
    dataLayout,
    layoutIsLoading,
  };
};

export default useLayout;


