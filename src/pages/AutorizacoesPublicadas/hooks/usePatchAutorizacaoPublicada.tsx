import { API } from "../../../services";
import type { IAutorizacaoPublicada } from "../../../services/resources/cargos/IAutorizacaoPublicada";

// PATCH simples; retorna dados em sucesso, ou { message } em erro
export const usePatchAutorizacaoPublicada = async (
  autorizacaoUuid: string,
  payload: unknown,
  signal?: AbortSignal
): Promise<IAutorizacaoPublicada | { message: string }> => {
  try {
    const { response } = API.Cargos.patchAutorizacaoPublicada(autorizacaoUuid, payload, { signal });
    return (await response) as IAutorizacaoPublicada;
  } catch (e: any) {
    const message =
      e?.response?.data?.detail ||
      e?.message ||
      "Não foi possível atualizar a autorização publicada.";
    return { message: String(message) };
  }
};

