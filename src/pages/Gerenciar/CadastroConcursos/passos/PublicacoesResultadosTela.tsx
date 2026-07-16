import React, { useEffect } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormPublicacoesResultados from "../components/FormPublicacoesResultados";
import { usePublicacoesResultadosForm } from "../hooks/usePublicacoesResultadosForm";
import { useModoConcurso } from "../hooks/useModoConcurso";
import { usePatchConcurso } from "../hooks/usePatchConcurso";
import { useGetConcursoByUuid } from "../../../GerenciamentoVagas/hooks/useGetConcursoPorUuid";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import { CHAVE_PASSO_2 } from "../utils/wizardStorage";
import {
  detalheParaPasso2,
  montarPayloadPasso2,
} from "../utils/montarPayloadConcurso";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const PublicacoesResultadosTela: React.FC = () => {
  const navigate = useNavigate();
  const current = 1;

  const { isEdicao, uuidRota, getStepPath, labelTela } = useModoConcurso();
  const uuid = uuidRota;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = usePublicacoesResultadosForm();

  const { concursoData: concurso } = useGetConcursoByUuid(
    isEdicao ? uuidRota ?? "" : ""
  );

  useEffect(() => {
    if (isEdicao && concurso) {
      reset(detalheParaPasso2(concurso));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdicao, concurso]);

  // Silencioso: a notificação de sucesso aparece só no último passo.
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
          Cadastro de concurso
        </Text>
      ),
    },
    { title: labelTela },
  ] as TitleItem[];

  const irParaPasso3 = () => {
    navigate(getStepPath(2, uuid) ?? "/gerenciar/concursos");
  };

  const next = handleSubmit((valores) => {
    if (isEdicao && uuidRota) {
      patchConcurso.mutate(
        { uuid: uuidRota, payload: montarPayloadPasso2(valores) },
        { onSuccess: () => irParaPasso3() }
      );
      return;
    }

    sessionStorage.setItem(CHAVE_PASSO_2, JSON.stringify(valores));
    irParaPasso3();
  });

  const prev = () => {
    navigate(getStepPath(0, uuid) ?? "/gerenciar/concursos");
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
          <CardTitle>Publicações e resultados</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Registre as principais publicações e os resultados divulgados ao
            longo do concurso.
          </Text>

          <FormPublicacoesResultados control={control} erros={errors} />

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
            canAvancar={isValid}
            loading={patchConcurso.isPending}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default PublicacoesResultadosTela;
