import { useQuery } from "@tanstack/react-query";
import { API } from "../services";

export const useCargos = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["getCargos"],
    queryFn: ({ signal }) =>
      API.Cargos.getCargos({ signal }).response,
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });

  const opcoes = (data ?? []).map((cargo) => ({
    value: cargo.uuid,
    label: `${cargo.codigo} - ${cargo.nome}`,
  }));

  return { opcoes, isLoading };
};
