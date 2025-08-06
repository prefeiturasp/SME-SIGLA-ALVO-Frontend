import { Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import BaseScreen, { type TitleItem } from "../BaseScreen";
import useConvocacaoSchema from "./useConvocacaoSchema";
import { Divider, Select, DatePicker, Row, Col, Space, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { CustomFormItem } from "./styles";
import { Content } from "antd/es/layout/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IFiltroProcessos, IProcessoConvocacao } from "../../services/resources/convocacao/IConvocacao";
import dayjs from "dayjs";
import ConvocacaoTable from "./components/ConvocacaoTable";
import useListRequest from "../../hooks/useListRequest";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../services";

const mockData: IProcessoConvocacao[] = Array.from({ length: 288 }).map(
  (_, index) => {
    const concursos = [
      "Concurso A",
      "Concurso B",
      "Concurso C",
      "Concurso D",
      "Concurso E",
    ];
    const status = [
      "Em andamento",
      "Finalizado",

    ];
    const randomConcurso = concursos[index % concursos.length];
    const randomStatus = status[index % status.length];

    return {
      nome: `${randomConcurso} ${index + 1}`,
      status: randomStatus,
      data_convocacao: `2025-06-${String((index % 28) + 1).padStart(2, "0")}`,      
    };
  }
);

const breadcrumbItems = [
  {
    title: <a href="/">Home</a>,
  },
  {
    title: <a href="/processos">Processos</a>,
  },
  {
    title: <a href="/administracao">Consulta de candidatos</a>,
  },
] as TitleItem[];


const Administracao: React.FC = () => {

  const defaultValues = {
      concurso: undefined,
      cargo: undefined,
      data_convocacao: "",
      data_inicial: "",
      data_final: "",
    }
  const { listRequest, setListRequest, onAntTableChange } = useListRequest<IFiltroProcessos>({
    pagination: { pageNumber: 1, pageSize: 10 },
  });

  console.log("listRequest", listRequest);

  const { data, isLoading } = useQuery({
    queryKey: ["permissions", "products", listRequest],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry:0
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors: formErrors },
  } = useForm<IFiltroProcessos>({
    defaultValues: defaultValues,
    resolver: yupResolver(useConvocacaoSchema()),
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const handleSub = async (data: IFiltroProcessos) => {
    try {
        console.log("integração com o back", data);
        
        setListRequest((prevState) => ({
        ...prevState,
        filters: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Consulta de convocação de candidatos"
    >
      <Content >
        <Row  align="middle" justify="space-between">
          <Typography.Title level={4} style={{ margin: 0 }}>
            {"Busca Processos"}
          </Typography.Title>

          <Button type="primary" icon={<PlusOutlined />}>
            Nova convocação
          </Button>
        </Row>

        <Row >
          <Col xs={24} md={12}>
            <Controller
              control={control}
              name="concurso"
              render={({ field: { onChange, value } }) => (
                <CustomFormItem
                  label="Concurso"
                  validateStatus={formErrors.concurso ? "error" : undefined}
                  help={formErrors.concurso?.message}
                  labelCol={{ span: 24 }}
                >
                  <Select
                    style={{ width: "100%" }}
                    value={value}
                    onChange={onChange}
                    options={[
                      { value: "Concurso A", label: "Concurso A" },
                      { value: "Concurso B", label: "Concurso B" },
                      { value: "Concurso C", label: "Concurso C" },
                    ]}
                    placeholder="Selecione o concurso"
                  />
                </CustomFormItem>
              )}
            />

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Controller
                  control={control}
                  name="data_inicial"
                  render={({ field: { onChange, value } }) => (
                    <CustomFormItem
                      label="Data Inicial"
                      validateStatus={
                        formErrors.data_inicial ? "error" : undefined
                      }
                      help={formErrors.data_inicial?.message}
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        value={value ? dayjs(value) : undefined}
                        onChange={(date) =>
                          onChange(date ? date.toISOString() : "")
                        }
                        placeholder="Selecione a data inicial"
                        format="DD/MM/YYYY"
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>

              <Col xs={24} sm={12}>
                <Controller
                  control={control}
                  name="data_final"
                  render={({ field: { onChange, value } }) => (
                    <CustomFormItem
                      label="Data Final"
                      validateStatus={
                        formErrors.data_final ? "error" : undefined
                      }
                      help={formErrors.data_final?.message}
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        value={value ? dayjs(value) : undefined}
                        onChange={(date) =>
                          onChange(date ? date.toISOString() : "")
                        }
                        placeholder="Selecione a data final"
                        format="DD/MM/YYYY"
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>
            </Row>

            <Row >
              <Col xs={24} sm={24}>
                <Controller
                  control={control}
                  name="cargo"
                  render={({ field: { onChange, value } }) => (
                    <CustomFormItem
                      label="Cargo"
                      validateStatus={formErrors.cargo ? "error" : undefined}
                      help={formErrors.cargo?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        style={{ width: "100%" }}
                        value={value}
                        onChange={onChange}
                        options={[
                          { value: "Analista", label: "Analista" },
                          { value: "Técnico", label: "Técnico" },
                          { value: "Assistente", label: "Assistente" },
                        ]}
                        placeholder="Selecione o cargo"
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>

              <Space>
                <Button onClick={handleReset}>Limpar filtros</Button>
                <Button type="primary" onClick={handleSubmit(handleSub)}>
                  Pesquisar
                </Button>
              </Space>
            </Row>
          </Col>

          <Col xs={24} md={24}>
            <ConvocacaoTable
              loading={isLoading}
              data={data||[]}
              pagination={{
                current: listRequest.pagination.pageNumber,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: data?.length,
                showTotal: () =>
                  `Mostrando ${listRequest.pagination.pageNumber} - 10 registro(s) do total de ${data?.length}`,
              }}
              onChange={onAntTableChange}
            />
          </Col> 
        </Row>
      </Content>
      <Divider style={{ margin: 0 }} />
    </BaseScreen>
  );
};

export default Administracao;
