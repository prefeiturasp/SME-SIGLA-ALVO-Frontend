import React from "react";
import {
  Card,
  Row,
  Col,
  theme,
  Typography,
  Select,
  Upload,
  Input,
  message,
} from "antd";
import type { UploadProps } from "antd";
import { CloudUploadOutlined, SearchOutlined } from '@ant-design/icons';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import {
  UserSwitchOutlined,
} from "@ant-design/icons";
import { PrimaryButton, SecondaryButton, StyledSelect, ActionButtonsContainer } from "../../components/EstilosCompartilhados";
import { CustomFormItem } from "../../components/FormStyle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import VagasEscolasTabela from "./components/VagasEscolasTabela";

import { useGerenciamentoVagas } from "./hooks/useGerenciamentoVagas";


const { Text } = Typography;

const GerenciamentoVagasTela: React.FC = () => {
  const { token } = theme.useToken();
  const { Dragger } = Upload;
  const draggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    beforeUpload: (file) => {
      handleFileUpload(file as File);
      return false;
    },
    onChange(info) {
      const { status, name } = info.file;
      if (status === 'done') {
        message.success(`${name} enviado com sucesso`);
      } else if (status === 'error') {
        message.error(`${name} falhou ao enviar`);
      }
    },
  };
  const {
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    dadosVagasNasEscolas,
    handleSelectProcessoConvocacao,
    control,
    handleSubmit,
    handleEnviarForm,
    handleFileUpload,
    uploadConcluido,
    concursoData,
    concursoIsLoading,
    handleSelectCargo,
    optionsDres,
    isLoadingVagasEscolas,
    isFetchingVagasEscolas,
    vagasEscolasData,
    setVagasEscolasData,
    handleBuscarVagas,
    handleSalvar,
    handleFiltrar,
    handleLimparFiltros,
    controlFiltrar,
    formErrorsFiltrar,
    setSelecionadas,
    selecionadas,
    selecionadasKeys,
    setSelecionadasKeys,
    cargoSelecionado,
  } = useGerenciamentoVagas();
  const navigate = useNavigate();
  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/processos")}
        >
          Processos
        </Text>
      ),
    },
    {
      title: "Gerenciamento de vagas",
    },
  ] as TitleItem[];


  const contentStyle: React.CSSProperties = {
    lineHeight: "300px",
    textAlign: "center",

    borderRadius: token.borderRadiusLG,

    marginTop: 20,
  };
  
  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Gerenciamento de vagas"
        buttons={
          <PrimaryButton style={{fontWeight:'400'}} color="primary" variant="outlined" icon={<UserSwitchOutlined />}>Nova convocação</PrimaryButton>
        }
      >
        <Card
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
          <div style={contentStyle}>
            <Row gutter={[16, 16]}>
              <Col span={uploadConcluido ? 8 : 12}>
              <Controller
                  control={control}
                  name="processo_convocacao"
                  render={({ field }) => (
                  <CustomFormItem
                    label="Processo"
                    labelCol={{ span: 24 }}
                  >
                     <StyledSelect
                       value={field.value}
                       onChange={(value: unknown) => {
                         field.onChange(value as string | undefined);
                         handleSelectProcessoConvocacao(value as string | undefined);
                       }}
                      placeholder="Selecione o processo de convocação"
                      allowClear
                      suffixIcon={
                        <ExpandMoreIcon
                          style={{ fontSize: "1.5rem", color: "#032B68" }}
                        />
                      }
                      loading={processosConvocacaoIsLoading}
                    >
                      {Array.isArray(processosConvocacaoData?.results) && processosConvocacaoData?.results.map((processoConvocacao: any) => (
                        <Select.Option
                          key={processoConvocacao.uuid}
                          value={processoConvocacao.uuid}
                        >
                          {processoConvocacao.descricao}
                        </Select.Option>
                      ))}
                    </StyledSelect>
                  </CustomFormItem>
                  )}
                />
              </Col>
              {(cargoSelecionado || (dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0)) && (
                <Col span={8}>
                  <CustomFormItem
                    label="Cargo"
                    labelCol={{ span: 24 }}
                  >
                    <StyledSelect
                      placeholder="Selecione o cargo"
                      onChange={(value: unknown) => {
                        handleSelectCargo(value as string | undefined);
                        handleBuscarVagas();
                      }}
                      loading={concursoIsLoading}
                      allowClear
                    >
                      {Array.isArray(concursoData?.cargos) && concursoData?.cargos.map((cargo: any) => (
                        <Select.Option key={cargo.uuid} value={cargo.uuid}>
                          {cargo.nome}
                        </Select.Option>
                      ))}
                    </StyledSelect>
                  </CustomFormItem>
                </Col>
              )}
            </Row>
          </div>

        </Card>
        
        {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <Card style={{ marginTop: "1.25rem" }} variant="borderless">
          <div style={contentStyle}>
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Controller
                  control={controlFiltrar}
                  name="dre"
                  render={({ field }) => (
                    <CustomFormItem
                      label={"DRE"}
                      // validateStatus={formErrors.dre ? "error" : undefined}
                      // help={formErrors.dre?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        {...field}
                        options={optionsDres}
                        placeholder="(Todas)"
                        loading={false}
                        suffixIcon={
                          <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                        }
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>
              <Col xs={24} md={8}>
                <Controller
                  name="escola"
                  control={controlFiltrar}
                  render={({ field }) => (
                    <CustomFormItem
                      label="Escola"
                      validateStatus={formErrorsFiltrar.escola ? "error" : undefined}
                      help={formErrorsFiltrar.escola?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Input {...field} placeholder="" />
                    </CustomFormItem>
                  )}
                />
              </Col>
              <Col span={8}>
                <ActionButtonsContainer>
                  <SecondaryButton onClick={handleLimparFiltros}>Limpar filtros</SecondaryButton>
                  <SecondaryButton icon={<SearchOutlined />} onClick={handleFiltrar}>Buscar</SecondaryButton>
                  <PrimaryButton>Incluir escola</PrimaryButton>
                </ActionButtonsContainer>
              </Col>
            </Row>
          </div>
        </Card>
        )}
         {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <Card style={{ marginTop: "1.25rem" }} variant="borderless">
          <div style={contentStyle}>
            <Text strong style={{ display: "block", marginBottom: 8, textAlign: "left" }}>Vagas por unidade escolar</Text>
            <VagasEscolasTabela
              filteredData={vagasEscolasData}
              setEditableData={setVagasEscolasData}
              loading={isLoadingVagasEscolas}
              onSelectionChange={(rows) => setSelecionadas(rows)}
              onSelectionChangeKeys={(keys) => setSelecionadasKeys(keys as string[])}
              cargoUuid={cargoSelecionado}
            />
          </div>
        </Card>
        )}
         {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <ActionButtonsContainer>
          <PrimaryButton onClick={handleSalvar}>Salvar</PrimaryButton>
        </ActionButtonsContainer>
        )}
        {!uploadConcluido && (
        <Card
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
          <div style={contentStyle}>
            {Array.isArray(dadosVagasNasEscolas?.vagas) && dadosVagasNasEscolas?.vagas.length === 0 && (
              <Row gutter={[16, 16]}>
                <Col span={24}>
                <Controller
                  control={control}
                  name="arquivo"
                  render={() => (
                    <CustomFormItem
                      labelCol={{ span: 24 }}
                    >
                      <Text strong style={{ display: "block", marginBottom: 8 }}>Importar vagas</Text>
                      <Dragger {...draggerProps}>
                      <p className="ant-upload-drag-icon">
                          <CloudUploadOutlined style={{ fontSize: "4.5rem", color: "#032B68" }} />
                      </p>
                      <p className="ant-upload-drag-icon">
                          <CloudUploadIcon style={{ fontSize: "4.5rem", color: "#032B68" }} />
                      </p>
                        <p className="ant-upload-text">Clique ou arraste o arquivo para esta área</p>
                        <p className="ant-upload-hint" style={{ color: '#727679' }}>Apenas 1 arquivo CSV</p>
                        <PrimaryButton style={{ marginTop: 12 }}>Selecionar arquivo</PrimaryButton>
                      </Dragger>
                      <ActionButtonsContainer>
                        <PrimaryButton onClick={handleSubmit(handleEnviarForm)}>Importar</PrimaryButton>
                      </ActionButtonsContainer>
                    </CustomFormItem>
                    )}
                  />
                </Col>
              </Row>
            )}
          </div>
        </Card>
        )}
      </BaseTela>
    </>
  );
};

export default GerenciamentoVagasTela;
