import * as yup from "yup";

const useLoginTelaSchema = () => {
  return yup.object({
    usuario: yup
      .string()
      .required("Campo Obrigatório")
      .matches(/^\d+$/, "RF deve conter apenas números"),

    senha: yup
      .string()
      .required("Campo Obrigatório")
      .min(3, "Senha deve ter pelo menos 3 caracteres"),
  });
};

export const useEsqueceuSenhaSchema = () => {
  return yup.object({
    rf: yup
      .string()
      .required("Campo Obrigatório")
      .matches(/^\d+$/, "RF deve conter apenas números"),
  });
};

export default useLoginTelaSchema;
