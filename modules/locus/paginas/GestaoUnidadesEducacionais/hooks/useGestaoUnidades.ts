import { useMemo, useState } from "react";
import {
  lerStatusSimuladoListagem,
  type StatusListagemUnidades,
} from "@locus/servicos/recursos/unidadesEducacionais";
import type {
  FiltrosUnidades,
  PainelComponente,
  UnidadeEducacional,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import {
  estatisticasPainel,
  linhasUnidades,
  opcoesComponenteCurricular,
  TOTAL_REGISTROS,
} from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";

const COMPONENTE_PADRAO =
  opcoesComponenteCurricular[0]?.value ?? "Arte";

export interface EstadoGestaoUnidades {
  unidades: UnidadeEducacional[];
  total: number;
  painel: PainelComponente | undefined;
  componenteSelecionado: string;
  statusListagem: StatusListagemUnidades;
  carregando: boolean;
  erro: boolean;
  selecionarComponente: (componente: string) => void;
  aplicarFiltros: (filtros: FiltrosUnidades) => void;
  limparFiltros: () => void;
}

export function useGestaoUnidades(): EstadoGestaoUnidades {
  const [componenteSelecionado, setComponenteSelecionado] =
    useState(COMPONENTE_PADRAO);
  const [, setFiltros] = useState<FiltrosUnidades>({});

  const statusListagem = lerStatusSimuladoListagem();
  const semDados = statusListagem !== "comDados";

  const painel = useMemo<PainelComponente>(
    () => ({
      componente: componenteSelecionado,
      estatisticas: estatisticasPainel,
    }),
    [componenteSelecionado],
  );

  return useMemo(
    () => ({
      unidades: semDados ? [] : linhasUnidades,
      total: semDados ? 0 : TOTAL_REGISTROS,
      painel,
      componenteSelecionado,
      statusListagem,
      carregando: false,
      erro: false,
      selecionarComponente: setComponenteSelecionado,
      aplicarFiltros: (novos: FiltrosUnidades) =>
        setFiltros((atuais) => ({ ...atuais, ...novos })),
      limparFiltros: () => setFiltros({}),
    }),
    [painel, componenteSelecionado, statusListagem, semDados],
  );
}

export default useGestaoUnidades;
