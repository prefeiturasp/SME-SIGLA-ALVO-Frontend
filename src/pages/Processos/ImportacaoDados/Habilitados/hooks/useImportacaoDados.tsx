import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../../services";
import useImportacaoSchema from "./useImportacaoSchema";
import type { IImportacaoHabilitadosFiltros, IImportacaoHabilitadosPayload } from "./types";
import { useConcursos } from "../../../NovaConvocacaoCandidatos/hooks/useConcursos";
// import type { IImportacaoRequest } from "../../../../../services/resources/importacaoDados/IImportacaoArquivos";

export const useImportacaoDados = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
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

  // Mutation para post de importação de arquivos
  const postImportacaoArquivosMutation = useMutation({
    mutationFn: (payload: IImportacaoHabilitadosPayload) => API.ImportacaoDados.postImportacaoArquivosHabilitados(payload).response,
    onSuccess: () => {
      console.log("Sucesso");
      // Invalidar queries relacionadas após sucesso
      queryClient.invalidateQueries({ queryKey: ["getImportacaoArquivosHabilitados"] });
      
      // Mostrar notificação de sucesso
      notification.success({
        message: "Importação Realizada",
        description: "A importação dos dados foi processada com sucesso!",
        placement: "top",
        duration: 3.5,
      });
    },
    onError: (e) => {
      console.log("Erro capturado:", e);
      notification.error({
        message: "Erro na Importação",
        description: "Ocorreu um erro ao processar a importação dos dados. Tente novamente.",
        placement: "top",
        duration: 3.5,
      });
    },
  });

  // Effect para mostrar notificação de erro
  // useEffect(() => {
  //   if (postImportacaoArquivosMutation.error) {
  //     notification.error({
  //       message: "Erro na Importação",
  //       description: "Ocorreu um erro ao processar a importação dos dados. Tente novamente.",
  //       placement: "top",
  //       duration: 3.5,
  //     });
  //   }
  // }, [postImportacaoArquivosMutation.error]);

  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getImportacaoArquivosHabilitados"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getImportacaoArquivos(
         { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

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
  };
};

