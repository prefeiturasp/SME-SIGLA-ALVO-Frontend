import { useQuery } from "@tanstack/react-query";
import { API } from "../../../services";

export const useGetDREs = (enabled: boolean = false) => {
  const {
    data: dres,
    refetch: fetchDREs,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["getDREs"],
    queryFn: ({ signal }) =>
      API.Escolhas.getDREs({}, { signal }).response,
    enabled,
    staleTime: 0,
    retry: 0,
  });

  return {
    dres: dres?.results || [],
    isLoading,
    isFetching,
    error,
    fetchDREs,
  };
};

