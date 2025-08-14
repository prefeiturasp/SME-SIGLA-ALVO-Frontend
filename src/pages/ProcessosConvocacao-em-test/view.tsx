import { Controller} from "react-hook-form";
import { type  UseFormReturn } from "react-hook-form";
import { Typography, Select, DatePicker, Button, Row, Col, Space } from "antd";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import ConvocacaoTable from "./components/ConvocacaoTable";
import dayjs from "dayjs";

interface Props {
  form: UseFormReturn<IFiltroProcessos>;
  concursosQuery: { data?: any; isLoading: boolean };
  processosQuery: { data?: any; isLoading: boolean };
  onSubmit: (data: IFiltroProcessos) => void;
  onReset: () => void;
}

export default function ProcessosConvocacaoView({
  form,
  concursosQuery,
  processosQuery,
  onSubmit,
  onReset,
}: Props) {
  const { control, handleSubmit, formState: { errors } } = form;

  return (
    <>
      {/* Filtros */}
      <Row>
        <Col>
          <Controller
            control={control}
            name="data_inicial"
            render={({ field }) => (
              <DatePicker
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                placeholder="Selecione a data inicial"
              />
            )}
          />
        </Col>
        <Col>
          <Controller
            control={control}
            name="data_final"
            render={({ field }) => (
              <DatePicker
                value={field.value ? dayjs(field.value) : undefined}
                onChange={(date) => field.onChange(date ? date.toISOString() : "")}
                placeholder="Selecione a data final"
              />
            )}
          />
        </Col>
        <Space>
          <Button onClick={onReset}>Limpar filtros</Button>
          <Button type="primary" onClick={handleSubmit(onSubmit)} data-testid="submit">
            Pesquisar
          </Button>
        </Space>
      </Row>

      {/* Tabela */}
      <ConvocacaoTable
        loading={processosQuery.isLoading}
        data={processosQuery.data?.results || []}
        pagination={{
          current: 1,
          defaultPageSize: 10,
          total: processosQuery.data?.count || 0,
        }}
      />
    </>
  );
}
