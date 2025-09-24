import * as yup from "yup";
import { MetodoImportacao } from "./types";

const useImportacaoVagasSchema = () => {
  return yup.object({
     metodo_de_importacao: yup
      .number()
      .oneOf([MetodoImportacao.WebService, MetodoImportacao.Arquivo])
      .required("Método de importação é obrigatório"),

    cargo: yup.string().when("metodo_de_importacao", {
      is: MetodoImportacao.WebService,
      then: (schema) => schema.required("Cargo é obrigatório, selecione um cargo"),
      otherwise: (schema) => schema.notRequired(),
    }),
    

    data_fechamento_modulo: yup.string().when("metodo_de_importacao", {
      is: MetodoImportacao.WebService,
      then: (schema) => schema.required("Data de fechamento do módulo é obrigatória"),
      otherwise: (schema) => schema.notRequired(),
    }),


    concurso_uuid: yup.string().when("metodo_de_importacao", {
      is: MetodoImportacao.Arquivo,
      then: (schema) => schema.required("Concurso é obrigatório, selecione um concurso"),
      otherwise: (schema) => schema.notRequired(),
    }),

    arquivo: yup
      .mixed<File>()
      .when("metodo_de_importacao", {
        is: MetodoImportacao.Arquivo,
        then:(schema) =>
          schema.required("Arquivo é obrigatório")
            .test("file-type", "Apenas arquivos CSV são permitidos", (value) => {
              if (!value) return false;
              return value.type === "text/csv" || value.name.endsWith(".csv");
            }),
        otherwise: (schema) => schema.notRequired(),
      })

  });
};

export default useImportacaoVagasSchema;
