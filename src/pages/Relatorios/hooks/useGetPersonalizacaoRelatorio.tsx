import { API } from "../../../services";

export async function getPersonalizacaoRelatorio(
  tipoRelatorio: string
) {
  const { response } = API.Relatorios.getPersonalizacaoRelatorio(tipoRelatorio);
  return await response;
}

