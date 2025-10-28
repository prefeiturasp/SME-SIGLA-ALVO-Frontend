import React from "react";
import {
  Row,
  Col,
  Select,
  DatePicker,
  Radio,
  Button,
  Typography,
  Space,
} from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosVagas } from "./hooks/useImportacaoDadosVagas";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  SectionCard,
  SectionTitle,
  StyledSelect,
  UploadArea,
  StyledUpload,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import { useNavigate } from "react-router-dom";

import { CloudUploadOutlined, DownloadOutlined } from "@ant-design/icons";
import Dragger from "antd/es/upload/Dragger";
import FormItem from "antd/es/form/FormItem";

interface VagasProps {
  onShowLayoutPadrao: () => void;
}
const { Text, Title } = Typography;
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
    handleBaixarArquivo,
  } = useImportacaoDadosVagas();

  const navigate = useNavigate();

  const onShowHistorico = () => {
    navigate("/processos/importacao-dados/historico-vagas");
  };
  const watchedFile = watch("arquivo");

  return (
    <>
      <Row style={{ marginBottom: "1.8125rem" }}>
        <Title level={5} type="secondary" style={{ marginTop: "0" }}>
          Selecione abaixo o tipo de arquivo que deseja carregar
        </Title>

        <Text style={{ fontSize: "14px" }}>
          Nesta aba, você pode consultar as vagas atualmente disponíveis nas
          escolas da rede. As vagas são atualizadas conforme a movimentação de
          servidores e a necessidade das unidades. Utilize os filtros para
          localizar oportunidades por cargo, escola, região ou outros critérios
          e acompanhe em tempo real as opções abertas para escolha.
        </Text>
      </Row>
      <Row
        gutter={[0, 16]}
        style={{
          padding: "20px 16px",
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          marginBottom: "1.8125rem",
        }}
      >
        <Space size={16}>
          <Button onClick={() => handleBaixarArquivo("VAGAS")}>
            <DownloadOutlined /> Layout Padrão
          </Button>

          <Text style={{ fontSize: "14px" }}>
            O Layout padrão mostra o formato correto dos campos e colunas que
            você deve preencher para que a importação dos dados funcione sem
            erros.
          </Text>
        </Space>
      </Row>

      <Row gutter={16} style={{ marginBottom: "1.8125rem" }}>
        <Col xs={24} sm={12}>
          <Controller
            control={control}
            name="processo_convocacao"
            render={({ field }) => (
              <CustomFormItem
                label="Processo de convocação"
                validateStatus={
                  formErrors.processo_convocacao ? "error" : undefined
                }
                help={formErrors.processo_convocacao?.message}
                labelCol={{ span: 24 }}
              >
                <StyledSelect
                  value={field.value}
                  onChange={(value: unknown) =>
                    field.onChange(value as string | undefined)
                  }
                  placeholder="Selecione o processo"
                  loading={processosConvocacaoOptionsIsLoading}
                  allowClear
                  suffixIcon={
                    <ExpandMoreIcon
                      style={{ fontSize: "1.5rem", color: "#032B68" }}
                    />
                  }
                >
                  {Array.isArray(processosConvocacaoOptions) &&
                    processosConvocacaoOptions.map(
                      (processoConvocacao: any) => (
                        <Select.Option
                          key={processoConvocacao.value}
                          value={processoConvocacao.value}
                        >
                          {processoConvocacao.label}
                        </Select.Option>
                      )
                    )}
                </StyledSelect>
              </CustomFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12}>
          <Controller
            control={control}
            name="arquivo"
            render={() => (
              <FormItem
                validateStatus={formErrors.arquivo ? "error" : undefined}
                help={formErrors.arquivo?.message}
                labelCol={{ span: 24 }}
              >
                <StyledUpload
                  beforeUpload={(file) => {
                    handleFileUpload(file);
                    return false;
                    // Impede o upload automático
                  }}
                  accept=".csv"
                  showUploadList={false}
                  multiple={false}
                >
                  <UploadArea style={{ height: "80px" }}>
                  <CloudUploadOutlined style={{ fontSize: 40, color: "#BFBFBF" }} />

                    <span style={{ color: "#666", fontSize: "0.875rem" }}>
                      {watchedFile
                        ? watchedFile.name
                        : "Selecione ou arraste e solte aqui o arquivo de importação"}
                    </span>
                    <Button type="primary" size="small" style={{ fontSize: "14px" }}>
                      Selecionar
                    </Button>
                  </UploadArea>
                </StyledUpload>
              </FormItem>
            )}
          />
        </Col>
      </Row>

      {/* <ActionButtonsContainer>
        <Button type="primary" ghost size="large" onClick={onShowHistorico}>
          Histórico
        </Button>

        <Button
          type="primary"
          ghost
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
        >
          Importar
        </Button>

        <Button type="primary" size="large" onClick={onShowLayoutPadrao}>
          Layout padrão
        </Button>
      </ActionButtonsContainer> */}
    </>
  );
};

export default Vagas;
