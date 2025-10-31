import React from "react";
import { Row, Col, Button, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { PrimaryButton, SecondaryButton } from "../../../components/EstilosCompartilhados";

interface StepActionsProps {
  current: number;
  steps: { title: string }[];
  next: () => void | Promise<void>;
  prev: () => void;
  onCancel?: () => void;  
  loading?: boolean;
}

export const StepActions: React.FC<StepActionsProps> = ({
  current,
  steps,
  next,
  prev,
  onCancel,
  loading,
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
            <Button
              size="large"
              variant="outlined"
              icon={<LeftOutlined />}
              style={{ margin: "0 8px" }}
              onClick={prev}
            >
              Voltar
            </Button>
          )}

          {current < steps.length - 1 && (
            <Button
              size="large"
              iconPosition="end"
              icon={<RightOutlined />}
              type="primary"
              style={{ margin: "0 8px" }}
              onClick={next} 
              loading={loading}            
            >
              Salvar e avançar
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button
              type="primary"
              size="large"
              style={{ margin: "0 8px" }}
              onClick={next}
            >
              Finalizar
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
