import { API } from "../../../../services";

export async function patchParametrizacaoRelatorios(payload: FormData | Record<string, any>, uuid?: string) {
  const { response } = API.Relatorios.patchParametrizacaoRelatorios(payload, uuid);
  return await response;
}
