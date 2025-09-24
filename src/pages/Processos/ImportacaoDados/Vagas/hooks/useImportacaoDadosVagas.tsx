import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { usePostImportacaoArquivosVagas } from "./usePostImportacaoArquivosVagas";
import useImportacaoVagasSchema from "./useImportacaoVagasSchema";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";
import { MetodoImportacao } from "./types";
import useImportacaoArquivosVagas from "./useImportacaoArquivosVagas";
import useListRequest from "../../../../../hooks/useListRequest";

export const useImportacaoDadosVagas = () => {

  const defaultValues = {
    cargo: undefined,
    concurso_uuid: undefined,
    concurso_nome: undefined,
    arquivo: null,
    metodo_de_importacao: MetodoImportacao.WebService,
    opcoes_de_importacao:'Ajustar',
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

    if (data.metodo_de_importacao === MetodoImportacao.WebService) {
      console.log("A funcionalidade webservice ainda não foi impementada",data)
      return
    };
 
    const payload: IImportacaoVagasPayload = {
      concurso_nome: data.concurso_nome!,
      concurso_uuid: data.concurso_uuid!,
      arquivo: data.arquivo!,
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

  const handleConcursoSelecionado = (uuid: string | undefined, nome: string | undefined) => {
    setValue("concurso_uuid", uuid, { shouldValidate: true, shouldTouch: true });
    setValue("concurso_nome", nome, { shouldValidate: false });
    clearErrors("concurso_uuid");
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
    handleConcursoSelecionado,
    watch,
    isCreatingImportacao: postImportacaoArquivosVagasMutation.isPending,
    createImportacaoError: postImportacaoArquivosVagasMutation.error,
    isValid,
    listRequest,
    onAntTableChange
  };
};

