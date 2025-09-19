import React from "react";
import { Row, Col, Select, Input, DatePicker, Typography } from "antd";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";
import { CustomFormItem } from "../../../components/FormStyle";

const { Text } = Typography;

export type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};
export type FormFields = {
  concurso: string;
  tipo_processo: string;
  descricao: string;
  cargo: string;
  data_convocacao: string;
  data_corte_vagas: string;
};

interface FormPrincipalProps {
  control: Control<FormFields>;
  concursosData: ConcursoOption[];
  concursosOptionsIsLoading: boolean;
  isCargoLiberado: string | undefined;
  buscarCargosDoConcurso: (value: string) => void;
}

const FormPrincipal: React.FC<FormPrincipalProps> = ({
  control,
  concursosData,
  concursosOptionsIsLoading,
  isCargoLiberado,
  buscarCargosDoConcurso,
}) => {
  return (
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="concurso"
          render={({ field }) => (
            <CustomFormItem label="Concurso" labelCol={{ span: 24 }}>
              <Select
                {...field}
                data-testid="concurso-select"
                placeholder="Selecione o concurso"
                style={{ width: "36.875rem", height: "2.5rem" }}
                options={concursosData || []}
<<<<<<< HEAD:src/pages/NovaConvocacaoCandidatos/components/FormPrincipal.tsx
                loading={concursosOptionsIsLoading}
=======
                loading={concursosIsLoading}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
>>>>>>> feature/131553-criacao-funcionalidade-agenda:src/pages/Processos/NovaConvocacaoCandidatos/components/FormPrincipal.tsx
                onChange={(value) => {
                  field.onChange(value as string);
                  buscarCargosDoConcurso(value as string);
                }}
              />
              {!isCargoLiberado && (
                <Text
                  type="secondary"
                  style={{ fontSize: 12, color: "gray", marginTop: 2, display: "block" }}
                >
                  * Selecione o concurso para liberar a opção de Cargo.
                </Text>
              )}
            </CustomFormItem>
          )}
        />
        <Controller
          control={control}
          name="tipo_processo"
          render={({ field }) => (
            <CustomFormItem label="Tipo de Escolha" labelCol={{ span: 24 }}>
              <Select
                {...field}
                placeholder="Selecione o tipo de escolha"
                style={{ width: "36.875rem", height: "2.5rem" }}
                options={[
                  { value: "Nova Autorização", label: "Nova Autorização" },
                  { value: "Reposição", label: "Reposição" },
                  { value: "Reconvocação", label: "Reconvocação" },
                ]}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
              />
            </CustomFormItem>
          )}
        />
        <Controller
          control={control}
          name="descricao"
          render={({ field }) => (
            <CustomFormItem label="Descrição" labelCol={{ span: 24 }}>
              <Input {...field} placeholder="Digite a descrição" style={{ width: "36.875rem", height: "2.5rem" }} />
            </CustomFormItem>
          )}
        />
        <Controller
          control={control}
          name="data_convocacao"
          render={({ field }) => (
            <CustomFormItem label="Data da convocação" labelCol={{ span: 24 }}>
              <DatePicker
                {...field}
                placeholder="Selecione a data da convocação"
                style={{ width: "36.875rem", height: "2.5rem" }}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString() : "")}
              />
            </CustomFormItem>
          )}
        />
        <Controller
          control={control}
          name="data_corte_vagas"
          render={({ field }) => (
            <CustomFormItem label="Data corte de Vagas" labelCol={{ span: 24 }}>
              <DatePicker
                {...field}
                placeholder="Selecione a data corte de vagas"
                style={{ width: "36.875rem", height: "2.5rem" }}
                format="DD/MM/YYYY"
                suffixIcon={<CalendarMonthIcon style={{ color: "#05409A" }} />}
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString() : "")}
              />
            </CustomFormItem>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormPrincipal;
