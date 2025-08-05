import * as yup from "yup";

const useProductsSchema = () => {
  return yup.object({
    concurso: yup.string().required("campo obrigatório"),
    cargo: yup.string().required("campo obrigatório"),
    data_inicial: yup
      .string()
      .required("campo obrigatório")
      .test("is-valid-date", "Data inicial inválida", (value) => !!value),
    data_final: yup
      .string()
      .required("campo obrigatório")
      .test("is-after-start", "Data final deve ser maior ou igual à inicial", function (value) {
        const { data_inicial } = this.parent;
        if (!data_inicial || !value) return true; 
        return new Date(value) >= new Date(data_inicial);
      }),
    is_active: yup.boolean().required(),
  });
};

export default useProductsSchema;
