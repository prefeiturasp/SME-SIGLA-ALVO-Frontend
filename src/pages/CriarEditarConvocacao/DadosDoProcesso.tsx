import React from "react";
import { Button, Steps, theme, Typography } from "antd";
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
  
  const { token } = theme.useToken();

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
    uuid,
    isViewMode,
    formErrors,
    processoConvocacaoData,
    hasEdits,
    patchProcessoFromForm
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
      if (isEdit || uuid) {
        if (hasEdits) {
          await patchProcessoFromForm(formData);
          navigate(`/processos/convocacao/editar/${uuid}/selecao-cargos`);
        }
        navigate(`/processos/convocacao/editar/${uuid}/selecao-cargos`);
        return;
      }
      const result = await handleSub(formData);
      if (result && typeof result === 'object' && 'uuid' in result) {
        navigate(`/processos/convocacao/editar/${result.uuid}/selecao-cargos`, { state: { editData: result, isViewMode: false } });
      }
    })();
  };

  const prev = () => {
    console.log("voltar");
  };

  const cancel = () => {
    navigate("/processos/convocacao/")
  };

  return (
    <>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Button
            color="primary"
            variant="outlined"
            icon={<UserSwitchOutlined />}
          >
            Gerenciamento de vagas
          </Button>
        }
      >
        <StyledCardWithoutBorder  title={<Text style={{ fontWeight: '400', color: token.colorTextSecondary }}>Processo de convocação de candidatos</Text>} variant="borderless">
          <Steps current={current} items={items} />
        </StyledCardWithoutBorder>

        <StyledCardWithoutBorder
          style={{ marginTop: "1.25rem" }}
          title={steps[current].title}
          variant="borderless"
        >
          <div>
            <FormPrincipal
              control={control}
              concursosData={concursosData}
              concursosOptionsIsLoading={concursosOptionsIsLoading}
              isCargoLiberado={isCargoLiberado}
              popularSelectDeCargos={popularSelectDeCargos}
              isViewMode={isViewMode} 
              formErrors={formErrors}
              processoConvocacaoData={processoConvocacaoData}
            />
          </div>

          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            loading={false}
            onCancel={cancel}

          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default DadosDoProcesso;
