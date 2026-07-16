import React, { useState } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import FormConcurso from "../components/FormConcurso";
import { useConcursoForm } from "../hooks/useConcursoForm";
import { StepActionsConcurso } from "../components/StepActionsConcurso";
import { steps } from "../components/stepsConcurso";
import { useConcursoSteps } from "../components/useConcursoSteps";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const CHAVE_PASSO_1 = "concurso-wizard-passo-1";

const IdentificacaoTela: React.FC = () => {
  const navigate = useNavigate();
  const current = 0;

  const [uuidConcurso] = useState(() => uuidv4());

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useConcursoForm();

  const { stepItems, handleStepChange } = useConcursoSteps({
    uuid: uuidConcurso,
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
    sessionStorage.setItem(CHAVE_PASSO_1, JSON.stringify(valores));
    navigate(`/gerenciar/concursos/adicionar/${uuidConcurso}/passo-2`);
  });

  const prev = () => {
    navigate("/gerenciar/concursos");
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
          <CardTitle>Identificação do concurso</CardTitle>
          <Text
            type="secondary"
            style={{ display: "block", marginTop: 8, marginBottom: 24 }}
          >
            Informe os dados que identificam o concurso e o processo
            administrativo correspondente.
          </Text>

          <FormConcurso control={control} erros={errors} />

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

export default IdentificacaoTela;
