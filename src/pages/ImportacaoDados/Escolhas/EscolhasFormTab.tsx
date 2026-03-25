import React from "react";
import {
  Row,
  Col,
  Select,
  Button,
  Tooltip,
} from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosEscolhas } from "./hooks/useImportacaoDadosEscolhas";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  StyledSelect,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import { useNavigate } from "react-router-dom";

interface EscolhasProps {
  onShowLayoutPadrao: () => void;
  canViewHistoricoVagas: boolean;
  canImportarVagas: boolean;
}
const EscolhasFormTab: React.FC<EscolhasProps> = ({
  canViewHistoricoEscolhas,
  canImportarEscolhas,
}) => {
  const {
    control,
    formErrors,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
    isSubmitting,
  } = useImportacaoDadosEscolhas();

  const navigate = useNavigate();

  const onShowHistorico = () => {
    navigate("/processos/importacao-dados/historico-escolhas");
  };

  return (
    <>
      <TabContentContainer>

        <Row gutter={40} style={{ marginBottom: "1.8125rem" }}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="processo_convocacao"
              render={({ field }) => (
                <CustomFormItem
                  label="Processo de convocação"
                  validateStatus={
                    formErrors.processo_convocacao ? "error" : undefined
                  }
                  help={formErrors.processo_convocacao?.message}
                  labelCol={{ span: 24 }}
                >
                  <StyledSelect
                    disabled={!canImportarEscolhas}
                    value={field.value}
                    onChange={(value: unknown) =>
                      field.onChange(value as string | undefined)
                    }
                    placeholder="Selecione o processo"
                    loading={processosConvocacaoOptionsIsLoading}
                    allowClear
                    suffixIcon={
                      <ExpandMoreIcon
                        style={{ fontSize: "1.5rem", color: "#032B68" }}
                      />
                    }
                  >
                    {Array.isArray(processosConvocacaoOptions) &&
                      processosConvocacaoOptions.map(
                        (processoConvocacao: any) => (
                          <Select.Option
                            key={processoConvocacao.value}
                            value={processoConvocacao.value}
                          >
                            {processoConvocacao.label}
                          </Select.Option>
                        )
                      )}
                  </StyledSelect>
                </CustomFormItem>
              )}
            />
          </Col>
        </Row>
      </TabContentContainer>
      <ActionButtonsContainer>
        <Tooltip
          title={
            !canViewHistoricoEscolhas
              ? "Você não possui permissão para essa ação"
              : "Histórico"
          }
          arrow={true}
        >
          <Button type="primary" ghost size="large" onClick={onShowHistorico} disabled={!canViewHistoricoEscolhas}>
            Histórico
          </Button>
        </Tooltip>
        <Tooltip
          title={
            !canImportarEscolhas
              ? "Você não possui permissão para essa ação"
              : "Importar"
          }
          arrow={true}
        >
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit(handleEnviarForm)}
            disabled={!canImportarEscolhas || isSubmitting}
            loading={isSubmitting}
          >
            Importar
          </Button>
        </Tooltip>
      </ActionButtonsContainer>
    </>
  );
};

export default EscolhasFormTab;

