import React, { useState } from "react";
import { Card, Space, Typography, Select, Row, Col, Divider } from "antd";
import { Controller, type Control } from "react-hook-form";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ApprovalIcon from "@mui/icons-material/Approval";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import { PlusOutlined } from "@ant-design/icons";
import {
  PrimaryButton,
  StyledCardPequeno,
  StyledCardGrande,
  CardIconContainer,
  CardContentContainer,
  ActionButton,
  AddButton,
} from "../styles";
import VisualizarVagasModal from "./VisualizarVagasModal/VisualizarVagasModal";
import SelecionarCandidatos from "./SelecionarCandidatos";
import type { IConvocacaoFiltros } from "../../../../services/resources/convocacao/IConvocacao";
import type { FormFields } from "./FormPrincipal";

const { Title, Text } = Typography;

export type Option = { value: string; label: string };

interface CargoProps {
  isCargoLiberado: string | undefined;
  cargosDisponiveis: Option[];
  cardData: {
    vagas: number;
    autorizacoes: number;
    reservas: number;
    convocar: number;
  };
  setCardData: (data: {
    vagas: number;
    autorizacoes: number;
    reservas: number;
    convocar: number;
  }) => void;
  selectedConcursoLabel: string;
  selectedCargoLabel: string;
  onCandidatosSelecionados?: (qtd: number) => void;
  setPodeVisualizarVagas: (podeVisualizarVagas: boolean) => void;
  podeVisualizarVagas: boolean;
  watchFields: any;
  control: Control<FormFields>;
}

