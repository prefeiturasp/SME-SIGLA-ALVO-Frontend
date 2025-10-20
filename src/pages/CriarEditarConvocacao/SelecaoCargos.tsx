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
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import { useNovaConvocacaoCandidatos } from "../Processos/NovaConvocacaoCandidatos/hooks/useNovaConvocacaoCandidatos";

const { Text } = Typography;

const SelecaoCargos: React.FC = () => {
  const { token } = theme.useToken();

  const navigate = useNavigate();
  
  const {    
    isEdit,    
    editData,
    } = useNovaConvocacaoCandidatos();
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

  const current=1;
  const next = () => {
    navigate('/processos/convocacao/nova/agenda')
    
  };

  const prev = () => {
    navigate('/processos/convocacao/nova/dados-processo', {state:{editData: editData, isViewMode: false}});
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

export default SelecaoCargos;
