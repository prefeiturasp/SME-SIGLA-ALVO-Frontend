import { Card, Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { IconeExcluir } from "@locus/componentes/IconeExcluir";
import { BotaoExcluir } from "@locus/estilos";
import { formatarNumeroPadded } from "@locus/utilitarios/formatadores";
import type { ComponenteCurricularAdicionado } from "../hooks/useRegistrarUnidadeEducacional";
import { DivSemDados } from "./DivSemDados";
import { FormularioAdicionarComponenteCurricular } from "./FormularioAdicionarComponenteCurricular";

const { Title, Paragraph } = Typography;

export interface CardComponentesCurricularesProps {
  componentes: ComponenteCurricularAdicionado[];
  componenteSelecionado?: string;
  quantidadeModulos: string;
  erroComponenteCurricular?: string;
  aoSelecionarComponente: (valor?: string) => void;
  aoAlterarQuantidade: (valor: string) => void;
  aoAdicionar: () => void;
  aoRemover: (id: string) => void;
}

function criarColunas(
  aoRemover: (id: string) => void,
): ColumnsType<ComponenteCurricularAdicionado> {
  return [
    {
      title: "Componente curricular",
      dataIndex: "componente",
      key: "componente",
      width: "35%",
    },
    {
      title: "Módulos",
      dataIndex: "quantidadeModulos",
      key: "quantidadeModulos",
      width: 120,
      align: "center",
      render: (quantidade: number) => formatarNumeroPadded(quantidade),
    },
    {
      title: "",
      key: "acoes",
      width: 64,
      align: "right",
      render: (_, item) => (
        <Tooltip title="Excluir componente">
          <BotaoExcluir
            icon={<IconeExcluir fontSize="small" />}
            onClick={() => aoRemover(item.id)}
            aria-label="Excluir componente"
          />
        </Tooltip>
      ),
    },
  ];
}

export function CardComponentesCurriculares({
  componentes,
  componenteSelecionado,
  quantidadeModulos,
  erroComponenteCurricular,
  aoSelecionarComponente,
  aoAlterarQuantidade,
  aoAdicionar,
  aoRemover,
}: CardComponentesCurricularesProps) {
  return (
    <Card>
      <Title level={4} style={{ marginTop: 0 }}>
        Componentes curriculares
      </Title>
      <Paragraph>
        Adicione os componentes curriculares oferecidos pela unidade e informe a
        quantidade de módulos prevista para cada um.
      </Paragraph>

      <FormularioAdicionarComponenteCurricular
        componenteSelecionado={componenteSelecionado}
        quantidadeModulos={quantidadeModulos}
        erroComponenteCurricular={erroComponenteCurricular}
        aoSelecionarComponente={aoSelecionarComponente}
        aoAlterarQuantidade={aoAlterarQuantidade}
        aoAdicionar={aoAdicionar}
      />

      {componentes.length === 0 ? (
        <DivSemDados />
      ) : (
        <Table
          style={{ marginTop: 24 }}
          rowKey="id"
          pagination={false}
          dataSource={componentes}
          columns={criarColunas(aoRemover)}
        />
      )}
    </Card>
  );
}

export default CardComponentesCurriculares;
