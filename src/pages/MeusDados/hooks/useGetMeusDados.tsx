import { useQuery } from "@tanstack/react-query";
import { getMeusDados } from "../../../services/resources/usuarios";

export const useGetMeusDados = () => {
  return useQuery({
    queryKey: ["meus-dados"],
    queryFn: () => getMeusDados().response,
  });
};
