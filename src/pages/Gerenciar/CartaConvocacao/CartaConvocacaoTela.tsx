import React, { useMemo } from "react";
import {
  Row,
  Col,
  Button,
  Typography,
  DatePicker,
  Select,
} from "antd";
import { Controller } from "react-hook-form";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { CustomFormItem } from "../../../components/FormStyle";
import {
  TabContentContainer,
  StyledSelect,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import { useCartaConvocacao } from "./hooks/useCartaConvocacao";

const { Text, Title } = Typography;

const CartaConvocacaoTela: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    formErrors,
    handleSubmit,
    handleEnviarForm,
    processosConvocacaoOptions,
    processosConvocacaoOptionsIsLoading,
  } = useCartaConvocacao();

  const breadcrumbItems = useMemo(
    () => [
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
          <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/gerenciar")}>
            Gerenciar
          </Text>
        ),
      },
      { title: "E-mail de Convocação" },
    ] as TitleItem[],
    [navigate]
  );

  const onShowHistorico = () => {
    navigate("/gerenciar/carta-convocacao/historico");
  };

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="E-mail de Convocação"
    >
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
                          (processoConvocacao: { value: string; label: string }) => (
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
            <Col xs={24} sm={12}>
              <Controller
                control={control}
                name="data"
                render={({ field }) => (
                  <CustomFormItem
                    label="Data"
                    validateStatus={formErrors.data ? "error" : undefined}
                    help={formErrors.data?.message}
                    labelCol={{ span: 24 }}
                  >
                    <DatePicker
                      style={{ width: "15rem" }}
                      placeholder="Selecione a data"
                      format="DD/MM/YYYY"
                      value={field.value}
                      onChange={(date) => field.onChange(date ?? null)}
                    />
                  </CustomFormItem>
                )}
              />
            </Col>
          </Row>
        </TabContentContainer>
        <ActionButtonsContainer>
          <Button type="primary" ghost size="large" onClick={onShowHistorico}>
            Histórico
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit(handleEnviarForm)}
          >
            Enviar
          </Button>
        </ActionButtonsContainer>
      </>
    </BaseTela>
  );
};

export default CartaConvocacaoTela;
