import { Controller } from "react-hook-form";
import { Typography, Select, Button, Row, Col, Space } from "antd";
import { TextField } from "@mui/material";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { CustomFormItem, SeparatorCol } from "./styles";
import ConvocacaoTable from "./components/ConvocacaoTable";
import dayjs from "dayjs";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import type { UseFormReturn } from "react-hook-form";
import type { IBackendWithSubOptions } from "../../types/IListRequest";
import { Form } from "react-router-dom";

interface Props {
  form: UseFormReturn<IFiltroProcessos>;
  concursosOptions?: IBackendWithSubOptions;
  processosData?: { results?: any[]; count?: number };
  processosLoading: boolean;
  paginationPage: number;
  onSubmit: (data: IFiltroProcessos) => void;
  onReset: () => void;
  onAntTableChange:any;
}

export default function ProcessosConvocacaoView({
  form,
  concursosOptions,
  processosData,
  processosLoading,
  paginationPage,
  onSubmit,
  onReset,
  onAntTableChange,
}: Props) {
  const { control, handleSubmit, formState: { errors } } = form;
  const { Text } = Typography;

  return (
    <>
    <Form >
      <Row gutter={16} align="middle">
        <Col xs={24}>
          <Controller
            control={control}
            name="concurso"
            render={({ field }) => (
              <CustomFormItem
                label="Concurso"
                validateStatus={errors.concurso ? "error" : undefined}
                help={errors.concurso?.message}
                labelCol={{ span: 24 }}
              >
                <Select {...field} options={concursosOptions?.concursos} />
              </CustomFormItem>
            )}
          />
        </Col>

        <Col xs={24} sm={11}>
          <Controller
            control={control}
            name="data_inicial"
            render={({ field }) => (
              <CustomFormItem
                label="Data de Convocação"
                validateStatus={errors.data_inicial ? "error" : undefined}
                help={errors.data_inicial?.message}
                labelCol={{ span: 24 }}
              >
                <TextField
                  {...field}
                  type="date"
                  fullWidth
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.data_inicial}
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
            render={({ field }) => (
              <CustomFormItem
                label=" "
                validateStatus={errors.data_final ? "error" : undefined}
                help={errors.data_final?.message}
                labelCol={{ span: 24 }}
              >
                <TextField
                  {...field}
                  type="date"
                  fullWidth
                  InputProps={{
                    endAdornment: <CalendarMonthRoundedIcon sx={{ color: "#032B68" }} />,
                  }}
                  onChange={(e) => field.onChange(e.target.value)}
                  error={!!errors.data_final}
                />
              </CustomFormItem>
            )}
          />
        </Col>

        <Col xs={24}>
          <Controller
            control={control}
            name="cargo"
            render={({ field }) => (
              <CustomFormItem
                label="Cargo"
                validateStatus={errors.cargo ? "error" : undefined}
                help={errors.cargo?.message}
                labelCol={{ span: 24 }}
              >
                <Select {...field} options={concursosOptions?.cargos} />
              </CustomFormItem>
            )}
          />
        </Col>

        <Space style={{ margin: "1.5rem 0" }}>
          <Button onClick={onReset}>Limpar filtros</Button>
          <Button   type="primary" onClick={handleSubmit(onSubmit)} data-testid="submit">
            Pesquisar
          </Button>
        </Space>
      </Row>

      <ConvocacaoTable
        loading={processosLoading}
        data={processosData?.results || []}
        pagination={{
          current: paginationPage,
          defaultPageSize: 10,
          total: processosData?.count || 0,
        }}
        onChange={onAntTableChange}
      />
      </Form>
    </>
  );
}
