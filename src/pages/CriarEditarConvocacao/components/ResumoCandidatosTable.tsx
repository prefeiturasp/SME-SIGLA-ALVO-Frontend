import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";

import { CustomTitle, TextSubTituloCinza, TextTituloCinza } from "../../../components/EstilosCompartilhados";
const { Text } = Typography;

import { StyledTable } from "../../../components/EstilosCompartilhados";
import { Button, Row, Typography } from "antd";
import type { ICandidatosClassificados } from "../../../services/resources/agenda/IAgenda";


interface ResumoCandidatosTableProps extends TableProps<ICandidatosClassificados> {
  data: ICandidatosClassificados[];
}
const ResumoCandidatosTable: React.FC<ResumoCandidatosTableProps> = ({ data, title, ...rest }) => {

  const columns: ColumnsType<ICandidatosClassificados> = [
    {
      title: "Qtd. Candidatos",
      dataIndex: "qtd_candidatos",
      key: "qtd_candidatos",
    },

    {
      title: "Classificação",
      dataIndex: "classificacao",
      key: "classificacao",
    },
    {
      title: "Data da escolha",
      dataIndex: "data_escolha",
      key: "data_escolha",
    },
    {
      title: "Sessão",
      dataIndex: "sessao",
      key: "sessao",

    },
    {
      title: "Horário",
      dataIndex: "horario",
      key: "horario",
    },
  ];


  return (
    <>

 
      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.uuid}`}
        pagination={false}
        {...rest}
      />
    </>
  );
};

export default ResumoCandidatosTable;
