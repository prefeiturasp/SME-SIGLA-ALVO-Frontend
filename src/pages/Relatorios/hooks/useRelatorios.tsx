import { useProcessosConvocacaoOptions } from "../../Processos/ConvocacaoCandidatos/hooks/useProcessosConvocacaoOptions";

export const useRelatorios = () => {
  const {
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
  } = useProcessosConvocacaoOptions();

  return {
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
  };
};


