import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { useQueryClient } from "@tanstack/react-query";
// import { App } from "antd";
// import { API } from "../../../../services";
import { usePostImportacaoArquivosHabilitados } from "./usePostImportacaoArquivosHabilitados";
import useImportacaoSchema from "./useImportacaoSchema";
import type { IImportacaoHabilitadosFiltros, IImportacaoHabilitadosPayload } from "./types";
import { useConcursos } from "../../../../hooks/useConcursos";
import useImportacoesArquivosHabilitados from "./useImportacoesArquivosHabilitados";
import useListRequest from "../../../../hooks/useListRequest";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import { useLayoutDownload } from "../../../../hooks/useLayoutDownload";


export const useImportacaoDados = () => {
  // const queryClient = useQueryClient();
  // const { notification } = App.useApp();
  const { concursosData } = useConcursos();
  
  const defaultValues = {
    concurso: undefined,
    arquivo: null,
    tipo: "HABILITADOS",
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<IImportacaoHabilitadosFiltros>({
    defaultValues,
    resolver: yupResolver(useImportacaoSchema()) as Resolver<IImportacaoHabilitadosFiltros>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const { listRequest, onAntTableChange } =
    useListRequest<IImportacaoHabilitadosFiltros>({
      pagination: { page: 1, page_size: 10 },
    });

  // Mutation para post de importação de arquivos (hook centralizado)
  const postImportacaoArquivosMutation = usePostImportacaoArquivosHabilitados();

  // Query para buscar importações com parâmetros
  const { importacoesArquivos, importacoesArquivosIsLoading } = useImportacoesArquivosHabilitados(listRequest);

  const handleEnviarForm = async (data: IImportacaoHabilitadosFiltros) => {
    if (!data.arquivo || !data.concurso) {
      console.error("Arquivo e concurso são obrigatórios");
      return;
    }

    // Buscar dados do concurso selecionado
    const concursosArray = Array.isArray(concursosData) ? concursosData : concursosData?.results || [];
    const concursoSelecionado = concursosArray.find((concurso: any) => concurso.value === data.concurso);

    if (!concursoSelecionado) {
      console.error("Concurso selecionado não encontrado");
      return;
    }

    const payload: IImportacaoHabilitadosPayload = {
      concurso_nome: concursoSelecionado.label,
      concurso_uuid: concursoSelecionado.value,
      arquivo: data.arquivo!,
      tipo: "HABILITADOS",
    };

    try {
      const result = await postImportacaoArquivosMutation.mutateAsync(payload);
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




  
  return {
    control,
    handleSubmit,
    formErrors,
    importacoesArquivos,
    importacoesArquivosIsLoading,
    handleEnviarForm,
    handleReset,
    handleFileUpload,
    watch,
    isCreatingImportacao: postImportacaoArquivosMutation.isPending,
    createImportacaoError: postImportacaoArquivosMutation.error,
    listRequest,
    onAntTableChange,
  };
};

