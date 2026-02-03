import { API } from "../../../services";

type PatchPersonalizacaoRelatorioPayload = {
  tipoRelatorio: string;
  usar_cabecalho_padrao: boolean;
  usar_logotipo: boolean;
  cabecalho: string;
  texto_final: string;
  cabecalho_capa_ata?: string;
  uuid?: string | null;
};

export async function patchPersonalizacaoRelatorio(
  payload: PatchPersonalizacaoRelatorioPayload
) {
  const { response } = API.Relatorios.patchPersonalizacaoRelatorio(
    payload.tipoRelatorio,
    {
      usar_cabecalho_padrao: payload.usar_cabecalho_padrao,
      usar_logotipo: payload.usar_logotipo,
      cabecalho: payload.cabecalho,
      texto_final: payload.texto_final,
      cabecalho_capa_ata: payload.cabecalho_capa_ata,
      uuid: payload.uuid !== undefined ? payload.uuid : null,
    },
    // Para a URL, converter null em undefined
    payload.uuid ?? undefined
  );
  return await response;
}

