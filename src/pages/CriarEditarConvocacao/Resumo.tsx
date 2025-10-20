import React from "react";
import {
  Button,
  Steps,
  theme,
  Typography,
} from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import {
  UserSwitchOutlined,
} from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { items, steps } from "./components/StepsNames";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";

const { Text } = Typography;

const Resumo: React.FC = () => {
  const { token } = theme.useToken();

  const navigate = useNavigate();
  const isEdit = false;
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
      title: isEdit ? "Editar Convocação" : "Nova Convocação",
    },
  ] as TitleItem[];

  //ESCOLHE O STEP DEPENDENDO DO QUE JÁ FOI PREENCHIDO EM   EditData

  const current=3;
  const next = () => {
    console.log('next')
  };

  const prev = () => {
    navigate('/processos/convocacao/nova/agenda')    
  };

  

  

  const contentStyle: React.CSSProperties = {
    lineHeight: "300px",
    textAlign: "center",

    borderRadius: token.borderRadiusLG,

    marginTop: 20,
  };

  // editData
  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Button style={{fontWeight:'400'}} color="primary" variant="outlined" icon={<UserSwitchOutlined />}>Gerenciamento de vagas</Button>
        }
      >
        <StyledCardWithoutBorder title="Processo de convocação de candidatos" variant="borderless">
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          title={steps[current].title}
          variant="borderless"
        >
          <div style={contentStyle}>{"escreva seu componente aqui"}</div>

          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={() => console.log("cancelado!")}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default Resumo;
