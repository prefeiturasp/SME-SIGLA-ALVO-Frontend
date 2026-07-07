import React, { useState } from "react";
import { Card, Space, Typography, Select, Row, Col, Divider } from "antd";
import { Controller, type Control } from "react-hook-form";
import CampaignIcon from "@mui/icons-material/Campaign";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ApprovalIcon from "@mui/icons-material/Approval";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { AppButton } from '@/components/ui';
import {
  StyledCardPequeno,
  StyledCardGrande,
  CardIconContainer,
  CardContentContainer,
  StatCardActionButton as ActionButton,
  StatCardPrimaryActionButton as PrimaryActionButton,
} from "@/components/ui";
import {
  fullWidth,
  shadowCard,
  standardWideControl,
  colNoPadding,
  cardBodyNoPadding,
  statRow,
  flexRowGap8,
  statLabelBold,
  statValueHighlight,
} from "@/design-system/estilos";

const styles = {
  fullWidth,
  card: shadowCard,
  cargoSelect: standardWideControl,
  buscarButton: { alignSelf: "flex-start" as const },
  colNoPadding,
  sectionLabel: { fontSize: 16 },
  cardBodyNoPadding,
  statRow,
  statCardsRow: flexRowGap8,
  statLabel: statLabelBold,
  statValue: statValueHighlight,
  dividerNone: { margin: "0px" },
  dividerSection: { margin: "16px 0" },
  summaryLabel: {
    fontSize: 14,
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
    textAlign: "center" as const,
  },
};
import VisualizarVagasModal from "./VisualizarVagasModal/VisualizarVagasModal";
import SelecionarCandidatos from "./SelecionarCandidatos";
import type {  IDre, IVaga } from "../../../../services/resources/convocacao/IConvocacao";
import type { FormFields } from "./FormPrincipal";

const { Title, Text } = Typography;

export type Option = { value: string; label: string };
export type ICardData = {
  vagas: number;
  autorizacoes: number;
  reservas: number;
  convocar: number;
};

interface CargoProps {
  isCargoLiberado: string | undefined;
  cargosDisponiveis: Option[];
  cardData:ICardData;
  setCardData: (data: ICardData) => void;
  selectedConcursoLabel: string;
  selectedConcursoValue: string;
  selectedCargoLabel: string;
  onCandidatosSelecionados?: (qtd: number, quantidadesIndividuais?: { geral: number; pcd: number; nna: number }) => void;
  setPodeVisualizarVagas: (podeVisualizarVagas: boolean) => void;
  podeVisualizarVagas: boolean;
  watchFields: any;
  control: Control<FormFields>;
  agendaComponent: React.ReactNode;
  vagasNasEscolasPorCargo:IVaga[];
  buscarVagasNasEscolasPorCargo: () => void;
  dres: IDre[];
}

