import { Button, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import type { IConcursoFiltros } from "../../../../services/resources/concursos/IConcursos";
import { useOpcoesFiltro } from "../hooks/useOpcoesFiltro";

interface IFiltrosProps {
  onBuscar: (filtros: IConcursoFiltros) => void;
  onLimpar: () => void;
}

interface IFiltrosFields {
  codigo_cargo?: number;
  nome?: string;
  descricao_cargo?: string;
  numero_processo?: string;
  ano_edital?: number;
  banca_responsavel?: string;
  status?: string;  
}

const removerVazios = (valores: IFiltrosFields): IConcursoFiltros => {
  return Object.fromEntries(
    Object.entries(valores).filter(([, valor]) => {
      if (valor === undefined || valor === null) return false;
      if (typeof valor === "string") return valor.trim() !== "";
      return true;
    })
  ) as IConcursoFiltros;
};

const FiltrosBuscaConcurso: React.FC<IFiltrosProps> = ({
  onBuscar,
  onLimpar,
}) => {
  const { control, handleSubmit, reset } = useForm<IFiltrosFields>();
  const { opcoesBanca, opcoesAno } = useOpcoesFiltro();

  const limpar = () => {
    reset({});
    onLimpar();
  };

  const buscar = handleSubmit((valores) => {
    onBuscar(removerVazios(valores));
  });

  return (
    <Form layout="vertical">
      <Row gutter={[16, 8]}>
        <Col xs={24} md={8}>
          <Controller
            control={control}
            name="codigo_cargo"
            render={({ field }) => (
              <Form.Item label={<strong>Código do cargo</strong>}>
                <InputNumber
                  {...field}
                  style={{ width: "100%" }}
                  controls={false}
                  placeholder="Digite o código do cargo..."
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
              <Form.Item label={<strong>Nome do concurso</strong>}>
                <Input {...field} placeholder="Digite o nome do concurso..." />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} md={8}>
          <Controller
            control={control}
            name="descricao_cargo"
            render={({ field }) => (
              <Form.Item label={<strong>Descrição do cargo</strong>}>
                <Input
                  {...field}
                  placeholder="Digite a descrição do cargo..."
                />
              </Form.Item>
            )}
          />
        </Col>
      </Row>

      <Row gutter={[16, 8]}>
        <Col xs={24} md={6}>
          <Controller
            control={control}
            name="numero_processo"
            render={({ field }) => (
              <Form.Item label={<strong>Número do processo</strong>}>
                <Input
                  {...field}
                  placeholder="Digite o número do processo..."
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} md={6}>
          <Controller
            control={control}
            name="ano_edital"
            render={({ field }) => (
              <Form.Item label={<strong>Ano do edital</strong>}>
                <Select
                  {...field}
                  allowClear
                  placeholder="Selecione"
                  options={opcoesAno}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} md={6}>
          <Controller
            control={control}
            name="banca_responsavel"
            render={({ field }) => (
              <Form.Item label={<strong>Banca responsável</strong>}>
                <Select
                  {...field}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Selecione"
                  options={opcoesBanca}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col xs={24} md={6}>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Form.Item label={<strong>Status</strong>}>
                <Select
                  {...field}
                  allowClear
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

      <Row justify="end" gutter={8}>
        <Col>
          <Button onClick={limpar}>Limpar filtros</Button>
        </Col>
        <Col>
          <Button type="primary" icon={<SearchOutlined />} onClick={buscar}>
            Buscar
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default FiltrosBuscaConcurso;
