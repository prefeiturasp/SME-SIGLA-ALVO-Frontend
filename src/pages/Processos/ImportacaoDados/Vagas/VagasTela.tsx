import React from "react";
import { Row, Col, Select, DatePicker, Radio } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosVagas } from "./hooks/useImportacaoDadosVagas";

import { useNavigate } from "react-router-dom";

import { AppFormItem, AppButton, TabContentContainer, SectionCard, SectionTitle, StyledSelect, UploadArea, StyledUpload, ActionButtonsContainer } from '@/components/ui';
interface VagasProps {
  onShowLayoutPadrao: () => void;
}

const Vagas: React.FC<VagasProps> = ({ onShowLayoutPadrao }) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
    watch,
  } = useImportacaoDadosVagas();

  const navigate = useNavigate();

  const onShowHistorico = () => {
    navigate("/processos/importacao-dados/historico-vagas");
  };
  const watchedFile = watch("arquivo");

  return (
    <TabContentContainer>
      <SectionCard>
        <SectionTitle>Vagas</SectionTitle>
        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>
            <Controller
              control={control}
              name="processo_convocacao"
              render={({ field }) => (
                <AppFormItem
                  label="Processo de convocação"
                  validateStatus={formErrors.processo_convocacao ? "error" : undefined}
                  help={formErrors.processo_convocacao?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    value={field.value}
                    onChange={(value: unknown) => field.onChange(value as string | undefined)}
                    placeholder="Selecione o processo de convocação"
                    loading={processosConvocacaoOptionsIsLoading}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {Array.isArray(processosConvocacaoOptions) && processosConvocacaoOptions.map((processoConvocacao: any) => (
                          <Select.Option
                            key={processoConvocacao.value}
                            value={processoConvocacao.value}
                          >
                            {processoConvocacao.label}
                          </Select.Option>
                        ))
                      }
                  </StyledSelect>
                </AppFormItem>
              )}
            />
          </Col>
        </Row>

        <Row gutter={[0, 8]}>
          <Col xs={24} sm={9}>
            <Controller
              control={control}
              name="arquivo"
              render={() => (
                <AppFormItem
                  label="Arquivo para importação"
                  validateStatus={formErrors.arquivo ? "error" : undefined}
                  help={formErrors.arquivo?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledUpload
                    beforeUpload={(file) => {
                      handleFileUpload(file);
                      return false;
                    }}
                    accept=".csv"
                    showUploadList={false}
                    multiple={false}
                  >
                    <UploadArea>
                      <span style={{ color: "#666", fontSize: "0.875rem" }}>
                        {watchedFile
                          ? watchedFile.name
                          : "Clique ou arraste os arquivos"}
                      </span>
                      <UploadFileIcon
                        style={{ fontSize: "1.50rem", color: "#032B68" }}
                      />
                    </UploadArea>
                  </StyledUpload>
                </AppFormItem>
              )}
            />
          </Col>
        </Row>
      </SectionCard>

      <ActionButtonsContainer>
        <AppButton variant="secondary" size="large" onClick={onShowHistorico}>
          Histórico
        </AppButton>

        <AppButton
          variant="secondary"
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
        >
          Importar
        </AppButton>

        <AppButton variant="primary" size="large" onClick={onShowLayoutPadrao}>
          Layout padrão
        </AppButton>
      </ActionButtonsContainer>
    </TabContentContainer>
  );
};

export default Vagas;
