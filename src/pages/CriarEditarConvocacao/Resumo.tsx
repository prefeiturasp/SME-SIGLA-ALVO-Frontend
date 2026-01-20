import React, { useMemo } from "react";
import { Button, Collapse, Steps, theme, Tooltip, Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate, useParams } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { items, steps } from "./components/StepsNames";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import ResumoDoProcesso from "./Resumo/ResumoDoProcesso";
import ResumoAgendaTabela from "./Resumo/ResumoAgendaTabela";
import useConvocacaoById from "../Processos/ConvocacaoCandidatos/hooks/useConvocacaoById";
import { useGetAgendas } from "./Agenda/hooks/useGetAgendas";
import type { IAgenda } from "../../services/resources/agenda/IAgenda";
import { useGetPermissions } from "../../routes/PermissionContextGuard";
import { resumoStyles } from "./Resumo/styles";

const { Text } = Typography;

const Resumo: React.FC = () => {
  const { can } = useGetPermissions();
  const canChangeProcessoConvocacao = can("change_processoconvocacao");
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const { token } = theme.useToken();

  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

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
      totalCandidatos: agendas.reduce((sum, agenda) => {
        if (agenda?.retardatario) {
          return sum;
        }
        const valor =
          typeof agenda?.classificacao === "number" ? agenda.classificacao : 0;
        return sum + valor;
      }, 0),
    }));
  }, [agendasData]);

  const { processoConvocacaoData, processoConvocacaoIsLoading } =
    useConvocacaoById(uuid as string);

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
      title: "Editar Convocação",
    },
  ] as TitleItem[];

  const current = 3;

  const next = async () => {
    navigate(`/processos/convocacao/`);
  };

  const prev = () => {
    navigate(`/processos/convocacao/editar/${uuid}/agenda`);
  };

  return (
    <>
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
        <StyledCardWithoutBorder
          title={
            <Text style={resumoStyles.cardTitle(token)}>
              Processo de convocação de candidatos
            </Text>
          }
          variant="borderless"
        >
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={resumoStyles.cardWithMarginTop}
          title={steps[current].title}
          variant="borderless"
        >
          {processoConvocacaoData && (
            <ResumoDoProcesso
              data={processoConvocacaoData}
              isLoading={processoConvocacaoIsLoading}
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

          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={() => navigate(`/processos/convocacao`)}
            canSalvarEAvancar={canChangeProcessoConvocacao}
            canVoltar={canChangeProcessoConvocacao}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default Resumo;
