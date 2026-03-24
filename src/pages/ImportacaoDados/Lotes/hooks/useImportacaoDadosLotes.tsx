import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useConcursos } from "../../../../hooks/useConcursos";
import useListRequest from "../../../../hooks/useListRequest";
import useImportacaoLotesSchema from "./useImportacaoLotesSchema";
import { usePostImportacaoLotes } from "./usePostImportacaoLotes";
import useGetImportacaoLotes from "./useGetImportacaoLotes";
import type { IImportacaoLotesFiltros, IImportacaoLotesPayload } from "./types";

export const useImportacaoDadosLotes = () => {
  const { concursosData } = useConcursos();

  const defaultValues: IImportacaoLotesFiltros = {
    concurso: undefined,
    arquivo: null,
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<IImportacaoLotesFiltros>({
    defaultValues,
    resolver: yupResolver(useImportacaoLotesSchema()) as Resolver<IImportacaoLotesFiltros>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const { listRequest, onAntTableChange } =
    useListRequest<IImportacaoLotesFiltros>({
      pagination: { page: 1, page_size: 10 },
    });

  const postMutation = usePostImportacaoLotes();
  const { importacaoLotes, importacaoLotesIsLoading } = useGetImportacaoLotes(listRequest);

  const handleEnviarForm = async (data: IImportacaoLotesFiltros) => {
    if (!data.arquivo || !data.concurso) return;

    const concursosArray = Array.isArray(concursosData)
      ? concursosData
      : concursosData?.results || [];
    const concursoSelecionado = concursosArray.find(
      (c: any) => c.value === data.concurso
    );

    if (!concursoSelecionado) return;

    const payload: IImportacaoLotesPayload = {
      concurso_nome: concursoSelecionado.label,
      concurso_uuid: concursoSelecionado.value,
      arquivo: data.arquivo!,
    };

    try {
      await postMutation.mutateAsync(payload);
      reset(defaultValues);
    } catch (error) {
      console.error("Erro ao importar lotes:", error);
    }
  };

  const handleFileUpload = (file: File) => {
    setValue("arquivo", file, { shouldValidate: true });
    clearErrors("arquivo");
  };

  return {
    control,
    handleSubmit,
    formErrors,
    importacaoLotes,
    importacaoLotesIsLoading,
    handleEnviarForm,
    handleFileUpload,
    watch,
    isCreating: postMutation.isPending,
    listRequest,
    onAntTableChange,
  };
};
