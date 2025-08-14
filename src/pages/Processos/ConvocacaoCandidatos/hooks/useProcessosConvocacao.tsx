 

// src/pages/ProcessosConvocacao/hooks/useProcessosConvocacao.ts
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";
import useConvocacaoSchema from "../useConvocacaoSchema";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import useListRequest, { removeUndefinedFields } from "../../../../hooks/useListRequest";

export const useProcessosConvocacao = () => {
  const defaultValues: IFiltroProcessos = {
 
  };

  const form= useForm<IFiltroProcessos>({
    defaultValues,
    resolver: yupResolver(useConvocacaoSchema()) as Resolver<IFiltroProcessos>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });


  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors: formErrors },
  } =form

  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });


  const concursosQuery = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) => API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const processosQuery = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) => API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });


 
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
      page:1,
    filters: removeUndefinedFields(data),
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
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    watch,
    form,
    processosQuery,
    concursosQuery
  };
};


