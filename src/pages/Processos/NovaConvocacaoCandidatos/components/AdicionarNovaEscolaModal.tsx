import { Col, Divider, Input, Row, Select, Space, Typography } from "antd";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { Controller, useForm } from "react-hook-form";
import { useTheme } from "styled-components";

import { AppButton, AppFormItem, CustomModal } from "@/components/ui";
import { Content } from "antd/es/layout/layout";
import type { IConvocacaoFiltros } from "../../../../services/resources/convocacao/IConvocacao";

import AdicionarEscolaTable from "./AdicionarEscolaTable";

interface INewAdicionarNovaEscolaModalProps {
  isOpen: boolean;
  onConfirm: (data: IConvocacaoFiltros) => void;
  onCancel: () => void;
  loading: boolean;
}

const AdicionarNovaEscolaModal: React.FC<INewAdicionarNovaEscolaModalProps> = ({
  onCancel,
  onConfirm,
  isOpen,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<IConvocacaoFiltros>({
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const onFinish = async (data: IConvocacaoFiltros) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.log(error);
    }
  };

  useTheme();

  return (
    <CustomModal
      title={"Nova escola"}
      onOk={handleSubmit(onFinish)}
      onCancel={onCancel}
      closable={false}
      open={isOpen}
      centered
      afterClose={() => {
        reset();
      }}
      width="85rem"
      confirmLoading={loading}
      focusTriggerAfterClose={false}
      maskClosable={false}
      okText={"Salvar"}
      footer={
        <Space size={24}>
          <AppButton
            variant="secondary"
            size="large"
            onClick={() => onCancel()}
          >
            Voltar
          </AppButton>
          <AppButton
            variant="primary"
            size="large"
            onClick={handleSubmit(onFinish)}
          >
            Adicionar escola
          </AppButton>
        </Space>
      }
    >
      <Content
        style={{
          padding: "0.5rem",
        }}
      >
        <Row
          gutter={16}
          style={{
            padding: "0.5rem 0 1.5rem 0",
          }}
        ></Row>

        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Controller
              control={control}
              name="dre"
              render={({ field }) => (
                <AppFormItem
                  colon={false}
                  label={"DRE"}
                  validateStatus={formErrors.dre ? "error" : undefined}
                  help={formErrors.dre?.message}
                  labelCol={{ span: 24 }}
                >
                  <Select
                    {...field}
                    options={[]}
                    placeholder="(Todas)"
                    loading={false}
                    suffixIcon={
                      <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                    }
                  />
                </AppFormItem>
              )}
            />
          </Col>
          <Col xs={24} md={6}>
            <Controller
              control={control}
              name="escola"
              render={({ field }) => (
                <AppFormItem
                  colon={false}
                  label="Escola"
                  validateStatus={formErrors.escola ? "error" : undefined}
                  help={formErrors.escola?.message}
                  labelCol={{ span: 24 }}
                >
                  <Input {...field} placeholder="" />
                </AppFormItem>
              )}
            />
          </Col>
        </Row>

        <AppButton variant="primary" size="large">
          Filtrar
        </AppButton>

        <AdicionarEscolaTable loading={false} />
      </Content>
      <Divider
        style={{
          margin: 0,
        }}
      />
    </CustomModal>
  );
};

export default AdicionarNovaEscolaModal;
