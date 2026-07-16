import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import type { Dayjs } from "dayjs";
import * as yup from "yup";

export interface IPublicacoesResultadosFormFields {
  data_autorizacao: Dayjs;
  classificacao_final: Dayjs;
  data_abertura: Dayjs;
  link_edital: string;
  habilitados_geral: number;
  habilitados_nna: number;
  habilitados_pcd: number;
  retificacoes?: string;
}

const schema = yup.object({
  data_autorizacao: yup
    .mixed<Dayjs>()
    .required("Informe a data de autorização do concurso"),
  classificacao_final: yup
    .mixed<Dayjs>()
    .required("Informe a data da classificação final"),
  data_abertura: yup
    .mixed<Dayjs>()
    .required("Informe a data de abertura do concurso"),
  link_edital: yup
    .string()
    .trim()
    .url("Informe um link válido")
    .required("Informe o link do edital"),
  habilitados_geral: yup
    .number()
    .typeError("Informe a quantidade de habilitados (Geral)")
    .min(0, "A quantidade não pode ser negativa")
    .required("Informe a quantidade de habilitados (Geral)"),
  habilitados_nna: yup
    .number()
    .typeError("Informe a quantidade de habilitados (NNA)")
    .min(0, "A quantidade não pode ser negativa")
    .required("Informe a quantidade de habilitados (NNA)"),
  habilitados_pcd: yup
    .number()
    .typeError("Informe a quantidade de habilitados (PcD)")
    .min(0, "A quantidade não pode ser negativa")
    .required("Informe a quantidade de habilitados (PcD)"),
  retificacoes: yup.string().trim().optional(),
});

const valoresPadrao: Partial<IPublicacoesResultadosFormFields> = {
  link_edital: "",
  retificacoes: "",
};

export const usePublicacoesResultadosForm = (
  defaultValues?: Partial<IPublicacoesResultadosFormFields>
) => {
  return useForm<IPublicacoesResultadosFormFields>({
    resolver: yupResolver(schema) as Resolver<IPublicacoesResultadosFormFields>,
    mode: "onChange",
    defaultValues: { ...valoresPadrao, ...defaultValues },
  });
};
