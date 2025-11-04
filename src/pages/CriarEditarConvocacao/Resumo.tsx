import React from "react";
import { Button, Collapse, Steps, theme, Tooltip, Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate, useParams } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { items, steps } from "./components/StepsNames";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import ResumoDoProcesso from "./components/ResumoDoProcesso";
import ResumoCandidatosTable from "./components/ResumoCandidatosTable";
import { useAgenda } from "../../hooks/useAgenda";
import useConvocacaoById from "../Processos/ConvocacaoCandidatos/hooks/useConvocacaoById";
import { usePatchProcessoConvocacao } from "../Processos/NovaConvocacaoCandidatos/hooks/usePatchProcessoConvocacao";
import type { IAgenda, ICandidatosClassificados } from "../../services/resources/agenda/IAgenda";
import { useGetPermissions } from "../../routes/PermissionContextGuard";

const { Text } = Typography;

const Resumo: React.FC = () => {
  const { can } = useGetPermissions();
  const canChangeProcessoConvocacao = can("change_processoconvocacao");
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
  const { token } = theme.useToken();

  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const { agendaData, agendaIsLoading } = useAgenda(uuid as string);
  const totalPorAgenda = Array.isArray(agendaData)
  ? agendaData?.map((agenda: IAgenda) =>
      Array.isArray(agenda?.candidatos_classificados)
        ? agenda.candidatos_classificados.reduce(
            (acc: number, candidato: ICandidatosClassificados) => acc + (candidato?.qtd_candidatos ?? 0),
            0
          )
        : 0
    )
  : [];

  
  const { processoConvocacaoData, processoConvocacaoIsLoading } =
    useConvocacaoById(uuid as string);
  // de onde vem o cargo tem que ser varias tabelas ? rodar no wire mock
  const patchProcessoConvocacaoMutation = usePatchProcessoConvocacao();

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
      title: (
        <Text
          strong
          style={{ cursor: "pointer" }}
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
    patchProcessoConvocacaoMutation.mutate(
      { uuid: uuid as string, payload: { status: "EM_ANDAMENTO" } },
      {
        onSuccess: () => {
          navigate(`/processos/convocacao/`);
        },
      }
    );
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
            style={{ fontWeight: "400" }}
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
            <Text
              style={{ fontWeight: "400", color: token.colorTextSecondary }}
            >
              Processo de convocação de candidatos
            </Text>
          }
          variant="borderless"
        >
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
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
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
            <Collapse
              size="large"
              defaultActiveKey={['0']}
              items={agendaData?.map((agenda: IAgenda, index: number) => (
                 {
                  key: index,
                  label: <>{agenda.cargo_nome}   -   {totalPorAgenda[index] } Vagas no total</>,
                  children: (
                    <ResumoCandidatosTable
                      loading={agendaIsLoading}
                      data={agenda?.candidatos_classificados || []}
                    />
                  )
                }
              )) || []}
            />
          

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
