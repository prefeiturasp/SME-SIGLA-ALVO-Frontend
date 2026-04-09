import React from "react";
import {
  Button,
  Card,
  Alert,
  Steps,
  Typography,
  Row,
  Col,
  Divider,
  Tooltip,
  theme,
  message,
} from "antd";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import {
  UserSwitchOutlined,
} from "@ant-design/icons";
import { StepActions } from "../components/StepActions";
import { items, steps } from "../components/StepsNames";
import { ConvocacaoStepsGlobalStyle } from "../components/ConvocacaoStepsStyles";
import { useStepVisualProgress } from "../components/useStepVisualProgress";
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
import { useGetPermissions } from "../../../routes/PermissionContextGuard";
import { StyledCardWithoutBorder } from "../../../components/EstilosCompartilhados";
import { usePatchPassoProcessoConvocacao } from "../hooks/usePatchPassoProcessoConvocacao";

const { Text } = Typography;

const AgendaTela: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const { can } = useGetPermissions();
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const canChangeProcessoConvocacao = can("change_processoconvocacao");
  const {
    processoConvocacaoData,
    candidatosFaltantesCount,
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
    salvarAgendasNoBackend,
    uuid,
    temPeriodosAgenda,
    setValue,
    trigger,
    agendasLoading,
  } = useAgenda();
  const patchPassoProcessoConvocacaoMutation = usePatchPassoProcessoConvocacao();

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

  const current = 2;
  const passoAtual = Number(processoConvocacaoData?.passo ?? 1);
  const { passoVisual, completedStep, markStepCompleted } = useStepVisualProgress({
    processoUuid: uuid,
    passoAtual,
    currentStepIndex: current,
  });
  const maxStepPermitido = Math.min(3, Math.max(current, passoAtual));
  const stepItems = items.map((item, index) => {
    const isLocked = index > maxStepPermitido;
    const isVisited = !isLocked && index <= passoVisual - 1;

    return {
      ...item,
      disabled: isLocked,
      status: index + 1 <= completedStep ? ("finish" as const) : undefined,
      className: isLocked ? "step-locked" : isVisited ? "step-visited" : undefined,
    };
  });

  const getStepPath = (stepIndex: number) => {
    if (stepIndex === 0) return `/processos/convocacao/editar/${uuid}/dados-processo`;
    if (stepIndex === 1) return `/processos/convocacao/editar/${uuid}/selecao-cargos`;
    if (stepIndex === 2) return `/processos/convocacao/editar/${uuid}/agenda`;
    return `/processos/convocacao/editar/${uuid}/resumo`;
  };

  const hasEdits = periodosList.some((periodo) => !periodo.uuid);
  const handleStepChange = (nextStep: number) => {
    if (nextStep > maxStepPermitido) return;
    if (agendasLoading) return;
    if (hasEdits) {
      message.warning("Salve as alterações antes de navegar entre as etapas.");
      return;
    }
    navigate(getStepPath(nextStep));
  };

  const next = async () => {
    const sucesso = await salvarAgendasNoBackend();
     if (sucesso) {
        if (!uuid) return;
        const passoAtualizado = Math.max(passoAtual, 3) as 1 | 2 | 3 | 4;
        await patchPassoProcessoConvocacaoMutation.mutateAsync({ processoUuid: uuid, passo: passoAtualizado });
        markStepCompleted(3);
        navigate(`/processos/convocacao/editar/${uuid}/resumo`);
      }
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

  const handleAgendarClick = (cargoUuid: string) => {
    handleAgendarCargo(cargoUuid);
  };

  // Exibir alerta somente quando a primeira agenda for ONLINE e estamos abrindo a segunda
  const showSecondAfterOnlineAlert =
    !!agendaAberto &&
    Array.isArray(periodosList) &&
    periodosList.length === 1 &&
    String(periodosList[0]?.tipoEscolha).toUpperCase() === "ONLINE";

  return (
    <>
      <ConvocacaoStepsGlobalStyle />
      <GlobalStyles />
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Tooltip title={!canAddImportacaoArquivoVagas?"Você não possui permissão para essa ação":"Gerenciamento de vagas"} arrow={true} >

          <Button
            color="primary"
            variant="outlined"
            icon={<UserSwitchOutlined />}
            disabled={!canAddImportacaoArquivoVagas}
            onClick={() => navigate('/processos/gerenciamento-vagas')}
          >
            Gerenciamento de vagas
          </Button>
          </Tooltip>
        }
      >
        <StyledCardWithoutBorder  title={<Text style={{ fontWeight: '400', color: token.colorTextSecondary }}>Processo de convocação de candidatos</Text>} variant="borderless">
          <Steps className="convocacao-steps" current={current} items={stepItems} onChange={handleStepChange} />
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
          {showSecondAfterOnlineAlert && (
            <Alert
              message={`Ainda há ${candidatosFaltantesCount ?? 0} candidato(s) faltantes para fazerem a escolha após a importação de escolhas do EOL.`}
              type="info"
              showIcon
              closable
              style={{ marginBottom: 12 }}
            />
          )}
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
          candidatosDisponiveis={
            agendaAberto
              ? // Se houver candidatos faltantes informados pela API (após agenda ONLINE), usar essa quantidade
                (typeof candidatosFaltantesCount === "number"
                  ? candidatosFaltantesCount
                  : agendaAberto.cargo.totalCandidatos -
                    periodosList
                      .filter(p => p.cargo === agendaAberto.cargo.nome)
                      .reduce((total, periodo) => total + (periodo.classificacao || 0), 0))
              : undefined
          }
          candidatosFaltantesCount={typeof candidatosFaltantesCount === "number" ? candidatosFaltantesCount : undefined}
          setValue={setValue}
          totalCandidatos={agendaAberto ? agendaAberto.cargo.totalCandidatos : undefined}
          trigger={trigger}
          hasAgendas={periodosList.length > 0}
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
            onCancel={() => navigate(`/processos/convocacao`)}
            canSalvarEAvancar={canChangeProcessoConvocacao}
            canVoltar={canChangeProcessoConvocacao}
            temPeriodosAgenda={temPeriodosAgenda()}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default AgendaTela;
