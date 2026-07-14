import React, { useState } from "react";
import { Steps, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
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

const IdentificacaoTela: React.FC = () => {
  const navigate = useNavigate();
  const current = 0;

  // Passo 1 "cria" o concurso gerando um uuid no cliente, que é carregado
  // por parâmetro nos passos seguintes. Nenhum request ao backend nesta fase.
  const [uuidConcurso] = useState(() => uuidv4());

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

  const next = () => {
    navigate(`/gerenciar/concursos/adicionar/${uuidConcurso}/passo-2`);
  };

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
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Informe os dados que identificam o concurso e o processo
            administrativo correspondente.
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

export default IdentificacaoTela;
