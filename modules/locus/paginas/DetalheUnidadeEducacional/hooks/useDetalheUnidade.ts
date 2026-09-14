import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useNotificacao } from "@locus/hooks/useNotificacao";
import { CAMINHOS } from "@locus/rotas/caminhos";
import {
  deveSimularUnidadeIndisponivel,
  excluirUnidade,
  lerDetalheEstatico,
  salvarModulos,
} from "@locus/servicos/recursos/unidadesEducacionais";
import { historicoExemplo } from "../dados/dadosEstaticos";
import type {
  ComponenteCurricularDetalhe,
  DetalheUnidade,
  OpcaoSelecao,
  RegistroHistorico,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import { montarLinhasAgrupadas, type LinhaTabelaComponentes } from "../utilitarios";

export type FiltroSituacaoValores =
  | "todos"
  | "comVagas"
  | "comExcedente"
  | "comAfastados";

export const OPCOES_FILTRO_SITUACAO: { valor: FiltroSituacaoValores; rotulo: string }[] =
  [
    { valor: "todos", rotulo: "Todos" },
    { valor: "comVagas", rotulo: "Com vagas" },
    { valor: "comExcedente", rotulo: "Com excedente" },
    { valor: "comAfastados", rotulo: "Com afastados" },
  ];

export interface PainelProfessores {
  tipo: "lotacao" | "afastados";
  componente: ComponenteCurricularDetalhe;
}

export interface EstadoDetalheUnidade {
  unidade: DetalheUnidade | undefined;
  linhas: LinhaTabelaComponentes[];
  opcoesComponente: OpcaoSelecao[];
  totalComponentes: number;
  componentesExibidos: number;
  componenteSelecionado: string | undefined;
  filtroSituacao: FiltroSituacaoValores;
  possuiAlteracoes: boolean;
  carregando: boolean;
  naoEncontrada: boolean;
  indisponivel: boolean;
  salvando: boolean;
  excluindo: boolean;
  somenteLeitura: boolean;
  versaoVisualizada: RegistroHistorico | undefined;
  historico: RegistroHistorico[];
  painelProfessores: PainelProfessores | undefined;
  painelHistoricoAberto: boolean;
  modalExclusaoAberto: boolean;
  modalSaidaAberto: boolean;
  selecionarComponente: (valor?: string) => void;
  selecionarFiltroSituacao: (valor: FiltroSituacaoValores) => void;
  alterarModulo: (componenteId: string, valor: number) => void;
  abrirPainelLotacao: (componente: ComponenteCurricularDetalhe) => void;
  abrirPainelAfastados: (componente: ComponenteCurricularDetalhe) => void;
  fecharPainelProfessores: () => void;
  abrirPainelHistorico: () => void;
  fecharPainelHistorico: () => void;
  visualizarVersao: (registro: RegistroHistorico) => void;
  voltarVersaoAtual: () => void;
  abrirModalExclusao: () => void;
  fecharModalExclusao: () => void;
  confirmarExclusao: () => Promise<void>;
  fecharModalSaida: () => void;
  confirmarSaida: () => void;
  salvarESair: () => Promise<void>;
  voltar: () => void;
  salvar: () => Promise<void>;
}

function atendeFiltroSituacao(
  componente: ComponenteCurricularDetalhe,
  filtro: FiltroSituacaoValores,
): boolean {
  if (filtro === "comVagas") return componente.saldoVagas > 0;
  if (filtro === "comExcedente") return componente.saldoVagas < 0;
  if (filtro === "comAfastados") return componente.afastados > 0;
  return true;
}

export function useDetalheUnidade(): EstadoDetalheUnidade {
  const { codigoLotacao = "" } = useParams<{ codigoLotacao: string }>();
  const navigate = useNavigate();
  const notificacao = useNotificacao();

  const [componenteSelecionado, setComponenteSelecionado] = useState<
    string | undefined
  >();
  const [filtroSituacao, setFiltroSituacao] = useState<FiltroSituacaoValores>("todos");
  const [modulosEditados, setModulosEditados] = useState<
    Record<string, number>
  >({});
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [painelProfessores, setPainelProfessores] = useState<
    PainelProfessores | undefined
  >();
  const [painelHistoricoAberto, setPainelHistoricoAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalSaidaAberto, setModalSaidaAberto] = useState(false);
  const [versaoVisualizada, setVersaoVisualizada] = useState<
    RegistroHistorico | undefined
  >();

  const [versaoDados, setVersaoDados] = useState(0);

  const somenteLeitura = Boolean(versaoVisualizada);

  const unidade = useMemo(
    () =>
      lerDetalheEstatico(codigoLotacao, {
        comEdicoesSalvas: !somenteLeitura,
      }),
      [codigoLotacao, somenteLeitura, versaoDados],
  );

  const naoEncontrada = Boolean(codigoLotacao) && unidade === undefined;
  const indisponivel = deveSimularUnidadeIndisponivel();
  const historico = useMemo(
    () => (painelHistoricoAberto ? historicoExemplo : []),
    [painelHistoricoAberto],
  );

  const componentes = useMemo(
    () => unidade?.componentes ?? [],
    [unidade?.componentes],
  );

  const modulosOriginais = useMemo(() => {
    const mapa = new Map<string, number>();
    componentes.forEach((componente) => mapa.set(componente.id, componente.modulo));
    return mapa;
  }, [componentes]);

  const componentesComEdicoes = useMemo(
    () =>
      componentes.map((componente) => {
        const editado = modulosEditados[componente.id];
        if (editado === undefined) return componente;

        return {
          ...componente,
          modulo: editado,
          saldoVagas: componente.saldoVagas + (editado - componente.modulo),
        };
      }),
    [componentes, modulosEditados],
  );

  const componentesFiltrados = useMemo(
    () =>
      componentesComEdicoes.filter(
        (componente) =>
          (!componenteSelecionado ||
            componente.componente === componenteSelecionado) &&
          atendeFiltroSituacao(componente, filtroSituacao),
      ),
    [componentesComEdicoes, componenteSelecionado, filtroSituacao],
  );

  const linhas = useMemo(
    () => montarLinhasAgrupadas(componentesFiltrados),
    [componentesFiltrados],
  );

  const opcoesComponente = useMemo<OpcaoSelecao[]>(
    () =>
      componentes.map((componente) => ({
        value: componente.componente,
        label: componente.componente,
      })),
    [componentes],
  );

  const possuiAlteracoes = Object.keys(modulosEditados).length > 0;

  const modulosEditadosRef = useRef(modulosEditados);

  const definirModulosEditados = useCallback(
    (proximos: Record<string, number>) => {
      modulosEditadosRef.current = proximos;
      setModulosEditados(proximos);
    },
    [],
  );

  const alterarModulo = useCallback(
    (componenteId: string, valor: number) => {
      const atuais = modulosEditadosRef.current;
      const proximos =
        modulosOriginais.get(componenteId) === valor
          ? (({ [componenteId]: _removido, ...resto }) => resto)(atuais)
          : { ...atuais, [componenteId]: valor };

      definirModulosEditados(proximos);
    },
    [definirModulosEditados, modulosOriginais],
  );

  const salvar = useCallback(async () => {
    if (!unidade || !possuiAlteracoes) return;

    setSalvando(true);
    try {
      await salvarModulos({
        codigoLotacao: unidade.codigoLotacao,
        alteracoes: Object.entries(modulosEditados).map(
          ([componenteId, modulo]) => ({ componenteId, modulo }),
        ),
      }).response;

      definirModulosEditados({});
      setVersaoDados((atual) => atual + 1);
      notificacao.sucesso({
        titulo: "Sucesso!",
        texto: "As alterações foram salvas.",
      });
    } catch {
      notificacao.erro({
        titulo: "Erro",
        texto:
          "Não conseguimos salvar as alterações. Por favor, tente novamente!",
      });
    } finally {
      setSalvando(false);
    }
  }, [
    unidade,
    possuiAlteracoes,
    modulosEditados,
    definirModulosEditados,
    notificacao,
  ]);

  const confirmarExclusao = useCallback(async () => {
    setExcluindo(true);
    try {
      await excluirUnidade(codigoLotacao).response;

      setModalExclusaoAberto(false);
      notificacao.sucesso({
        titulo: "Sucesso!",
        texto: "A unidade educacional foi excluída.",
      });
      navigate(CAMINHOS.cadastroGestaoUnidades);
    } catch {
      notificacao.erro({
        titulo: "Erro",
        texto:
          "Não conseguimos excluir a unidade educacional. Por favor, tente novamente!",
      });
    } finally {
      setExcluindo(false);
    }
  }, [codigoLotacao, navigate, notificacao]);

  const voltar = useCallback(() => {
    if (Object.keys(modulosEditadosRef.current).length > 0) {
      setModalSaidaAberto(true);
      return;
    }
    navigate(CAMINHOS.cadastroGestaoUnidades);
  }, [navigate]);

  const confirmarSaida = useCallback(() => {
    setModalSaidaAberto(false);
    definirModulosEditados({});
    navigate(CAMINHOS.cadastroGestaoUnidades);
  }, [definirModulosEditados, navigate]);

  const salvarESair = useCallback(async () => {
    if (!unidade || !possuiAlteracoes) {
      setModalSaidaAberto(false);
      navigate(CAMINHOS.cadastroGestaoUnidades);
      return;
    }

    setSalvando(true);
    try {
      await salvarModulos({
        codigoLotacao: unidade.codigoLotacao,
        alteracoes: Object.entries(modulosEditados).map(
          ([componenteId, modulo]) => ({ componenteId, modulo }),
        ),
      }).response;

      definirModulosEditados({});
      setModalSaidaAberto(false);
      notificacao.sucesso({
        titulo: "Sucesso!",
        texto: "As alterações foram salvas.",
      });
      navigate(CAMINHOS.cadastroGestaoUnidades);
    } catch {
      notificacao.erro({
        titulo: "Erro",
        texto:
          "Não conseguimos salvar as alterações. Por favor, tente novamente!",
      });
    } finally {
      setSalvando(false);
    }
  }, [
    unidade,
    possuiAlteracoes,
    modulosEditados,
    definirModulosEditados,
    navigate,
    notificacao,
  ]);

  const visualizarVersao = useCallback((registro: RegistroHistorico) => {
    setPainelHistoricoAberto(false);
    definirModulosEditados({});
    setVersaoVisualizada(registro);
  }, [definirModulosEditados]);

  const voltarVersaoAtual = useCallback(() => setVersaoVisualizada(undefined), []);

  return useMemo(
    () => ({
      unidade,
      linhas,
      opcoesComponente,
      totalComponentes: componentes.length,
      componentesExibidos: componentesFiltrados.length,
      componenteSelecionado,
      filtroSituacao,
      possuiAlteracoes,
      carregando: false,
      naoEncontrada,
      indisponivel,
      salvando,
      excluindo,
      somenteLeitura,
      versaoVisualizada,
      historico,
      painelProfessores,
      painelHistoricoAberto,
      modalExclusaoAberto,
      modalSaidaAberto,
      selecionarComponente: setComponenteSelecionado,
      selecionarFiltroSituacao: setFiltroSituacao,
      alterarModulo,
      abrirPainelLotacao: (componente) =>
        setPainelProfessores({ tipo: "lotacao", componente }),
      abrirPainelAfastados: (componente) =>
        setPainelProfessores({ tipo: "afastados", componente }),
      fecharPainelProfessores: () => setPainelProfessores(undefined),
      abrirPainelHistorico: () => setPainelHistoricoAberto(true),
      fecharPainelHistorico: () => setPainelHistoricoAberto(false),
      visualizarVersao,
      voltarVersaoAtual,
      abrirModalExclusao: () => setModalExclusaoAberto(true),
      fecharModalExclusao: () => setModalExclusaoAberto(false),
      confirmarExclusao,
      fecharModalSaida: () => setModalSaidaAberto(false),
      confirmarSaida,
      salvarESair,
      voltar,
      salvar,
    }),
    [
      unidade,
      linhas,
      opcoesComponente,
      componentes.length,
      componentesFiltrados.length,
      componenteSelecionado,
      filtroSituacao,
      possuiAlteracoes,
      somenteLeitura,
      naoEncontrada,
      indisponivel,
      salvando,
      excluindo,
      versaoVisualizada,
      historico,
      painelProfessores,
      painelHistoricoAberto,
      modalExclusaoAberto,
      modalSaidaAberto,
      alterarModulo,
      visualizarVersao,
      voltarVersaoAtual,
      confirmarExclusao,
      confirmarSaida,
      salvarESair,
      voltar,
      salvar,
    ],
  );
}

export default useDetalheUnidade;
