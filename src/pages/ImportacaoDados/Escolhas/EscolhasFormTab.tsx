import React from "react";
import {
  Row,
  Col,
  Select,
} from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useImportacaoDadosEscolhas } from "./hooks/useImportacaoDadosEscolhas";
import { AppFormItem, AppButton, TabContentContainer, StyledSelect, ActionButtonsContainer, formTabStyles, selectSuffixIcon } from '@/components/ui';

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

        <Row gutter={40} style={formTabStyles.fieldsRow}>
          <Col xs={24} sm={12}>
            <Controller
              control={control}
              name="processo_convocacao"
              render={({ field }) => (
                <AppFormItem
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
                        suffixIcon={<ExpandMoreIcon style={selectSuffixIcon} />}
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
                </AppFormItem>
              )}
            />
          </Col>
        </Row>
      </TabContentContainer>
      <ActionButtonsContainer>
        <AppButton
          variant="secondary"
          size="large"
          onClick={onShowHistorico}
          disabled={!canViewHistoricoEscolhas}
        >
          Histórico
        </AppButton>
        <AppButton
          variant="primary"
          size="large"
          onClick={handleSubmit(handleEnviarForm)}
          disabled={!canImportarEscolhas || isSubmitting}
          loading={isSubmitting}
        >
          Importar
        </AppButton>
      </ActionButtonsContainer>
    </>
  );
};

export default EscolhasFormTab;

