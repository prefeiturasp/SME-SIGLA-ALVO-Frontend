import { Card } from "antd";
import { CabecalhoSecao } from "@locus/componentes/CabecalhoSecao";
import type {
  ComponenteCurricularDetalhe,
  OpcaoSelecao,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import type { FiltroSituacaoValores } from "../hooks/useDetalheUnidade";
import type { LinhaTabelaComponentes } from "../utilitarios";
import { FiltrosComponentes } from "./FiltrosComponentes";
import { TabelaComponentesDetalhe } from "./TabelaComponentesDetalhe";

export interface CardComponentesDetalheProps {
  linhas: LinhaTabelaComponentes[];
  opcoesComponente: OpcaoSelecao[];
  componenteSelecionado?: string;
  filtroSituacao: FiltroSituacaoValores;
  totalComponentes: number;
  componentesExibidos: number;
  carregando: boolean;
  somenteLeitura?: boolean;
  aoSelecionarComponente: (valor?: string) => void;
  aoSelecionarFiltroSituacao: (valor: FiltroSituacaoValores) => void;
  aoAlterarModulo: (componenteId: string, valor: number) => void;
  aoAbrirLotacao: (componente: ComponenteCurricularDetalhe) => void;
  aoAbrirAfastados: (componente: ComponenteCurricularDetalhe) => void;
}

export function CardComponentesDetalhe({
  linhas,
  opcoesComponente,
  componenteSelecionado,
  filtroSituacao,
  totalComponentes,
  componentesExibidos,
  carregando,
  somenteLeitura,
  aoSelecionarComponente,
  aoSelecionarFiltroSituacao,
  aoAlterarModulo,
  aoAbrirLotacao,
  aoAbrirAfastados,
}: CardComponentesDetalheProps) {
  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <CabecalhoSecao
          titulo="Dados por componente curricular"
          descricao="Compare as informações por componente curricular da unidade educacional. Use os filtros para localizar um componente curricular ou filtrar vagas, excedentes e afastamentos."
        />
      </div>

      <FiltrosComponentes
        opcoesComponente={opcoesComponente}
        componenteSelecionado={componenteSelecionado}
        filtroSituacao={filtroSituacao}
        aoSelecionarComponente={aoSelecionarComponente}
        aoSelecionarFiltroSituacao={aoSelecionarFiltroSituacao}
      />

      <TabelaComponentesDetalhe
        linhas={linhas}
        totalComponentes={totalComponentes}
        componentesExibidos={componentesExibidos}
        carregando={carregando}
        somenteLeitura={somenteLeitura}
        aoAlterarModulo={aoAlterarModulo}
        aoAbrirLotacao={aoAbrirLotacao}
        aoAbrirAfastados={aoAbrirAfastados}
      />
    </Card>
  );
}

export default CardComponentesDetalhe;
