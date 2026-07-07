import { Select, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { AppButton, CustomModal2 as CustomModal, TextBlue } from '@/components/ui';
const { Text } = Typography;

import { Col, Divider, Input, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ModalCustomFormItem as CustomFormItem } from "@/components/ui";
import { Content } from "antd/es/layout/layout";
import type { IConvocacaoFiltros, IOptions, IVaga } from "../../../../../services/resources/convocacao/IConvocacao";
import UnidadeEscolarTable from "../UnidadeEscolarTable";
import {  useEffect, useState } from "react";
import AdicionarNovaEscolaModal from "../AdicionarNovaEscolaModal";
 
interface INewAdicionarNovaEscolaProps {
  isOpen: boolean;
  onConfirm: (data: IVaga[]) => void;
  onCancel: () => void;
  loading: boolean;
   concurso: string;
  cargo: string;
  vagasNasEscolasPorCargo: IVaga[];
  dres: IOptions[];
}

const AdicionarNovaEscola: React.FC<INewAdicionarNovaEscolaProps> = ({
  onCancel,
  onConfirm,
  isOpen,
  loading,
  concurso,
  cargo,
  vagasNasEscolasPorCargo,
  dres,
}) => {
 
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
    getValues,
  } = useForm<IConvocacaoFiltros>({
    defaultValues: {
 
    },
     reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const [openAdicionarNovaEscola, setOpenAdicionarNovaEscola] =
    useState<boolean>(false);
  const [editableData, setEditableData] = useState<IVaga[]>(vagasNasEscolasPorCargo || []);
  const [filteredData, setFilteredData] = useState<IVaga[]>(vagasNasEscolasPorCargo || []);

  //TODO remove this after testing
  useEffect(() => {
    setEditableData(vagasNasEscolasPorCargo || []);
    setFilteredData(vagasNasEscolasPorCargo || []);
  }, [vagasNasEscolasPorCargo]);

  useEffect(() => {
    handleFiltrar();    
  }, [editableData]);


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

  
  const handleFiltrar = () => {
    const { dre, escola } = getValues();
    const selectedDre = dres.find((opt) => opt.value === dre);
    const selectedDreLabel = selectedDre?.label || "";
    const escolaQuery = (escola || "").toString().trim().toLowerCase();
  
    const next = editableData.filter((item) => {
      const matchDre = dre
        ? item.escola?.dre?.uuid === dre || item.escola?.dre?.nome === selectedDreLabel
        : true;
      const matchEscola = escolaQuery ? (item.escola.nome_oficial || "").toLowerCase().includes(escolaQuery) : true;
      return matchDre && matchEscola;
    });
  
    setFilteredData(next);
  };
  

  const handleLimparFiltros = () => {
    reset({ dre: "", escola: "" } as any);
    setFilteredData([...editableData]); // aplica "limpar" sem perder edições
  };
  
  const handleResetar = () => {
    setEditableData([...(vagasNasEscolasPorCargo || [])]);
    setFilteredData([...(vagasNasEscolasPorCargo || [])]);
    reset({ dre: "", escola: "" } as any);
  };
  

    const onFinish = async () => {
    try {
      await onConfirm(editableData);
    } catch (error) {
      console.log(error);
    }
  };


  const handleOnCancel = () => {
    handleResetar();
    onCancel();
  };
  return (
    <CustomModal
      title={"Vagas por Unidade Escolar"}
      onOk={handleSubmit(onFinish)}
      onCancel={handleOnCancel}
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
            <AppButton variant="primary" size="large" icon={<PlusOutlined />} onClick={handleOpenAdicionarEscola}>
              Incluir Escola
            </AppButton>
          </Col>

          <Col>
            <Space size={24}>
              <AppButton
                variant="secondary"
                size="large"
                onClick={() => handleOnCancel()}
              >
                Cancelar
              </AppButton>
              <AppButton
                variant="primary"
                size="large"
                onClick={handleSubmit(onFinish)}
              >
                Salvar
              </AppButton>
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
                    options={dres}
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
            <AppButton variant="secondary" size="large" onClick={handleResetar}>
              Resetar
            </AppButton>
            <AppButton variant="secondary" size="large" onClick={handleLimparFiltros}>
              Limpar Filtros
            </AppButton>
            <AppButton variant="primary" size="large" onClick={handleFiltrar}>
              Filtrar
            </AppButton>
          </Space>
        </Row>

        <UnidadeEscolarTable
          loading={false}
          filteredData={filteredData}
          setEditableData={setEditableData}
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
