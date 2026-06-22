import React, { useMemo } from "react";
import { Progress, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InfoCircleOutlined } from "@ant-design/icons";
import { TextTitulo, TextTituloSecundario } from "../../../../components/EstilosCompartilhados";
import type {
  TabelaVagasDreComparativoItem,
  TabelaVagasDreItem,
} from "../utils/mapGraficosDre";
import { formatValorComparativo, formatValorNumerico } from "../utils/formatValorIndicador";
import {
  PercentualCell,
  TableCard,
  VagasDreTable,
} from "../styles";

type TabelaVagasDreProps = {
  data?: TabelaVagasDreItem[];
  dataComparativo?: TabelaVagasDreComparativoItem[];
  subtitle?: string;
};

type TabelaVagasDreComparativoLinha = {
  key: string;
  dre: string;
  dreRowSpan: number;
  ano: string;
  escolhas: number;
  vagas: number;
  percentualPreenchimento: number;
};

const expandirLinhasComparativo = (
  data: TabelaVagasDreComparativoItem[]
): TabelaVagasDreComparativoLinha[] =>
  data.flatMap((record) => [
    {
      key: `${record.key}-${record.anoAntigo}`,
      dre: record.nome,
      dreRowSpan: 2,
      ano: record.anoAntigo,
      escolhas: record.escolhasAnoAntigo,
      vagas: record.vagasAnoAntigo,
      percentualPreenchimento: record.percentualAnoAntigo,
    },
    {
      key: `${record.key}-${record.anoRecente}`,
      dre: record.nome,
      dreRowSpan: 0,
      ano: record.anoRecente,
      escolhas: record.escolhasAnoRecente,
      vagas: record.vagasAnoRecente,
      percentualPreenchimento: record.percentualAnoRecente,
    },
  ]);

const formatValorCelula = (value: number | null, modoComparativo: boolean) =>
  modoComparativo ? formatValorComparativo(value) : formatValorNumerico(value ?? 0);

