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
import { useExportacaoCandidatos } from "../hooks/useExportacaoCandidatos";
import HistoricoExportacaoCandidatosModal from "./HistoricoExportacaoCandidatosModal";

const { Title } = Typography;

interface ExportacaoCandidatosFormTabProps {
  tipo: string;
  canViewExportacaoCandidatosProcesso: boolean;
  canAddExportacaoCandidatosProcesso: boolean;
}

const ExportacaoCandidatosFormTab: React.FC<ExportacaoCandidatosFormTabProps> = (
  {tipo, canViewExportacaoCandidatosProcesso, canAddExportacaoCandidatosProcesso }  ) => {
    
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
  } = useExportacaoCandidatos(tipo);

  return (
    <>
      <TabContentContainer>
        <Row style={{ marginBottom: "1.8125rem" }}>
          <Title level={5} type="secondary" style={{ marginTop: "0" }}>
            Selecione o processo e o cargo para exportar os candidatos
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
                    disabled={!canAddExportacaoCandidatosProcesso}
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
          disabled={!canAddExportacaoCandidatosProcesso}
          type="primary"
          size="large"
          onClick={handleSubmit(handleExportar)}
          loading={isCreating}
        >
          Exportar
        </Button>
      </ActionButtonsContainer>

      <HistoricoExportacaoCandidatosModal
        open={showHistoricoModal}
        onClose={() => setShowHistoricoModal(false)}
      />
    </>
  );
};

export default ExportacaoCandidatosFormTab;
