import { API } from "../../../services";

type PatchPersonalizacaoRelatorioPayload = {
  tipoRelatorio: string;
  usar_logotipo: boolean;
  cabecalho_gabarito?: string;
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
      usar_logotipo: payload.usar_logotipo,
      ...(payload.cabecalho_gabarito !== undefined
        ? { cabecalho_gabarito: payload.cabecalho_gabarito }
        : {}),
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

