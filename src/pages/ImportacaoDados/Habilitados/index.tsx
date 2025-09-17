import React from "react";
import { Row, Col, Select, Button } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useImportacaoDados } from "./hooks/useImportacaoDados";
import { CustomFormItem } from "../../../components/formStyle/styles";
import {
  TabContentContainer,
  SectionCard,
  SectionTitle,
  StyledSelect,
  UploadArea,
  StyledUpload,
  ActionButtonsContainer,
} from "../../../components/estilosCompartilhados/styles";
import { useConcursos } from "../../../hooks/useConcursos";



interface HabilitadosProps {
  onShowHistorico: () => void;
  onShowLayoutPadrao: () => void;
}

const Habilitados: React.FC<HabilitadosProps> = ({ onShowHistorico, onShowLayoutPadrao }) => {
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
  const { concursosData, concursosIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");

  return (
    <TabContentContainer>
      <SectionCard>
        <SectionTitle>
          Arquivo de Classificados - Habilitados Responsável (.csv)
        </SectionTitle>
        
        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>
            <Controller
              control={control}
              name="concurso"
              render={({ field }) => (
                <CustomFormItem
                  label="Concurso"
                  validateStatus={formErrors.concurso ? "error" : undefined}
                  help={formErrors.concurso?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    {...field}
                    placeholder="Selecione o concurso"
                    loading={concursosIsLoading}
                    allowClear
                    suffixIcon={<ExpandMoreIcon style={{ fontSize: '1.5rem', color: '#032B68' }} />}
                  >
                    {Array.isArray(concursosData) ? concursosData.map((concurso: any) => (
                      <Select.Option key={concurso.value} value={concurso.value}>
                        {concurso.label}
                      </Select.Option>
                    )) : concursosData?.results?.map((concurso: any) => (
                      <Select.Option key={concurso.value} value={concurso.value}>
                        {concurso.label}
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
        <Button
          type="primary"
          ghost
          size="large"
          onClick={onShowHistorico}
          style={{
            fontWeight: 700,
            borderRadius: '0.375rem'
          }}
        >
          Histórico
        </Button>
        <Button
          type="primary"
          ghost
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
          style={{
            fontWeight: 700,
            borderRadius: '0.375rem'
          }}
        >
          Importar
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={onShowLayoutPadrao}
        >
          Layout padrão
        </Button>
      </ActionButtonsContainer>
    </TabContentContainer>
  );
};

export default Habilitados;


