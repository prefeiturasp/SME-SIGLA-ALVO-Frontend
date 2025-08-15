import {
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import { Typography, Row, Col, Space, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BaseScreen, { type TitleItem } from "../../BaseScreen";
import { CustomFormItem, SeparatorCol } from "./styles";
import { Content } from "antd/es/layout/layout";
import ConvocacaoTable from "./components/ConvocacaoTable";
import { useNavigate } from "react-router-dom";
import type { IFiltroProcessos } from "../../../services/resources/convocacao/IConvocacao";

import { useQuery } from "@tanstack/react-query";
import useListRequest, { removeUndefinedFields } from "../../../hooks/useListRequest";
import { API } from "../../../services";
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

export default function ProcessosConvocacaoV2() {
  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IFiltroProcessos>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: concursosOptions, isLoading: concursosIsLoading } = useQuery({
    queryKey: ["getConcursosOptions"],
    queryFn: ({ signal }) =>
      API.Convocacao.getConcursosOptions({ signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const {
    data: processosConvocacaoData,
    isLoading: processosConvocacaoIsLoading,
  } = useQuery({
    queryKey: ["getProcessosConvocacao", listRequest],
    queryFn: ({ signal }) =>
      API.Convocacao.getProcessosConvocacao(listRequest, { signal }).response,
    staleTime: 1000 * 60 * 5,
    retry: 0,
  });

  const handleSub = async (data: IFiltroProcessos) => {
    setListRequest((prevState) => ({
      ...prevState,
      page: 1,
      filters: removeUndefinedFields(data),
    }));
  };

  const navigate = useNavigate();

  const defaultValues = {
    concurso_uuid: "",
    data_convocacao_inicio: "",
    data_convocacao_fim: "",
    cargo: "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: defaultValues,
  });
  const handleReset = () => {
    reset(defaultValues);
    handleSub(defaultValues);
  };

  const onSubmit = async (data: any) => {
    // validação de datas
    if (data.data_convocacao_inicio && data.data_convocacao_fim) {
      if (
        new Date(data.data_convocacao_inicio) >
        new Date(data.data_convocacao_fim)
      ) {
        setError("data_convocacao_fim", {
          type: "manual",
          message: "Data final não pode ser menor que data inicial",
        });
        return;
      }
    }

    handleSub(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    labelCol={{ span: 24 }}
                  >
                    <Select
                      {...field}
                      style={{ width: "100%" }}
                      //  placeholder="Selecione o concurso"
                      // loading={concursosIsLoading}
                      // suffixIcon={
                      //   <KeyboardArrowDownRoundedIcon
                      //     sx={{ color: "#032B68" }}
                      //   />
                      // }
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200, // altura máxima em px
                            overflowY: "auto",
                          },
                        },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Selecione o concurso
                      </MenuItem>

                      {concursosIsLoading ? (
                        <MenuItem disabled>
                          <CircularProgress size={20} />
                        </MenuItem>
                      ) : (
                        (concursosOptions?.concursos || []).map((c) => (
                          <MenuItem key={c.value} value={c.value}>
                            {c.label}
                          </MenuItem>
                        ))
                      )}
                    </Select>
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
                        label="Data Inicial"
                        validateStatus={
                          formErrors.data_convocacao_inicio
                            ? "error"
                            : undefined
                        }
                        labelCol={{ span: 24 }}
                      >
                        <TextField
                          {...field}
                          id="data_convocacao_inicio"
                          type="date"
                          fullWidth
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            clearErrors("data_convocacao_fim");
                          }}
                          error={!!formErrors.data_convocacao_inicio}
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
                        label="Data Final"
                        validateStatus={
                          formErrors.data_convocacao_fim ? "error" : undefined
                        }
                        help={formErrors.data_convocacao_fim?.message}
                        labelCol={{ span: 24 }}
                      >
                        <TextField
                          {...field}
                          id="data_convocacao_fim"
                          type="date"
                          fullWidth
                          // InputProps={{
                          //   endAdornment: (
                          //     <InputAdornment position="end">
                          //       <CalendarMonthRoundedIcon
                          //         sx={{ color: "#032B68" }}
                          //       />
                          //     </InputAdornment>
                          //   ),
                          // }}
                          placeholder="Selecione a data final"
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            clearErrors("data_convocacao_fim");
                          }}
                          error={!!formErrors.data_convocacao_fim}
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
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 200, // altura máxima em px
                                overflowY: "auto",
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Selecione o cargo
                          </MenuItem>

                          {concursosIsLoading ? (
                            <MenuItem disabled>
                              <CircularProgress size={20} />
                            </MenuItem>
                          ) : (
                            (concursosOptions?.cargos || []).map((c) => (
                              <MenuItem key={c.value} value={c.value}>
                                {c.label}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </CustomFormItem>
                    )}
                  />
                </Col>

                <Space style={{ margin: "1.5rem 0" }}>
                  <Button onClick={handleReset}>Limpar filtros</Button>
                  <Button
                    data-testid="submit-button"
                    type="primary"
                    onClick={handleSubmit(handleSub)}
                  >
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

            <Row gutter={16} align="middle">
              <Col xs={24} sm={11}></Col>
            </Row>
          </Row>
        </Content>
      </BaseScreen>
    </form>
  );
}
