import React from "react";
import { Row, Col, Select, Button, Typography, Space } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDados } from "./hooks/useImportacaoDados";
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
import { useConcursos } from "../../../hooks/useConcursos";
import Title from "antd/es/typography/Title";
import { CloudUploadOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  onChange(info) {
    const { status } = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  },
};

import { DownloadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

interface HabilitadosProps {
  onShowHistorico: () => void;
  onShowLayoutPadrao: () => void;
}

const { Text } = Typography;
const Habilitados: React.FC<HabilitadosProps> = ({
  onShowHistorico,
  onShowLayoutPadrao,
}) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch,
    importacoesArquivos,
    importacoesArquivosIsLoading,
    handleBaixarArquivo,
  } = useImportacaoDados();
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");

  return (
    <TabContentContainer>
      <>
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
            <Button      
              size="large"
              onClick={() => handleBaixarArquivo("HABILITADOS")}
            >
              <DownloadOutlined /> Layout Padrão
            </Button>

            <Text style={{ fontSize: "14px" }}>
              O Layout padrão mostra o formato correto dos campos e colunas que
              você deve preencher para que a importação funcione sem erros.
            </Text>
          </Space>
        </Row>

        <Row
          style={{
            marginBottom: "1.8125rem",
          }}
          gutter={16}
        >
          <Col xs={24} sm={12}>
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
                    loading={concursosOptionsIsLoading}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {Array.isArray(concursosData)
                      ? concursosData.map((concurso: any) => (
                          <Select.Option
                            key={concurso.value}
                            value={concurso.value}
                          >
                            {concurso.label}
                          </Select.Option>
                        ))
                      : concursosData?.results?.map((concurso: any) => (
                          <Select.Option
                            key={concurso.value}
                            value={concurso.value}
                          >
                            {concurso.label}
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

      <ActionButtonsContainer>
        <Button type="primary" ghost size="large" onClick={onShowHistorico}>
          Histórico
        </Button>        

        <Button type="primary" size="large" onClick={handleSubmit(handleEnviarForm)}>
        Importar
        </Button>
      </ActionButtonsContainer>
      </>
    </TabContentContainer>
  );
};

export default Habilitados;
