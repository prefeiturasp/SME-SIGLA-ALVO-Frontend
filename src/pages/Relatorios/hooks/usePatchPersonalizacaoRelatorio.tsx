import { API } from "../../../services";

type PatchPersonalizacaoRelatorioPayload = {
  processoUuid: string;
  tipoRelatorio: string;
  usar_cabecalho: boolean;
  usar_logotipo: boolean;
  cabecalho: string;
  texto_final: string;
  uuid?: string | null;
};

export async function patchPersonalizacaoRelatorio(
  payload: PatchPersonalizacaoRelatorioPayload
) {
  const { response } = API.Relatorios.patchPersonalizacaoRelatorio(
    payload.processoUuid,
    payload.tipoRelatorio,
    {
      usar_cabecalho: payload.usar_cabecalho,
      usar_logotipo: payload.usar_logotipo,
      cabecalho: payload.cabecalho,
      texto_final: payload.texto_final,
      uuid: payload.uuid !== undefined ? payload.uuid : null,
    },
    // Para a URL, converter null em undefined
    payload.uuid ?? undefined
  );
  return await response;
}

