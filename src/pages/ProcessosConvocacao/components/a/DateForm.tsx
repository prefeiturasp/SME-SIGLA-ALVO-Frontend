import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { Controller } from "react-hook-form";
import { Typography, Select,  Row, Col, Space } from "antd";
 import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { CustomFormItem, SeparatorCol } from "../../styles";
import dayjs from "dayjs";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import type { UseFormReturn } from "react-hook-form";
import type { IBackendWithSubOptions } from "../../../../types/IListRequest";
import { Form } from "react-router-dom";
interface DateFormProps {
  onSubmit: (data: { startDate: string; endDate: string }) => void;
}


interface Props {
  form: UseFormReturn<IFiltroProcessos>;
  concursosOptions?: IBackendWithSubOptions;
  processosData?: { results?: any[]; count?: number };
  processosLoading: boolean;
  paginationPage: number;
  onSubmit2?: (data: IFiltroProcessos) => void;
    onSubmit: (data: { startDate: string; endDate: string }) => void;

  onReset: () => void;
  onAntTableChange:any;
}

export default function DateForm({
  form,
  concursosOptions,
  processosData,
  processosLoading,
  paginationPage,
  onSubmit,
  onReset,
  onAntTableChange,
}: Props)   {

    const { control, handleSubmit, formState: { errors } } = form;
  const { Text } = Typography;

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit2a = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      startDate,
      endDate
    });
  };
   const handleSubmit2 = async data => {
    await onSubmit(data);
   };

  return (
        

    <Box component="form" onSubmit={handleSubmit(handleSubmit2)}>
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
 
        </Space>
      </Row>

 

      <TextField
        label="Data Inicial"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        data-testid="start-date"
      />
      <TextField
        label="Data Final"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        data-testid="end-date"
      />
      <Button type="submit" variant="contained">
        Pesquisar
      </Button>
    </Box>
  );
}
