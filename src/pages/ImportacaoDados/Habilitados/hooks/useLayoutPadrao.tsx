import { useQuery } from "@tanstack/react-query";
import { getLayoutArquivos } from "../../../../services/resources/importacaoDados";
import type { ILayoutPadrao } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";

interface UseLayoutPadraoProps {
  tipo: string;
  enabled?: boolean;
}

export const useLayoutPadrao = ({ tipo, enabled = true }: UseLayoutPadraoProps) => {
  const {
    data: layoutData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["layoutPadrao", tipo],
    queryFn: async (): Promise<ILayoutPadrao> => {
      const { response } = getLayoutArquivos(tipo);
      return response;
    },
    enabled: enabled && !!tipo,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  return {
    layoutData,
    isLoading,
    error,
    refetch,
  };
};
