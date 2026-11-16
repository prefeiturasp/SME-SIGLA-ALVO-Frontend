import React from "react";
import {
  Row,
  Col,
  Select,
  Button,
  Typography,
  Tooltip,
  Spin,
} from "antd";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosVagas } from "./hooks/useImportacaoDadosVagas";
import { AppFormItem, AppButton, TabContentContainer, StyledSelect, UploadArea, StyledUpload, ActionButtonsContainer, GrupoEsquerda, formTabStyles, selectSuffixIcon } from '@/components/ui';

import { CloudUploadOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

interface VagasProps {
  canViewHistoricoVagas: boolean;
  canImportarVagas: boolean;
}
const { Text, Title } = Typography;
const VagasFormTab: React.FC<VagasProps> = ({
  canViewHistoricoVagas,
  canImportarVagas,
}) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
    watch,
    isCreatingImportacao,
  } = useImportacaoDadosVagas();

  const navigate = useNavigate();

  const onShowHistorico = () => {
    navigate("/processos/importacao-dados/historico-vagas");
  };
  const watchedFile = watch("arquivo");

  return (
    <>
      <Spin spinning={isCreatingImportacao}>
        <TabContentContainer>
          <Row style={formTabStyles.introRow}>
            <Title level={5} type="secondary" style={formTabStyles.introTitle}>
              Selecione abaixo o tipo de arquivo que deseja carregar
            </Title>

            <Text style={formTabStyles.introDescription}>
              Nesta aba, você pode consultar as vagas atualmente disponíveis nas
              escolas da rede. As vagas são atualizadas conforme a movimentação de
              servidores e a necessidade das unidades. Utilize os filtros para
              localizar oportunidades por cargo, escola, região ou outros
              critérios e acompanhe em tempo real as opções abertas para escolha.
            </Text>
          </Row>

          <Row gutter={40} style={formTabStyles.fieldsRow}>
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="processo_convocacao"
                render={({ field }) => (
                  <AppFormItem
                    label="Processo de convocação"
                    validateStatus={
                      formErrors.processo_convocacao ? "error" : undefined
                    }
                    help={formErrors.processo_convocacao?.message}
                    labelCol={{ span: 24 }}
                  >
                    <StyledSelect
                      disabled={!canImportarVagas}
                      value={field.value}
                      onChange={(value: unknown) =>
                        field.onChange(value as string | undefined)
                      }
                      placeholder="Selecione o processo"
                      loading={processosConvocacaoOptionsIsLoading}
                      allowClear
                          suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
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
                    disabled={!canImportarVagas}
                      beforeUpload={(file) => {
                        handleFileUpload(file);
                        return false;
                      }}
                      accept=".csv"
                      showUploadList={false}
                      multiple={false}
                    >
                      {(() => {
                        const uploadArea = (
                          <UploadArea
                            style={{ height: "64px" }}
                            status={formErrors.arquivo ? "error" : undefined}
                          >
                            <GrupoEsquerda>
                              <CloudUploadOutlined
                                style={{ fontSize: 38, color: "#838383" }}
                              />

                              <span
                                style={{
                                  color: "#666",
                                  fontSize: "14px",
                                  textAlign: "left",
                                }}
                              >
                                {watchedFile ? (
                                  watchedFile.name
                                ) : (
                                  <>
                                    Selecione ou arraste e solte aqui <br />o arquivo
                                    de importação (.csv)
                                  </>
                                )}
                              </span>
                            </GrupoEsquerda>

                            <Button
                              disabled={!canImportarVagas}
                              type="primary"
                              size="small"
                              style={{ fontSize: "14px" }}
                            >
                              Selecionar
                            </Button>
                          </UploadArea>
                        );

                        if (!canImportarVagas) {
                          return (
                            <Tooltip title="Você não possui permissão para essa ação" arrow>
                              {uploadArea}
                            </Tooltip>
                          );
                        }

                        return uploadArea;
                      })()}
                    </StyledUpload>
                  </FormItem>
                )}
              />
            </Col>
          </Row>
        </TabContentContainer>
        <ActionButtonsContainer>
          <AppButton
            variant="secondary"
            size="large"
            onClick={onShowHistorico}
            disabled={!canViewHistoricoVagas}
          >
            Histórico
          </AppButton>
          <AppButton
            variant="primary"
            size="large"
            onClick={handleSubmit(handleEnviarForm)}
            disabled={!canImportarVagas}
          >
            Importar
          </AppButton>
        </ActionButtonsContainer>
      </Spin>
    </>
  );
};

export default VagasFormTab;
