import { useMutation } from "@tanstack/react-query";
import { postLogin } from "../../../services/resources/login";
import type { ILoginRequest } from "../../../services/resources/login";

export const usePostLogin = () => {

  return useMutation({
    mutationFn: (payload: ILoginRequest) => postLogin(payload).response,
    onSuccess: (data, payload) => {
      // Salvar token no localStorage
      localStorage.setItem("TOKEN", data.token);
      localStorage.setItem("USUARIO", payload.usuario);
      
    },
    onError: (error: any) => {
      console.error("Erro no login:", error);
    },
  });
};
