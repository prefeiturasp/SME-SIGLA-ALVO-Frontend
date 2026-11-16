import React, { useState } from "react";
import { Row, Col, Select, Typography } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { useExportacaoLotes } from "../hooks/useExportacaoLotes";
import HistoricoExportacaoLotesModal from "./HistoricoExportacaoLotesModal";

import { AppFormItem, AppButton, TabContentContainer, StyledSelect, ActionButtonsContainer, formTabStyles, selectSuffixIcon } from '@/components/ui';
const { Title } = Typography;

const ExportacaoLotesFormTab: React.FC = () => {
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);

  const {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosOptionsLoading,
    lotesOptions,
    lotesOptionsLoading,
    concursoUuid,
    handleConcursoChange,
    handleLoteChange,
    handleExportar,
    isCreating,
  } = useExportacaoLotes();

  return (
    <>
      <TabContentContainer>
        <Row style={formTabStyles.introRow}>
          <Title level={5} type="secondary" style={formTabStyles.introTitle}>
            Selecione o concurso e o número de lote para exportar os dados do SIGPEC
          </Title>
        </Row>

        <Row gutter={40} style={formTabStyles.fieldsRow}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="concurso_uuid"
              render={({ field }) => (
                <AppFormItem
                  label="Concurso"
                  validateStatus={formErrors.concurso_uuid ? "error" : undefined}
                  help={formErrors.concurso_uuid?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    value={field.value}
                    onChange={(value: unknown) =>
                      handleConcursoChange(value as string | undefined)
                    }
                    placeholder="Selecione o concurso"
                    loading={concursosOptionsLoading}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                  >
                    {concursosOptions.map((opt) => (
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
              name="numero_lote"
              render={({ field }) => (
                <AppFormItem
                  label="Número do Lote"
                  validateStatus={formErrors.numero_lote ? "error" : undefined}
                  help={formErrors.numero_lote?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    value={field.value}
                    onChange={(value: unknown) => {
                      field.onChange(value);
                      handleLoteChange(value as number | undefined);
                    }}
                    placeholder="Selecione o lote"
                    loading={lotesOptionsLoading}
                    disabled={!concursoUuid}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
                  >
                    {lotesOptions.map((opt) => (
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
          onClick={handleSubmit(handleExportar)}
          loading={isCreating}
        >
          Exportar
        </AppButton>
      </ActionButtonsContainer>

      <HistoricoExportacaoLotesModal
        open={showHistoricoModal}
        onClose={() => setShowHistoricoModal(false)}
      />
    </>
  );
};

export default ExportacaoLotesFormTab;
