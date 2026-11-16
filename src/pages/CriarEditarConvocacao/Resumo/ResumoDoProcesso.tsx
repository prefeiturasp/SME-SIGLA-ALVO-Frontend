import React from "react";
import { Row, Col, Spin, Typography } from "antd";
import dayjs from "dayjs";

import { processInfoStyles } from "@/design-system/estilos";

import type { IProcessoConvocacaoResumo } from "../../../services/resources/convocacao/IConvocacao";

const { Text } = Typography;

const textColorBlack = { color: "#111111" };

const contentStyle: React.CSSProperties = {
  lineHeight: "normal",
  textAlign: "left",
  borderRadius: "0.5rem",
  marginTop: 0,
};

const TIPO_ESCOLHA_LABELS: Record<string, string> = {
  NOVA_AUTORIZACAO: "Nova Autorização",
  REPOSICAO: "Reposição",
  RECONVOCAO: "Reconvocação",
  MANDADO_JUDICIAL: "Mandado Judicial",
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
  const labelStyle = { ...processInfoStyles.label, ...blackStyle };
  const valueStyle = { ...processInfoStyles.value, ...blackStyle };

  return (
    <Spin spinning={isLoading} tip="Carregando dados do processo..." size="large">
      <div style={contentStyle}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Concurso:
              </Text>
              <Text style={valueStyle}>{data.concurso_nome}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Data da convocação:
              </Text>
              <Text style={valueStyle}>
                {data.data_convocacao ? dayjs(data.data_convocacao).format("DD/MM/YYYY") : ""}
              </Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Tipo de Escolha:
              </Text>
              <Text style={valueStyle}>{getTipoEscolhaLabel(data.tipo_escolha)}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Data corte de vagas:
              </Text>
              <Text style={valueStyle}>
                {data.data_corte_vagas ? dayjs(data.data_corte_vagas).format("DD/MM/YYYY") : ""}
              </Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Descrição:
              </Text>
              <Text style={valueStyle}>{data.descricao}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={processInfoStyles.container}>
              <Text strong style={labelStyle}>
                Modalidade:
              </Text>
              <Text style={valueStyle}>{modalidade ?? "—"}</Text>
            </div>
          </Col>
        </Row>
      </div>
    </Spin>
  );
};

export default ResumoDoProcesso;

