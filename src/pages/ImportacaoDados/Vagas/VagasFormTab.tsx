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
  GrupoEsquerda,
} from "../../../components/EstilosCompartilhados";
import { useNavigate } from "react-router-dom";

import { CloudUploadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

interface VagasProps {
  onShowLayoutPadrao: () => void;
}
const { Text, Title } = Typography;
const VagasFormTab: React.FC<VagasProps> = ({ onShowLayoutPadrao }) => {
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
    <TabContentContainer>
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
      

      <Row gutter={40} style={{ marginBottom: "1.8125rem" }}>
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
                  <UploadArea style={{ height: "64px" }} status={formErrors.arquivo ? "error" : undefined}>
                  <GrupoEsquerda>
                  <CloudUploadOutlined style={{ fontSize: 38, color: "#838383" }} />

                    <span style={{ color: "#666", fontSize: "14px", textAlign: "left" }}>
                      {watchedFile
                        ? watchedFile.name
                        : <>
                        Selecione ou arraste e solte aqui <br />o arquivo de importação (.csv)
                          </>                      
                        }
                    </span>
                    </GrupoEsquerda>

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

      
      </TabContentContainer>
    <ActionButtonsContainer>
    <Button type="primary" ghost size="large" onClick={onShowHistorico}>
      Histórico
    </Button>        

    <Button type="primary" size="large" onClick={handleSubmit(handleEnviarForm)}>
    Importar
    </Button>
  </ActionButtonsContainer>
  </>
  );
};

export default VagasFormTab;
