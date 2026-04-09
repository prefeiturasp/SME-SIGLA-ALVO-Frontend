import React, { useMemo } from "react";
import { Button, Collapse, Steps, theme, Tooltip, Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate, useParams, useLocation } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { steps } from "./components/StepsNames";
import { ConvocacaoStepsGlobalStyle } from "./components/ConvocacaoStepsStyles";
import { useConvocacaoSteps } from "./components/useConvocacaoSteps";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import ResumoDoProcesso from "./Resumo/ResumoDoProcesso";
import ResumoAgendaTabela from "./Resumo/ResumoAgendaTabela";
import useConvocacaoById from "../Processos/ConvocacaoCandidatos/hooks/useConvocacaoById";
import { useGetAgendas } from "./Agenda/hooks/useGetAgendas";
import type { IAgenda } from "../../services/resources/agenda/IAgenda";
import { useGetPermissions } from "../../routes/PermissionContextGuard";
import { resumoStyles } from "./Resumo/styles";
import { usePatchPassoProcessoConvocacao } from "./hooks/usePatchPassoProcessoConvocacao";

const { Text } = Typography;

function normalizeModalidade(value: any): string | undefined {
  const s = String(value || "").toLowerCase();
  if (!s) return undefined;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatResumoModalidadeFromResults(results?: any[]): string | undefined {
  const list = Array.isArray(results) ? results : [];
  if (list.length === 0) return undefined;
  if (list.length === 1) {
    return normalizeModalidade(list[0]?.modalidade);
  }
  const first = list[0];
  const second = list[1];
  const firstMod = String(first?.modalidade || "").toUpperCase();
  if (firstMod === "ONLINE") {
    return `${normalizeModalidade(first?.modalidade)} / ${normalizeModalidade(second?.modalidade)}`;
  }
  return normalizeModalidade(first?.modalidade);
}

const Resumo: React.FC = () => {
  const { can } = useGetPermissions();
  const canChangeProcessoConvocacao = can("change_processoconvocacao");
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const { token } = theme.useToken();
  const patchPassoProcessoConvocacaoMutation = usePatchPassoProcessoConvocacao();

  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Buscar agendas do backend
  const { agendasData, agendasIsLoading } = useGetAgendas(
    uuid
      ? {
          pagination: { page: 1, page_size: 1000 },
          filters: {
            processo_convocacao_uuid: uuid,
          },
        }
      : undefined,
    { enabled: !!uuid }
  );

  // Agrupar agendas por cargo
  const agendasPorCargo = useMemo(() => {
    if (!agendasData?.results) return [];

    const agrupadas: Record<string, IAgenda[]> = {};

    agendasData.results.forEach((agenda: IAgenda) => {
      const cargoKey = agenda.cargo_uuid || agenda.cargo_nome;
      if (!agrupadas[cargoKey]) {
        agrupadas[cargoKey] = [];
      }
      agrupadas[cargoKey].push(agenda);
    });
    // Ordenar agendas dentro de cada cargo por data e horário
    Object.keys(agrupadas).forEach((cargoKey) => {
      agrupadas[cargoKey].sort((a, b) => {
        // Ordenar por data
        const dataA = a.escolha_em || a.data_escolha;
        const dataB = b.escolha_em || b.data_escolha;
        if (dataA !== dataB) {
          return new Date(dataA).getTime() - new Date(dataB).getTime();
        }

        // Se as datas forem iguais, ordena por horário
        const horaA = a.hora_convocacao_inicio;
        const horaB = b.hora_convocacao_inicio;
        if (horaA && horaB) {
          return horaA.localeCompare(horaB);
        }

        return 0;
      });
    });

    return Object.entries(agrupadas).map(([cargoKey, agendas]) => ({
      cargoKey,
      cargoNome: agendas[0]?.cargo_nome || "Cargo desconhecido",
      agendas,
      totalCandidatos: (() => {
        const first = agendas[0];
        const modalidadeFirst = String(first?.modalidade || "").toUpperCase();
        // Se a primeira agenda for ONLINE, usa a própria classificação da primeira agenda
        if (modalidadeFirst === "ONLINE") {
          return typeof first?.classificacao === "number" ? first.classificacao : 0;
        }
        // Caso contrário, soma (ignorando retardatário)
        return agendas.reduce((sum, agenda) => {
          if (agenda?.retardatario) {
            return sum;
          }
          const valor =
            typeof agenda?.classificacao === "number" ? agenda.classificacao : 0;
          return sum + valor;
        }, 0);
      })(),
    }));
  }, [agendasData]);

  const { processoConvocacaoData, processoConvocacaoIsLoading } =
    useConvocacaoById(uuid as string);

  const isStatusFinalizado = (status: string | undefined) => {
    if (!status) return false;
    const s = status.toLowerCase();
    return s.includes("finalizado") || s.includes("finalizada");
  };

  const isViewOnlyResumo =
    (location.state as { isViewMode?: boolean } | null)?.isViewMode === true ||
    (processoConvocacaoData?.status && isStatusFinalizado(processoConvocacaoData.status));

  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={resumoStyles.breadcrumbItem}
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
          style={resumoStyles.breadcrumbItem}
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
          style={resumoStyles.breadcrumbItem}
          onClick={() => navigate("/processos/convocacao")}
        >
          Convocação de candidatos
        </Text>
      ),
    },
    {
      title: isViewOnlyResumo ? "Visualizar convocação" : "Editar Convocação",
    },
  ] as TitleItem[];

  const current = 3;
  const { stepItems, handleStepChange, markStepCompleted } = useConvocacaoSteps({
    uuid,
    currentStepIndex: current,
    passoAtualBackend: processoConvocacaoData?.passo,
    onNavigate: (path) => navigate(path),
  });

  const next = async () => {
    if (uuid) {
      await patchPassoProcessoConvocacaoMutation.mutateAsync({ processoUuid: uuid, passo: 4 });
      markStepCompleted(4);
    }
    navigate(`/processos/convocacao/`);
  };

  const prev = () => {
    navigate(`/processos/convocacao/editar/${uuid}/agenda`);
  };
  return (
    <>
      <ConvocacaoStepsGlobalStyle />
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title={isViewOnlyResumo ? "Resumo do processo" : "Nova convocação"}
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
        {!isViewOnlyResumo && (
          <StyledCardWithoutBorder
            title={
              <Text style={resumoStyles.cardTitle(token)}>
                Processo de convocação de candidatos
              </Text>
            }
            variant="borderless"
          >
            <Steps className="convocacao-steps" current={current} items={stepItems} onChange={handleStepChange} />
          </StyledCardWithoutBorder>
        )}

        <StyledCardWithoutBorder
          style={resumoStyles.cardWithMarginTop}
          title={isViewOnlyResumo ? undefined : steps[current].title}
          variant="borderless"
        >
          {processoConvocacaoData && (
            <ResumoDoProcesso
              data={processoConvocacaoData}
              isLoading={processoConvocacaoIsLoading}
              useBlackText={isViewOnlyResumo}
              modalidade={formatResumoModalidadeFromResults((agendasData as any)?.results)}
            />
          )}
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={resumoStyles.cardWithMarginTop}
          variant="borderless"
        >
          {agendasPorCargo.length > 0 ? (
            <Collapse
              size="large"
              items={agendasPorCargo.map((grupo, index) => ({
                key: index.toString(),
                label: (
                  <Text style={resumoStyles.collapseLabel}>
                    {grupo.cargoNome} - {grupo.totalCandidatos} candidatos no total
                  </Text>
                ),
                children: (
                  <ResumoAgendaTabela
                    agendas={grupo.agendas}
                    loading={agendasIsLoading}
                  />
                ),
              }))}
            />
          ) : (
            <div style={resumoStyles.emptyAgendasMessage}>
              {agendasIsLoading
                ? "Carregando agendas..."
                : "Nenhuma agenda foi criada ainda. Retorne ao step anterior para criar agendas."}
            </div>
          )}

          {isViewOnlyResumo ? (
            <div style={{ marginTop: 24 }}>
              <Button size="large" onClick={() => navigate("/processos/convocacao")}>
                Voltar
              </Button>
            </div>
          ) : (
            <StepActions
              current={current}
              steps={steps}
              next={next}
              prev={prev}
              onCancel={() => navigate(`/processos/convocacao`)}
              canSalvarEAvancar={canChangeProcessoConvocacao}
              canVoltar={canChangeProcessoConvocacao}
            />
          )}
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default Resumo;
