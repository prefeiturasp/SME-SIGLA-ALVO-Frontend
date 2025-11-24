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

export const useNovaSenhaSchema = () => {
  return yup.object({
    nova_senha: yup
      .string()
      .required("Campo Obrigatório")
      .min(8, "A senha deve ter entre 8 e 12 caracteres")
      .max(12, "A senha deve ter entre 8 e 12 caracteres")
      .matches(/[a-z]/, "Ao menos uma letra minúscula")
      .matches(/[A-Z]/, "Ao menos uma letra maiúscula")
      .matches(/[0-9]/, "Ao menos um caracter numérico")
      .matches(/[#$@!%&*?]/, "Ao menos um caracter especial (#$@!%&*?)")
      .test("no-spaces", "Não deve conter espaços em branco", (value) => {
        return value ? !/\s/.test(value) : true;
      })
      .test("no-accents", "Não deve conter caracteres acentuados", (value) => {
        return value ? !/[áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(value) : true;
      }),
    
    confirmar_senha: yup
      .string()
      .required("Campo Obrigatório")
      .oneOf([yup.ref("nova_senha")], "As senhas não coincidem"),
  });
};

export default useLoginTelaSchema;
