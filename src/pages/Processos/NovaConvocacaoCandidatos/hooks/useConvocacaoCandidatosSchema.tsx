import * as yup from "yup";

const useConvocacaoCandidatosSchema = () => {
  return yup.object({
    concurso: yup.string().required("O campo concurso é obrigatório"),
    tipo_escolha: yup.string().required("O campo tipo de escolha é obrigatório"),
    descricao: yup.string().required("O campo descrição é obrigatório"),    
    data_convocacao: yup.string().required("O campo data de convocação é obrigatório"),
    data_corte_vagas: yup.string().required("O campo data de corte de vagas é obrigatório"),
  });
};

export default useConvocacaoCandidatosSchema;
