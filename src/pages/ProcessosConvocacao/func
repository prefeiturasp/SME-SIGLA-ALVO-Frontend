import React from "react";
import { TextField, Select } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import { Row, Col } from "antd";
import { CustomFormItem } from "./styles";

interface Props {
  concursosOptions?: any;
  processosData?: { results?: any[]; count?: number };
  processosLoading: boolean;
  paginationPage: number;
  onSubmit2: (data: any) => void;
  onReset: () => void;
  onAntTableChange: any;
  login: any;
}

export default function App({
  concursosOptions,
  processosData,
  processosLoading,
  paginationPage,
  onSubmit2,
  onReset,
  onAntTableChange,
  login
}: Props) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors
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

    await login(data.email, data.password);
    onSubmit2(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row gutter={16} align="middle">
        <Col xs={24} sm={11}>
          <Controller
            control={control}
            name="data_inicial"
            render={({ field }) => (
              <CustomFormItem
                label="Data Inicial"
                validateStatus={errors.data_inicial ? "error" : undefined}
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
                  error={!!errors.data_inicial}
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
                validateStatus={errors.data_final ? "error" : undefined}
                help={errors.data_final?.message}
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
                  error={!!errors.data_final}
                />
              </CustomFormItem>
            )}
          />
        </Col>
      </Row>

      <label htmlFor="email">email</label>
      <input
        id="email"
        {...register("email", {
          required: "required",
          pattern: { value: /\S+@\S+\.\S+/, message: "Formato de email inválido" }
        })}
        type="email"
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}

      <label htmlFor="password">password</label>
      <input
        id="password"
        {...register("password", {
          required: "required",
          minLength: { value: 5, message: "min length is 5" }
        })}
        type="password"
      />
      {errors.password && <span role="alert">{errors.password.message}</span>}

      <button type="submit">SUBMIT</button>
    </form>
  );
}
