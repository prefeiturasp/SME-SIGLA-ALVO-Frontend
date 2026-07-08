import React from "react";
import { Row, Col, Select, Button, Tooltip, Spin, Input } from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDados } from "./hooks/useImportacaoDadosHabilitados";

import { useConcursos } from "../../../hooks/useConcursos";
import { CloudUploadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import { useNavigate } from "react-router-dom";

import { AppFormItem, AppButton, TabContentContainer, StyledSelect, UploadArea, StyledUpload, ActionButtonsContainer, GrupoEsquerda, selectSuffixIcon } from '@/components/ui';
interface HabilitadosProps {
  canViewHistoricoHabilitados: boolean;
  canImportarHabilitados: boolean;
}

const HabilitadosFormTab: React.FC<HabilitadosProps> = ({
    canViewHistoricoHabilitados,
    canImportarHabilitados
}) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch,
    isCreatingImportacao,
  } = useImportacaoDados();
  const navigate = useNavigate();
  const { concursosData, concursosOptionsIsLoading } = useConcursos();
  const watchedFile = watch("arquivo");
  
  return (
    <>
    <Spin spinning={isCreatingImportacao}>
      <TabContentContainer>
        

          <Row
            
            gutter={40}
          >
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="concurso"
                render={({ field }) => (
                  <AppFormItem
                    label="Concurso"
                    validateStatus={formErrors.concurso ? "error" : undefined}
                    help={formErrors.concurso?.message}
                    labelCol={{ span: 24 }}
                  >
                    <StyledSelect
                      {...field}
                      disabled={!canImportarHabilitados}
                      placeholder="Selecione o concurso"
                      loading={concursosOptionsIsLoading}
                      allowClear
                      suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
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
                  </AppFormItem>
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
                    disabled={!canImportarHabilitados}
                    beforeUpload={(file) => {
                      handleFileUpload(file);
                      return false;
                    }}
                    accept=".csv"
                    showUploadList={false}
                    multiple={false}
                  >
                    <Tooltip
                      title={
                        !canImportarHabilitados
                          ? "Você não possui permissão para essa ação"
                          : "Selecionar arquivo"
                      }
                      arrow
                    >
                      <UploadArea
                        style={{ height: "64px" }}
                        status={formErrors.arquivo ? "error" : undefined}
                      >
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
                    </Tooltip>
                  </StyledUpload>
                </FormItem>
              )}
            />
          </Col>
          </Row>

          <Row gutter={40}>
            <Col xs={24}>
              <Controller
                control={control}
                name="observacao"
                render={({ field }) => (
                  <AppFormItem
                    label="Observação"
                    validateStatus={formErrors.observacao ? "error" : undefined}
                    help={formErrors.observacao?.message}
                    labelCol={{ span: 24 }}
                  >
                    <Input.TextArea
                      {...field}
                      disabled={!canImportarHabilitados}
                      rows={4}
                      autoSize={{ minRows: 4, maxRows: 4 }}
                      maxLength={2000}
                      showCount
                      placeholder="Digite uma observação sobre esta importação (opcional)"
                    />
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
          onClick={() => navigate("/processos/importacao-dados/historico-habilitados")}
          disabled={!canViewHistoricoHabilitados}
        >
          Histórico
        </AppButton>
        <AppButton
          variant="primary"
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
          disabled={!canImportarHabilitados}
        >
          Importar
        </AppButton>
      </ActionButtonsContainer>
    </Spin>
  </>
  );
};

export default HabilitadosFormTab;
