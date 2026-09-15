import { Col, Row } from "antd";
import { FormItem, SelectForm } from "@locus/estilos";
import type { OpcaoSelecao } from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import { FiltroSituacao } from "../Estilos";
import {
  OPCOES_FILTRO_SITUACAO,
  type FiltroSituacaoValores,
} from "../hooks/useDetalheUnidade";

export interface FiltrosComponentesProps {
  opcoesComponente: OpcaoSelecao[];
  componenteSelecionado?: string;
  filtroSituacao: FiltroSituacaoValores;
  aoSelecionarComponente: (valor?: string) => void;
  aoSelecionarFiltroSituacao: (valor: FiltroSituacaoValores) => void;
}

export function FiltrosComponentes({
  opcoesComponente,
  componenteSelecionado,
  filtroSituacao,
  aoSelecionarComponente,
  aoSelecionarFiltroSituacao,
}: FiltrosComponentesProps) {
  return (
    <Row
      gutter={[128, 16]}
      align="bottom"
      justify="space-between"
      style={{ marginBottom: 24 }}
    >
      <Col xs={24} md={12}>
        <FormItem
          label="Componente curricular"
          layout="vertical"
          style={{ width: "100%", marginBottom: 0 }}
        >
          <SelectForm
            id="filtro-componente"
            allowClear
            placeholder="Selecione"
            value={componenteSelecionado}
            onChange={(valor) =>
              aoSelecionarComponente(valor as string | undefined)
            }
            options={opcoesComponente}
          />
        </FormItem>
      </Col>

      <Col xs={24} md={12}>
        <FiltroSituacao
          aria-label="Filtrar componentes por situação"
          value={filtroSituacao}
          onChange={(novoValor) =>
            aoSelecionarFiltroSituacao(novoValor as FiltroSituacaoValores)
          }
          options={OPCOES_FILTRO_SITUACAO.map(({ valor, rotulo }) => ({
            label: rotulo,
            value: valor,
          }))}
        />
      </Col>
    </Row>
  );
}

export default FiltrosComponentes;
