import React from "react";
import { Radio } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Controller } from "react-hook-form";
import { AppFormItem, FilterActionSlot } from '@/components/ui';
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import {
  FieldLabel,
  CustomSelect,
  CustomRangePicker,
  RadioGroup,
  SearchButton,
  ClearButton,
  FilterInlineRow,
  FilterFieldCol,
  FilterActionCol,
  FilterActionsGroup,
  SearchFieldsContainer,
} from "@/components/ui";

interface ConvocacaoFiltrosProps {
  control: any;
  formErrors: any;
  concursosOptions: any;
  concursosOptionsIsLoading: boolean;
  handleSubmit: any;
  handleSub: any;
  handleReset: any;
  dayjs: any;
  canViewProcessoConvocacao: boolean;
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
  canViewProcessoConvocacao,
}) => {
  const onSubmit = (data: IFiltroProcessos) => {
    handleSub(data);
  };
  return (
    <SearchFieldsContainer>
      <FilterInlineRow gutter={[16, 0]}>
        <FilterFieldCol xs={24} md={12}>
          <Controller
            control={control}
            name="concurso_uuid"
            render={({ field }) => (
              <AppFormItem
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
              </AppFormItem>
            )}
          />
        </FilterFieldCol>

        <FilterFieldCol xs={24} md={12}>
          <Controller
            control={control}
            name="cargo_uuid"
            render={({ field }) => (
              <AppFormItem
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
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
      </FilterInlineRow>

      <FilterInlineRow gutter={[16, 8]}>
        <FilterFieldCol xs={24} md={7}>
          <Controller
            control={control}
            name="data_convocacao_inicio"
            render={({ field }) => (
              <AppFormItem
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
              </AppFormItem>
            )}
          />
        </FilterFieldCol>

        <Controller
          control={control}
          name="data_convocacao_fim"
          render={({ field }) => <input type="hidden" {...field} />}
        />
        
        <FilterFieldCol xs={24} md={7}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <AppFormItem
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
              </AppFormItem>
            )}
          />
        </FilterFieldCol>
        <FilterActionCol xs={24} md={10}>
          <FilterActionSlot>
            <FilterActionsGroup>
              <ClearButton
                size="large"
                onClick={handleReset}
                disabled={!canViewProcessoConvocacao}
              >
                Limpar filtros
              </ClearButton>
              <SearchButton
                disabled={!canViewProcessoConvocacao}
                size="large"
                icon={<SearchOutlined />}
                onClick={handleSubmit(onSubmit)}
              >
                Buscar
              </SearchButton>
            </FilterActionsGroup>
          </FilterActionSlot>
        </FilterActionCol>
      </FilterInlineRow>
    </SearchFieldsContainer>
  );
};

export default ConvocacaoFiltros;
