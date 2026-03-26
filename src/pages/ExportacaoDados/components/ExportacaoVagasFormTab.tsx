import React, { useState } from "react";
import { Row, Col, Button, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  StyledSelect,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import { useExportacaoVagas } from "../hooks/useExportacaoVagas";
import HistoricoExportacaoModal from "./HistoricoExportacaoModal";
import type { ExportacaoTipo } from "../../../services/resources/exportacaoDados/types";

const { Title } = Typography;

interface ExportacaoVagasFormTabProps {
  tipo: ExportacaoTipo;
  canViewExportacaoVagasProcesso: boolean;
  canAddExportacaoVagasProcesso: boolean;
}

const ExportacaoVagasFormTab: React.FC<ExportacaoVagasFormTabProps> = (
  { tipo, canViewExportacaoVagasProcesso, canAddExportacaoVagasProcesso}
) => {
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  const {
    control,
    handleSubmit,
    formErrors,
    processosOptions,
    processosOptionsLoading,
    cargosOptions,
    cargosOptionsLoading,
    processoUuid,
    handleProcessoChange,
    handleExportar,
    isCreating,
  } = useExportacaoVagas(tipo);

  return (
    <>
      <TabContentContainer>
        <Row style={{ marginBottom: "1.8125rem" }}>
          <Title level={5} type="secondary" style={{ marginTop: "0" }}>
            Selecione o processo e o cargo para exportar
          </Title>
        </Row>

        <Row gutter={40} style={{ marginBottom: "1.8125rem" }}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="processo_uuid"
              render={({ field }) => (
                <CustomFormItem
                  label="Processo de convocação"
                  validateStatus={formErrors.processo_uuid ? "error" : undefined}
                  help={formErrors.processo_uuid?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    disabled={!canAddExportacaoVagasProcesso}
                    value={field.value}
                    onChange={(value: unknown) =>
                      handleProcessoChange(value as string | undefined)
                    }
                    placeholder="Selecione o processo"
                    loading={processosOptionsLoading}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {processosOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="cargo_uuid"
              render={({ field }) => (
                <CustomFormItem
                  label="Cargo"
                  validateStatus={formErrors.cargo_uuid ? "error" : undefined}
                  help={formErrors.cargo_uuid?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    value={field.value}
                    onChange={(value: unknown) =>
                      field.onChange(value as string | undefined)
                    }
                    placeholder="Selecione o cargo"
                    loading={cargosOptionsLoading}
                    disabled={!processoUuid}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {cargosOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>
        </Row>

      </TabContentContainer>

      <ActionButtonsContainer>
        <Button
          type="primary"
          ghost
          size="large"
          onClick={() => setShowHistoricoModal(true)}
        >
          Histórico
        </Button>
        <Button
          disabled={!canAddExportacaoVagasProcesso}
          type="primary"
          size="large"
          onClick={handleSubmit(handleExportar)}
          loading={isCreating}
        >
          Exportar
        </Button>
      </ActionButtonsContainer>

      <HistoricoExportacaoModal
        open={showHistoricoModal}
        onClose={() => setShowHistoricoModal(false)}
        tipo={tipo}
      />
    </>
  );
};

export default ExportacaoVagasFormTab;
