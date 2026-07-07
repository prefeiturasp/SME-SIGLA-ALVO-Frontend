import { useQuery } from "@tanstack/react-query";
import { API } from "../services";

// Traz todos os cargos de uma vez (sem busca no servidor) para popular
// selects com filtragem em memoria. O page_size grande garante que a
// listagem venha completa em uma unica requisicao.
const TAMANHO_PAGINA_TODOS = 10000;

export const useCargos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getCargos"],
    queryFn: ({ signal }) =>
      API.Cargos.getCargos("", TAMANHO_PAGINA_TODOS, { signal }).response,
    staleTime: 1000 * 60 * 5, // 5 minutos
    retry: 0,
  });

  const opcoes = (data?.results ?? []).map((cargo) => ({
    value: cargo.uuid,
    label: `${cargo.codigo} - ${cargo.nome}`,
  }));

  return { opcoes, isLoading };
};
