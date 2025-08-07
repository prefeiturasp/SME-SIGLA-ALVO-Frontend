import { Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import BaseScreen, { type TitleItem } from "../BaseScreen";
import useConvocacaoSchema from "./useConvocacaoSchema";
import {  Select, DatePicker, Row, Col, Space, Button } from "antd";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import dayjs from "dayjs";
import ConvocacaoTable from "./components/ConvocacaoTable";
import useListRequest from "../../hooks/useListRequest";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../services";
 
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const { Text } = Typography;

const breadcrumbItems = [
  {
    title: <a href="/"><Text strong>Home</Text></a>,
  },
  {
    title: <a href="/processos"><Text strong>Processos</Text></a>,
  },
  {
    title: 'Consulta de candidatos',
  },
] as TitleItem[];

const Administracao: React.FC = () => {
  const defaultValues = {
    concurso: undefined,
    cargo: undefined,   
    data_inicial: "",
    data_final: "",
  } as IFiltroProcessos;


   const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors: formErrors },
  } = useForm<IFiltroProcessos>({
    defaultValues: defaultValues,
    resolver: yupResolver(useConvocacaoSchema()) as Resolver<IFiltroProcessos>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosData"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosData({ signal }).response,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: 0,
  });

   

  const selectedConcurso = concursosOptions?.find(
    (c) => c.value === watch("concurso")
  );


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
    handleSub(defaultValues);
  };

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Consulta de convocação de candidatos"
    >
      <Content>
        <Row align={'top'} justify="space-between">
          <Typography.Title level={4} style={{ margin: '0 0 1rem 0' }} >
            {"Busca Processos"}
          </Typography.Title>

          <Button type="primary" icon={<PlusOutlined />}>
            Nova convocação
          </Button>
        </Row>

        <Row > 
          <Col xs={24} md={12} >
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
                    suffixIcon={<KeyboardArrowDownRoundedIcon  sx={{ color: "#032B68" }}/>}
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
                      label="Data de Convocação"
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
                        suffixIcon={<CalendarMonthRoundedIcon   sx={{ color: "#032B68" }} />}
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>

              <SeparatorCol xs={24} sm={2}>
                <Text strong>até</Text>
              </SeparatorCol>

              <Col xs={24} sm={11}>
                <Controller
                  control={control}
                  name="data_final"
                  render={({ field: { onChange, value } }) => (
                    <CustomFormItem
                      label=" "
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
                        suffixIcon={<CalendarMonthRoundedIcon   sx={{ color: "#032B68" }} />}
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
                        options={
                          selectedConcurso
                            ? selectedConcurso.cargos
                            : []
                        }
                        placeholder="Selecione o cargo"
                        suffixIcon={<KeyboardArrowDownRoundedIcon  sx={{ color: "#032B68" }}/>}
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>

              <Space style={{ margin: '1.5rem 0 1.5rem 0' }}>
                  
                
                <Button  color="primary" variant="outlined" onClick={handleReset}>Limpar filtros</Button>
                <Button type="primary" onClick={handleSubmit(handleSub)}>
                  Pesquisar
                </Button>
              </Space>
            </Row>
          </Col>
          </Row>

         <Row  > 
          <Col xs={24} md={24}>
            <ConvocacaoTable
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData?.results || []}
              pagination={{
                current: listRequest.pagination.page,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: processosConvocacaoData?.count,
                showTotal: () =>
                  `Mostrando ${listRequest.pagination.page} - 10 registro(s) do total de ${processosConvocacaoData?.count}`,
              }}
              onChange={onAntTableChange}
            />
          </Col>
        </Row>

      </Content>
     </BaseScreen>
  );
};

export default Administracao;
