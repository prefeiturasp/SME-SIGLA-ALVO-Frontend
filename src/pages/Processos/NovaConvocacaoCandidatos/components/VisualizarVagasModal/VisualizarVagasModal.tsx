import { Button, Select, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const { Text } = Typography;

import { Col, Divider, Input, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ModalCustomFormItem as CustomFormItem } from "../../styles";
import { Content } from "antd/es/layout/layout";
import type { IConvocacaoFiltros } from "../../../../../services/resources/convocacao/IConvocacao";
import UnidadeEscolarTable from "../UnidadeEscolarTable";
import { CustomModal2 as CustomModal, TextBlue } from '../../../../../components/EstilosCompartilhados';
import { useState } from "react";
import AdicionarNovaEscolaModal from "../AdicionarNovaEscolaModal";

interface INewAdicionarNovaEscolaProps {
  isOpen: boolean;
  onConfirm: (data: IConvocacaoFiltros) => void;
  onCancel: () => void;
  loading: boolean;
   concurso: string;
  cargo: string;
}

const AdicionarNovaEscola: React.FC<INewAdicionarNovaEscolaProps> = ({
  onCancel,
  onConfirm,
  isOpen,
  loading,
  concurso,
  cargo,
}) => {
 
    const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<IConvocacaoFiltros>({
    defaultValues: {
 
    },
     reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const [openAdicionarNovaEscola, setOpenAdicionarNovaEscola] =
    useState<boolean>(false);

  const handleCloseAdicionarEscola = () => {
    setOpenAdicionarNovaEscola(false);
  };

  const handleOpenAdicionarEscola = () => {
    setOpenAdicionarNovaEscola(true);
  };

  const confirmAdicionarNovaEscola = async (data: IConvocacaoFiltros) => {
    try {
      console.log("e", data);
    } catch (e) {
      console.log(e);
    }
  };

  // Handlers for action buttons
  const handleAtualizarVagas = () => {
    console.log("Atualizar vagas");
  };

  const handleFiltrar = () => {
    console.log("Filtrar");
  };


    const onFinish = async (data: IConvocacaoFiltros) => {
    try {
      await onConfirm(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CustomModal
      title={"Vagas por Unidade Escolar"}
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
        <Row justify="space-between" align="middle" style={{ width: "100%" }}>
          <Col>
            <Button size="large" type="primary" icon={<PlusOutlined />} onClick={handleOpenAdicionarEscola}>
              Incluir Escola
            </Button>
          </Col>

          <Col>
            <Space size={24}>
              <Button
                key="atualizar"
                size="large"
                type="primary"
                onClick={() => onCancel()}
              >
                Cancelar
              </Button>
              <Button
                key="salvar"
                size="large"
                type="primary"
                onClick={handleSubmit(onFinish)}
              >
                Salvar
              </Button>
            </Space>
          </Col>
        </Row>
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
        >
          <Col xs={24} md={24}>
            <Text strong>Concurso: </Text>

            <TextBlue style={{ paddingLeft: "1rem" }}>{concurso}</TextBlue>
          </Col>
          <Col xs={24} md={24}>
            <Text strong>Cargo: </Text>
            <TextBlue style={{ paddingLeft: "1rem" }}>{cargo}</TextBlue>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={6}>
            <Controller
              control={control}
              name="dre"
              render={({ field }) => (
                <CustomFormItem
                  label={"DRE"}
                  // validateStatus={formErrors.dre ? "error" : undefined}
                  // help={formErrors.dre?.message}
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

        <Row>
          <Space size={24} style={{ margin: "0" }}>
            <Button type="primary" ghost size="large" onClick={handleAtualizarVagas}>
              Atualizar vagas
            </Button>
            <Button size="large" type="primary" onClick={handleFiltrar}>
              Filtrar
            </Button>
          </Space>
        </Row>

        <UnidadeEscolarTable
          loading={false}
          originData={[
            {
              uuid: "3b178725-a14a-42d7-97cc-4fb1e3837f5b",
              eol: "480100",
              dre: "Guaianases",
              tipo: "UE",
              unidade: "Escola Guaianases",
              vagas_definitivas: 1,
              vagas_precarias: 1,
            },
            {
              uuid: "e81d73ef-5121-4237-9bcd-69d174354051",
              eol: "480100",
              dre: "Guaianases",
              tipo: "UE",
              unidade: "Escola Campo Limpo",
              vagas_definitivas: 1,
              vagas_precarias: 1,
            },
          ]}
        />
      </Content>
      <Divider
        style={{
          margin: 0,
        }}
      />
      <AdicionarNovaEscolaModal
          isOpen={openAdicionarNovaEscola}
          onCancel={handleCloseAdicionarEscola}
          onConfirm={confirmAdicionarNovaEscola}
          loading={false}
         />
    </CustomModal>
    
  );
};

export default AdicionarNovaEscola;