const Cargo: React.FC<CargoProps> = ({
  isCargoLiberado,
  selectedConcursoLabel,
  selectedConcursoValue,
  selectedCargoLabel,
  onCandidatosSelecionados,
  setPodeVisualizarVagas,
  cargosDisponiveis,
  cardData,
  setCardData,
  watchFields,
  podeVisualizarVagas,
  control,
  agendaComponent,
  vagasNasEscolasPorCargo,
  buscarVagasNasEscolasPorCargo,
  dres
}) => {

  const optionsDres = dres.map((dre) => ({ value: dre.uuid, label: dre.nome }));
  const [popupSelecionarCandidatos, setPopupSelecionarCandidatos] =
    useState(false);
  const [candidatosSelecionados, setCandidatosSelecionados] = useState(0);
  
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
  const [candidatosEEscolas, setCandidatosEEscolas] = useState({quantidadeEscolasSelecionadas:0});
  const confirmVisualizarVagas = async (data: IVaga[]) => {
    try {
      
      const escolasSelecionadas = data.filter((item) => item.checked);      

      const quantidadeVagasSelecionados = escolasSelecionadas.reduce((acc, item) => ({
        totalVagas: acc.totalVagas + item.vagas_definitivas + item.vagas_precarias
      }), { totalVagas: 0 }).totalVagas;
      
      
      setCardData((prev: ICardData)  => ({
        ...prev,
        vagas: quantidadeVagasSelecionados,
      }));   

      setCandidatosEEscolas({        
        quantidadeEscolasSelecionadas:escolasSelecionadas.length
       });

      
      setOpenVisualizarVagasModal(false);

    } catch (e) {
      console.log(e);
    }
  };

  const handleCloseSelecionarCandidatos = () => {
    setPopupSelecionarCandidatos(false);
  };

  const handleCandidatosSelecionados = (quantidade: number, quantidadesIndividuais?: { geral: number; pcd: number; nna: number }) => {
    setCandidatosSelecionados(quantidade);
    
    // Atualizar os cards individuais se as quantidades foram fornecidas
    if (quantidadesIndividuais) {
      setCardData({
        vagas: cardData.vagas,
        autorizacoes: quantidadesIndividuais.geral, // Ampla
        convocar: quantidadesIndividuais.pcd,      // PcD
        reservas: quantidadesIndividuais.nna       // NNA
      });
    }
    
    // Também chama o callback do componente pai se existir
    if (onCandidatosSelecionados) {
      onCandidatosSelecionados(quantidade, quantidadesIndividuais);
    }
  };

  const buscarDadosDoCargo = () => {
    if (!watchFields.cargo) return;

      setCardData({
        vagas: 385,
        autorizacoes: 0,
        reservas: 0,
        convocar: 0,
      });
      // Habilita o botão somente se todos os campos do formulário estiverem preenchidos
      const camposPreenchidos = Boolean(
        watchFields.concurso &&
          watchFields.tipo_escolha &&
          watchFields.descricao &&
          watchFields.data_convocacao &&
          watchFields.data_corte_vagas,
      );
      setPodeVisualizarVagas(camposPreenchidos);

  };

  return (
    <Space direction="vertical" size="large" style={styles.fullWidth}>
      <Card style={styles.card}>
        <Space direction="vertical" size="small" style={styles.fullWidth}>
        <Title level={3}>Cargos</Title>
        <Text strong>Cargo</Text>
        <Controller
          control={control}
          name="cargo"
          render={({ field }) => (
            <Select
              {...field}
              placeholder="Selecione o cargo"
              style={styles.cargoSelect}
              disabled={!isCargoLiberado}
              options={cargosDisponiveis}
              suffixIcon={
                <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
              }
            />
          )}
        />

        <AppButton
          variant="primary"
          size="large"
          onClick={buscarVagasNasEscolasPorCargo}
          disabled={!watchFields.cargo && !podeVisualizarVagas}
          style={styles.buscarButton}
        >
          Buscar
        </AppButton>

        <Row gutter={0} justify="start" align="top">
          <Col style={styles.colNoPadding}>
            <div style={{ marginBottom: 0 }}>
              <Text strong style={styles.sectionLabel}>
                Número de Vagas
              </Text>
            </div>
            <StyledCardPequeno styles={{ body: styles.cardBodyNoPadding }}>
              <div style={styles.statRow}>
                <CardIconContainer>{<CampaignIcon />}</CardIconContainer>
                <CardContentContainer>
                  <div style={styles.statLabel}>Vagas</div>
                  <div style={styles.statValue}>
                    {cardData.vagas}
                  </div>
                </CardContentContainer>
              </div>
            </StyledCardPequeno>
          </Col>

          <Col style={styles.colNoPadding}>
            <div style={{ marginBottom: 0 }}>
              <Text strong style={styles.sectionLabel}>
                Candidatos a convocar
              </Text>
            </div>
            <Row gutter={0} justify="start">
              <Col style={styles.colNoPadding}>
                <div style={styles.statCardsRow}>
                  <StyledCardPequeno styles={{ body: styles.cardBodyNoPadding }}>
                    <div style={styles.statRow}>
                      <CardIconContainer>{<GroupAddIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={styles.statLabel}>
                          Ampla
                        </div>
                        <div style={styles.statValue}>
                          {cardData.autorizacoes}
                        </div>
                      </CardContentContainer>
                    </div>
                  </StyledCardPequeno>
                  <StyledCardPequeno styles={{ body: styles.cardBodyNoPadding }}>
                    <div style={styles.statRow}>
                      <CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={styles.statLabel}>
                          NNA
                        </div>
                        <div style={styles.statValue}>
                          {cardData.reservas}
                        </div>
                      </CardContentContainer>
                    </div>
                  </StyledCardPequeno>
                  <StyledCardPequeno styles={{ body: styles.cardBodyNoPadding }}>
                    <div style={styles.statRow}>
                      <CardIconContainer>{<ApprovalIcon />}</CardIconContainer>
                      <CardContentContainer>
                        <div style={styles.statLabel}>
                          PcD
                        </div>
                        <div style={styles.statValue}>
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

        <Divider style={styles.dividerNone} />

        <Title level={3}>Configuração do cargo</Title>

        <Space wrap>
          <ActionButton
            disabled={!podeVisualizarVagas}
            onClick={handleOpenVisualizarVagasModal}
            icon={<VisibilityIcon />}
          >
            Visualizar vagas
          </ActionButton>

          <ActionButton
            disabled={!podeVisualizarVagas}
            icon={<AdsClickIcon />}
            onClick={handleAbrirPopupSelecionarCandidatos}
          >
            Selecionar candidatos
          </ActionButton>

          <PrimaryActionButton
            size="large"
            disabled
          >
            Exportação de convocados
          </PrimaryActionButton>

          <PrimaryActionButton
            size="large"
            disabled
          >
            Exportação de vagas
          </PrimaryActionButton>
        </Space>

        <Row gutter={16} justify="start">
          {[
            { title: "Escolas selecionadas", value: candidatosEEscolas.quantidadeEscolasSelecionadas, icon: <SchoolIcon /> },
            { title: "Candidatos selecionados", value: candidatosSelecionados, icon: <GroupIcon /> },
          ].map(({ title, value, icon }) => (
            <Col key={title}>
              <StyledCardGrande styles={{ body: styles.cardBodyNoPadding }}>
                <div style={styles.statRow}>
                  <CardIconContainer>{icon}</CardIconContainer>
                  <CardContentContainer>
                    <div style={styles.summaryLabel}>
                      {title}
                    </div>
                    <div style={styles.statValue}>
                      {value}
                    </div>
                  </CardContentContainer>
                </div>
              </StyledCardGrande>
            </Col>
          ))}
        </Row>

        <AppButton variant="primary" icon={<PlusOutlined />} size="large">
          Adicionar Cargo
        </AppButton>

        <Divider style={styles.dividerSection} />

        {agendaComponent}

        <VisualizarVagasModal
          isOpen={openVisualizarVagasModal}
          onCancel={handleCloseVisualizarVagas}
          onConfirm={confirmVisualizarVagas}
          loading={false}
          concurso={selectedConcursoLabel}
          cargo={selectedCargoLabel}
          vagasNasEscolasPorCargo={vagasNasEscolasPorCargo}
          dres={optionsDres}
        />

        <SelecionarCandidatos
          visible={popupSelecionarCandidatos}
          onClose={handleCloseSelecionarCandidatos}
          concurso={selectedConcursoLabel}
          concursoValue={selectedConcursoValue}
          cargo={selectedCargoLabel}
          vagas={cardData.vagas}
          autorizacoes={cardData.autorizacoes}
          onCandidatosSelecionados={handleCandidatosSelecionados}
        />

        </Space>
      </Card>
    </Space>
  );
};

export default Cargo;
