import React from "react";
import { Steps, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormPublicacoesResultados from "../components/FormPublicacoesResultados";
import { usePublicacoesResultadosForm } from "../hooks/usePublicacoesResultadosForm";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const CHAVE_PASSO_2 = "concurso-wizard-passo-2";

const PublicacoesResultadosTela: React.FC = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const current = 1;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = usePublicacoesResultadosForm();

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid,
    currentStepIndex: current,
    onNavigate: (path) => navigate(path),
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
    { title: "Adicionar concurso" },
  ] as TitleItem[];

  const next = handleSubmit((valores) => {
    sessionStorage.setItem(CHAVE_PASSO_2, JSON.stringify(valores));
    navigate(`/gerenciar/concursos/adicionar/${uuid}/passo-3`);
  });

  const prev = () => {
    navigate("/gerenciar/concursos/adicionar/passo-1");
  };

  const cancel = () => {
    navigate("/gerenciar/concursos");
  };

  return (
    <>
      <ConvocacaoStepsGlobalStyle />
      <BaseTela breadcrumbItems={breadcrumbItems} title="Adicionar concurso">
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
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default PublicacoesResultadosTela;
