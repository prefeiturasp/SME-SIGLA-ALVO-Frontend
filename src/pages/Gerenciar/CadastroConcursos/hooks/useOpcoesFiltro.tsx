import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

// Busca todos os concursos (sem paginacao efetiva) e deriva as opcoes
// distintas de "Banca responsavel" e "Ano do edital" para os selects
// do filtro de busca.
export const useOpcoesFiltro = () => {
  const query = useQuery({
    queryKey: ["opcoesFiltroConcurso"],
    queryFn: ({ signal }) =>
      API.Concursos.listarConcursos(
        { pagination: { page: 1, page_size: 1000 }, filters: {} },
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const concursos = query.data?.results ?? [];

  const bancas = Array.from(
    new Set(
      concursos
        .map((c) => c.banca_responsavel)
        .filter((banca): banca is string => Boolean(banca && banca.trim()))
    )
  ).sort((a, b) => a.localeCompare(b));

  const anos = Array.from(
    new Set(
      concursos
        .map((c) => c.ano_edital)
        .filter((ano): ano is number => ano !== null && ano !== undefined)
    )
  ).sort((a, b) => b - a);

  const opcoesBanca = bancas.map((banca) => ({ value: banca, label: banca }));
  const opcoesAno = anos.map((ano) => ({ value: ano, label: String(ano) }));

  return { opcoesBanca, opcoesAno, isLoading: query.isLoading };
};
