import { useMutation } from "@tanstack/react-query";
import { postAlterarEmail } from "../../../services/resources/usuarios";
import type { IAlterarEmailRequest } from "../../../services/resources/usuarios";

export const useAlterarEmail = () => {
  return useMutation({
    mutationFn: (payload: IAlterarEmailRequest) =>
      postAlterarEmail(payload).response,
  });
};
