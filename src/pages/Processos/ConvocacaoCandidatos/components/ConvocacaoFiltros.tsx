import React from "react";
import { Row, Col, Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import { CustomFormItem } from "../../../../components/FormStyle";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import {
  FieldLabel,
  CustomSelect,
  CustomRangePicker,
  RadioGroup,
  SearchButton,
  SearchButtonContainer,
  SearchFieldsContainer,
  ClearButton
} from "../style";

interface ConvocacaoFiltrosProps {
  control: any;
  formErrors: any;
  concursosOptions: any;
  concursosOptionsIsLoading: boolean;
  handleSubmit: any;
  handleSub: any;
  handleReset: any;
  dayjs: any;
}

const ConvocacaoFiltros: React.FC<ConvocacaoFiltrosProps> = ({
  control,
  formErrors,
  concursosOptions,
  concursosOptionsIsLoading,
  handleSubmit,
  handleSub,
  handleReset,
  dayjs,
}) => {
  const onSubmit = (data: IFiltroProcessos) => {
    handleSub(data);
  };
  return (
    <SearchFieldsContainer>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Controller
            control={control}
            name="concurso_uuid"
            render={({ field }) => (
              <CustomFormItem
                label={<FieldLabel>Concurso</FieldLabel>}
                validateStatus={
                  formErrors.concurso_uuid ? "error" : undefined
                }
                help={formErrors.concurso_uuid?.message}
                labelCol={{ span: 24 }}
              >
                <CustomSelect
                  {...field}
                  options={concursosOptions && 'concursos' in concursosOptions ? concursosOptions.concursos : []}
                  placeholder="Todos"
                  loading={concursosOptionsIsLoading}
                  className="custom-select-concurso"
                />
              </CustomFormItem>
            )}
          />
        </Col>

        <Col xs={24} md={12}>
          <Controller
            control={control}
            name="cargo_uuid"
            render={({ field }) => (
              <CustomFormItem
                label={<FieldLabel>Cargo</FieldLabel>}
                validateStatus={formErrors.cargo_uuid ? "error" : undefined}
                help={formErrors.cargo_uuid?.message}
                labelCol={{ span: 24 }}
                className="custom-form-item-cargo"
              >
                <CustomSelect
                  {...field}
                  options={
                    concursosOptions && 'cargos' in concursosOptions ? concursosOptions.cargos : []
                  }
                  placeholder="Selecione o cargo"
                  className="custom-select-cargo"
                />
              </CustomFormItem>
            )}
          />
        </Col>
      </Row>

      <Row gutter={[16, 8]} align="middle">
        <Col xs={24} md={7}>
          <Controller
            control={control}
            name="data_convocacao_inicio"
            render={({ field }) => (
              <CustomFormItem
                label={<FieldLabel>Data de Convocação</FieldLabel>}
                validateStatus={
                  formErrors.data_convocacao_inicio ? "error" : undefined
                }
                help={formErrors.data_convocacao_inicio?.message}
                labelCol={{ span: 24 }}
              >
                <CustomRangePicker
                  onChange={(dates: any) => {
                    const dataInicio = dates && dates[0] ? dayjs(dates[0]).format("YYYY-MM-DD") : "";
                    const dataFim = dates && dates[1] ? dayjs(dates[1]).format("YYYY-MM-DD") : "";
                    
                    field.onChange(dataInicio);
                    control.setValue("data_convocacao_fim", dataFim);
                  }}
                  placeholder={["Data inicial", "Data final"]}
                  format="DD/MM/YYYY"
                />
              </CustomFormItem>
            )}
          />
        </Col>

        <Controller
          control={control}
          name="data_convocacao_fim"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        
        <Col xs={24} md={7}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <CustomFormItem
                label={<FieldLabel>Status</FieldLabel>}
                labelCol={{ span: 24 }}
              >
                <RadioGroup 
                  value={field.value || "todos"}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  <Radio value="todos">Todos</Radio>
                  <Radio value="andamento">Andamento</Radio>
                  <Radio value="finalizado">Finalizado</Radio>
                </RadioGroup>
              </CustomFormItem>
            )}
          />
        </Col>
        <Col xs={24} md={10}>
          <SearchButtonContainer>
            <ClearButton
              size="large"
              onClick={handleReset}
            >
              Limpar filtros
            </ClearButton>
            <SearchButton
              size="large"
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSubmit(onSubmit)}
            >
              Buscar
            </SearchButton>
          </SearchButtonContainer>
        </Col>
      </Row>
    </SearchFieldsContainer>
  );
};

export default ConvocacaoFiltros;
