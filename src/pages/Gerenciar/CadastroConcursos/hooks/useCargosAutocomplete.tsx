import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

export const useCargosAutocomplete = () => {
  const [termo, setTermo] = useState("");

  const query = useQuery({
    queryKey: ["cargosAutocomplete", termo],
    queryFn: ({ signal }) => API.Cargos.getCargos(termo, { signal }).response,
    enabled: termo.trim().length > 0,
    staleTime: 1000 * 60,
    retry: 0,
  });

  const opcoes = (query.data?.results ?? []).map((cargo) => ({
    value: cargo.uuid,
    label: `${cargo.codigo} - ${cargo.nome}`,
  }));

  return { opcoes, buscar: setTermo, isFetching: query.isFetching };
};
