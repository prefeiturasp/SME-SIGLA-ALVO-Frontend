import React from "react";
import { Button, Steps, theme, Tooltip, Typography } from "antd";
import BaseTela, { type TitleItem } from "../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import { UserSwitchOutlined } from "@ant-design/icons";
import { StepActions } from "./components/StepActions";
import { items, steps } from "./components/StepsNames";
import { StyledCardWithoutBorder } from "../../components/EstilosCompartilhados";
import FormPrincipal from "../Processos/NovaConvocacaoCandidatos/components/FormPrincipal";
import { useNovaConvocacaoCandidatos } from "../Processos/NovaConvocacaoCandidatos/hooks/useNovaConvocacaoCandidatos";
import { useGetPermissions } from "../../routes/PermissionContextGuard";

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
    isViewMode,
    formErrors,  
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
      const result = await handleSub(formData);
      if (result && typeof result === 'object' && 'uuid' in result) {
        navigate(`/processos/convocacao/editar/${result.uuid}/selecao-cargos`, {state:{editData: result, isViewMode: false}});         
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
          <Tooltip title={!canAddImportacaoArquivoVagas?"Você não possui permissão para essa ação":"Gerenciamento de vagas"} arrow={true} >

          <Button
            style={{ fontWeight: "400" }}
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
            onCancel={() => navigate(`/processos/convocacao`)}
            canSalvarEAvancar={canAddProcessoConvocacao}
            canVoltar={canViewProcessoConvocacao}            
          />
        </StyledCardWithoutBorder>
      </BaseTela>
    </>
  );
};

export default DadosDoProcesso;
