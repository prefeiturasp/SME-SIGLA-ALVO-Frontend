import React from "react";
import { Col, Row, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { ActionButton, StyledCardWithoutBorder } from "@/components/ui";

const { Text } = Typography;

const CardFixo = styled.div`
  position: fixed;
  bottom: 1.5rem;
  left: 8.625rem;
  right: 2.5rem;
  z-index: 20;
`;

const CardConteudo = styled(StyledCardWithoutBorder)`
  margin: 0;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.12);
`;

const ColBotao = styled(Col)`
  text-align: right;
`;

export interface CardHistoricoProcessosProps {
  onAbrirHistorico: () => void;
}

const CardHistoricoProcessos: React.FC<CardHistoricoProcessosProps> = ({
  onAbrirHistorico,
}) => {
  return (
    <CardFixo data-testid="card-historico-processos">
      <CardConteudo variant="borderless">
        <Row align="middle" justify="space-between" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Text>
              Acesse o histórico de convocações dos processos selecionados.
            </Text>
          </Col>
          <ColBotao xs={24} md={8}>
            <ActionButton
              size="large"
              icon={<HistoryOutlined />}
              onClick={onAbrirHistorico}
            >
              Histórico de candidatos
            </ActionButton>
          </ColBotao>
        </Row>
      </CardConteudo>
    </CardFixo>
  );
};

export default CardHistoricoProcessos;
