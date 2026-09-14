import { InputNumber, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ColunaComInfo } from "@locus/componentes/ColunaComInfo";
import {
  InputDesabilitadoAzul,
  TagVagas,
  textoContagemComponentes,
} from "@locus/estilos";
import { DICAS_COLUNAS_COMPONENTE } from "@locus/servicos/recursos/unidadesEducacionais/textos";
import type { ComponenteCurricularDetalhe } from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import type { LinhaTabelaComponentes } from "../utilitarios";
import { GrupoComponente } from "../Estilos";

const TOTAL_COLUNAS = 6;

export interface TabelaComponentesDetalheProps {
  linhas: LinhaTabelaComponentes[];
  totalComponentes: number;
  componentesExibidos: number;
  carregando: boolean;
  somenteLeitura?: boolean;
  aoAlterarModulo: (componenteId: string, valor: number) => void;
  aoAbrirLotacao: (componente: ComponenteCurricularDetalhe) => void;
  aoAbrirAfastados: (componente: ComponenteCurricularDetalhe) => void;
}

function celulaGrupo(
  linha: LinhaTabelaComponentes,
  indiceColuna: number,
  totalColunas: number,
) {
  if (linha.tipo !== "grupo") return {};
  return { colSpan: indiceColuna === 0 ? totalColunas : 0 };
}

export function TabelaComponentesDetalhe({
  linhas,
  totalComponentes,
  componentesExibidos,
  carregando,
  somenteLeitura = false,
  aoAlterarModulo,
  aoAbrirLotacao,
  aoAbrirAfastados,
}: TabelaComponentesDetalheProps) {
  const colunas: ColumnsType<LinhaTabelaComponentes> = [
    {
      title: "Componente curricular",
      key: "componente",
      onCell: (linha) => celulaGrupo(linha, 0, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? (
          <GrupoComponente>{linha.rotulo}</GrupoComponente>
        ) : (
          linha.componente
        ),
    },
    {
      title: (
        <ColunaComInfo titulo="Módulo" dica={DICAS_COLUNAS_COMPONENTE.modulo} />
      ),
      key: "modulo",
      align: "center",
      width: 140,
      onCell: (linha) => celulaGrupo(linha, 1, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? null : (
          <InputNumber
            min={0}
            max={999}
            precision={0}
            value={linha.modulo}
            disabled={somenteLeitura}
            aria-label={`Módulo de ${linha.componente}`}
            onChange={(valor) =>
              aoAlterarModulo(linha.id, typeof valor === "number" ? valor : 0)
            }
          />
        ),
    },
    {
      title: (
        <ColunaComInfo
          titulo="Lotação"
          dica={DICAS_COLUNAS_COMPONENTE.lotacao}
        />
      ),
      key: "lotacao",
      align: "center",
      width: 120,
      onCell: (linha) => celulaGrupo(linha, 2, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? null : (
          <InputDesabilitadoAzul
            readOnly
            $largura={50}
            $clicavel={!somenteLeitura && linha.lotacao > 0}
            value={String(linha.lotacao)}
            aria-label={`Lotação de ${linha.componente}`}
            onClick={
              somenteLeitura || linha.lotacao === 0
                ? undefined
                : () => aoAbrirLotacao(linha)
            }
          />
        ),
    },
    {
      title: (
        <ColunaComInfo
          titulo="Afastados"
          dica={DICAS_COLUNAS_COMPONENTE.afastados}
        />
      ),
      key: "afastados",
      align: "center",
      width: 120,
      onCell: (linha) => celulaGrupo(linha, 3, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? null : (
          <InputDesabilitadoAzul
            readOnly
            $largura={50}
            $clicavel={!somenteLeitura && linha.afastados > 0}
            value={String(linha.afastados)}
            aria-label={`Afastados de ${linha.componente}`}
            onClick={
              somenteLeitura || linha.afastados === 0
                ? undefined
                : () => aoAbrirAfastados(linha)
            }
          />
        ),
    },
    {
      title: (
        <ColunaComInfo
          titulo="Vacâncias"
          dica={DICAS_COLUNAS_COMPONENTE.vacancia}
        />
      ),
      key: "vacancias",
      align: "center",
      width: 120,
      onCell: (linha) => celulaGrupo(linha, 4, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? null : linha.vacancias,
    },
    {
      title: (
        <ColunaComInfo titulo="Vagas" dica={DICAS_COLUNAS_COMPONENTE.vagas} />
      ),
      key: "saldoVagas",
      align: "center",
      width: 160,
      onCell: (linha) => celulaGrupo(linha, 5, TOTAL_COLUNAS),
      render: (_, linha) =>
        linha.tipo === "grupo" ? null : <TagVagas saldo={linha.saldoVagas} />,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={colunas}
      dataSource={linhas}
      loading={carregando}
      pagination={false}
      rowClassName={(_, indice) => (indice % 2 === 1 ? "linhaPar" : "")}
      summary={() => (
        <Table.Summary>
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={TOTAL_COLUNAS}>
              <strong>
                {textoContagemComponentes(componentesExibidos, totalComponentes)}
              </strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
}

export default TabelaComponentesDetalhe;
