import * as yup from "yup";

const useConvocacaoSchema = () => {
  return yup.object({
    data_inicial: yup
      .string()
      .nullable()
      .notRequired()
      .test("is-valid-date", "Data inicial inválida", (value) => {
        if (!value) return true; 
        return !isNaN(new Date(value).getTime());
      }),

    data_final: yup
      .string()
      .nullable()
      .notRequired()
      .test("is-after-start", "Data final deve ser maior ou igual à inicial", function (value) {
        const { data_inicial } = this.parent;
        if (!data_inicial && !value) return true;
        if (!data_inicial || !value) return false; 
        return new Date(value) >= new Date(data_inicial);
      }),
  });
};

export default useConvocacaoSchema;
