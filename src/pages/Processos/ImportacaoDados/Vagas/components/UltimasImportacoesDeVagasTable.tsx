import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";

import { CustomTitle } from "./style";


import { StyledTable } from "../../../../../components/EstilosCompartilhados";
import type { IUltimasImportacoesVagas } from "../../../../../services/resources/importacaoDados/IImportacaoArquivos";

interface UltimasImportacoesDeVagasTableProps extends TableProps<IUltimasImportacoesVagas> {
  data: IUltimasImportacoesVagas[];
}
const UltimasImportacoesDeVagasTable: React.FC<UltimasImportacoesDeVagasTableProps> = ({ data, ...rest }) => {
  const columns: ColumnsType<IUltimasImportacoesVagas> = [
    {
      title: "Método de importação",
      dataIndex: "metodo_de_importacao",
      key: "metodo_de_importacao",
      render: () => 'arquivo'
    },

    {
      title: "Data de fechamento do módulo",
      dataIndex: "data_de_fechamento_do_modulo",
      key: "data_de_fechamento_do_modulo",
      render: () => ''
    },
    {
      title: "Cargo",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Opções de importação",
      dataIndex: "opcoes_de_importacao",
      key: "opcoes_de_importacao",
      render: () => 'Ajustar'

    },
    {
      title: "Data da importação",
      dataIndex: "criado_em",
      key: "criado_em",
      render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
    },
  ];

  return (
    <>

      <CustomTitle level={4} style={{ margin: "1rem 0" }}>
        {"Últimas importações"}
      </CustomTitle>

      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.uuid}`}
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        {...rest}
      />
    </>
  );
};

export default UltimasImportacoesDeVagasTable;
