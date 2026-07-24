import React from "react";
import { Row, Col, Select, Input, DatePicker, Typography, Form } from "antd";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { FormFields } from "../hooks/useNovaConvocacaoCandidatos";
import { AppFormItem } from "@/components/ui";

const { Text } = Typography;

export type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};

interface FormPrincipalProps {
  control: Control<FormFields>;
  concursosData: ConcursoOption[];
  concursosOptionsIsLoading: boolean;
  isCargoLiberado: string | undefined;
  popularSelectDeCargos: (value: string) => void;
  isViewMode?: boolean;
  formErrors: FieldErrors<FormFields>;
  processoConvocacaoData?: {
    concurso_uuid?: string;
    tipo_escolha?: string;
    descricao?: string;
    data_convocacao?: string;
    data_corte_vagas?: string;
  };
}

const FormPrincipal: React.FC<FormPrincipalProps> = ({
  control,
  concursosData,
  concursosOptionsIsLoading,
  isCargoLiberado,
  popularSelectDeCargos,
  isViewMode = false, 
  formErrors,
  processoConvocacaoData,
}) => {
  return (
    <Row gutter={30}>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="concurso"
          render={({ field }) => (
            <AppFormItem
              layout="vertical"
              required
              label="Concurso"
              validateStatus={
                formErrors.concurso ? "error" : undefined
              }
              help={formErrors.concurso?.message}
            >
              <Select
                {...field}
                data-testid="concurso-select"
                placeholder="Selecione o concurso"
                style={{ width: "100%" }}
                options={concursosData || []}
                loading={concursosOptionsIsLoading}
                disabled={isViewMode}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
                onChange={(value) => {
                  field.onChange(value as string);
                  popularSelectDeCargos(value as string);
                }}
              />
            </AppFormItem>
          )}
        />
      </Col>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="tipo_escolha"
          render={({ field }) => (
            <AppFormItem
              layout="vertical"
              required
              label="Tipo de Escolha"
              validateStatus={
                formErrors.tipo_escolha ? "error" : undefined
              }
              help={formErrors.tipo_escolha?.message}
            >
              <Select
                {...field}
                placeholder="Selecione o tipo de escolha"
                style={{ width: "100%" }}
                options={[
                  { value: "NOVA_AUTORIZACAO", label: "Nova Autorização" },
                  { value: "REPOSICAO", label: "Reposição" },
                  { value: "RECONVOCAO", label: "Reconvocação" },
                  { value: "MANDADO_JUDICIAL", label: "Mandado Judicial" },
                ]}
                disabled={isViewMode}
                suffixIcon={
                  <KeyboardArrowDownRoundedIcon sx={{ color: "#032B68" }} />
                }
              />
            </AppFormItem>
          )}
        />
      </Col>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="descricao"
          render={({ field }) => (
            <AppFormItem
              label="Descrição"
              layout="vertical"
              required
              validateStatus={
                formErrors.descricao ? "error" : undefined
              }
              help={formErrors.descricao?.message}
            >
              <Input
                {...field}
                placeholder="Digite a descrição"
                style={{ width: "100%" }}
                disabled={isViewMode}
              />
            </AppFormItem>
          )}
        />
      </Col>
      <Col xs={24} md={6}>
        <Controller
          control={control}
          name="data_convocacao"
          render={({ field }) => (
            <AppFormItem
              label="Data da convocação"
              layout="vertical"
              required
              validateStatus={
                formErrors.data_convocacao ? "error" : undefined
              }
              help={formErrors.data_convocacao?.message}
            >
              <DatePicker
                {...field}
                placeholder="Selecione a data da convocação"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabled={isViewMode}
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString() : "")
                }
              />
            </AppFormItem>
          )}
        />
      </Col>
      <Col xs={24} md={6}>
        <Controller
          control={control}
          name="data_corte_vagas"
          render={({ field }) => (
            <AppFormItem
              label="Data corte de Vagas"
              layout="vertical"
              required
              validateStatus={
                formErrors.data_corte_vagas ? "error" : undefined
              }
              help={formErrors.data_corte_vagas?.message}
            
            >
              <DatePicker
                {...field}
                placeholder="Selecione a data corte de vagas"
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabled={isViewMode}
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) =>
                  field.onChange(date ? date.toISOString() : "")
                }
              />
            </AppFormItem>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormPrincipal;
