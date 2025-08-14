import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IFiltroProcessos } from "../../../services/resources/convocacao/IConvocacao";
import useConvocacaoSchema from "../useConvocacaoSchema";

export const defaultValues: IFiltroProcessos = {
  concurso: undefined,
  cargo: undefined,
  data_inicial: "",
  data_final: "",
};

export const useProcessosConvocacaoForm = () => {
  return useForm<IFiltroProcessos>({
    defaultValues,
    // resolver: yupResolver(useConvocacaoSchema()) as Resolver<IFiltroProcessos>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });
};
