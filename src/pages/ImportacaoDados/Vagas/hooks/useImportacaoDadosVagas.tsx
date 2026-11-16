import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePostImportacaoArquivosVagas } from "./usePostImportacaoArquivosVagas";
import useImportacaoVagasSchema from "./useImportacaoVagasSchema";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";
import useImportacaoArquivosVagas from "./useImportacaoArquivosVagas";
import useListRequest from "../../../../hooks/useListRequest";
import useConvocacao from "../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import { useLayoutDownload } from "../../../../hooks/useLayoutDownload";
import { useMemo } from "react";

export const useImportacaoDadosVagas = () => {

  const defaultValues = {
    processo_convocacao: undefined,
    arquivo: null,
  };

  const importacaoVagasSchema = useImportacaoVagasSchema();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors: formErrors, isValid },
  } = useForm<IImportacaoVagasForm>({
    defaultValues,
    resolver: yupResolver(importacaoVagasSchema) as unknown as Resolver<IImportacaoVagasForm>,
    reValidateMode: "onChange",
    mode: "onChange",
    shouldFocusError: false,
  });

  const { listRequest,  onAntTableChange } =
    useListRequest({
      pagination: { page: 1, page_size: 10 },
    });

  // Query para buscar importações com parâmetros
  const { importacoesArquivosData, importacoesArquivosIsLoading, importacoesArquivosRefetch } = useImportacaoArquivosVagas(listRequest);
  
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

  // Mutation para post de importação de arquivos
  const postImportacaoArquivosVagasMutation = usePostImportacaoArquivosVagas({
    onSuccess: () => importacoesArquivosRefetch(),
  });

  const handleEnviarForm = async (data: IImportacaoVagasForm) => {
    const uuid = data.processo_convocacao!;
    const selected = (processosConvocacaoOptions || []).find((o: any) => o?.value === uuid);
    const label = selected?.label as string | undefined;

    const payload: IImportacaoVagasPayload = {
      processo_nome: label,
      processo_uuid: uuid,
      concurso_uuid: selected?.concurso_uuid as string | undefined,
      arquivo: data.arquivo!,
    };
    try {
      const result = await postImportacaoArquivosVagasMutation.mutateAsync(payload);
      console.log("Importação criada com sucesso:", result);
      reset(defaultValues);
    } catch (error) {
      console.error("Erro ao criar importação:", error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const handleFileUpload = (file: File) => {
    setValue("arquivo", file, { shouldValidate: true });
    clearErrors("arquivo");
  };
  const { handleBaixarArquivo, isDownloading } = useLayoutDownload();

  return {
    control,
    handleSubmit,
    formErrors,
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
    handleEnviarForm,
    handleReset,
    handleFileUpload,
    watch,
    isCreatingImportacao: postImportacaoArquivosVagasMutation.isPending,
    createImportacaoError: postImportacaoArquivosVagasMutation.error,
    isValid,
    listRequest,
    onAntTableChange,
    handleBaixarArquivo,
    isDownloading,
  };
};

