import React from "react";
import { Row, Col, Button, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface StepActionsProps {
  current: number;
  steps: { title: string }[];
  next: () => void;
  prev: () => void;
  onCancel?: () => void;
}

export const StepActions: React.FC<StepActionsProps> = ({
  current,
  steps,
  next,
  prev,
  onCancel,
}) => {
  return (
    <div style={{ marginTop: 24 }}>
      <Row align="middle" justify="space-between">
        {/* Botão Cancelar à esquerda */}
        <Col>
          <Button
            style={{ margin: "0 8px" }}
            onClick={onCancel ?? (() => console.log("cancelar"))}
          >
            Cancelar
          </Button>
        </Col>

        {/* Ações à direita */}
        <Col>
          {current > 0 && (
            <Button
              icon={<LeftOutlined />}
              style={{ margin: "0 8px" }}
              onClick={prev}
            >
              Voltar
            </Button>
          )}

          {current < steps.length - 1 && (
            <Button
              iconPosition="end"
              icon={<RightOutlined />}
              type="primary"
              style={{ margin: "0 8px" }}
              onClick={next}
            >
              Salvar e avançar
            </Button>
          )}

          {current === steps.length - 1 && (
            <Button
              type="primary"
              style={{ margin: "0 8px" }}
              onClick={() => message.success("Processo concluído!")}
            >
              Finalizar
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
