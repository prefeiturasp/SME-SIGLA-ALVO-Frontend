import * as yup from "yup";

const useImportacaoVagasSchema = () => {
  return yup.object({
    processo_convocacao: yup.string().required("Processo de convocação é obrigatório"),
    arquivo: yup
      .mixed<File>()
      .required("Arquivo é obrigatório")
      .test("file-type", "Apenas arquivos CSV são permitidos", (value) => {
        if (!value) return false;
        return value.type === "text/csv" || value.name.endsWith(".csv");
      }),

  });
};

export default useImportacaoVagasSchema;
