import React from "react";
import { Row, Col, Spin } from "antd";
import dayjs from "dayjs";

import { TextSubHeadingPreto, TextSubTituloCinza, TextTitulo } from "../../../components/EstilosCompartilhados";
import { resumoDoProcessoStyles } from "./styles";

import type { IProcessoConvocacaoResumo } from "../../../services/resources/convocacao/IConvocacao";

const textColorBlack = { color: "#111111" };

const TIPO_ESCOLHA_LABELS: Record<string, string> = {
  NOVA_AUTORIZACAO: "Nova Autorização",
  REPOSICAO: "Reposição",
  RECONVOCAO: "Reconvocação",
};

function getTipoEscolhaLabel(value: string | undefined): string {
  if (!value) return "—";
  return TIPO_ESCOLHA_LABELS[value] ?? value;
}

export interface ResumoDoProcessoProps {
  data: IProcessoConvocacaoResumo;
  isLoading: boolean;
  useBlackText?: boolean;
  modalidade?: string | null;
}

const ResumoDoProcesso: React.FC<ResumoDoProcessoProps> = ({
  data,
  isLoading,
  useBlackText = false,
  modalidade,
}) => {
  const blackStyle = useBlackText ? textColorBlack : undefined;

  return (
    <Spin spinning={isLoading} tip="Carregando dados do processo..." size="large">
      <Row gutter={30}>
        <Col xs={24} md={24} style={resumoDoProcessoStyles.colWithMargin}>
          <TextSubHeadingPreto style={blackStyle}>
            Dados do processo
          </TextSubHeadingPreto>
        </Col>

        <Col xs={24} md={8}>
          <TextTitulo style={blackStyle}>Concurso</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>{data.concurso_nome}</TextSubTituloCinza>
          <TextTitulo style={blackStyle}>Data da convocação</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>
            {data.data_convocacao ? dayjs(data.data_convocacao).format("DD/MM/YYYY") : ""}
          </TextSubTituloCinza>
        </Col>

        <Col xs={24} md={8}>
          <TextTitulo style={blackStyle}>Tipo de processo</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>{getTipoEscolhaLabel(data.tipo_escolha)}</TextSubTituloCinza>
          <TextTitulo style={blackStyle}>Data da publicação</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>
            {data.data_corte_vagas ? dayjs(data.data_corte_vagas).format("DD/MM/YYYY") : ""}
          </TextSubTituloCinza>
        </Col>

        <Col xs={24} md={8}>
          <TextTitulo style={blackStyle}>Título</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>{data.descricao}</TextSubTituloCinza>
          <TextTitulo style={blackStyle}>Modalidade</TextTitulo>
          <TextSubTituloCinza style={blackStyle}>
            {modalidade ?? "—"}
          </TextSubTituloCinza>
        </Col>
      </Row>
    </Spin>
  );
};

export default ResumoDoProcesso;

