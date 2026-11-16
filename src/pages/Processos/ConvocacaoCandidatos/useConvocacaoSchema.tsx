import * as yup from "yup";

const useConvocacaoSchema = () => {
  return yup.object({
    data_convocacao_inicio: yup
      .string()
      .nullable()
      .notRequired()
      .test("is-valid-date", "Data inicial inválida", (value) => {
        if (!value) return true;
        return !isNaN(new Date(value).getTime());
      }),

    data_convocacao_fim: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "is-after-start",
        "Data final deve ser maior ou igual à inicial",
        function (value) {
          const { data_convocacao_inicio } = this.parent;

          // Se não informou a final, tá tudo bem
          if (!value) return true;

          // Se informou final mas não inicial, também tá tudo bem
          if (!data_convocacao_inicio) return true;

          // Valida se final >= inicial
          return new Date(value) >= new Date(data_convocacao_inicio);
        }
      ),
  });
};

export default useConvocacaoSchema;