const formatPercentualDecimal = (value: number) =>
  `${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;

const renderPercentualComBarra = (percentual: number, decimal = false) => (
  <PercentualCell>
    <span>{decimal ? formatPercentualDecimal(percentual) : `${percentual}%`}</span>
    <Progress
      percent={percentual}
      showInfo={false}
      strokeColor="#0F59C8"
      trailColor="#E8E8E8"
      size="small"
    />
  </PercentualCell>
);

const TabelaVagasDre: React.FC<TabelaVagasDreProps> = ({
  data = [],
  dataComparativo,
  subtitle,
}) => {
  const modoComparativoPorAno = Boolean(dataComparativo?.length);
  const modoComparativo = !modoComparativoPorAno && (data[0]?.modoComparativo ?? false);
  const linhasComparativo = useMemo(
    () => expandirLinhasComparativo(dataComparativo ?? []),
    [dataComparativo]
  );

  const columnsSimples = useMemo<ColumnsType<TabelaVagasDreItem>>(
    () => [
      {
        title: "DRE",
        dataIndex: "nome",
        key: "nome",
        ellipsis: true,
        onHeaderCell: () => ({ className: "col-dre" }),
        onCell: () => ({ className: "col-dre" }),
      },
      {
        title: modoComparativo ? "Variação escolhas" : "Escolhas",
        dataIndex: "escolhas",
        key: "escolhas",
        align: "right",
        width: 120,
        onHeaderCell: () => ({ className: "col-escolhas" }),
        onCell: () => ({ className: "col-escolhas" }),
        render: (value: number | null) => formatValorCelula(value, modoComparativo),
      },
      {
        title: modoComparativo ? "Variação vagas" : "Vagas",
        dataIndex: "vagas",
        key: "vagas",
        align: "right",
        width: 120,
        onHeaderCell: () => ({ className: "col-vagas" }),
        onCell: () => ({ className: "col-vagas" }),
        render: (value: number | null) => formatValorCelula(value, modoComparativo),
      },
      {
        title: (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, width: "100%" }}>
            {modoComparativo ? "Variação preenchimento (p.p.)" : "% preenchimento"}
            <Tooltip title="A porcentagem representa a relação entre a quantidade de escolhas realizadas e o total de vagas disponíveis.">
              <InfoCircleOutlined style={{ color: "#0F59C8" }} />
            </Tooltip>
          </span>
        ),
        dataIndex: "percentualPreenchimento",
        key: "percentualPreenchimento",
        align: "right",
        width: 200,
        onHeaderCell: () => ({ className: "col-percentual" }),
        onCell: () => ({ className: "col-percentual" }),
        render: (value: number | null) => {
          if (modoComparativo) {
            return formatValorComparativo(value);
          }

          return renderPercentualComBarra(value ?? 0);
        },
      },
    ],
    [modoComparativo]
  );

  const columnsComparativo = useMemo<ColumnsType<TabelaVagasDreComparativoLinha>>(
    () => [
      {
        title: "DRE",
        dataIndex: "dre",
        key: "dre",
        ellipsis: true,
        onHeaderCell: () => ({ className: "col-dre" }),
        onCell: (record) => ({
          className: "col-dre",
          rowSpan: record.dreRowSpan,
        }),
        render: (value: string, record) => (record.dreRowSpan > 0 ? value : null),
      },
      {
        title: "Escolhas",
        dataIndex: "escolhas",
        key: "escolhas",
        align: "right",
        width: 120,
        onHeaderCell: () => ({ className: "col-escolhas" }),
        onCell: () => ({ className: "col-escolhas" }),
        render: (value: number, record) =>
          `${formatValorNumerico(value)} (${record.ano})`,
      },
      {
        title: "Vagas",
        dataIndex: "vagas",
        key: "vagas",
        align: "right",
        width: 120,
        onHeaderCell: () => ({ className: "col-vagas" }),
        onCell: () => ({ className: "col-vagas" }),
        render: (value: number, record) =>
          `${formatValorNumerico(value)} (${record.ano})`,
      },
      {
        title: (
          <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "flex-end", gap: 4, width: "100%" }}>
            % preenchimento
            <Tooltip title="A porcentagem representa a relação entre a quantidade de escolhas realizadas e o total de vagas disponíveis.">
              <InfoCircleOutlined style={{ color: "#0F59C8" }} />
            </Tooltip>
          </span>
        ),
        dataIndex: "percentualPreenchimento",
        key: "percentualPreenchimento",
        align: "right",
        width: 200,
        onHeaderCell: () => ({ className: "col-percentual" }),
        onCell: () => ({ className: "col-percentual" }),
        render: (value: number) => renderPercentualComBarra(value, true),
      },
    ],
    []
  );

  const subtituloPadrao = modoComparativoPorAno
    ? "Tabela com escolhas e percentual de preenchimento"
    : "Tabela com habilitados, convocações, escolhas e percentual de preenchimento";

  return (
    <TableCard>
      <TextTitulo style={{ fontSize: 20, marginLeft: 16, display: "block" }}>
        Total de vagas ofertadas por DRE
      </TextTitulo>
      <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, marginLeft: 16, display: "block" }}>
        {subtitle ?? subtituloPadrao}
      </TextTituloSecundario>
      {modoComparativoPorAno ? (
        <VagasDreTable
          style={{ marginTop: "1.5rem" }}
          columns={columnsComparativo}
          dataSource={linhasComparativo}
          pagination={false}
          locale={{ emptyText: "Nenhum dado encontrado" }}
        />
      ) : (
        <VagasDreTable
          style={{ marginTop: "1.5rem" }}
          columns={columnsSimples}
          dataSource={data}
          pagination={false}
          locale={{ emptyText: "Nenhum dado encontrado" }}
        />
      )}
    </TableCard>
  );
};

export default TabelaVagasDre;
