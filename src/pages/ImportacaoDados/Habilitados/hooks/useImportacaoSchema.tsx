import * as yup from "yup";

const useImportacaoSchema = () => {
  return yup.object({
    concurso: yup
      .string()
      .required("Concurso é obrigatório"),

    arquivo: yup
      .mixed<File>()
      .required("Arquivo é obrigatório")
      .test("file-type", "Apenas arquivos CSV são permitidos", (value) => {
        if (!value) return false;
        return value.type === "text/csv" || value.name.endsWith(".csv");
      }),

    observacao: yup.string().optional(),
    mandado_judicial: yup.boolean().optional(),
  });
};

export default useImportacaoSchema;
