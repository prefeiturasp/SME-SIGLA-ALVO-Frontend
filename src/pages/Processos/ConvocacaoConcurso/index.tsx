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

import {
  PlusOutlined,
} from "@ant-design/icons";

import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ApprovalIcon from '@mui/icons-material/Approval';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CampaignIcon from '@mui/icons-material/Campaign';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import UploadFileIcon from '@mui/icons-material/UploadFile';

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

import useConcursos from "../../../hooks/useConcursos"; 



const { Option } = Select;
const { Title, Text } = Typography;

const breadcrumbItems = [
  { title: <a href="/">Home</a> },

  { title: <a href="/processos">Processos</a> },

  { title: <a href="/processos">Convocação de candidatos</a>},
  
] as TitleItem[];

type FormFields = {
  concurso: string;
  tipo_processo: string;
  descricao: string;
  cargo: string;
  data_inicial: string;
  data_final: string;
};

export const Processos: React.FC = () => {
  const concursosOptions = useConcursos()
  console.log(concursosOptions)
  const [cargoSelecionado, setCargoSelecionado] = useState<string | undefined>();
  const [arquivoSelecionado, setArquivoSelecionado] = useState<string | undefined>();
  const [cardData, setCardData] = useState({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  });

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      concurso: undefined,
      tipo_processo: undefined,
      descricao: undefined,
      cargo: "",
      data_inicial: "",
      data_final: "",
    },
  });

  const watchFields = useWatch({ control });

  const isBuscaProcessosPreenchido =
    watchFields.concurso &&
    watchFields.tipo_processo &&
    watchFields.descricao &&
    watchFields.data_inicial &&
    watchFields.data_final &&
    watchFields.cargo;

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
      data_inicial: "",
      data_final: "",
    });
    setCargoSelecionado(undefined);
    setArquivoSelecionado(undefined);
  };

  const buscarDadosDoCargo = () => {
    if (!cargoSelecionado) return;

    setTimeout(() => {
      if (cargoSelecionado === "PROF.ED.INF.E ENS.FUND.I") {
        setCardData({
          vagas: 385,
          autorizacoes: 0,
          reservas: 407,
          convocar: 0,
        });
      } else {
        setCardData({ vagas: 0, autorizacoes: 0, reservas: 0, convocar: 0 });
      }
    }, 1000);
  };

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Processo de convocação de candidatos"
    >
      <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginBottom: 24 }}>
        <Typography.Title level={4}>Busca Processos</Typography.Title>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Controller
              control={control}
              name="concurso"
              render={({ field }) => (
                <CustomFormItem label="Concurso">
                  <Select
                    {...field}
                    placeholder="Selecione o concurso"
                    style={{ width: "65%" }}
                    options={[
                      {
                        value: "200901633964",
                        label: "200901633964 - PROFESSOR DE EDUCACAO INFANTIL",
                      },
                    ]}
                  />
                </CustomFormItem>
              )}
            />

            <Controller
              control={control}
              name="tipo_processo"
              render={({ field }) => (
                <CustomFormItem label="Tipo de processo">
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
                <CustomFormItem label="Descrição">
                  <Input
                    {...field}
                    placeholder="Digite a descrição"
                    style={{ width: "65%" }}
                  />
                </CustomFormItem>
              )}
            />

            <Row gutter={8}>
  <Col xs={24} sm={12}>
    <Controller
      control={control}
      name="data_inicial"
      render={({ field }) => (
        <CustomFormItem label="Data de publicação">
          <DatePicker
            {...field}
            placeholder="Data de publicação"
            style={{ width: "60%" }}
            format="DD/MM/YYYY"
            suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
            value={field.value ? dayjs(field.value) : undefined}
            onChange={(date) => field.onChange(date ? date.toISOString() : "")}
          />
        </CustomFormItem>
      )}
    />
  </Col>

  <Col xs={24} sm={12} style={{ marginLeft: -145 }}>
    <Controller
      control={control}
      name="data_final"
      render={({ field }) => (
        <CustomFormItem label="Data de convocação">
          <DatePicker
            {...field}
            placeholder="Data de convocação"
            style={{ width: "60%" }}
            format="DD/MM/YYYY"
            suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
            value={field.value ? dayjs(field.value) : undefined}
            onChange={(date) => field.onChange(date ? date.toISOString() : "")}
          />
        </CustomFormItem>
      )}
    />
  </Col>
</Row>

            <Controller
              control={control}
              name="cargo"
              render={({ field }) => (
                <CustomFormItem label="Número de convocados">
                  <Input
                    {...field}
                    placeholder="Insira o número de candidatos convocados"
                    style={{ width: "65%" }}
                  />

                  {!isBuscaProcessosPreenchido && (
                    <Text 
                      type="secondary" 
                      style={{ fontSize:12, color: 'gray', marginTop: 18, display: 'block' }}
                    >
                      * Preencha todos os campos acima para liberar a seleção de Cargo.
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
            disabled={!isBuscaProcessosPreenchido}
          >
            <Option value="PROF.ED.INF.E ENS.FUND.I">PROF.ED.INF.E ENS.FUND.I</Option>
          </Select>

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
              { title: "Autorizações", value: cardData.autorizacoes, icon: <ApprovalIcon />  },
              { title: "Reservas", value: cardData.reservas, icon: <CalendarMonthIcon /> },
              { title: "Convocar", value: cardData.convocar, icon: <CampaignIcon /> },
            ].map(({ title, value, icon }) => (
              <Col key={title}>
                <StyledCardPequeno styles={{ body: { padding: 0 } }}>
                  <div style={{ display: "flex", height: 64 }}>
                    <CardIconContainer>{icon}</CardIconContainer>
                    <CardContentContainer>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{title}</div>
                      <div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{value}</div>
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

            <ActionButton icon={<UploadFileIcon style={{ color: "gray" }} />} disabled>
              Exportação de convocados
            </ActionButton>

            <ActionButton icon={<UploadFileIcon style={{ color: "gray" }} />} disabled>
              Exportação de vagas
            </ActionButton>
          </Space>

          <Row gutter={16} justify="start">
            {[
              { title: "Escolas selecionadas", value: 0, icon: <SchoolIcon /> },
              { title: "Candidatos selecionados", value: 0, icon: <GroupIcon />  },
            ].map(({ title, value, icon }) => (
              <Col key={title}>
                <StyledCardGrande styles={{ body: { padding: 0 } }}>
                  <div style={{ display: "flex", height: 64 }}>
                    <CardIconContainer>{icon}</CardIconContainer>
                    <CardContentContainer>
                      <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", textAlign: "center" }}>{title}</div>
                      <div style={{ fontSize: 18, fontWeight: "bold", color: "#05409A" }}>{value}</div>
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
