import { Typography, Select, DatePicker, Row, Col, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import BaseScreen, { type TitleItem } from "../../BaseScreen";
import { Controller } from "react-hook-form";
import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import ConvocacaoTable from "./components/ConvocacaoTable";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const breadcrumbItems = [
  {
    title: (
      <a href="/">
        <Text strong>Home</Text>
      </a>
    ),
  },
  {
    title: (
      <a href="/processos">
        <Text strong>Processos</Text>
      </a>
    ),
  },
  { title: "Consulta de candidatos" },
] as TitleItem[];

const ConvocacaoCandidatos: React.FC = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    dayjs,
  } = useProcessosConvocacao();

  return (
    <BaseScreen
      breadcrumbItems={breadcrumbItems}
      title="Consulta de convocação de candidatos"
    >
      <Content>
        <Row align="top" justify="space-between">
          <Typography.Title level={4} style={{ margin: "0 0 1rem 0" }}>
            Busca Processos
          </Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/processos/convocacao/nova")}
          >
            Nova convocação
          </Button>
        </Row>

        <Row>
          <Col xs={24} md={12}>
            <Controller
              control={control}
              name="concurso_uuid"
              render={({ field }) => (
                <CustomFormItem
                  label="Concurso"
                  validateStatus={
                    formErrors.concurso_uuid ? "error" : undefined
                  }
                  help={formErrors.concurso_uuid?.message}
                  labelCol={{ span: 24 }}
                >
                  <Select
                    {...field}
                    style={{ width: "100%" }}
                    options={concursosOptions?.concursos || []}
                    placeholder="Selecione o concurso"
                    loading={concursosIsLoading}
                    suffixIcon={
                      <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                    }
                  />
                </CustomFormItem>
              )}
            />

            <Row gutter={16} align="middle">
              <Col xs={24} sm={11}>
                <Controller
                  control={control}
                  name="data_convocacao_inicio"
                  render={({ field }) => (
                    <CustomFormItem
                      label="Data de Convocação"
                      validateStatus={
                        formErrors.data_convocacao_inicio ? "error" : undefined
                      }
                      help={formErrors.data_convocacao_inicio?.message}
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        value={field.value ? dayjs(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(
                            date ? dayjs(date).format("YYYY-MM-DD") : ""
                          )
                        }
                        placeholder="Selecione a data inicial"
                        format="DD/MM/YYYY"
                        suffixIcon={
                          <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />
                        }
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
                  name="data_convocacao_fim"
                  render={({ field }) => (
                    <CustomFormItem
                      label=" "
                      validateStatus={
                        formErrors.data_convocacao_fim ? "error" : undefined
                      }
                      help={formErrors.data_convocacao_fim?.message}
                      labelCol={{ span: 24 }}
                    >
                      <DatePicker
                        style={{ width: "100%" }}
                        

                        value={field.value ? dayjs(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(
                            date ? dayjs(date).format("YYYY-MM-DD") : ""
                          )
                        }
                        placeholder="Selecione a data final"
                        format="DD/MM/YYYY"
                        suffixIcon={
                          <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />
                        }
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>
            </Row>

            <Row>
              <Col xs={24}>
                <Controller
                  control={control}
                  name="cargo"
                  render={({ field }) => (
                    <CustomFormItem
                      label="Cargo"
                      validateStatus={formErrors.cargo ? "error" : undefined}
                      help={formErrors.cargo?.message}
                      labelCol={{ span: 24 }}
                    >
                      <Select
                        {...field}
                        style={{ width: "100%" }}
                        options={
                          concursosOptions ? concursosOptions.cargos : []
                        }
                        placeholder="Selecione o cargo"
                        suffixIcon={
                          <KeyboardArrowDownRoundedIcon
                            sx={{ color: "#032B68" }}
                          />
                        }
                      />
                    </CustomFormItem>
                  )}
                />
              </Col>

              <Space style={{ margin: "1.5rem 0" }}>
                <Button onClick={handleReset}>Limpar filtros</Button>
                <Button type="primary" onClick={handleSubmit(handleSub)}>
                  Pesquisar
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col xs={24}>
            <ConvocacaoTable
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData?.results || []}
              pagination={{
                current: listRequest.pagination.page,
                pageSize: 10,
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

export default ConvocacaoCandidatos;
