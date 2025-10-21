import React from "react";
import { Row, Col, Select, Input, DatePicker, Typography, Form } from "antd";
import type { Control, FieldErrors } from "react-hook-form";
import { TextSubHeading, TextSubTituloCinza, TextTituloCinza } from "../../../components/EstilosCompartilhados";
import type { FormFields } from "../../Processos/NovaConvocacaoCandidatos/hooks/useNovaConvocacaoCandidatos";

const { Text } = Typography;
const { Paragraph } = Typography;

export type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};

interface ResumoDoProcessoProps {
  
  formErrors?: FieldErrors<FormFields>;
}

const ResumoDoProcesso: React.FC<ResumoDoProcessoProps> = ({
  
}) => {
  return (
    <Row gutter={30}>
      <Col xs={24} md={24} style={{marginBottom: '1rem'}}>
      <TextSubHeading>Dados do processo</TextSubHeading>
      </Col>

      <Col xs={24} md={8}>
        <TextTituloCinza >Concurso</TextTituloCinza>
        <TextSubTituloCinza>10ª CONV COORDENADOR PEDAGÓGICO</TextSubTituloCinza>        
        <TextTituloCinza >Número da convocação</TextTituloCinza>
        <TextSubTituloCinza >00057869-12</TextSubTituloCinza>
      </Col>

      <Col xs={24} md={8}>
      <TextTituloCinza >Tipo de processo</TextTituloCinza>
        
        <TextSubTituloCinza>Escolha</TextSubTituloCinza>
        <TextTituloCinza >Data da convocação</TextTituloCinza>        
        <TextSubTituloCinza>12/06/2025</TextSubTituloCinza>
      </Col>

      <Col xs={24} md={8}>
      <TextTituloCinza >Título</TextTituloCinza>        
        
        <TextSubTituloCinza>Descrição do título</TextSubTituloCinza>
        
        <TextTituloCinza  >Data da publicação</TextTituloCinza>        
        <TextSubTituloCinza >26/09/2025</TextSubTituloCinza>
      </Col>
    </Row>
  );
};

export default ResumoDoProcesso;
