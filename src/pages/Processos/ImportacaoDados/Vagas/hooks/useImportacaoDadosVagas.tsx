import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../../services";
import useImportacaoVagasSchema from "./useImportacaoVagasSchema";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";

export const useImportacaoDadosVagas = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const defaultValues = {
    cargo: undefined,
    arquivo: null,
    tipo: "VAGAS",
    metodo_de_importacao: 1,
   };

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
    resolver: yupResolver(useImportacaoVagasSchema()) as Resolver<IImportacaoVagasForm>,
    reValidateMode: "onChange",
    mode: "onChange",
    shouldFocusError: false,
  });

  // Mutation para post de importação de arquivos
  const postImportacaoArquivosMutation = useMutation({
    mutationFn: (payload: IImportacaoVagasPayload) => API.ImportacaoDados.postImportacaoArquivos(payload).response,
    onSuccess: () => {
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


  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading } = useQuery({
    queryKey: ["getImportacaoArquivosVagas"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getUltimasImportacoesArquivos(
        {
          tipo: "VAGAS",
        },
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const handleEnviarForm = async (data: IImportacaoVagasForm) => {
    console.error("Arquivo e cargo são obrigatórios", data);


    const payload: IImportacaoVagasPayload = {
      arquivo: data.arquivo!,
      tipo: "VAGAS",
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
    isValid
  };
};

