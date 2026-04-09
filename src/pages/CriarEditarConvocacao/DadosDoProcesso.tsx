import React from "react";
import { Button, Steps, theme, Tooltip, Typography, message } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { steps } from "./components/StepsNames";
import { ConvocacaoStepsGlobalStyle } from "./components/ConvocacaoStepsStyles";
import { useConvocacaoSteps } from "./components/useConvocacaoSteps";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import FormPrincipal from "../Processos/NovaConvocacaoCandidatos/components/FormPrincipal";
import { useNovaConvocacaoCandidatos } from "../Processos/NovaConvocacaoCandidatos/hooks/useNovaConvocacaoCandidatos";
import { useGetPermissions } from "../../routes/PermissionContextGuard";
import { usePatchPassoProcessoConvocacao } from "./hooks/usePatchPassoProcessoConvocacao";

const { Text } = Typography;

const DadosDoProcesso: React.FC = () => {
  
  const { token } = theme.useToken();

  const navigate = useNavigate();

  const { can } = useGetPermissions();
  const canAddProcessoConvocacao = can("add_processoconvocacao");
  const canViewProcessoConvocacao = can("view_processoconvocacao");
  const canAddImportacaoArquivoVagas = can("add_importacaoarquivovagas");
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
  const patchPassoProcessoConvocacaoMutation = usePatchPassoProcessoConvocacao();
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
  const { passoAtual, stepItems, handleStepChange, markStepCompleted } = useConvocacaoSteps({
    uuid,
    currentStepIndex: current,
    passoAtualBackend: processoConvocacaoData?.passo,
    hasEdits,
    lockFutureStepsWithoutUuid: true,
    onUnsavedChangesWarning: () =>
      message.warning("Salve as alterações antes de navegar entre as etapas."),
    onNavigate: (path) => navigate(path),
  });

  const next = async () => {
    await handleSubmit(async (formData) => {
      if (isEdit || uuid) {
        if (hasEdits) {
          await patchProcessoFromForm(formData);
        }
        if (uuid) {
          const passoAtualizado = Math.max(passoAtual, 1) as 1 | 2 | 3 | 4;
          await patchPassoProcessoConvocacaoMutation.mutateAsync({ processoUuid: uuid, passo: passoAtualizado });
          markStepCompleted(1);
        }
        navigate(`/processos/convocacao/editar/${uuid}/selecao-cargos`);
        return;
      }
      const result = await handleSub(formData);
      if (result && typeof result === 'object' && 'uuid' in result) {
        await patchPassoProcessoConvocacaoMutation.mutateAsync({ processoUuid: result.uuid, passo: 1 });
        markStepCompleted(1);
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
      <ConvocacaoStepsGlobalStyle />
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title="Nova convocação"
        buttons={
          <Tooltip title={!canAddImportacaoArquivoVagas?"Você não possui permissão para essa ação":"Gerenciamento de vagas"} arrow={true} >

          <Button
            color="primary"
            variant="outlined"
            icon={<UserSwitchOutlined />}
            disabled={!canAddImportacaoArquivoVagas}
            onClick={() => navigate("/processos/gerenciamento-vagas")}
          >
            Gerenciamento de vagas
          </Button>
          </Tooltip>
        }
      >
        <StyledCardWithoutBorder  title={<Text style={{ fontWeight: '400', color: token.colorTextSecondary }}>Processo de convocação de candidatos</Text>} variant="borderless">
          <Steps className="convocacao-steps" current={current} items={stepItems} onChange={handleStepChange} />
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
            canSalvarEAvancar={canAddProcessoConvocacao}
            canVoltar={canViewProcessoConvocacao}            
            onCancel={cancel}
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default DadosDoProcesso;
