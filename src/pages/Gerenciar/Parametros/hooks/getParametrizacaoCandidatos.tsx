import { API } from "../../../../services";

export async function getParametrizacaoCandidatos() {
  const { response } = API.Candidatos.getParametrizacaoCandidatos();
  return await response;
}

