import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import type { Dayjs } from "dayjs";
import * as yup from "yup";

export interface IVigenciaFormFields {
  data_homologacao: Dayjs;
  data_prorrogacao?: Dayjs | null;
  vigencia: [Dayjs, Dayjs];
}

const schema = yup.object({
  data_homologacao: yup
    .mixed<Dayjs>()
    .required("Informe a data da homologação"),
  data_prorrogacao: yup.mixed<Dayjs>().nullable().optional(),
  vigencia: yup
    .mixed<[Dayjs, Dayjs]>()
    .test(
      "intervalo-completo",
      "Informe o período de vigência do concurso",
      (valor) => Array.isArray(valor) && Boolean(valor[0]) && Boolean(valor[1])
    )
    .required("Informe o período de vigência do concurso"),
});

export const useVigenciaForm = (
  defaultValues?: Partial<IVigenciaFormFields>
) => {
  return useForm<IVigenciaFormFields>({
    resolver: yupResolver(schema) as Resolver<IVigenciaFormFields>,
    mode: "onChange",
    defaultValues: { ...defaultValues },
  });
};
