import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Resolver } from "react-hook-form";
import * as yup from "yup";
import type { ConcursoStatus } from "../../../../services/resources/concursos/IConcursos";

export interface IConcursoFormFields {
  cargos_ids: string[];
  nome: string;
  numero_processo: string;
  banca_responsavel: string;
  status: ConcursoStatus;
}

const schema = yup.object({
  cargos_ids: yup
    .array()
    .of(yup.string().required())
    .min(1, "Selecione ao menos um cargo")
    .required("Selecione ao menos um cargo"),
  nome: yup.string().trim().required("Informe o nome do concurso"),
  numero_processo: yup
    .string()
    .trim()
    .required("Informe o número do processo"),
  banca_responsavel: yup
    .string()
    .trim()
    .required("Informe a banca responsável"),
  status: yup
    .mixed<ConcursoStatus>()
    .oneOf(["ATIVO", "INATIVO"])
    .required("Selecione o status"),
});

const valoresPadrao: IConcursoFormFields = {
  cargos_ids: [],
  nome: "",
  numero_processo: "",
  banca_responsavel: "",
  status: "ATIVO",
};

export const useConcursoForm = (
  defaultValues?: Partial<IConcursoFormFields>
) => {
  return useForm<IConcursoFormFields>({
    resolver: yupResolver(schema) as Resolver<IConcursoFormFields>,
    mode: "onChange",
    defaultValues: { ...valoresPadrao, ...defaultValues },
  });
};
