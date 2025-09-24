import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePostImportacaoArquivosVagas } from "./usePostImportacaoArquivosVagas";
import useImportacaoVagasSchema from "./useImportacaoVagasSchema";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";
import useImportacaoArquivosVagas from "./useImportacaoArquivosVagas";
import useListRequest from "../../../../../hooks/useListRequest";

export const useImportacaoDadosVagas = () => {

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



  const { listRequest,  onAntTableChange } =
    useListRequest({
      pagination: { page: 1, page_size: 10 },
    });

  // Query para buscar importações com parâmetros
  const { importacoesArquivosData, importacoesArquivosIsLoading, importacoesArquivosRefetch } = useImportacaoArquivosVagas(listRequest);

  // Mutation para post de importação de arquivos
  const postImportacaoArquivosVagasMutation = usePostImportacaoArquivosVagas({
    onSuccess: () => importacoesArquivosRefetch(),
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
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    handleEnviarForm,
    handleReset,
    handleFileUpload,
    watch,
    isCreatingImportacao: postImportacaoArquivosVagasMutation.isPending,
    createImportacaoError: postImportacaoArquivosVagasMutation.error,
    isValid,
    listRequest,
    onAntTableChange
  };
};