const Cargo: React.FC<CargoProps> = ({
  isCargoLiberado,
  selectedConcursoLabel,
  selectedCargoLabel,
  onCandidatosSelecionados,
  setPodeVisualizarVagas,
  cargosDisponiveis,
  cardData,
  setCardData,
  watchFields,
  podeVisualizarVagas,
  control,
}) => {
  const [popupSelecionarCandidatos, setPopupSelecionarCandidatos] =
    useState(false);
  
  const handleOpenVisualizarVagasModal = () => {
    setOpenVisualizarVagasModal(true);
  };

  const handleAbrirPopupSelecionarCandidatos = () => {
    setPopupSelecionarCandidatos(true);
  };
  const [openVisualizarVagasModal, setOpenVisualizarVagasModal] =
    useState<boolean>(false);

  const handleCloseVisualizarVagas = () => {
    setOpenVisualizarVagasModal(false);
  };

  const confirmVisualizarVagas = async (data: IConvocacaoFiltros) => {
    try {
      console.log("e", data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseSelecionarCandidatos = () => {
    setPopupSelecionarCandidatos(false);
  };

  const buscarDadosDoCargo = () => {
    if (!watchFields.cargo) return;

      setCardData({
        vagas: 385,
        autorizacoes: 0,
        reservas: 407,
        convocar: 0,
      });
      // Habilita o botão somente se todos os campos do formulário estiverem preenchidos
      const camposPreenchidos = Boolean(
        watchFields.concurso &&
          watchFields.tipo_processo &&
          watchFields.descricao &&
          watchFields.data_convocacao &&
          watchFields.data_corte_vagas,
      );
      setPodeVisualizarVagas(camposPreenchidos);

  };

  return (
    <Card style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <Title level={3}>Cargos</Title>
        <Text strong>Cargo</Text>
        <Controller
          control={control}
          name="cargo"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o cargo"
              style={{ width: "32%" }}
              disabled={!isCargoLiberado}
              options={cargosDisponiveis}
            />
          )}
        />

        <PrimaryButton
          type="primary"
          size="large"
          onClick={buscarDadosDoCargo}
          disabled={!watchFields.cargo}
          style={{ alignSelf: "flex-start" }}
        >
          Buscar
        </PrimaryButton>

        <Row gutter={0} justify="start" align="top">
          <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ marginBottom: 0 }}>
              <Text strong style={{ fontSize: 16 }}>
                Número de Vagas
              </Text>
            </div>
            <StyledCardPequeno styles={{ body: { padding: 0 } }}>
              <div style={{ display: "flex", height: 64 }}>
                <CardIconContainer>{<CampaignIcon />}</CardIconContainer>
                <CardContentContainer>
                  <div style={{ fontSize: 14, fontWeight: "bold" }}>Vagas</div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#05409A",
                    }}
                  >
                    {cardData.vagas}
                  </div>
                </CardContentContainer>
              </div>
            </StyledCardPequeno>
          </Col>

          <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ marginBottom: 0 }}>
              <Text strong style={{ fontSize: 16 }}>
                Candidatos a convocar
              </Text>
            </div>
            <Row gutter={0} justify="start">
              <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <StyledCardPequeno styles={{ body: { padding: 0 } }}>
                    <div style={{ display: "flex", height: 64 }}>
                      <CardIconContainer>{<GroupAddIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>
                          Ampla
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#05409A",
                          }}
                        >
                          {cardData.autorizacoes}
                        </div>
                      </CardContentContainer>
                    </div>
                  </StyledCardPequeno>
                  <StyledCardPequeno styles={{ body: { padding: 0 } }}>
                    <div style={{ display: "flex", height: 64 }}>
                      <CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>
                          NNA
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#05409A",
                          }}
                        >
                          {cardData.reservas}
                        </div>
                      </CardContentContainer>
                    </div>
                  </StyledCardPequeno>
                  <StyledCardPequeno styles={{ body: { padding: 0 } }}>
                    <div style={{ display: "flex", height: 64 }}>
                      <CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={{ fontSize: 14, fontWeight: "bold" }}>
                          PcD
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#05409A",
                          }}
                        >
                          {cardData.convocar}
                        </div>
                      </CardContentContainer>
                    </div>
                  </StyledCardPequeno>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider style={{ margin: "0px" }} />

        <Title level={3}>Configuração do cargo</Title>

        <Space wrap>
          <ActionButton
            disabled={!podeVisualizarVagas}
            onClick={handleOpenVisualizarVagasModal}
            icon={
              <VisibilityIcon
                style={{
                  color: podeVisualizarVagas ? "#05409A" : "gray",
                }}
              />
            }
            style={{
              border: `1px solid ${podeVisualizarVagas ? "#05409A" : "#d9d9d9"}`,
              color: podeVisualizarVagas ? "#05409A" : "gray",
              backgroundColor: podeVisualizarVagas ? "#fff" : "#f5f5f5",
            }}
          >
            Visualizar vagas
          </ActionButton>

          <ActionButton
            disabled={!podeVisualizarVagas}
            icon={
              <AdsClickIcon
                style={{
                  color: podeVisualizarVagas ? "#05409A" : "gray",
                }}
              />
            }
            style={{
              border: `1px solid ${podeVisualizarVagas ? "#05409A" : "#d9d9d9"}`,
              color: podeVisualizarVagas ? "#05409A" : "gray",
              backgroundColor: podeVisualizarVagas ? "#fff" : "#f5f5f5",
            }}
            onClick={handleAbrirPopupSelecionarCandidatos}
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
            { title: "Candidatos selecionados", value: 0, icon: <GroupIcon /> },
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

        <VisualizarVagasModal
          isOpen={openVisualizarVagasModal}
          onCancel={handleCloseVisualizarVagas}
          onConfirm={confirmVisualizarVagas}
          loading={false}
          concurso={selectedConcursoLabel}
          cargo={selectedCargoLabel}
        />

        <SelecionarCandidatos
          visible={popupSelecionarCandidatos}
          onClose={handleCloseSelecionarCandidatos}
          concurso={selectedConcursoLabel}
          cargo={selectedCargoLabel}
          vagas={cardData.vagas}
          autorizacoes={cardData.autorizacoes}
          onCandidatosSelecionados={onCandidatosSelecionados}
        />

      </Space>
    </Card>
  );
};

export default Cargo;
