import React from "react";
import { Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AppButton } from "@/components/ui";

interface StepActionsConcursoProps {
  current: number;
  steps: { title: string }[];
  next: () => void | Promise<void>;
  prev: () => void;
  onCancel?: () => void;
  loading?: boolean;
  canAvancar?: boolean;
  canVoltar?: boolean;
  /** Texto do botão do último passo (ex.: "Salvar" na edição). */
  labelFinal?: string;
}

export const StepActionsConcurso: React.FC<StepActionsConcursoProps> = ({
  current,
  steps,
  next,
  prev,
  onCancel,
  loading,
  canAvancar = true,
  canVoltar = true,
  labelFinal = "Adicionar concurso",
}) => {
  const isUltimoPasso = current === steps.length - 1;

  return (
    <div style={{ marginTop: 24 }}>
      <Row align="middle" justify="end">
        <Col>
          {onCancel && (
            <AppButton
              variant="secondary"
              style={{ margin: "0 8px" }}
              onClick={onCancel}
            >
              Cancelar
            </AppButton>
          )}

          <AppButton
            variant="secondary"
            style={{ margin: "0 8px" }}
            onClick={prev}
            disabled={current === 0 || !canVoltar}
          >
            Anterior
          </AppButton>

          {!isUltimoPasso ? (
            <AppButton
              variant="primary"
              style={{ margin: "0 8px" }}
              onClick={next}
              loading={loading}
              disabled={!canAvancar}
            >
              Próximo
            </AppButton>
          ) : (
            <AppButton
              variant="primary"
              icon={<PlusOutlined />}
              style={{ margin: "0 8px" }}
              onClick={next}
              loading={loading}
              disabled={!canAvancar}
            >
              {labelFinal}
            </AppButton>
          )}
        </Col>
      </Row>
    </div>
  );
};
