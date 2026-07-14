import React from "react";
import { Steps, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../../Base/BaseTela";
import { StepActionsConcurso } from "./StepActionsConcurso";
import { steps } from "./stepsConcurso";
import { useConcursoSteps } from "./useConcursoSteps";
import {
  CardTitle,
  ConvocacaoStepsGlobalStyle,
  StyledCardWithoutBorder,
} from "@/components/ui";

const { Text } = Typography;

const VigenciaTela: React.FC = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const current = 2;

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

  const next = () => {
    navigate("/gerenciar/concursos");
  };

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
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Informe as datas que definem a validade e a vigência do concurso.
          </Text>

          <StepActionsConcurso
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={cancel}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default VigenciaTela;
