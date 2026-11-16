import { API } from "../../../../services";

export async function patchParametrizacaoCandidatos(payload: Record<string, any>, uuid?: string) {
  const { response } = API.Candidatos.patchParametrizacaoCandidatos(payload, uuid);
  return await response;
}

