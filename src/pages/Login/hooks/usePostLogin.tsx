import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../../../services/resources/login";
import type { ILoginRequest } from "../../../services/resources/login";

export const usePostLogin = () => {

  return useMutation({
    mutationFn: (payload: ILoginRequest) => postLogin(payload).response,
    onSuccess: (data) => {
      // Salvar token no localStorage
      localStorage.setItem("TOKEN", data.token);
      // USUARIO deve vir do login; se não vier, usa o codigoRf
      const usuario = data.login ?? data.codigoRf;
      localStorage.setItem("USUARIO", usuario);
    },
    onError: (error: any) => {
      console.error("Erro no login:", error);
    },
  });
};
