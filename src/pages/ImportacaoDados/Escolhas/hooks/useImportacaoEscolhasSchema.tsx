import * as yup from "yup";

const useImportacaoEscolhasSchema = () => {
  return yup.object({
    processo_convocacao: yup.string().required("Processo de convocação é obrigatório"),
    // Não exigimos arquivo para importação de escolhas - é uma chamada direta à API PRODAM
    arquivo: yup.mixed<File>().nullable().notRequired(),
  });
};

export default useImportacaoEscolhasSchema;

