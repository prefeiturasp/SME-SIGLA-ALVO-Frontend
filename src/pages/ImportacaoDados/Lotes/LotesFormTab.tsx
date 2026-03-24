import React from "react";
import { Row, Col, Select, Button } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosLotes } from "./hooks/useImportacaoDadosLotes";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  StyledSelect,
  UploadArea,
  StyledUpload,
  ActionButtonsContainer,
  GrupoEsquerda,
} from "../../../components/EstilosCompartilhados";
import { useConcursos } from "../../../hooks/useConcursos";
import { CloudUploadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";

const LotesFormTab: React.FC = () => {
  const { control, formErrors, handleFileUpload, handleSubmit, handleEnviarForm, watch } =
    useImportacaoDadosLotes();
  const navigate = useNavigate();
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");

  return (
    <>
      <TabContentContainer>
        <Row gutter={40}>
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
                      <ExpandMoreIcon style={{ fontSize: "1.5rem", color: "#032B68" }} />
                    }
                  >
                    {Array.isArray(concursosData)
                      ? concursosData.map((concurso: any) => (
                          <Select.Option key={concurso.value} value={concurso.value}>
                            {concurso.label}
                          </Select.Option>
                        ))
                      : concursosData?.results?.map((concurso: any) => (
                          <Select.Option key={concurso.value} value={concurso.value}>
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
                    }}
                    accept=".txt"
                    showUploadList={false}
                    multiple={false}
                  >
                    <span>
                      <UploadArea
                        style={{ height: "64px" }}
                        status={formErrors.arquivo ? "error" : undefined}
                      >
                        <GrupoEsquerda>
                          <CloudUploadOutlined style={{ fontSize: 38, color: "#838383" }} />
                          <span style={{ color: "#666", fontSize: "14px", textAlign: "left" }}>
                            {watchedFile ? (
                              watchedFile.name
                            ) : (
                              <>
                                Selecione ou arraste e solte aqui <br />o arquivo de importação (.txt)
                              </>
                            )}
                          </span>
                        </GrupoEsquerda>
                        <Button type="primary" size="small" style={{ fontSize: "14px" }}>
                          Selecionar
                        </Button>
                      </UploadArea>
                    </span>
                  </StyledUpload>
                </FormItem>
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
          onClick={() => navigate("/processos/importacao-dados/historico-lotes")}
        >
          Histórico
        </Button>
        <Button
          type="primary"
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
        >
          Importar
        </Button>
      </ActionButtonsContainer>
    </>
  );
};

export default LotesFormTab;
