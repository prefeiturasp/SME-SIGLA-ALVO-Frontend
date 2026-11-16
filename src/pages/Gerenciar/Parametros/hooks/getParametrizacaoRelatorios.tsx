import { API } from "../../../../services";

export async function getParametrizacaoRelatorios() {
  const { response } = API.Relatorios.getParametrizacaoRelatorios();
  return await response;
}
