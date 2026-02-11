import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useImportacaoEscolhasSchema from "./useImportacaoEscolhasSchema";
import type { IImportacaoVagasForm } from "../../Vagas/hooks/types";
import useListRequest from "../../../../hooks/useListRequest";
import useConvocacao from "../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../services";
import type { IImportacaoEscolhasPayload } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";
import useImportacaoArquivosEscolhas from "./useImportacaoArquivosEscolhas";

export const useImportacaoDadosEscolhas = () => {
  const defaultValues = {
    processo_convocacao: undefined,
    arquivo: null,
  };

  const importacaoEscolhasSchema = useImportacaoEscolhasSchema();
  const { notification } = App.useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isValid },
  } = useForm<IImportacaoVagasForm>({
    defaultValues,
    resolver: yupResolver(importacaoEscolhasSchema) as unknown as Resolver<IImportacaoVagasForm>,
    reValidateMode: "onChange",
    mode: "onChange",
    shouldFocusError: false,
  });

  // Query para buscar processos de convocação com paginação grande (igual à aba de Vagas Escolas)
  const { listRequest: paramsProcessosConvocacao } = useListRequest<{}>({
    pagination: { page: 1, page_size: 100 },
  });
  const {
    processosConvocacaoData,
    processosConvocacaoIsLoading
  } = useConvocacao(paramsProcessosConvocacao);

  // Transformar os dados de processos em opções para o select
  const processosConvocacaoOptions = useMemo(() => {
    if (!processosConvocacaoData?.results) {
      return [];
    }
    return processosConvocacaoData.results.map((processo: any) => ({
      value: processo.uuid,
      label: processo.descricao,
      concurso_uuid: processo.concurso_uuid,
    }));
  }, [processosConvocacaoData]);

  const processosConvocacaoOptionsIsLoading = processosConvocacaoIsLoading;

  // Query para buscar importações com parâmetros (para histórico)
  const { listRequest: listRequestImportacoes } = useListRequest({
    pagination: { page: 1, page_size: 10 },
  });
  
  const { 
    importacoesArquivosData, 
    importacoesArquivosIsLoading, 
    importacoesArquivosRefetch 
  } = useImportacaoArquivosEscolhas(listRequestImportacoes);

  // Mutation para importação de escolhas
  const importacaoMutation = useMutation({
    mutationFn: (payload: IImportacaoEscolhasPayload) =>
      API.ImportacaoDados.postImportacaoEscolhas(payload).response,
    onSuccess: (data) => {
      notification.success({
        message: "Importação Realizada",
        description: "Importação realizada com sucesso!",
        placement: "top",
        duration: 4,
      });
      reset(defaultValues);
      importacoesArquivosRefetch();
    },
    onError: (error: any) => {
      notification.error({
        message: "Erro na Importação",
        description: "Erro na importação. Tente novamente.",
        placement: "top",
        duration: 5,
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleEnviarForm = async (data: IImportacaoVagasForm) => {
    if (!data.processo_convocacao) {
      notification.error({
        message: "Erro de Validação",
        description: "Selecione um processo de convocação.",
        placement: "top",
        duration: 3,
      });
      return;
    }

    // Buscar o processo selecionado para obter o concurso_uuid
    const processoSelecionado = processosConvocacaoData?.results?.find(
      (p: any) => p.uuid === data.processo_convocacao
    );

    if (!processoSelecionado) {
      notification.error({
        message: "Erro de Validação",
        description: "Processo de convocação não encontrado.",
        placement: "top",
        duration: 3,
      });
      return;
    }

    if (!processoSelecionado.concurso_uuid) {
      notification.error({
        message: "Erro de Validação",
        description: "O processo selecionado não possui concurso_uuid.",
        placement: "top",
        duration: 3,
      });
      return;
    }

    setIsSubmitting(true);

    // Preparar payload - processo_id será buscado pelo backend automaticamente se não fornecido
    const payload: IImportacaoEscolhasPayload = {
      processo_uuid: data.processo_convocacao,
      // processo_id é opcional - o backend buscará automaticamente a partir do processo_uuid
      concurso_uuid: processoSelecionado.concurso_uuid,
    };

    importacaoMutation.mutate(payload);
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return {
    control,
    handleSubmit,
    formErrors,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
    handleEnviarForm,
    handleReset,
    isValid,
    isSubmitting: isSubmitting || importacaoMutation.isPending,
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    listRequest: listRequestImportacoes,
    onAntTableChange: (pagination: any) => {
      listRequestImportacoes.pagination.page = pagination.current || 1;
      listRequestImportacoes.pagination.page_size = pagination.pageSize || 10;
      importacoesArquivosRefetch();
    },
  };
};

