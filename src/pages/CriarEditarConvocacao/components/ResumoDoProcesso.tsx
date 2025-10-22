import React from "react";
import { Row, Col, Spin } from "antd";
import dayjs from "dayjs";

import { TextSubHeading, TextSubTituloCinza, TextTituloCinza } from "../../../components/EstilosCompartilhados";

import type { IProcessoConvocacaoResumo } from "../../../services/resources/convocacao/IConvocacao";



interface ResumoDoProcessoProps {  
  data: IProcessoConvocacaoResumo;
  isLoading: boolean;
}

const ResumoDoProcesso: React.FC<ResumoDoProcessoProps> = ({
  data,
  isLoading
}) => {
   return (
    <Spin spinning={isLoading} tip="Carregando dados do processo..." size="large">
      
    <Row gutter={30} >  
      <Col xs={24} md={24} style={{marginBottom: '1rem'}}>
      <TextSubHeading>Dados do processo</TextSubHeading>
      </Col>

      <Col xs={24} md={8}>
        <TextTituloCinza >Concurso</TextTituloCinza>
        <TextSubTituloCinza>{data.concurso_nome}</TextSubTituloCinza>        
        <TextTituloCinza >Data da convocação</TextTituloCinza>        
        <TextSubTituloCinza>{data.data_convocacao ? dayjs(data.data_convocacao).format('DD/MM/YYYY') : ''}</TextSubTituloCinza>
      </Col>

      <Col xs={24} md={8}>
      <TextTituloCinza >Tipo de processo</TextTituloCinza>
        
        <TextSubTituloCinza>{data.tipo_escolha}</TextSubTituloCinza>
        <TextTituloCinza>Data da publicação</TextTituloCinza>        
        <TextSubTituloCinza >{data.data_corte_vagas ? dayjs(data.data_corte_vagas).format('DD/MM/YYYY') : ''}</TextSubTituloCinza>
      </Col>

      <Col xs={24} md={8}>
      <TextTituloCinza >Título</TextTituloCinza>        
        
        <TextSubTituloCinza>{data.descricao}</TextSubTituloCinza>

        
      </Col>
    </Row>
    </Spin>
  );
};

export default ResumoDoProcesso;
