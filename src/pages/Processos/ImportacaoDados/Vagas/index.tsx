import React, { useState } from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import dayjs from "dayjs";
import { Row, Col, Select, DatePicker, Radio, Checkbox } from "antd";
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
import UltimasImportacoesDeVagasTable from "./components/UltimasImportacoesDeVagasTable";
import { useUltimasImportacoes } from "./hooks/useUltimasImportacoes";



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



  const {
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
  } = useUltimasImportacoes();


  // TODO Fazer somente a opção Arquivo


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

            <Controller
              control={control}
              name="metodo_de_importacao"
              render={({ field }) => (
                <CustomFormItem
                  label="Método de importação"
                  validateStatus={
                    formErrors.metodo_de_importacao ? "error" : undefined
                  }
                  help={formErrors.metodo_de_importacao?.message}
                  labelCol={{ span: 24 }}
                >
                  <Radio.Group
                    buttonStyle="outline"
                    defaultValue={1}

                    {...field}
                    options={[
                      {
                        value: 1,
                        className: 'option-1',
                        label: (
                          <>
                            WebService
                          </>
                        ),
                      },
                      {
                        value: 2,
                        className: 'option-2',
                        label: (
                          <>
                            Arquivo
                          </>
                        ),
                      }
                    ]}
                  />
                </CustomFormItem>
              )}
            />

          </Col>
        </Row>


        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>
            <Controller
              control={control}
              name="data_fechamento_modulo"
              render={({ field }) => (
                <CustomFormItem
                  label="Data de fechamento do módulo"
                  validateStatus={
                    formErrors.data_fechamento_modulo ? "error" : undefined
                  }
                  help={formErrors.data_fechamento_modulo?.message}
                  labelCol={{ span: 24 }}
                >
                  <DatePicker
                    value={field.value ? dayjs(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(
                        date ? dayjs(date).format("YYYY-MM-DD") : ""
                      )
                    }
                    placeholder="Selecione a data desejada"
                    format="DD/MM/YYYY"
                    suffixIcon={
                      <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />
                    }
                  />
                </CustomFormItem>
              )}
            />
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

        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>

            <Controller
              control={control}
              name="ignorar_primeira_linha"
              render={({ field }) => (
                <CustomFormItem
                  label="Opções de importação"
                  validateStatus={
                    formErrors.ignorar_primeira_linha ? "error" : undefined
                  }
                  help={formErrors.ignorar_primeira_linha?.message}
                  labelCol={{ span: 24 }}
                >
                  <Checkbox {...field}>Ignorar a 1ª linha (arquivo com cabeçalho)</Checkbox>
                </CustomFormItem>
              )}
            />

          </Col>
        </Row>


        <Row gutter={[0, 16]}>
          <Col xs={24} sm={9}>

            <Controller
              control={control}
              name="opcoes_de_importacao"
              render={({ field }) => (
                <CustomFormItem
                  label="Opções de importação"
                  validateStatus={
                    formErrors.opcoes_de_importacao ? "error" : undefined
                  }
                  help={formErrors.opcoes_de_importacao?.message}
                  labelCol={{ span: 24 }}
                >
                  <Radio.Group
                    buttonStyle="outline"
                    defaultValue={1}

                    {...field}
                    options={[
                      {
                        value: 1,
                        className: 'option-1',
                        label: (
                          <>
                            Ajustar
                          </>
                        ),
                      },
                      {
                        value: 2,
                        className: 'option-2',
                        label: (
                          <>
                            Substituir
                          </>
                        ),
                      }
                    ]}
                  />
                </CustomFormItem>
              )}
            />

          </Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col xs={24} sm={24}>

            <UltimasImportacoesDeVagasTable
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData?.results || [{
                uuid: '111',
                metodo_de_importacao: 'WebService',
                data_de_fechamento_do_modulo: dayjs(),
                cargo: '2650 - ESP.INF.TEC.CULT.DESP.-BIBLIOTECA',
                opcoes_de_importacao: 'Ajustar',
                data_importacao: dayjs()
              }]}
              pagination={{
                current: listRequest.pagination.page,
                pageSize: 10,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: processosConvocacaoData?.count,
                showTotal: (total, range) => (
                  <span style={{ marginLeft: 16 }}>
                    {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
                  </span>
                ),
              }}
              onChange={onAntTableChange}
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
