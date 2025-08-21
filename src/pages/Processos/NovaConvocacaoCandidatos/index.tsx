import React, { useState } from "react";
import {
  Select,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  DatePicker,
  Input,
  Card,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ApprovalIcon from "@mui/icons-material/Approval";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CampaignIcon from "@mui/icons-material/Campaign";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import {
  StyledCardPequeno,
  StyledCardGrande,
  CardIconContainer,
  CardContentContainer,
  ActionButton,
  PrimaryButton,
  AddButton,
  CustomFormItem,
} from "./styles";

import BaseScreen, { type TitleItem } from "../../BaseScreen";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { Link, useLocation } from "react-router-dom";

import { useConcursos } from "./hooks/useConcursos";
import VisualizarVagasModal from "./components/VisualizarVagasModal/VisualizarVagasModal";
import type { IConvocacaoModal } from "../../../services/resources/convocacao/IConvocacao";
import type { IBackendWithSubOptions } from "../../../types/IListRequest";

const { Option } = Select;
const { Title, Text } = Typography;

const breadcrumbItems = [
  { title: <Link to="/">Home</Link> },
  { title: <Link to="/processos">Processos</Link> },
  { title: <Link to="/processos/convocacao">Convocação de candidatos</Link> },
  { title: "Nova Convocação" },
] as TitleItem[];

type FormFields = {
  concurso: string;
  tipo_processo: string;
  descricao: string;
  cargo: string;
  data_final: string;
};

export const NovaConvocacaoCandidatos: React.FC = () => {
  const { concursosData, concursosIsLoading } = useConcursos();

  const [cargoSelecionado, setCargoSelecionado] = useState<
    string | undefined
  >();
  const [arquivoSelecionado, setArquivoSelecionado] = useState<
    string | undefined
  >();
  const [cargosDisponiveis, setCargosDisponiveis] = useState<
    { value: string; label: string }[]
  >([]);


  const location = useLocation();
  let state = location.state as IBackendWithSubOptions;

  console.log("cargos,concursos", state);

  const handleOpenVisualizarVagasModal = () => {
    setOpenVisualizarVagasModal(true);
  };

  const [cardData, setCardData] = useState({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  });

  const { control, reset } = useForm<FormFields>({
    defaultValues: {
      concurso: undefined,
      tipo_processo: undefined,
      descricao: undefined,
      cargo: "",
      data_final: "",
    },
  });

  const watchFields = useWatch({ control });

  const isCargoLiberado = watchFields.concurso;

  const buscarCargosDoConcurso = (concursoValue: string) => {
    if (!concursoValue) {
      setCargosDisponiveis([]);
      return;
    }

    const concursoSelecionado = concursosData.find(
      (c) => c.value === concursoValue
    );
    console.log(concursoSelecionado);
    if (concursoSelecionado && concursoSelecionado.cargos) {
      setCargosDisponiveis(concursoSelecionado.cargos);
    }

    setCargoSelecionado(undefined);

    setCardData({
      vagas: 0,
      autorizacoes: 0,
      reservas: 0,
      convocar: 0,
    });
  };

  const handleSub = (data: FormFields) => {
    console.log("Enviando dados para o backend:", {
      ...data,
      page: 1,
      page_size: 10,
    });
  };

  const handleReset = () => {
    reset({
      concurso: "",
      tipo_processo: "",
      descricao: "",
      cargo: "",
      data_final: "",
    });
    setCargoSelecionado(undefined);
    setArquivoSelecionado(undefined);
    setCargosDisponiveis([]);
  };

  const buscarDadosDoCargo = () => {
    if (!cargoSelecionado) return;

    setTimeout(() => {
      setCardData({
        vagas: 385,
        autorizacoes: 0,
        reservas: 407,
        convocar: 0,
      });
    }, 1000);
  };

 

  const [openVisualizarVagasModal, setOpenVisualizarVagasModal] =  useState<boolean>(true);


  const handleCloseVisualizarVagas = () => { 
    setOpenVisualizarVagasModal(false);
  };

  const confirmVisualizarVagas = async (data: IConvocacaoModal) => {
    try {
      console.log("e", data);      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Processo de convocação de candidatos"
    >
         <VisualizarVagasModal
          isOpen={openVisualizarVagasModal}
          onCancel={handleCloseVisualizarVagas}
          onConfirm={confirmVisualizarVagas}
          loading={false}
          concurso="200803471730 - 200803471730"
          cargo="PROF.ENS.FUND.II E MED.-BIOL.PROG.SAUDE"
        />
     

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}
      >
        <Typography.Title level={4}>Busca Processos</Typography.Title>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Controller
              control={control}
              name="concurso"
              render={({ field }) => (
                <CustomFormItem label={<strong>Concurso</strong>}>
                  <Select
                    {...field}
                    placeholder="Selecione o concurso"
                    style={{ width: "65%" }}
                    options={concursosData || []}
                    loading={concursosIsLoading}
                    onChange={(value) => {
                      field.onChange(value);
                      buscarCargosDoConcurso(value);
                    }}
                  />
                </CustomFormItem>
              )}
            />
            <Controller
              control={control}
              name="tipo_processo"
              render={({ field }) => (
                <CustomFormItem label={<strong>Tipo de processo</strong>}>
                  <Select
                    {...field}
                    placeholder="Selecione o tipo de processo"
                    style={{ width: "65%" }}
                    options={[{ value: "Escolha", label: "Escolha" }]}
                  />
                </CustomFormItem>
              )}
            />
            <Controller
              control={control}
              name="descricao"
              render={({ field }) => (
                <CustomFormItem label={<strong>Descrição</strong>}>
                  <Input
                    {...field}
                    placeholder="Digite a descrição"
                    style={{ width: "65%" }}
                  />
                </CustomFormItem>
              )}
            />
            <Controller
              control={control}
              name="data_final"
              render={({ field }) => (
                <CustomFormItem label={<strong>Data de convocação</strong>}>
                  <DatePicker
                    {...field}
                    placeholder="Data de convocação"
                    style={{ width: "25%" }}
                    format="DD/MM/YYYY"
                    suffixIcon={
                      <CalendarMonthIcon style={{ color: "#05409A" }} />
                    }
                    value={field.value ? dayjs(field.value) : undefined}
                    onChange={(date) =>
                      field.onChange(date ? date.toISOString() : "")
                    }
                  />
                </CustomFormItem>
              )}
            />
            <Controller
              control={control}
              name="cargo"
              render={({ field }) => (
                <CustomFormItem label={<strong>Número de convocados</strong>}>
                  <Input
                    {...field}
                    placeholder="Insira o número de candidatos convocados"
                    style={{ width: "65%" }}
                  />

                  {!isCargoLiberado && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: 12,
                        color: "gray",
                        marginTop: 18,
                        display: "block",
                      }}
                    >
                      * Selecione o concurso para liberar a seleção de Cargo.
                    </Text>
                  )}
                </CustomFormItem>
              )}
            />
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Title level={3}>Cargos</Title>
          <Text strong>Cargo</Text>

          <Select
            placeholder="Selecione o cargo"
            style={{ width: "32%" }}
            value={cargoSelecionado}
            onChange={setCargoSelecionado}
            disabled={!isCargoLiberado}
            options={cargosDisponiveis}
          />

          <PrimaryButton
            type="primary"
            size="large"
            onClick={buscarDadosDoCargo}
            disabled={!cargoSelecionado}
          >
            Buscar
          </PrimaryButton>

          <Row gutter={16} justify="start">
            {[
              { title: "Vagas", value: cardData.vagas, icon: <GroupAddIcon /> },
              {
                title: "Autorizações",
                value: cardData.autorizacoes,
                icon: <ApprovalIcon />,
              },
              {
                title: "Reservas",
                value: cardData.reservas,
                icon: <CalendarMonthIcon />,
              },
              {
                title: "Convocar",
                value: cardData.convocar,
                icon: <CampaignIcon />,
              },
            ].map(({ title, value, icon }) => (
              <Col key={title}>
                <StyledCardPequeno styles={{ body: { padding: 0 } }}>
                  <div style={{ display: "flex", height: 64 }}>
                    <CardIconContainer>{icon}</CardIconContainer>
                    <CardContentContainer>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#05409A",
                        }}
                      >
                        {value}
                      </div>
                    </CardContentContainer>
                  </div>
                </StyledCardPequeno>
              </Col>
            ))}
          </Row>

          <Divider style={{ margin: "0px" }} />

          <Title level={3}>Configuração do cargo</Title>
          <Text strong>Arquivo de orientação</Text>

          <Select
            placeholder="Selecione o arquivo"
            style={{ width: "32%" }}
            value={arquivoSelecionado}
            onChange={setArquivoSelecionado}
            disabled={!cargoSelecionado}
          >
            <Option value="orientacoes_professores">
              ORIENTAÇÕES PROFESSORES FUND. II E MÉDIO
            </Option>
          </Select>

          <Space wrap>
            <ActionButton
              onClick={handleOpenVisualizarVagasModal}
              icon={
                <VisibilityIcon
                  style={{
                    color: arquivoSelecionado ? "#05409A" : "gray",
                  }}
                />
              }
              disabled={!arquivoSelecionado}
              style={
                arquivoSelecionado
                  ? {
                      border: "1px solid #05409A",
                      color: "#05409A",
                      backgroundColor: "#fff",
                    }
                  : {
                      border: "1px solid #d9d9d9", // cor padrão AntD cinza
                      color: "gray",
                      backgroundColor: "#f5f5f5",
                    }
              }
            >
              Visualizar vagas
            </ActionButton>

            <ActionButton
              icon={
                <AdsClickIcon
                  style={{
                    color: arquivoSelecionado ? "#05409A" : "gray",
                  }}
                />
              }
              disabled={!arquivoSelecionado}
              style={
                arquivoSelecionado
                  ? {
                      border: "1px solid #05409A",
                      color: "#05409A",
                      backgroundColor: "#fff",
                    }
                  : {
                      border: "1px solid #d9d9d9",
                      color: "gray",
                      backgroundColor: "#f5f5f5",
                    }
              }
            >
              Selecionar candidatos
            </ActionButton>

            <ActionButton
              icon={<UploadFileIcon style={{ color: "gray" }} />}
              disabled
            >
              Exportação de convocados
            </ActionButton>

            <ActionButton
              icon={<UploadFileIcon style={{ color: "gray" }} />}
              disabled
            >
              Exportação de vagas
            </ActionButton>
          </Space>

          <Row gutter={16} justify="start">
            {[
              { title: "Escolas selecionadas", value: 0, icon: <SchoolIcon /> },
              {
                title: "Candidatos selecionados",
                value: 0,
                icon: <GroupIcon />,
              },
            ].map(({ title, value, icon }) => (
              <Col key={title}>
                <StyledCardGrande styles={{ body: { padding: 0 } }}>
                  <div style={{ display: "flex", height: 64 }}>
                    <CardIconContainer>{icon}</CardIconContainer>
                    <CardContentContainer>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {title}
                      </div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "#05409A",
                        }}
                      >
                        {value}
                      </div>
                    </CardContentContainer>
                  </div>
                </StyledCardGrande>
              </Col>
            ))}
          </Row>

          <AddButton type="primary" icon={<PlusOutlined />} size="large">
            Adicionar Cargo
          </AddButton>
        </Space>
      </Card>
    </BaseScreen>
  );
};

export default NovaConvocacaoCandidatos;
