import { API } from "../../../../services";

export type ParametrizacaoTipoUnidade = {
  uuid: string;
  tipo_ue: string;
  usar: boolean;
};

export async function getParametrizacaoEscolhas(): Promise<ParametrizacaoTipoUnidade[]> {
  const { response } = API.Escolhas.getParametrizacaoEscolhas();
  const data = await response;
  // Garantir que retorna um array e mapear apenas os campos necessários
  const arrayData = Array.isArray(data) ? data : [];
  return arrayData.map((item: any) => ({
    uuid: item.uuid,
    tipo_ue: item.tipo_ue,
    usar: item.usar,
  }));
}

