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
import { Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';
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
import styled from "styled-components";

import { useGerenciamentoVagas } from "./hooks/useGerenciamentoVagas";


const { Text } = Typography;

const ResponsiveSelect = styled(StyledSelect)`
  width: 100%;
  max-width: 900px;
`;

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
  const showCargo = Boolean(cargoSelecionado) || ((dadosVagasNasEscolas?.vagas?.length ?? 0) > 0);
  
  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Gerenciamento de vagas"
        buttons={
          <Button type="primary" size="large" variant="outlined" icon={<UserSwitchOutlined />}>Nova convocação</Button>
        }
      >
        <Card
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
          <div style={contentStyle}>
            <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
              <Col xs={24} md={8}>
              <Controller
                  control={control}
                  name="processo_convocacao"
                  render={({ field }) => (
                  <CustomFormItem
                    label="Processo"
                    labelCol={{ span: 24 }}
                  >
                    <ResponsiveSelect
                       style={{ marginTop: 6 }}
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
                    </ResponsiveSelect>
                  </CustomFormItem>
                  )}
                />
              </Col>
              {showCargo && (
                <Col xs={24} md={8}>
                  <CustomFormItem
                    label="Cargo"
                    labelCol={{ span: 24 }}
                  >
                    <ResponsiveSelect
                      style={{ marginTop: 6 }}
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
                    </ResponsiveSelect>
                  </CustomFormItem>
                </Col>
              )}
            </Row>
          </div>

        </Card>

        {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <Card style={{ marginTop: "1.25rem" }} variant="borderless">
          <div style={contentStyle}>
            <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
              <Col xs={24} md={8}>
                <Controller
                  control={controlFiltrar}
                  name="dre"
                  render={({ field }) => (
                    <CustomFormItem
                      label={"DRE"}
                      labelCol={{ span: 24 }}
                    >
                      <ResponsiveSelect
                        style={{ marginTop: 6 }}
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
                      <Input {...field} placeholder="" style={{ marginTop: 6, width: "100%", maxWidth: "900px" }} />
                    </CustomFormItem>
                  )}
                />
              </Col>
              <Col span={8} style={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-end", marginTop: -7 }}>
                <ActionButtonsContainer style={{ justifyContent: "flex-end" }}>
                  <Button onClick={handleLimparFiltros}>Limpar filtros</Button>
                  <Button icon={<SearchOutlined />} onClick={handleFiltrar}>Buscar</Button>
                  <Button type="primary">Incluir escola</Button>
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
          <Button type="primary" size="large" onClick={handleSalvar}>Salvar</Button>
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
