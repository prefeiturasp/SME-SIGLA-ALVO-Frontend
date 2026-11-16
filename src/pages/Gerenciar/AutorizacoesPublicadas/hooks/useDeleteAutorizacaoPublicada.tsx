import { API } from "../../../../services";

// DELETE simples; retorna sucesso em sucesso, ou { message } em erro
export const useDeleteAutorizacaoPublicada = async (
  autorizacaoUuid: string,
  signal?: AbortSignal
): Promise<unknown | { message: string }> => {
  try {
    const { response } = API.Cargos.deleteAutorizacaoPublicada(autorizacaoUuid, { signal });
    return await response;
  } catch (e: any) {
    const message =
      e?.response?.data?.detail ||
      e?.message ||
      "Não foi possível excluir a autorização publicada.";
    return { message: String(message) };
  }
};

