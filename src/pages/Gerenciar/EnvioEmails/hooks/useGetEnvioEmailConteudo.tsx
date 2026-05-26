import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { TipoEnvio } from "./useEnvioEmails";

type EnvioEmailConteudoResponse = Array<{ conteudo?: string; [key: string]: any }>;

const useGetEnvioEmailConteudo = (
  tipo: TipoEnvio | undefined,
  enabled: boolean = true
) => {
  const {
    data,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["getEnvioEmailConteudo", tipo],
    enabled: enabled && Boolean(tipo),
    queryFn: async ({ signal }) => {
      try {
        const resp = await API.EnvioEmails.getEnvioEmailConteudo(String(tipo), {
          signal,
        }).response;
        return resp as EnvioEmailConteudoResponse;
      } catch {
        return [] as EnvioEmailConteudoResponse;
      }
    },
    staleTime: 60_000,
    retry: 1,
  });

  const conteudo = Array.isArray(data) && data.length > 0 ? String(data[0]?.conteudo || "") : "";

  return {
    conteudo,
    isLoading,
    refetch,
  };
};

export default useGetEnvioEmailConteudo;

