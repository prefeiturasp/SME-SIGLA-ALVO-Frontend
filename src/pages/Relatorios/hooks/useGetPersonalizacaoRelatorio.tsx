import { API } from "../../../services";

export async function getPersonalizacaoRelatorio(
  processoUuid: string,
  tipoRelatorio: string
) {
  const { response } = API.Relatorios.getPersonalizacaoRelatorio(processoUuid, tipoRelatorio);
  return await response;
}

