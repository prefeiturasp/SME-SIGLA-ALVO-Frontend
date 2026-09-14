import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Button, Card, Col, Form, Input, Row, Select, Typography } from "antd";
import { FormItem } from "@locus/estilos";
import { opcoesFiltros } from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";
import type { FiltrosUnidades } from "@locus/servicos/recursos/unidadesEducacionais/tipos";

const { Title, Paragraph } = Typography;

export interface CardFormFiltrosUnidadesProps {
  aoBuscar: (filtros: FiltrosUnidades) => void;
  aoLimpar: () => void;
}

export function CardFormFiltrosUnidades({
  aoBuscar,
  aoLimpar,
}: CardFormFiltrosUnidadesProps) {
  const [form] = Form.useForm();

  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Filtrar unidades
      </Title>
      <Paragraph>
        Consulte a distribuição de professores, capacidade de módulos e
        informações das unidades educacionais da Rede Municipal de Ensino.
      </Paragraph>

      <Form
        form={form}
        layout="vertical"
        onFinish={(valores) => aoBuscar(valores as FiltrosUnidades)}
      >
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Cargo">
              <Select
                placeholder="Selecione"
                allowClear
                options={opcoesFiltros.cargo}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Estrutura hierárquica (E.H)">
              <Input placeholder="Exemplo: 123456789012345" />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Código de lotação">
              <Input placeholder="Exemplo: 1234567" />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Tipo da unidade">
              <Select
                placeholder="Selecione"
                allowClear
                options={opcoesFiltros.tipoUnidade}
              />
            </FormItem>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Diretoria Regional de Educação (DRE)">
              <Select
                placeholder="Selecione"
                allowClear
                options={opcoesFiltros.dre}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Nome da unidade educacional">
              <Input placeholder="Exemplo: João da Silva" />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Escolas municipalizadas">
              <Select
                defaultValue="todos"
                options={opcoesFiltros.simNaoTodos}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem label="Ano da municipalização">
              <Select
                placeholder="Selecione"
                allowClear
                options={opcoesFiltros.anoMunicipalizacao}
              />
            </FormItem>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <FormItem
              label="Ensino fundamental I"
              help="Escolas que oferecem ensino fundamental."
            >
              <Select
                defaultValue="todos"
                options={opcoesFiltros.simNaoTodos}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem
              label="EJA Modular"
              help="Escolas com EJA na modalidade modular."
            >
              <Select
                defaultValue="todos"
                options={opcoesFiltros.simNaoTodos}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem
              label="São Paulo Integral"
              help="Escolas do programa São Paulo Integral."
            >
              <Select
                defaultValue="todos"
                options={opcoesFiltros.simNaoTodos}
              />
            </FormItem>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <FormItem
              label="Unidade contabilizada"
              help="Escolas contabilizadas nos cálculos do sistema."
            >
              <Select
                defaultValue="todos"
                options={opcoesFiltros.simNaoTodos}
              />
            </FormItem>
          </Col>
          <Col
            span={24}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 16,
              paddingTop: 16,
            }}
          >
            <Button
              type="default"
              onClick={() => {
                form.resetFields();
                aoLimpar();
              }}
            >
              Limpar filtros
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlinedIcon fontSize="small" />}
            >
              Buscar unidade
            </Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}

export default CardFormFiltrosUnidades;
