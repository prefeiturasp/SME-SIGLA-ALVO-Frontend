import { Col, DatePicker, Row } from "antd";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { IVigenciaFormFields } from "../hooks/useVigenciaForm";
import { AppFormItem } from "@/components/ui";

interface IFormVigenciaProps {
  control: Control<IVigenciaFormFields>;
  erros: FieldErrors<IVigenciaFormFields>;

  bloqueado?: boolean;
}

const FormVigencia: React.FC<IFormVigenciaProps> = ({
  control,
  erros,
  bloqueado = false,
}) => {
  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="data_homologacao"
          render={({ field }) => (
            <AppFormItem
              label="Data da homologação"
              validateStatus={erros.data_homologacao ? "error" : undefined}
              help={erros.data_homologacao?.message}
              labelCol={{ span: 24 }}
            >
              <DatePicker
                {...field}
                disabled={bloqueado}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="00/00/0000"
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="data_prorrogacao"
          render={({ field }) => (
            <AppFormItem
              label="Data da prorrogação (opcional)"
              validateStatus={erros.data_prorrogacao ? "error" : undefined}
              help={erros.data_prorrogacao?.message}
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

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="vigencia"
          render={({ field }) => (
            <AppFormItem
              label="Vigência do concurso"
              validateStatus={erros.vigencia ? "error" : undefined}
              help={erros.vigencia?.message as string | undefined}
              labelCol={{ span: 24 }}
            >
              <DatePicker.RangePicker
                {...field}
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder={["00/00/0000", "00/00/0000"]}
              />
            </AppFormItem>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormVigencia;
