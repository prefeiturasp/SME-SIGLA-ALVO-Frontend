import React, { useState } from "react";
import {
  Button,
  Card,
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

const { Text } = Typography;

const Step01: React.FC = () => {
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

  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  

  const contentStyle: React.CSSProperties = {
    lineHeight: "400px",
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
          <Button icon={<UserSwitchOutlined />}>Gerenciamento de vagas</Button>
        }
      >
        <Card title="Processo de convocação de candidatos" variant="borderless">
          <Steps current={current} items={items} />
        </Card>

        <Card
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
        </Card>
      </BaseTela>
    </>
  );
};

export default Step01;
