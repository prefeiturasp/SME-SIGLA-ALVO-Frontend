import React from "react";
import { TextField, Select } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
   
import { Typography, DatePicker, Row, Col, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import BaseScreen, { type TitleItem } from "../../BaseScreen";
 import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import ConvocacaoTable from "./components/ConvocacaoTable";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { IFiltroProcessos } from "../../../services/resources/convocacao/IConvocacao";
import type { IListRequest } from "../../../types/IListRequest";


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

interface Props {
  concursosOptions?: any;
  processosConvocacaoData?: { results?: any[]; count?: number };
  processosLoading: boolean;
  concursosIsLoading: boolean;
  paginationPage: number;
  handleSub: (data: any) => void;
  handleReset: () => void;
  onAntTableChange: any;
  listRequest: IListRequest<IFiltroProcessos>
 }



 
export default function ProcessosConvocacaoView({
  concursosOptions,
  processosConvocacaoData,
  processosLoading,
  concursosIsLoading,
  paginationPage,
  handleSub,
  handleReset,
  onAntTableChange,
  listRequest
  
 }: Props) {

      const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setError,
    clearErrors,
   } = useForm();


  

  const onSubmit = async (data: any) => {
    // validação de datas
    if (data.data_inicial && data.data_final) {
      if (new Date(data.data_inicial) > new Date(data.data_final)) {
        setError("data_final", {
          type: "manual",
          message: "Data final não pode ser menor que data inicial"
        });
        return;
      }
    }

     handleSub(data);
   };

  return (


       <BaseScreen
          breadcrumbItems={breadcrumbItems}
          title="Consulta de convocação de candidatos"
        >
          <Content>
            {/* <Row align="top" justify="space-between">
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
                        formErrors.concurso_uuid ? "error" : undefinedf
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
            </Row> */}
    
            <Row>
              <Col xs={24}>
                <ConvocacaoTable
                  loading={processosLoading}
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


               <form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={16} align="middle">
        <Col xs={24} sm={11}>
          <Controller
            control={control}
            name="data_inicial"
            render={({ field }) => (
              <CustomFormItem
                label="Data Inicial"
                validateStatus={formErrors.data_inicial ? "error" : undefined}
                labelCol={{ span: 24 }}
              >
                <TextField
                  {...field}
                  id="data_inicial"
                  type="date"
                  fullWidth
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors("data_final");
                  }}
                  error={!!formErrors.data_inicial}
                />
              </CustomFormItem>
            )}
          />
        </Col>

        <Col xs={24} sm={11}>
          <Controller
            control={control}
            name="data_final"
            render={({ field }) => (
              <CustomFormItem
                label="Data Final"
                validateStatus={formErrors.data_final ? "error" : undefined}
                help={formErrors.data_final?.message}
                labelCol={{ span: 24 }}
              >
                <TextField
                  {...field}
                  id="data_final"
                  type="date"
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />
                    )
                  }}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    clearErrors("data_final");
                  }}
                  error={!!formErrors.data_final}
                />
              </CustomFormItem>
            )}
          />
        </Col>
      </Row>

 

      <button type="submit">SUBMIT</button>
    </form>
            </Row>
          </Content>
        </BaseScreen>


   
  );
}
