import React, { useState } from "react";
import { Row, Col, Select, Button, Typography, Space } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDados } from "./hooks/useImportacaoDadosHabilitados";
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
import { useNavigate } from "react-router-dom";

interface HabilitadosProps {
  onShowLayoutPadrao: () => void;
  onShowHistorico: () => void;

}

const HabilitadosFormTab: React.FC<HabilitadosProps> = ({
    onShowLayoutPadrao,
    onShowHistorico,
}) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch    
  } = useImportacaoDados();
  const navigate = useNavigate();
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");
  
  return (
    <>
    <TabContentContainer>
      

        <Row
          
          gutter={40}
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

export default HabilitadosFormTab;
