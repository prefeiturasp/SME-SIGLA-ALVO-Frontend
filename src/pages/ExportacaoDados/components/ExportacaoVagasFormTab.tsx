import React, { useState } from "react";
import { Row, Col, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AppFormItem, AppButton, TabContentContainer, StyledSelect, ActionButtonsContainer, formTabStyles, selectSuffixIcon } from '@/components/ui';
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
        <Row style={formTabStyles.introRow}>
          <Title level={5} type="secondary" style={formTabStyles.introTitle}>
            Selecione o processo e o cargo para exportar
          </Title>
        </Row>

        <Row gutter={40} style={formTabStyles.fieldsRow}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="processo_uuid"
              render={({ field }) => (
                <AppFormItem
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
                    suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                  >
                    {processosOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </AppFormItem>
              )}
            />
          </Col>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="cargo_uuid"
              render={({ field }) => (
                <AppFormItem
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
                    suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                  >
                    {cargosOptions.map((opt) => (
                      <Select.Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </AppFormItem>
              )}
            />
          </Col>
        </Row>

      </TabContentContainer>

      <ActionButtonsContainer>
        <AppButton
          variant="secondary"
          size="large"
          onClick={() => setShowHistoricoModal(true)}
        >
          Histórico
        </AppButton>
        <AppButton
          variant="primary"
          size="large"
          disabled={!canAddExportacaoVagasProcesso}
          onClick={handleSubmit(handleExportar)}
          loading={isCreating}
        >
          Exportar
        </AppButton>
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
