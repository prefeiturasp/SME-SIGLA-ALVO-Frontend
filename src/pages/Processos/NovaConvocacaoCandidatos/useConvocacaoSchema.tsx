import * as yup from "yup";

const useConvocacaoSchema = () => {
  return yup.object({
    concurso: yup.string().required("campo obrigatório"),
    cargo: yup.string().required("campo obrigatório"),
    data_convocacao_inicio: yup
      .string()
      .required("campo obrigatório")
      .test("is-valid-date", "Data inicial inválida", (value) => !!value),
    data_convocacao_fim: yup
      .string()
      .required("campo obrigatório")
      .test("is-after-start", "Data final deve ser maior ou igual à inicial", function (value) {
        const { data_convocacao_inicio } = this.parent;
        if (!data_convocacao_inicio || !value) return true; 
        return new Date(value) >= new Date(data_convocacao_inicio);
      }),
  });
};

export default useConvocacaoSchema;