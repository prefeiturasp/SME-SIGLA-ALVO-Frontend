import React, { useMemo, useState } from "react";
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
import { SearchOutlined } from '@ant-design/icons';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import {
  UserSwitchOutlined,
} from "@ant-design/icons";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import VagasEscolasTabela from "./components/VagasEscolasTabela";
import IncluirEscolasModal from "./components/IncluirEscolasModal";

import { useGerenciamentoVagas } from "./hooks/useGerenciamentoVagas";
import type { IInclusaoVagasEscolasPayload } from "./hooks/types";
import { useGetPermissions } from "../../routes/PermissionContextGuard";


import {
  AppButton,
  StyledSelect,
  ActionButtonsContainer,
  AppFormItem,
  FilterActionSlot,
  FilterActionsGroup,
  selectSuffixIcon,
} from '@/components/ui';
import { cursorPointer, cardSpacing } from '@/design-system/estilos';
import { tokens } from '@/design-system/tokens';

const uploadIconStyle = { fontSize: 48, color: tokens.colors.primary };
const { Text } = Typography;

const GerenciamentoVagasTela: React.FC = () => {
  const { token } = theme.useToken();
  const { Dragger } = Upload;
  const { can } = useGetPermissions();
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const canAddProcessoConvocacao = can("add_processoconvocacao");
  // Estado para controlar o modal de incluir escolas 
  const [modalIncluirEscolasVisible, setModalIncluirEscolasVisible] = useState(false);
  
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
    postInclusaoVagasEscolasMutation,
  } = useGerenciamentoVagas();

  // Funções para controlar o modal
  const handleAbrirModalIncluirEscolas = () => {
    setModalIncluirEscolasVisible(true);
  };
  
  const handleFecharModalIncluirEscolas = () => {
    setModalIncluirEscolasVisible(false);
  };
  
  const handleEscolasSelecionadas = (payload: any) => {
    postInclusaoVagasEscolasMutation.mutate(payload as any);
  };
  
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

  const navigate = useNavigate();
  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={cursorPointer}
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
          style={cursorPointer}
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
  const showCargo = ((dadosVagasNasEscolas?.vagas?.length ?? 0) > 0);
  const allowedCargoCodigos = useMemo(() => {
    const vagas = Array.isArray(dadosVagasNasEscolas?.vagas) ? dadosVagasNasEscolas!.vagas as any[] : [];
    const codigos = vagas.map((v: any) => Number(v?.cargo_codigo)).filter((n) => Number.isFinite(n));
    return new Set<number>(codigos);
  }, [dadosVagasNasEscolas?.vagas]);
  
  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Gerenciamento de vagas"
        buttons={
          <AppButton
            variant="secondary"
            icon={<UserSwitchOutlined />}
            disabled={!canAddProcessoConvocacao}
            onClick={() => navigate("/processos/convocacao/dados-processo/criar")}
          >
            Nova convocação
          </AppButton>
        }
      >
        <Card
          style={cardSpacing.marginTop20}
          variant="borderless"
        >
          <div style={contentStyle}>
            <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
              <Col xs={24} md={8}>
              <Controller
                  control={control}
                  name="processo_convocacao"
                  render={({ field }) => (
                  <AppFormItem
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
                      suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
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
                  </AppFormItem>
                  )}
                />
              </Col>
              {showCargo && (
                <Col xs={24} md={8}>
                  <AppFormItem
                    label="Cargo"
                    labelCol={{ span: 24 }}
                  >
                    <StyledSelect
                      placeholder="Selecione o cargo"
                      value={cargoSelecionado}
                      onChange={(value: unknown) => {
                        handleSelectCargo(value as string | undefined);
                        handleBuscarVagas();
                      }}
                      loading={concursoIsLoading}
                      allowClear
                    >
                      {Array.isArray(concursoData?.cargos) && concursoData?.cargos.map((cargo: any) => {
                        const codigoNum = Number(cargo?.codigo);
                        const isHabilitado = allowedCargoCodigos.has(codigoNum);
                        return (
                          <Select.Option key={cargo.uuid} value={cargo.uuid} disabled={!isHabilitado}>
                            {cargo.nome}
                          </Select.Option>
                        );
                      })}
                    </StyledSelect>
                  </AppFormItem>
                </Col>
              )}
            </Row>
          </div>

        </Card>

        {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <Card style={cardSpacing.marginTop20} variant="borderless">
          <div style={contentStyle}>
            <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
              <Col xs={24} md={8}>
                <Controller
                  control={controlFiltrar}
                  name="dre"
                  render={({ field }) => (
                    <AppFormItem
                      label={"DRE"}
                      labelCol={{ span: 24 }}
                    >
                      <StyledSelect
                        {...field}
                        options={optionsDres}
                        placeholder="(Todas)"
                        loading={false}
                        suffixIcon={
                          <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                        }
                      />
                    </AppFormItem>
                  )}
                />
              </Col>
              <Col xs={24} md={8}>
                <Controller
                  name="escola"
                  control={controlFiltrar}
                  render={({ field }) => (
                    <AppFormItem
                      label="Escola"
                      validateStatus={formErrorsFiltrar.escola ? "error" : undefined}
                      help={formErrorsFiltrar.escola?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Input {...field} placeholder="" style={{ width: "100%", maxWidth: "900px" }} />
                    </AppFormItem>
                  )}
                />
              </Col>
              <Col xs={24} md={8}>
                <FilterActionSlot>
                  <FilterActionsGroup>
                    <AppButton variant="secondary" onClick={handleLimparFiltros}>Limpar filtros</AppButton>
                    <AppButton variant="secondary" icon={<SearchOutlined />} onClick={handleFiltrar}>Buscar</AppButton>
                    <AppButton onClick={handleAbrirModalIncluirEscolas}>Incluir escola</AppButton>
                  </FilterActionsGroup>
                </FilterActionSlot>
              </Col>
            </Row>
          </div>
        </Card>
        )}
         {(cargoSelecionado && dadosVagasNasEscolas?.vagas?.length && dadosVagasNasEscolas?.vagas?.length > 0) && (
        <Card style={cardSpacing.marginTop20} variant="borderless">
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
          <AppButton onClick={handleSalvar}>Salvar</AppButton>
        </ActionButtonsContainer>
        )}
        {!uploadConcluido && (
        <Card
          style={cardSpacing.marginTop20}
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
                    <AppFormItem
                    
                      labelCol={{ span: 24 }}
                    >
                      <Text strong style={{ display: "block", marginBottom: 8 }}>Importar vagas</Text>
                      
                      
                        <Dragger disabled={!canAddImportacaoArquivoVagas} {...draggerProps}>
                        
                      
                      <p className="ant-upload-drag-icon">
                          <CloudUploadIcon style={uploadIconStyle} />
                      </p>
                        <p className="ant-upload-text">Clique ou arraste o arquivo para esta área</p>
                        <p className="ant-upload-hint" style={{ color: '#727679' }}>Apenas 1 arquivo CSV</p>
                        <AppButton disabled={!canAddImportacaoArquivoVagas} style={{ marginTop: 12 }}>Selecionar arquivo</AppButton>
                      </Dragger>
                      <ActionButtonsContainer>
                        <AppButton disabled={!canAddImportacaoArquivoVagas} onClick={handleSubmit(handleEnviarForm)}>Importar</AppButton>
                      </ActionButtonsContainer>
                    </AppFormItem>
                    )}
                  />
                </Col>
              </Row>
            )}
          </div>
        </Card>
        )}
      </BaseTela>
      
      {/* Modal de Incluir Escolas */}
      <IncluirEscolasModal
        visible={modalIncluirEscolasVisible}
        onClose={handleFecharModalIncluirEscolas}
        processo={processosConvocacaoData?.results?.find((p: any) => p.uuid === control._formValues?.processo_convocacao)?.descricao || "Carregando..."}
        cargo={(concursoData?.cargos as any)?.find((c: any) => c.uuid === cargoSelecionado)?.nome || "Cargo"}
        cargoCodigo={(concursoData?.cargos as any)?.find((c: any) => c.uuid === cargoSelecionado)?.codigo}
        cargoNome={(concursoData?.cargos as any)?.find((c: any) => c.uuid === cargoSelecionado)?.nome}
        processoNome={processosConvocacaoData?.results?.find((p: any) => p.uuid === control._formValues?.processo_convocacao)?.descricao}
        processoUuid={control._formValues?.processo_convocacao}
        dadosVagasImportadas={dadosVagasNasEscolas}
        onEscolasSelecionadas={handleEscolasSelecionadas}
      />
    </>
  );
};

export default GerenciamentoVagasTela;
