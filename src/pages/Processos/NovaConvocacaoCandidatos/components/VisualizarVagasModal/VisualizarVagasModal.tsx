import { Button, Select, Space, Typography, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const { Text } = Typography;

import { Col, Divider, Input, Row } from "antd";
import { Controller, useForm } from "react-hook-form";
import { ModalCustomFormItem as CustomFormItem } from "../../styles";
import { Content } from "antd/es/layout/layout";
import type { IConvocacaoFiltros, IOptions, IUnidadeEscolar } from "../../../../../services/resources/convocacao/IConvocacao";
import UnidadeEscolarTable from "../UnidadeEscolarTable";
import { CustomModal2 as CustomModal, TextBlue } from '../../../../../components/EstilosCompartilhados';
import {  useEffect, useState } from "react";
import AdicionarNovaEscolaModal from "../AdicionarNovaEscolaModal";
 
interface INewAdicionarNovaEscolaProps {
  isOpen: boolean;
  onConfirm: (data: IConvocacaoFiltros) => void;
  onCancel: () => void;
  loading: boolean;
   concurso: string;
  cargo: string;
  dadosVagasNasEscolasPorCargo: IUnidadeEscolar[];
  dres: IOptions[];
}

const AdicionarNovaEscola: React.FC<INewAdicionarNovaEscolaProps> = ({
  onCancel,
  onConfirm,
  isOpen,
  loading,
  concurso,
  cargo,
  dadosVagasNasEscolasPorCargo,
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
  const [editableData, setEditableData] = useState<IUnidadeEscolar[]>(dadosVagasNasEscolasPorCargo || []);
  const [filteredData, setFilteredData] = useState<IUnidadeEscolar[]>(dadosVagasNasEscolasPorCargo || []);

  

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
    const selectedDreLabel = dres.find((opt) => opt.value === dre)?.label || "";
    const escolaQuery = (escola || "").toString().trim().toLowerCase();
  
    const next = editableData.filter((item) => {
      const matchDre = dre ? item.dre === selectedDreLabel || item.dre === dre : true;
      const matchEscola = escolaQuery ? (item.nome_oficial || "").toLowerCase().includes(escolaQuery) : true;
      return matchDre && matchEscola;
    });
  
    setFilteredData(next);
  };
  

  const handleLimparFiltros = () => {
    reset({ dre: "", escola: "" } as any);
    setFilteredData([...editableData]); // aplica "limpar" sem perder edições
  };
  
  const handleResetar = () => {
    setEditableData([...(dadosVagasNasEscolasPorCargo || [])]);
    setFilteredData([...(dadosVagasNasEscolasPorCargo || [])]);
    reset({ dre: "", escola: "" } as any);
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
            <Tooltip title="Voltar as escolas ao estado inicial">
              <Button type="primary" ghost size="large" onClick={handleResetar}>
                Resetar
              </Button>
            </Tooltip>
            <Button type="primary" ghost size="large" onClick={handleLimparFiltros}>
              Limpar Filtros
            </Button>
            <Button size="large" type="primary" onClick={handleFiltrar}>
              Filtrar
            </Button>
            
          </Space>
        </Row>

        <UnidadeEscolarTable
          loading={false}
          originData={filteredData}
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
