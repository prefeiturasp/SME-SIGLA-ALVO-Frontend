import dayjs from "dayjs";
import type {
  IContagemHistoricoCandidatos,
  IHistoricoCandidatosItem,
} from "../../../services/resources/convocacao/IConvocacao";
import type { ContagemGrupo, LinhaHistoricoCandidatos } from "../tipos";
import { usePostHistoricoCandidatos } from "./usePostHistoricoCandidatos";

function mapearContagem(grupo: IContagemHistoricoCandidatos): ContagemGrupo {
  return {
    total: grupo.total,
    geral: grupo.geral,
    pcd: grupo.pcd,
    nna: grupo.nna,
  };
}

export function mapearHistoricoCandidatos(
  itens: IHistoricoCandidatosItem[],
): LinhaHistoricoCandidatos[] {
  return itens.map((item, indice) => ({
    key: `${item.descricao}-${item.data_convocacao}-${indice}`,
    descricao: item.descricao,
    data: dayjs(item.data_convocacao).format("DD/MM/YYYY"),
    convocados: mapearContagem(item.candidatos),
    escolhas: mapearContagem(item.escolha),
    naoEscolhas: mapearContagem(item["nao-escolha"]),
    reconvocacao: mapearContagem(item.reconvocacao),
  }));
}

export function useHistoricoCandidatos(processosUuids: string[]) {
  const { data, isLoading, isFetching, error, refetch } =
    usePostHistoricoCandidatos(processosUuids);

  return {
    linhas: data ? mapearHistoricoCandidatos(data) : [],
    carregando: isLoading || isFetching,
    erro: error,
    refetch,
  };
}

export default useHistoricoCandidatos;
