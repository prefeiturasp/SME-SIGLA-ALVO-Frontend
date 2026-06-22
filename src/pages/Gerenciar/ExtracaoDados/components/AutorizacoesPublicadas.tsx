import React, { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import { TextTitulo, TextTituloSecundario } from "../../../../components/EstilosCompartilhados";
import type { AutorizacaoPublicadaItem } from "../utils/mapRelatoriosDetalhados";
import { RelatoriosDetalhadosTable, TableCard } from "../styles";

type AutorizacoesPublicadasProps = {
  data: AutorizacaoPublicadaItem[];
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const AutorizacoesPublicadas: React.FC<AutorizacoesPublicadasProps> = ({ data }) => {
  const columns = useMemo<ColumnsType<AutorizacaoPublicadaItem>>(
    () => [
      {
        title: "Cargo",
        dataIndex: "cargo",
        key: "cargo",
        ellipsis: true,
      },
      {
        title: "Quantidade",
        dataIndex: "quantidade",
        key: "quantidade",
        width: 140,
        onCell: () => ({ className: "col-numerica-valor" }),
        render: (value: number) => formatNumber(value),
      },
      {
        title: "Última atualização",
        dataIndex: "data_autorizacao",
        key: "data_autorizacao",
        width: 180,
      },
    ],
    []
  );

  return (
    <TableCard>
      <TextTitulo style={{ fontSize: 20, marginLeft: 16, display: "block" }}>
        Autorizações Publicadas
      </TextTitulo>
      <TextTituloSecundario style={{ fontSize: 14, marginTop: 8, marginLeft: 16, display: "block" }}>
        Autorizações publicadas por cargo.
      </TextTituloSecundario>

      <RelatoriosDetalhadosTable
        columns={columns}
        dataSource={data}
        pagination={false}
        locale={{ emptyText: "Nenhum dado encontrado" }}
      />
    </TableCard>
  );
};

export default AutorizacoesPublicadas;
