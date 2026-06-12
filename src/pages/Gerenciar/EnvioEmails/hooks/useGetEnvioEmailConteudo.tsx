import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import type { TipoEnvio } from "./useEnvioEmails";

export type EnvioEmailConteudoRegistro = {
  conteudo?: string;
  conteudo_gabarito?: string;
  assunto?: string;
  [key: string]: unknown;
};

type EnvioEmailConteudoResponse = EnvioEmailConteudoRegistro[];

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

  const registro = Array.isArray(data) && data.length > 0 ? data[0] : null;

  return {
    registro,
    conteudo: registro?.conteudo ? String(registro.conteudo) : "",
    conteudoGabarito: registro?.conteudo_gabarito ? String(registro.conteudo_gabarito) : "",
    assunto: registro?.assunto ? String(registro.assunto) : "",
    isLoading,
    refetch,
  };
};

export default useGetEnvioEmailConteudo;
