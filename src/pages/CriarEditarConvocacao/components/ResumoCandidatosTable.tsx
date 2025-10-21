import React from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";

import { CustomTitle, TextSubTituloCinza, TextTituloCinza } from "../../../components/EstilosCompartilhados";
const { Text } = Typography;

import { StyledTable } from "../../../components/EstilosCompartilhados";
import { Button, Row, Typography } from "antd";

export interface ICandidatosClassificados {
  uuid: string;
  qtd_candidatos: number;
  classificacao: string;
  data_escolha: string;  
  sessao: string;  
  horario: string;
}
interface ResumoCandidatosTableProps extends TableProps<ICandidatosClassificados> {
  data: ICandidatosClassificados[];
}
const ResumoCandidatosTable: React.FC<ResumoCandidatosTableProps> = ({ data, ...rest }) => {
  
  

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

  const totalCandidatos = data.reduce((acc, curr) => acc + curr.qtd_candidatos, 0);

  return (
    <>

      <CustomTitle level={4} style={{ margin: "1rem 0 1rem 1rem " }}>
        {"Cargo: PROF. FUND. II E MÉDIO - BIOLOGIA"}
      </CustomTitle>


      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.uuid}`}        
        footer={() => <Row justify="start"><Text style={{ fontWeight: '600' }}>Total de {totalCandidatos} candidatos adicionados</Text></Row>}
        pagination={false}        
        {...rest}
      />
    </>
  );
};

export default ResumoCandidatosTable;
