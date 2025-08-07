import { Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import BaseScreen, { type TitleItem } from "../BaseScreen";
import useConvocacaoSchema from "./useConvocacaoSchema";
import { Divider, Select, DatePicker, Row, Col, Space, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import dayjs from "dayjs";
import ConvocacaoTable from "./components/ConvocacaoTable";
import useListRequest from "../../hooks/useListRequest";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../services";
const { Text } = Typography;

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
  };
  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { pageNumber: 1, pageSize: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 0,
  });

  const {
    data: processosConvocacaoData,
    isLoading: processosConvocacaoIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 0,
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
      <Content>
        <Row align="middle" justify="space-between">
          <Typography.Title level={4} style={{ margin: 0 }}>
            {"Busca Processos"}
          </Typography.Title>

          <Button type="primary" icon={<PlusOutlined />}>
            Nova convocação
          </Button>
        </Row>

        <Row>
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
                    options={concursosOptions || []}
                    placeholder="Selecione o concurso"
                    loading={concursosIsLoading}
                  />
                </CustomFormItem>
              )}
            />

            <Row gutter={16} align="middle">
              <Col xs={24} sm={11}>
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

              <SeparatorCol
                xs={24}
                sm={2}
              >
                <Text strong>até</Text>
              </SeparatorCol>

              <Col xs={24} sm={11}>
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

            <Row>
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
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData || []}
              pagination={{
                current: listRequest.pagination.pageNumber,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: processosConvocacaoData?.length,
                showTotal: () =>
                  `Mostrando ${listRequest.pagination.pageNumber} - 10 registro(s) do total de ${processosConvocacaoData?.length}`,
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
