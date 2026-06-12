import React, { useMemo } from "react";
import { Progress, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { InfoCircleOutlined } from "@ant-design/icons";
import { TextTitulo, TextTituloSecundario } from "../../../../components/EstilosCompartilhados";
import type { TabelaVagasDreItem } from "../utils/mapGraficosDre";
import { PercentualCell, TableCard, VagasDreTable } from "../styles";

type TabelaVagasDreProps = {
  data: TabelaVagasDreItem[];
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const TabelaVagasDre: React.FC<TabelaVagasDreProps> = ({ data }) => {
  const columns = useMemo<ColumnsType<TabelaVagasDreItem>>(
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
        title: "Escolhas",
        dataIndex: "escolhas",
        key: "escolhas",
        align: "right",
        width: 88,
        onHeaderCell: () => ({ className: "col-escolhas" }),
        onCell: () => ({ className: "col-escolhas" }),
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Vagas",
        dataIndex: "vagas",
        key: "vagas",
        align: "right",
        width: 88,
        onHeaderCell: () => ({ className: "col-vagas" }),
        onCell: () => ({ className: "col-vagas" }),
        render: (value: number) => formatNumber(value),
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
        render: (value: number) => (
          <PercentualCell>
            <span>{value}%</span>
            <Progress
              percent={value}
              showInfo={false}
              strokeColor="#0F59C8"
              trailColor="#E8E8E8"
              size="small"
            />
          </PercentualCell>
        ),
      },
    ],
    []
  );

  return (
    <TableCard>
      <TextTitulo style={{ fontSize: 20, marginLeft: 16, display: "block" }}>
        Total de vagas ofertadas por DRE
      </TextTitulo>
      <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, marginLeft: 16, display: "block" }}>
        Tabela com habilitados, convocações, escolhas e percentual de preenchimento
      </TextTituloSecundario>
      <VagasDreTable
        style={{ marginTop: "1.5rem" }}
        columns={columns}
        dataSource={data}
        pagination={false}
        locale={{ emptyText: "Nenhum dado encontrado" }}
      />
    </TableCard>
  );
};

export default TabelaVagasDre;
