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
import { useExportacaoLotes } from "../hooks/useExportacaoLotes";
import HistoricoExportacaoLotesModal from "./HistoricoExportacaoLotesModal";

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
        <Row style={{ marginBottom: "1.8125rem" }}>
          <Title level={5} type="secondary" style={{ marginTop: "0" }}>
            Selecione o concurso e o número de lote para exportar os dados do SIGPEC
          </Title>
        </Row>

        <Row gutter={40} style={{ marginBottom: "1.8125rem" }}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="concurso_uuid"
              render={({ field }) => (
                <CustomFormItem
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
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {concursosOptions.map((opt) => (
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
              name="numero_lote"
              render={({ field }) => (
                <CustomFormItem
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
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {lotesOptions.map((opt) => (
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
          type="primary"
          size="large"
          onClick={handleSubmit(handleExportar)}
          loading={isCreating}
        >
          Exportar
        </Button>
      </ActionButtonsContainer>

      <HistoricoExportacaoLotesModal
        open={showHistoricoModal}
        onClose={() => setShowHistoricoModal(false)}
      />
    </>
  );
};

export default ExportacaoLotesFormTab;
