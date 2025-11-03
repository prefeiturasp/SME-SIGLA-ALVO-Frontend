import React from "react";
import {
  Button,
  Card,
  Steps,
  Typography,
  Row,
  Col,
  Divider,
  theme,
} from "antd";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import {
  UserSwitchOutlined,
} from "@ant-design/icons";
import { StepActions } from "../components/StepActions";
import { items, steps } from "../components/StepsNames";
import { useAgenda } from "./hooks/useAgenda";
import { 
  inlineStyles,
  GlobalStyles,
  processInfoStyles,
  agendaTelaStyles
} from "./styles";
import dayjs from "dayjs";
import AgendaForm from "./components/AgendaForm";
import AgendaTabela from "./components/AgendaTabela";
import { StyledCardWithoutBorder } from "../../../components/EstilosCompartilhados";

const { Text } = Typography;

const AgendaTela: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const {
    processoConvocacaoData,
    cargosAdicionados,
    handleAgendarCargo,
    agendaAberto,
    handleFecharAgenda,
    // Estados e funções específicas da agenda
    control,
    formErrors,
    isRetardatario,
    setIsRetardatario,
    periodosList,
    watchedFields,
    getErrorMessage,
    isAgendaComplete,
    isBotaoAdicionarHabilitado,
    handleAdicionarPeriodo,
    handleRemoverPeriodo,
    editingKey,
    isEditing,
    edit,
    cancelEdit,
    saveEdit,
    calcularIntervaloClassificacao,
    verificarConflitoTempoReal,
    cargoParaExpandir,
    limparExpansao, 
    uuid,
  } = useAgenda();

  const isEdit = false;
  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={inlineStyles.breadcrumbItem}
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
          style={inlineStyles.breadcrumbItem}
          onClick={() => navigate("/processos")}
        >
          Processos
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={inlineStyles.breadcrumbItem}
          onClick={() => navigate("/processos/convocacao")}
        >
          Convocação de candidatos
        </Text>
      ),
    },
    {
      title: isEdit ? "Editar Convocação" : "Nova Convocação",
    },
  ] as TitleItem[];

  const current = 2; // Step 3 - Agenda
  const next = () => {
    navigate(`/processos/convocacao/editar/${uuid}/resumo`);    
  };

  const prev = () => {
    navigate(`/processos/convocacao/editar/${uuid}/selecao-cargos`)    
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = dayjs(value);
    return d.isValid() ? d.format('DD/MM/YYYY') : '—';
  };

  const formatTipoEscolha = (value?: string) => {
    if (!value) return '—';
    const map: Record<string, string> = {
      NOVA_AUTORIZACAO: 'Nova Autorização',
      ESCOLHA: 'Escolha',
    };
    if (map[value]) return map[value];
    return value
      .toLowerCase()
      .split('_')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  };

  const contentStyle: React.CSSProperties = agendaTelaStyles.contentStyle;

  // Função para lidar com o clique no botão Agendar
  const handleAgendarClick = (cargoUuid: string) => {
    handleAgendarCargo(cargoUuid);
  };

  return (
    <>
      <GlobalStyles />
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Button
            color="primary"
            variant="outlined"
            icon={<UserSwitchOutlined />}
            onClick={() => navigate('/processos/gerenciamento-vagas')}
          >
            Gerenciamento de vagas
          </Button>
        }
      >
        <StyledCardWithoutBorder  title={<Text style={{ fontWeight: '400', color: token.colorTextSecondary }}>Processo de convocação de candidatos</Text>} variant="borderless">
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          title="Dados do processo"
          variant="borderless"
        >
          <div style={{ ...contentStyle, ...inlineStyles.containerWithMarginTop }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Concurso:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.concurso_nome || 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Data da convocação:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.data_convocacao ? formatDate(processoConvocacaoData.data_convocacao) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Tipo de Escolha:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.tipo_escolha ? formatTipoEscolha(processoConvocacaoData.tipo_escolha) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Data corte de vagas:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.data_corte_vagas ? formatDate(processoConvocacaoData.data_corte_vagas) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={16}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Descrição:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.descricao || 'Carregando...'}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={inlineStyles.marginTop}
          styles={{ body: { paddingTop: 0 }, header: { borderBottom: 'none' } }}
          title={
            <Text style={inlineStyles.tableTitleWithFont}>
              Agendar
            </Text>
          }
          variant="borderless"
        >

          <Divider style={inlineStyles.dividerMargin} />
          
          <div style={{ ...contentStyle, ...inlineStyles.containerWithMarginTop }}>
        {/* Formulário de Agenda */}
        <AgendaForm
          agendaAberto={agendaAberto}
          handleFecharAgenda={handleFecharAgenda}
          control={control}
          formErrors={formErrors}
          isRetardatario={isRetardatario}
          setIsRetardatario={setIsRetardatario}
          watchedFields={watchedFields}
          getErrorMessage={getErrorMessage}
          isAgendaComplete={isAgendaComplete}
          isBotaoAdicionarHabilitado={isBotaoAdicionarHabilitado}
          handleAdicionarPeriodo={handleAdicionarPeriodo}
          candidatosDisponiveis={agendaAberto ? agendaAberto.cargo.totalCandidatos - periodosList.filter(p => p.cargo === agendaAberto.cargo.nome).reduce((total, periodo) => total + (periodo.classificacao || 0), 0) : undefined}
        />

            {/* Tabela de Agenda */}
            <AgendaTabela
              cargosAdicionados={cargosAdicionados}
              periodosList={periodosList}
              handleAgendarClick={handleAgendarClick}
              handleRemoverPeriodo={handleRemoverPeriodo}
              editingKey={editingKey}
              isEditing={isEditing}
              edit={edit}
              cancelEdit={cancelEdit}
              saveEdit={saveEdit}
              calcularIntervaloClassificacao={calcularIntervaloClassificacao}
              verificarConflitoTempoReal={verificarConflitoTempoReal}
              cargoParaExpandir={cargoParaExpandir}
              limparExpansao={limparExpansao}
            />
          </div>
          
          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={() => console.log("cancelado!")}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default AgendaTela;
