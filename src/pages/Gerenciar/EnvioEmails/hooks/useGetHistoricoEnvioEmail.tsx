import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { IHistoricoEnvioEmail } from "../../../../services/resources/convocacao/IConvocacao";

const useHistoricoEnvioEmail = () => {
  const {
    data,
    isLoading: historicoIsLoading,
    refetch: historicoRefetch,
  } = useQuery({
    queryKey: ["getHistoricoEnvioEmail"],
    queryFn: async ({ signal }) => {
      try {
        const data = await API.Convocacao.getHistoricoEnvioEmail({ signal }).response;
        console.log(data);
        return data as unknown as IHistoricoEnvioEmail[];
      } catch {
        return [] as unknown as IHistoricoEnvioEmail[];
      }
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  return {
    historicoData: data,
    historicoIsLoading,
    historicoRefetch,
  };
};

export default useHistoricoEnvioEmail;
