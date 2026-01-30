// Implementação simples sem react-query e sem useEffect
import { API } from "../../../services";
import type { PaginatedResponse } from "../../../types/IListRequest";
import type { ICargos } from "../../../services/resources/cargos/ICargos";
import type { IAutorizacaoPublicada } from "../../../services/resources/cargos/IAutorizacaoPublicada";

// Retorna os dados em caso de sucesso; em caso de erro, retorna um objeto com message
export const useGetCargosAutorizacoesPublicadas = async (signal?: AbortSignal): Promise<PaginatedResponse<ICargos> | { message: string }> => {
  try {
    const { response } = API.Cargos.getCargosAutorizacoesPublicadas({ signal });
    return (await response) as PaginatedResponse<ICargos>;
  } catch (e: any) {
    const message =
      e?.response?.data?.detail ||
      e?.message ||
      "Não foi possível carregar as autorizações publicadas.";
    return { message: String(message) };
  }
};

export const useGetAutorizacoesPublicadasPorCargo = async (cargoUuid: string, signal?: AbortSignal): Promise<PaginatedResponse<IAutorizacaoPublicada> | { message: string }> => {
  try {
    const { response } = API.Cargos.getAutorizacoesPublicadasPorCargo(cargoUuid, { signal });
    return (await response) as PaginatedResponse<IAutorizacaoPublicada>;
  } catch (e: any) {
    const message =
      e?.response?.data?.detail ||
      e?.message ||
      "Não foi possível carregar as autorizações publicadas por cargo.";
    return { message: String(message) };
  }
};
