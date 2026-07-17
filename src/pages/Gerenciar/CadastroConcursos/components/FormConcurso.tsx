import { Col, Row } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { IConcursoFormFields } from "../hooks/useConcursoForm";
import { useCargos } from "../../../../hooks/useCargos";
import { AppFormItem, AppInput, FilterSelect, FilterSelectMulti } from "@/components/ui";

interface IOpcaoCargo {
  value: string;
  label: string;
}

interface IFormConcursoProps {
  control: Control<IConcursoFormFields>;
  erros: FieldErrors<IConcursoFormFields>;
  opcoesIniciais?: IOpcaoCargo[];
  /** Concurso EM_ANDAMENTO: bloqueia tudo exceto o status. */
  bloqueado?: boolean;
}

const filtrarPorLabel = (input: string, option?: DefaultOptionType) => {
  const label = option?.label;
  return typeof label === "string"
    ? label.toLowerCase().includes(input.toLowerCase())
    : false;
};

const FormConcurso: React.FC<IFormConcursoProps> = ({
  control,
  erros,
  opcoesIniciais = [],
  bloqueado = false,
}) => {
  const { opcoes, isLoading } = useCargos();

  const opcoesSelect = [
    ...opcoesIniciais,
    ...opcoes.filter(
      (o) => !opcoesIniciais.some((inicial) => inicial.value === o.value)
    ),
  ];

  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="cargos_ids"
          render={({ field }) => (
            <AppFormItem
              label="Código do cargo"
              validateStatus={erros.cargos_ids ? "error" : undefined}
              help={erros.cargos_ids?.message}
              labelCol={{ span: 24 }}
            >
              <FilterSelectMulti
                {...field}
                mode="multiple"
                disabled={bloqueado}
                placeholder="Selecione o(s) cargo(s)..."
                optionFilterProp="label"
                filterOption={filtrarPorLabel}
                loading={isLoading}
                options={opcoesSelect}
                notFoundContent={
                  isLoading ? "Carregando..." : "Nenhum cargo encontrado"
                }
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={12}>
        <Controller
          control={control}
          name="nome"
          render={({ field }) => (
            <AppFormItem
              label="Nome do concurso"
              validateStatus={erros.nome ? "error" : undefined}
              help={erros.nome?.message}
              labelCol={{ span: 24 }}
            >
              <AppInput
                {...field}
                disabled={bloqueado}
                placeholder="Digite o nome do concurso..."
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <AppFormItem
              label="Status do concurso"
              validateStatus={erros.status ? "error" : undefined}
              help={erros.status?.message}
              labelCol={{ span: 24 }}
            >
              <FilterSelect
                {...field}
                placeholder="Selecione"
                options={[
                  { value: "ATIVO", label: "Ativo" },
                  { value: "INATIVO", label: "Inativo" },
                ]}
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="banca_responsavel"
          render={({ field }) => (
            <AppFormItem
              label="Banca responsável"
              validateStatus={erros.banca_responsavel ? "error" : undefined}
              help={erros.banca_responsavel?.message}
              labelCol={{ span: 24 }}
            >
              <AppInput
                {...field}
                disabled={bloqueado}
                placeholder="Digite o nome da banca responsável..."
              />
            </AppFormItem>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="numero_processo"
          render={({ field }) => (
            <AppFormItem
              label="Processo SEI"
              validateStatus={erros.numero_processo ? "error" : undefined}
              help={erros.numero_processo?.message}
              labelCol={{ span: 24 }}
            >
              <AppInput
                {...field}
                inputMode="numeric"
                disabled={bloqueado}
                placeholder="Digite o número do Processo SEI..."
                onChange={(e) =>
                  field.onChange(e.target.value.replace(/\D/g, ""))
                }
              />
            </AppFormItem>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormConcurso;
