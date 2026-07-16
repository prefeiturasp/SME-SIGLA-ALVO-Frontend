import { Col, DatePicker, Input, InputNumber, Row } from "antd";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { IPublicacoesResultadosFormFields } from "../hooks/usePublicacoesResultadosForm";
import { AppFormItem, AppInput } from "@/components/ui";

interface IFormPublicacoesResultadosProps {
  control: Control<IPublicacoesResultadosFormFields>;
  erros: FieldErrors<IPublicacoesResultadosFormFields>;
}

const FormPublicacoesResultados: React.FC<IFormPublicacoesResultadosProps> = ({
  control,
  erros,
}) => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="data_autorizacao"
          render={({ field }) => (
            <AppFormItem
              label="Data de autorização do concurso"
              validateStatus={erros.data_autorizacao ? "error" : undefined}
              help={erros.data_autorizacao?.message}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="00/00/0000"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="classificacao_final"
          render={({ field }) => (
            <AppFormItem
              label="Classificação final"
              validateStatus={erros.classificacao_final ? "error" : undefined}
              help={erros.classificacao_final?.message}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="00/00/0000"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="data_abertura"
          render={({ field }) => (
            <AppFormItem
              label="Data de abertura do concurso"
              validateStatus={erros.data_abertura ? "error" : undefined}
              help={erros.data_abertura?.message}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                {...field}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="00/00/0000"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="link_edital"
          render={({ field }) => (
            <AppFormItem
              label="Link do edital"
              validateStatus={erros.link_edital ? "error" : undefined}
              help={erros.link_edital?.message}
              labelCol={{ span: 24 }}
            >
              <AppInput {...field} placeholder="Cole o link do edital..." />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="habilitados_geral"
          render={({ field }) => (
            <AppFormItem
              label="Quantidade de habilitados (Geral)"
              validateStatus={erros.habilitados_geral ? "error" : undefined}
              help={erros.habilitados_geral?.message}
              labelCol={{ span: 24 }}
            >
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                min={0}
                controls={false}
                placeholder="Exemplo: 100"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="habilitados_nna"
          render={({ field }) => (
            <AppFormItem
              label="Quantidade de habilitados (NNA)"
              validateStatus={erros.habilitados_nna ? "error" : undefined}
              help={erros.habilitados_nna?.message}
              labelCol={{ span: 24 }}
            >
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                min={0}
                controls={false}
                placeholder="Exemplo: 100"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="habilitados_pcd"
          render={({ field }) => (
            <AppFormItem
              label="Quantidade de habilitados (PcD)"
              validateStatus={erros.habilitados_pcd ? "error" : undefined}
              help={erros.habilitados_pcd?.message}
              labelCol={{ span: 24 }}
            >
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                min={0}
                controls={false}
                placeholder="Exemplo: 100"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24}>
        <Controller
          control={control}
          name="retificacoes"
          render={({ field }) => (
            <AppFormItem
              label="Retificações (opcional)"
              validateStatus={erros.retificacoes ? "error" : undefined}
              help={erros.retificacoes?.message}
              labelCol={{ span: 24 }}
            >
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="Informe as retificações publicadas para este concurso, se houver..."
              />
            </AppFormItem>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormPublicacoesResultados;
