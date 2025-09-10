import React from "react";
import { Row, Col, Select } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useImportacaoDados } from "./hooks/useImportacaoDados";
import { CustomFormItem } from "../../../../components/formStyle/styles";
import {
  TabContentContainer,
  SectionCard,
  SectionTitle,
  StyledSelect,
  UploadArea,
  StyledUpload,
  ActionButtonsContainer,
  SecondaryButton,
  PrimaryButton,
} from "../Habilitados/styles";
import { useCargos } from "../../NovaConvocacaoCandidatos/hooks/useCargos";



interface VagasProps {
  onShowHistorico: () => void;
  onShowLayoutPadrao: () => void;
}

const Vagas: React.FC<VagasProps> = ({ onShowHistorico, onShowLayoutPadrao }) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch,
    importacoesArquivos,
    importacoesArquivosIsLoading,
  } = useImportacaoDados();
  const { cargosData, cargosIsLoading } = useCargos();
  const watchedFile = watch("arquivo");

  return (
    <TabContentContainer>
      <SectionCard>
        <SectionTitle>
          Vagas
        </SectionTitle>

        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>
             
          </Col>
        </Row>

        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>
            <Controller
              control={control}
              name="cargo"
              render={({ field }) => (
                <CustomFormItem
                  label="Cargo"
                  validateStatus={formErrors.cargo ? "error" : undefined}
                  help={formErrors.cargo?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    {...field}
                    placeholder="Selecione o cargo"
                    loading={cargosIsLoading}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: '1.5rem', color: '#032B68' }} />}
                  >
                    {Array.isArray(cargosData) ? cargosData.map((cargo: any) => (
                      <Select.Option key={cargo.value} value={cargo.value}>
                        {cargo.label}
                      </Select.Option>
                    )) : cargosData?.results?.map((cargo: any) => (
                      <Select.Option key={cargo.value} value={cargo.value}>
                        {cargo.label}
                      </Select.Option>
                    ))}
                  </StyledSelect>
                </CustomFormItem>
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
                <CustomFormItem
                  label="Arquivo para importação"
                  validateStatus={formErrors.arquivo ? "error" : undefined}
                  help={formErrors.arquivo?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledUpload
                    beforeUpload={(file) => {
                      handleFileUpload(file);
                      return false; // Impede o upload automático
                    }}
                    accept=".csv"
                    showUploadList={false}
                    multiple={false}
                  >
                    <UploadArea>
                      <span style={{ color: '#666', fontSize: '0.875rem' }}>
                        {watchedFile ? watchedFile.name : 'Clique ou arraste os arquivos'}
                      </span>
                      <UploadFileIcon style={{ fontSize: '1.50rem', color: '#032B68' }} />
                    </UploadArea>
                  </StyledUpload>
                </CustomFormItem>
              )}
            />
          </Col>
        </Row>
        
      </SectionCard>
      
      {/* Botões de Ação */}
      <ActionButtonsContainer>
              
        <SecondaryButton
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
        >
          Importar
        </SecondaryButton>
        
        <PrimaryButton
          type="primary"
          size="large"
          onClick={onShowLayoutPadrao}
        >
          Layout padrão
        </PrimaryButton>
      </ActionButtonsContainer>
    </TabContentContainer>
  );
};

export default Vagas;
