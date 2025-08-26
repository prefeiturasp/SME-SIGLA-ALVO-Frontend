import { Button, Select, Space, Typography } from "antd";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;

import { Col, Divider, Input, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { CustomFormItem } from "../../styles";
import { Content } from "antd/es/layout/layout";
import type { IConvocacaoFiltros } from "../../../../../services/resources/convocacao/IConvocacao";


import { useTheme } from "styled-components";
import {
  CustomModal,
  TextBlue,
} from "../../../../../components/estilosCompartilhados/styles";
import AdicionarEscolaTable from "../AdicionarEscolaTable/AdicionarEscolaTable";

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

  const theme = useTheme();

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
        <Space  size={24}>
          <Button
            key="voltar"
            size="large"
            onClick={() => onCancel()}
          >
            Voltar
          </Button>
          <Button
            key="adicionar"
            type="primary"
            size="large"
            onClick={handleSubmit(onFinish)}
          >
            Adicionar escola
          </Button>
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
                <CustomFormItem
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
                </CustomFormItem>
              )}
            />
          </Col>
          <Col xs={24} md={6}>
            <Controller
              control={control}
              name="escola"
              render={({ field }) => (
                <CustomFormItem
                  label="Escola"
                  validateStatus={formErrors.escola ? "error" : undefined}
                  help={formErrors.escola?.message}
                  labelCol={{ span: 24 }}
                >
                  <Input {...field} placeholder="" />
                </CustomFormItem>
              )}
            />
          </Col>
        </Row>

        <Button size="large" type="primary">
          Filtrar
        </Button>

        <AdicionarEscolaTable
          loading={false}
     
        />
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
