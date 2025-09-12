import React from "react";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import dayjs from "dayjs";
import { Row, Col, Select, DatePicker, Radio, Checkbox } from "antd";
import { Controller } from "react-hook-form";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useImportacaoDadosVagas } from "./hooks/useImportacaoDadosVagas";
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
} from "../../../../components/estilosCompartilhados/styles";
import { useCargos } from "../../NovaConvocacaoCandidatos/hooks/useCargos";
import UltimasImportacoesDeVagasTable from "./components/UltimasImportacoesDeVagasTable";



interface VagasProps {
  onShowLayoutPadrao: () => void;
}

const Vagas: React.FC<VagasProps> = ({ onShowLayoutPadrao }) => {
  const {
    control,
    formErrors,
    handleFileUpload,
    handleSubmit,
    handleEnviarForm,
    watch,
    importacoesArquivos,
    importacoesArquivosIsLoading,
    isCreatingImportacao,
    isValid = false,
  } = useImportacaoDadosVagas();





  // TODO Fazer somente a opção Arquivo


  const { cargosData, cargosIsLoading } = useCargos();
  const watchedFile = watch("arquivo");
  const watchedMetodoImportacao = watch("metodo_de_importacao");

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



        {watchedMetodoImportacao === 1 &&
          <>
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
          </>
        }



        {watchedMetodoImportacao === 2 &&
          <>

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

             
          </>}

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
              loading={importacoesArquivosIsLoading}
              data={importacoesArquivos?.results || [{
                uuid: '111',
                metodo_de_importacao: 'WebService',
                data_de_fechamento_do_modulo: dayjs().toString(),
                cargo: '2650 - ESP.INF.TEC.CULT.DESP.-BIBLIOTECA',
                opcoes_de_importacao: 'Ajustar',
                data_importacao: dayjs().toString()
              }]}
              pagination={false}
            />
          </Col>
        </Row>

      </SectionCard>

      {/* Botões de Ação */}
      <ActionButtonsContainer>

        <SecondaryButton
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
          disabled={isCreatingImportacao || !isValid}
          loading={importacoesArquivosIsLoading}
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
