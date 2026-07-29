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
  habilitados_geral?: number | null;
  habilitados_nna?: number | null;
  habilitados_pcd?: number | null;
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
    .typeError("Informe um número válido")
    .integer("A quantidade deve ser um número inteiro")
    .min(0, "A quantidade não pode ser negativa")
    .nullable()
    .optional(),
  habilitados_nna: yup
    .number()
    .typeError("Informe um número válido")
    .integer("A quantidade deve ser um número inteiro")
    .min(0, "A quantidade não pode ser negativa")
    .nullable()
    .optional(),
  habilitados_pcd: yup
    .number()
    .typeError("Informe um número válido")
    .integer("A quantidade deve ser um número inteiro")
    .min(0, "A quantidade não pode ser negativa")
    .nullable()
    .optional(),
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
