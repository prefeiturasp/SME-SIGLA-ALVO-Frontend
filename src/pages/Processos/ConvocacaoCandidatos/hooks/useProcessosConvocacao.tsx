// src/pages/ProcessosConvocacao/hooks/useProcessosConvocacao.ts
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import useConvocacaoSchema from "../useConvocacaoSchema";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import useListRequest, { removeUndefinedFields } from "../../../../hooks/useListRequest";
import { useConcursosOptions } from "./useConcursosOptions";
import useConvocacao from "./useConvocacao";

export const useProcessosConvocacao = () => {
  const defaultValues: IFiltroProcessos = {
 
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

  const { concursosOptions, concursosOptionsIsLoading } = useConcursosOptions()


  const {
    processosConvocacaoData,
    processosConvocacaoIsLoading
  } = useConvocacao(listRequest);

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
    concursosOptionsIsLoading,
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
