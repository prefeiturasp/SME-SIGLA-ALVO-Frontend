import React from "react";
import { Button, Steps, Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { items, steps } from "./components/StepsNames";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import FormPrincipal from "../Processos/NovaConvocacaoCandidatos/components/FormPrincipal";
import { useNovaConvocacaoCandidatos } from "../Processos/NovaConvocacaoCandidatos/hooks/useNovaConvocacaoCandidatos";

const { Text } = Typography;

const DadosDoProcesso: React.FC = () => {
  

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,    
    concursosData,
    concursosOptionsIsLoading,    
    isCargoLiberado,    
    popularSelectDeCargos,
    handleSub,        
    isEdit,
    isViewMode,
    formErrors    
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

  const current = 0;

  const next = async () => {
    
    await handleSubmit(async (formData) => {
      const ok = await handleSub(formData);
      
      if (ok) {
         navigate("/processos/convocacao/nova/selecao-cargos", {state:{editData: {...formData, concurso_uuid:formData.concurso}, isViewMode: false}});
      }
    })();
  };

  const prev = () => {
    console.log("voltar");
  };

  const contentStyle: React.CSSProperties = {
    minHeight: "40vh",
    
    
  };

  // editData
  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Button
            style={{ fontWeight: "400" }}
            color="primary"
            variant="outlined"
            icon={<UserSwitchOutlined />}
          >
            Gerenciamento de vagas
          </Button>
        }
      >
        <StyledCardWithoutBorder
          title="Processo de convocação de candidatos"
          variant="outlined"
        >
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          title={steps[current].title}
          variant="borderless"
        >
          <div style={contentStyle}>
            <FormPrincipal
              control={control}
              concursosData={concursosData}
              concursosOptionsIsLoading={concursosOptionsIsLoading}
              isCargoLiberado={isCargoLiberado}
              popularSelectDeCargos={popularSelectDeCargos}
              isViewMode={isViewMode} 
              formErrors={formErrors}
            />
          </div>

          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            loading={false}

          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default DadosDoProcesso;
