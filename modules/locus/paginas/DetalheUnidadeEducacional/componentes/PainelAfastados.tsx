import { useMemo } from "react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PainelLateral } from "@locus/componentes/PainelLateral";
import {
  professoresAfastadosPadrao,
  professoresAfastadosPorComponente,
} from "@locus/paginas/DetalheUnidadeEducacional/dados/dadosEstaticos";
import {
  ROTULO_TIPO_AFASTAMENTO,
  type ProfessorAfastado,
  type TipoAfastamento,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";

const colunas: ColumnsType<ProfessorAfastado> = [
  { title: "Nome", dataIndex: "nome", key: "nome" },
  { title: "RF", dataIndex: "rf", key: "rf", width: 140 },
  {
    title: "Tipo de afastamento",
    dataIndex: "tipoAfastamento",
    key: "tipoAfastamento",
    width: 220,
    render: (tipo: TipoAfastamento) => ROTULO_TIPO_AFASTAMENTO[tipo],
  },
];

export interface PainelAfastadosProps {
  aberto: boolean;
  codigoLotacao: string;
  componenteId?: string;
  nomeComponente?: string;
  aoFechar: () => void;
}

export function PainelAfastados({
  aberto,
  codigoLotacao: _codigoLotacao,
  componenteId,
  nomeComponente,
  aoFechar,
}: PainelAfastadosProps) {
  const dados = useMemo(
    () =>
      componenteId
        ? (professoresAfastadosPorComponente[componenteId] ??
          professoresAfastadosPadrao)
        : [],
    [componenteId],
  );

  return (
    <PainelLateral
      aberto={aberto}
      titulo="Afastados"
      descricao="Confira os professores em atividades neste componente curricular."
      contexto={`Componente curricular: ${nomeComponente ?? ""}`}
      aoFechar={aoFechar}
    >
      <Table
        rowKey="nome"
        columns={colunas}
        dataSource={dados ?? []}
        pagination={false}
      />
    </PainelLateral>
  );
}

export default PainelAfastados;
