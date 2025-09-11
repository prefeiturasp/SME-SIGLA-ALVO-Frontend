import * as yup from "yup";

const useImportacaoVagasSchema = () => {
  return yup.object({
    metodo_de_importacao: yup.number().required("Método de importação é obrigatório"),

    cargo: yup.string().when("metodo_de_importacao", {
      is: 1,
      then: (schema) => schema.required("Cargo é obrigatório"),
      otherwise: (schema) => schema.notRequired(),
    }),

    data_fechamento_modulo: yup.string().when("metodo_de_importacao", {
      is: 1,
      then: (schema) => schema.required("Data de fechamento do módulo é obrigatória"),
      otherwise: (schema) => schema.notRequired(),
    }),

    arquivo: yup
      .mixed<File>()
      .when("metodo_de_importacao", {
        is: 2,
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
