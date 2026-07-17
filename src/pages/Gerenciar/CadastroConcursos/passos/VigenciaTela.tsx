import React, { useEffect } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormVigencia from "../components/FormVigencia";
import { useVigenciaForm } from "../hooks/useVigenciaForm";
import { useModoConcurso } from "../hooks/useModoConcurso";
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
  const current = 2;

  const { isEdicao, uuidRota, getStepPath, labelTela, labelBotaoFinal } =
    useModoConcurso();
  const uuid = uuidRota;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useVigenciaForm();

  // O concurso já existe desde o passo 1; carrega para popular este passo.
  const { concursoData: concurso } = useGetConcursoByUuid(uuidRota ?? "");

  useEffect(() => {
    if (concurso) {
      reset(detalheParaPasso3(concurso));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concurso]);

  // Passo final: notifica o sucesso (os passos anteriores são silenciosos).
  const patchConcurso = usePatchConcurso();

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

  // Concurso EM_ANDAMENTO: só data de prorrogação e vigência são editáveis;
  // a situação não é alterada (não regride para COMPLETO).
  const bloqueado = concurso?.situacao === "EM_ANDAMENTO";

  // Passo final: no fluxo normal salva a vigência e marca COMPLETO (reenviar
  // COMPLETO é idempotente); quando bloqueado, salva apenas prorrogação e
  // vigência mantendo a situação EM_ANDAMENTO.
  const next = handleSubmit((valores) => {
    if (!uuidRota) return;
    const payload = bloqueado
      ? montarPayloadVigenciaLiberada(valores)
      : { ...montarPayloadPasso3(valores), situacao: "COMPLETO" as const };
    patchConcurso.mutate(
      { uuid: uuidRota, payload },
      { onSuccess: () => navigate("/gerenciar/concursos") }
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
