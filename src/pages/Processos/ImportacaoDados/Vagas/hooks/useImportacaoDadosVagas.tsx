import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { API } from "../../../../../services";
import useImportacaoVagasSchema from "./useImportacaoVagasSchema";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";

export const useImportacaoDadosVagas = () => {
  const { notification } = App.useApp();

  const defaultValues = {
    cargo: undefined,
    arquivo: null,
    tipo: "VAGAS",
    metodo_de_importacao: 1,
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
    resolver: yupResolver(importacaoVagasSchema) as Resolver<IImportacaoVagasForm>,
    reValidateMode: "onChange",
    mode: "onChange",
    shouldFocusError: false,
  });

  // Query para buscar importações com parâmetros
  const { data: importacoesArquivos, isLoading: importacoesArquivosIsLoading, refetch: importacoesArquivosRefetch } = useQuery({
    queryKey: ["getImportacaoArquivosVagas"],
    queryFn: ({ signal }) =>
      API.ImportacaoDados.getUltimasImportacoesArquivosVagas(
        {
          tipo: "VAGAS",
        },
        { signal }
      ).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  // Mutation para post de importação de arquivos
  const postImportacaoArquivosVagasMutation = useMutation({
    mutationFn: (payload: IImportacaoVagasPayload) => API.ImportacaoDados.postImportacaoArquivosVagas(payload).response,
    onSuccess: () => {
      importacoesArquivosRefetch();
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



  const handleEnviarForm = async (data: IImportacaoVagasForm) => {

    if (data.metodo_de_importacao === 1) {
      console.log("A funcionalidade webservice ainda não foi impementada")
      return
    };


    const payload: IImportacaoVagasPayload = {
      arquivo: data.arquivo!,
      tipo: "VAGAS",
      opcoes_de_importacao:data.opcoes_de_importacao
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
    isCreatingImportacao: postImportacaoArquivosVagasMutation.isPending,
    createImportacaoError: postImportacaoArquivosVagasMutation.error,
    isValid
  };
};

