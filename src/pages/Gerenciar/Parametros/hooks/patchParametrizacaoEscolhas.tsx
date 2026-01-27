import { API } from "../../../../services";

export async function patchParametrizacaoEscolhas(payload: Record<string, any>) {
  const { response } = API.Escolhas.patchParametrizacaoEscolhas(payload);
  return await response;
}

