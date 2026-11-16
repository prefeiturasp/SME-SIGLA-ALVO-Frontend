import React from "react";
import { Row, Col, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppButton } from '@/components/ui';

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
        <Col>
          {onCancel && (
            <AppButton
              variant="secondary"
              size="large"
              style={{ margin: "0 8px" }}
              onClick={onCancel}
            >
              Cancelar
            </AppButton>
          )}
        </Col>

        <Col>
          {current > 0 && (
            <AppButton
              variant="secondary"
              icon={<LeftOutlined />}
              style={{ margin: "0 8px" }}
              onClick={prev}
              disabled={!canVoltar}
            >
              Voltar
            </AppButton>
          )}

          {current < steps.length - 1 && (
            <AppButton
              iconPosition="end"
              icon={<RightOutlined />}
              style={{ margin: "0 8px" }}
              onClick={next}
              loading={loading}
              disabled={!canSalvarEAvancar || !temPeriodosAgenda}
            >
              Salvar e avançar
            </AppButton>
          )}

          {current === steps.length - 1 && (
            <AppButton
              style={{ margin: "0 8px" }}
              onClick={next}
              disabled={!canSalvarEAvancar}
            >
              Finalizar
            </AppButton>
          )}
        </Col>
      </Row>
    </div>
  );
};
