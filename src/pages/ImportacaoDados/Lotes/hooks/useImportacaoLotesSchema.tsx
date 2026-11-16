import * as yup from "yup";

const useImportacaoLotesSchema = () => {
  return yup.object({
    concurso: yup.string().required("Concurso é obrigatório"),

    arquivo: yup
      .mixed<File>()
      .required("Arquivo é obrigatório")
      .test("file-type", "Apenas arquivos TXT são permitidos", (value) => {
        if (!value) return false;
        return value.name.endsWith(".txt") || value.type === "text/plain";
      }),
  });
};

export default useImportacaoLotesSchema;
