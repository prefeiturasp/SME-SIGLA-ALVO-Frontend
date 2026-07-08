import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IConcursoFiltros } from "../../../../services/resources/concursos/IConcursos";

export const useListarConcursos = (
  filtros: IConcursoFiltros,
  page: number,
  pageSize = 10
) => {
  const query = useQuery({
    queryKey: ["listarConcursos", filtros, page, pageSize],
    queryFn: ({ signal }) =>
      API.Concursos.listarConcursos(
        { pagination: { page, page_size: pageSize }, filters: filtros },
        { signal }
      ).response,
    placeholderData: keepPreviousData,
    retry: 0,
    staleTime: 0,
  });

  return {
    concursos: query.data?.results ?? [],
    total: query.data?.count ?? 0,
    isLoading: query.isLoading || query.isFetching,
  };
};
