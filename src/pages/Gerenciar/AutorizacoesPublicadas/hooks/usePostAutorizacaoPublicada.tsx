import { API } from "../../../../services";

// POST simples; retorna dados em sucesso, ou { message } em erro
export const usePostAutorizacaoPublicada = async (
  payload: unknown,
  signal?: AbortSignal
): Promise<unknown | { message: string }> => {
  try {
    const { response } = API.Cargos.postAutorizacaoPublicada(payload, { signal });
    return await response;
  } catch (e: any) {
    const message =
      e?.response?.data?.detail ||
      e?.message ||
      "Não foi possível criar a autorização publicada.";
    return { message: String(message) };
  }
};

