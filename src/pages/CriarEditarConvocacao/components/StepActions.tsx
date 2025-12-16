import React from "react";
import { Row, Col, Button, message, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../../components/EstilosCompartilhados";

interface StepActionsProps {
  current: number;
  steps: { title: string }[];
  next: () => void | Promise<void>;
  prev: () => void;
  onCancel?: () => void;
  loading?: boolean;
  canSalvarEAvancar: boolean;
  canVoltar: boolean;
  temPeriodosAgenda?: boolean;
}

export const StepActions: React.FC<StepActionsProps> = ({
  current,
  steps,
  next,
  prev,
  onCancel,
  loading,
  canSalvarEAvancar,
  canVoltar,
  temPeriodosAgenda = true,
}) => {
  return (
    <div style={{ marginTop: 24 }}>
      <Row align="middle" justify="space-between">
        {/* Botão Cancelar à esquerda */}
        <Col>
        {onCancel && (
          <Button
            size="large"
            style={{ margin: "0 8px" }}
            onClick={onCancel}
          >
            Cancelar
            </Button>
          )}
        </Col>

        {/* Ações à direita */}
        <Col>
          {current > 0 && (
            <Tooltip
              title={
                !canVoltar
                  ? "Você não possui permissão para essa ação"
                  : "Voltar"
              }
              arrow={true}
            >
              <SecondaryButton
                icon={<LeftOutlined />}
                style={{ margin: "0 8px" }}
                onClick={prev}
                disabled={!canVoltar}
              >
                Voltar
              </SecondaryButton>
            </Tooltip>
          )}

          {current < steps.length - 1 && (
            <Tooltip
              title={
                !canSalvarEAvancar
                  ? "Você não possui permissão para essa ação"
                  : !temPeriodosAgenda
                  ? "Adicione pelo menos um período de agenda para continuar"
                  : "Salvar e avançar"
              }
              arrow={true}
            >
              <PrimaryButton
                iconPosition="end"
                icon={<RightOutlined />}
                type="primary"
                style={{ margin: "0 8px" }}
                onClick={next}
                loading={loading}
                disabled={!canSalvarEAvancar || !temPeriodosAgenda}
              >
                Salvar e avançar
              </PrimaryButton>
            </Tooltip>
          )}

          {current === steps.length - 1 && (
            <Tooltip
              title={
                !canSalvarEAvancar
                  ? "Você não possui permissão para essa ação"
                  : "Finalizar"
              }
              arrow={true}
            >
              <PrimaryButton
                type="primary"
                style={{ margin: "0 8px" }}
                onClick={next}
                disabled={!canSalvarEAvancar}
              >
                Finalizar
              </PrimaryButton>
            </Tooltip>
          )}
        </Col>
      </Row>
    </div>
  );
};
