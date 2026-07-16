import React from "react";
import { Steps, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormVigencia from "../components/FormVigencia";
import { useVigenciaForm } from "../hooks/useVigenciaForm";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const CHAVE_PASSO_3 = "concurso-wizard-passo-3";

const VigenciaTela: React.FC = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const current = 2;

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useVigenciaForm();

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
    sessionStorage.setItem(CHAVE_PASSO_3, JSON.stringify(valores));
    navigate("/gerenciar/concursos");
  });

  const prev = () => {
    navigate(`/gerenciar/concursos/adicionar/${uuid}/passo-2`);
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
          <CardTitle>Vigência</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Informe as datas que definem a validade e a vigência do concurso.
          </Text>

          <FormVigencia control={control} erros={errors} />

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

export default VigenciaTela;
