import React, { useEffect } from "react";
import { Steps, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormVigencia from "../components/FormVigencia";
import { useVigenciaForm } from "../hooks/useVigenciaForm";
import {
  leHouveAlteracao,
  opcoesNavegacaoConcurso,
  ROTA_LISTAGEM_CONCURSOS,
  useModoConcurso,
} from "../hooks/useModoConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  detalheParaPasso3,
  montarPayloadPasso3,
  montarPayloadVigenciaLiberada,
} from "../utils/montarPayloadConcurso";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const VigenciaTela: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const houveAlteracaoAnterior = leHouveAlteracao(state);
  const current = 2;

  const { isEdicao, uuidRota, getStepPath, labelTela, labelBotaoFinal } =
    useModoConcurso();
  const uuid = uuidRota;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useVigenciaForm();

  const { concursoData: concurso } = useGetConcursoByUuid(uuidRota ?? "");

  useEffect(() => {
    if (concurso) {
      reset(detalheParaPasso3(concurso));
    }

  }, [concurso]);

  const patchConcurso = usePatchConcurso(true);

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid,
    currentStepIndex: current,
    onNavigate: (path) => navigate(path),
    getStepPath,
    liberarTodos: isEdicao,
  });

  const breadcrumbItems = [
    { title: <Text strong>Gerenciar</Text> },
    {
      title: (
        <Text
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/gerenciar/concursos")}
        >
          Cadastro de concursos
        </Text>
      ),
    },
    { title: labelTela },
  ] as TitleItem[];

  const bloqueado = concurso?.situacao === "EM_ANDAMENTO";

  const irParaListagem = (houveAlteracao: boolean) => {
    navigate(
      ROTA_LISTAGEM_CONCURSOS,
      opcoesNavegacaoConcurso(houveAlteracao)
    );
  };

  const next = handleSubmit((valores) => {
    if (!uuidRota) return;

    if (!isDirty) {
      irParaListagem(houveAlteracaoAnterior);
      return;
    }

    const payload = bloqueado
      ? montarPayloadVigenciaLiberada(valores)
      : { ...montarPayloadPasso3(valores), situacao: "COMPLETO" as const };
    patchConcurso.mutate(
      { uuid: uuidRota, payload },
      { onSuccess: () => irParaListagem(true) }
    );
  });

  const prev = () => {
    navigate(getStepPath(1, uuid) ?? "/gerenciar/concursos");
  };

  const cancel = () => {
    navigate("/gerenciar/concursos");
  };

  return (
    <>
      <ConvocacaoStepsGlobalStyle />
      <BaseTela breadcrumbItems={breadcrumbItems} title={labelTela}>
        <StyledCardWithoutBorder variant="borderless">
          <Steps
            className="convocacao-steps"
            current={current}
            items={stepItems}
            onChange={handleStepChange}
          />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          variant="borderless"
        >
          <CardTitle>Vigência</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Informe as datas que definem a validade e a vigência do concurso.
          </Text>

          <FormVigencia control={control} erros={errors} bloqueado={bloqueado} />

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
            canAvancar={isValid}
            loading={patchConcurso.isPending}
            labelFinal={labelBotaoFinal}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default VigenciaTela;
