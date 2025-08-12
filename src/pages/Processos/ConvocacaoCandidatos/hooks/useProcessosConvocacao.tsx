// src/pages/ProcessosConvocacao/hooks/useProcessosConvocacao.ts
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { API } from "../../../../services";
import useConvocacaoSchema from "../useConvocacaoSchema";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import useListRequest from "../../../../hooks/useListRequest";

export const useProcessosConvocacao = () => {
  const defaultValues: IFiltroProcessos = {
    concurso: undefined,
    cargo: undefined,
    data_inicial: "",
    data_final: "",
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors: formErrors },
  } = useForm<IFiltroProcessos>({
    defaultValues,
    resolver: yupResolver(useConvocacaoSchema()) as Resolver<IFiltroProcessos>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosData"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosData({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const selectedConcurso = concursosOptions?.find(
    (c) => c.value === watch("concurso")
  );

  const {
    data: processosConvocacaoData,
    isLoading: processosConvocacaoIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const handleSub = async (data: IFiltroProcessos) => {
    setListRequest((prevState) => ({
      ...prevState,
      filters: data,
    }));
  };

  const handleReset = () => {
    reset(defaultValues);
    handleSub(defaultValues);
  };

  return {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosIsLoading,
    selectedConcurso,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    dayjs,
    watch,
  };
};
