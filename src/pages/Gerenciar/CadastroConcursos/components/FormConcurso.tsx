import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";
import type { IConcursoFormFields } from "../hooks/useConcursoForm";
import { useCargosAutocomplete } from "../hooks/useCargosAutocomplete";

interface IOpcaoCargo {
  value: string;
  label: string;
}

interface IFormConcursoProps {
  control: Control<IConcursoFormFields>;
  erros: FieldErrors<IConcursoFormFields>;
  opcoesIniciais?: IOpcaoCargo[];
}

const FormConcurso: React.FC<IFormConcursoProps> = ({
  control,
  erros,
  opcoesIniciais = [],
}) => {
  const { opcoes, buscar, isFetching } = useCargosAutocomplete();

  // Mescla as opcoes ja selecionadas (edicao) com as do autocomplete,
  // para que o Select exiba "codigo - nome" em vez do UUID cru.
  const opcoesSelect = [
    ...opcoesIniciais,
    ...opcoes.filter(
      (o) => !opcoesIniciais.some((inicial) => inicial.value === o.value)
    ),
  ];

  return (
    <Row gutter={[16, 8]}>
      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="cargos_ids"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Código do cargo</strong>}
              validateStatus={erros.cargos_ids ? "error" : undefined}
              help={erros.cargos_ids?.message}
            >
              <Select
                {...field}
                mode="multiple"
                placeholder="Digite o código do cargo..."
                filterOption={false}
                onSearch={buscar}
                loading={isFetching}
                options={opcoesSelect}
                notFoundContent={isFetching ? "Buscando..." : null}
              />
            </Form.Item>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="nome"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Nome do concurso</strong>}
              validateStatus={erros.nome ? "error" : undefined}
              help={erros.nome?.message}
            >
              <Input {...field} placeholder="Digite o nome do concurso..." />
            </Form.Item>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="numero_processo"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Número do processo</strong>}
              validateStatus={erros.numero_processo ? "error" : undefined}
              help={erros.numero_processo?.message}
            >
              <Input
                {...field}
                placeholder="Digite o número do processo..."
              />
            </Form.Item>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="ano_edital"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Ano do edital</strong>}
              validateStatus={erros.ano_edital ? "error" : undefined}
              help={erros.ano_edital?.message}
            >
              <InputNumber
                {...field}
                style={{ width: "100%" }}
                controls={false}
                placeholder="Exemplo: 2026"
              />
            </Form.Item>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="banca_responsavel"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Banca responsável</strong>}
              validateStatus={erros.banca_responsavel ? "error" : undefined}
              help={erros.banca_responsavel?.message}
            >
              <Input
                {...field}
                placeholder="Digite o nome da banca responsável..."
              />
            </Form.Item>
          )}
        />
      </Col>

      <Col xs={24} md={8}>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Form.Item
              layout="vertical"
              required
              label={<strong>Status do concurso</strong>}
              validateStatus={erros.status ? "error" : undefined}
              help={erros.status?.message}
            >
              <Select
                {...field}
                placeholder="Selecione"
                options={[
                  { value: "ATIVO", label: "Ativo" },
                  { value: "INATIVO", label: "Inativo" },
                ]}
              />
            </Form.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default FormConcurso;
