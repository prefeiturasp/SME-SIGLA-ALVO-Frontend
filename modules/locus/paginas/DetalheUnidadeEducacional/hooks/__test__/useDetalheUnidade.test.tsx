import type { ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { CAMINHOS } from "@locus/rotas/caminhos";
import * as servico from "@locus/servicos/recursos/unidadesEducacionais";
import { ComProvedores } from "@locus/testes/renderizarComTema";
import { useDetalheUnidade } from "../useDetalheUnidade";

const CODIGO = "091488";

function envolver({ children }: { children: ReactNode }) {
  return (
    <ComProvedores rota={`/locus/cadastro/unidade-educacional/${CODIGO}`}>
      <Routes>
        <Route path={CAMINHOS.cadastroDetalheUE} element={children} />
      </Routes>
    </ComProvedores>
  );
}

async function montarHook() {
  const { result } = renderHook(() => useDetalheUnidade(), {
    wrapper: envolver,
  });
  await waitFor(() => expect(result.current.unidade).toBeDefined());
  return result;
}

describe("useDetalheUnidade", () => {
  beforeEach(() => {
    servico.reiniciarModulosSalvos();
    jest.restoreAllMocks();
  });

  it("carrega a unidade com todos os componentes", async () => {
    const result = await montarHook();

    expect(result.current.unidade?.nome).toBe("Cidade Tiradentes");
    expect(result.current.totalComponentes).toBe(22);
    expect(result.current.possuiAlteracoes).toBe(false);
  });

  it("marca alteracoes e limpa quando o valor volta ao original", async () => {
    const result = await montarHook();

    act(() => result.current.alterarModulo("arte", 9));
    expect(result.current.possuiAlteracoes).toBe(true);

    act(() => result.current.alterarModulo("arte", 3));
    expect(result.current.possuiAlteracoes).toBe(false);
  });

  it("recalcula as vagas ao editar o modulo, antes de salvar", async () => {
    const result = await montarHook();

    const arteAntes = result.current.linhas.find(
      (linha) => linha.tipo === "componente" && linha.id === "arte",
    );
    expect(arteAntes).toMatchObject({ modulo: 3, saldoVagas: -2 });

    act(() => result.current.alterarModulo("arte", 6));

    const arteDepois = result.current.linhas.find(
      (linha) => linha.tipo === "componente" && linha.id === "arte",
    );
    expect(arteDepois).toMatchObject({ modulo: 6, saldoVagas: 1 });
  });

  it("envia apenas o diff ao salvar e limpa o estado", async () => {
    const salvar = jest.spyOn(servico, "salvarModulos");
    const result = await montarHook();

    act(() => result.current.alterarModulo("arte", 9));
    await act(async () => {
      await result.current.salvar();
    });

    expect(salvar).toHaveBeenCalledWith({
      codigoLotacao: CODIGO,
      alteracoes: [{ componenteId: "arte", modulo: 9 }],
    });
    expect(result.current.possuiAlteracoes).toBe(false);
  });

  it("preserva as edicoes quando o salvamento falha", async () => {
    jest.spyOn(servico, "salvarModulos").mockReturnValue({
      response: Promise.reject(new Error("falha")),
      abort: () => {},
    });
    const result = await montarHook();

    act(() => result.current.alterarModulo("arte", 9));
    await act(async () => {
      await result.current.salvar();
    });

    expect(result.current.possuiAlteracoes).toBe(true);
  });

  it("combina o filtro de componente com o filtro de situacao", async () => {
    const result = await montarHook();

    act(() => result.current.selecionarFiltroSituacao("comExcedente"));
    const somenteExcedente = result.current.componentesExibidos;
    expect(somenteExcedente).toBeGreaterThan(0);
    expect(somenteExcedente).toBeLessThan(22);

    act(() => result.current.selecionarComponente("Arte"));
    expect(result.current.componentesExibidos).toBe(1);

    act(() => result.current.selecionarFiltroSituacao("comVagas"));
    expect(result.current.componentesExibidos).toBe(0);
  });

  it("exclui a unidade e fecha o modal", async () => {
    const excluir = jest.spyOn(servico, "excluirUnidade");
    const result = await montarHook();

    act(() => result.current.abrirModalExclusao());
    expect(result.current.modalExclusaoAberto).toBe(true);

    await act(async () => {
      await result.current.confirmarExclusao();
    });

    expect(excluir).toHaveBeenCalledWith(CODIGO);
    expect(result.current.modalExclusaoAberto).toBe(false);
  });

  it("mantem o modal aberto quando a exclusao falha", async () => {
    jest.spyOn(servico, "excluirUnidade").mockReturnValue({
      response: Promise.reject(new Error("falha")),
      abort: () => {},
    });
    const result = await montarHook();

    act(() => result.current.abrirModalExclusao());
    await act(async () => {
      await result.current.confirmarExclusao();
    });

    expect(result.current.modalExclusaoAberto).toBe(true);
  });

  it("volta direto quando nao ha alteracoes pendentes", async () => {
    const result = await montarHook();

    act(() => result.current.voltar());

    expect(result.current.modalSaidaAberto).toBe(false);
  });

  it("pede confirmacao ao voltar com alteracoes pendentes", async () => {
    const result = await montarHook();

    act(() => result.current.alterarModulo("arte", 9));
    act(() => result.current.voltar());
    expect(result.current.modalSaidaAberto).toBe(true);

    act(() => result.current.confirmarSaida());
    expect(result.current.modalSaidaAberto).toBe(false);
    expect(result.current.possuiAlteracoes).toBe(false);
  });

  it("abre e fecha os paineis de professores", async () => {
    const result = await montarHook();
    const arte = result.current.unidade!.componentes.find(
      (componente) => componente.id === "arte",
    )!;

    act(() => result.current.abrirPainelLotacao(arte));
    expect(result.current.painelProfessores).toMatchObject({
      tipo: "lotacao",
    });

    act(() => result.current.abrirPainelAfastados(arte));
    expect(result.current.painelProfessores).toMatchObject({
      tipo: "afastados",
    });

    act(() => result.current.fecharPainelProfessores());
    expect(result.current.painelProfessores).toBeUndefined();
  });

  it("carrega o historico apenas quando o painel abre", async () => {
    const result = await montarHook();
    expect(result.current.historico).toHaveLength(0);

    act(() => result.current.abrirPainelHistorico());
    await waitFor(() => expect(result.current.historico).toHaveLength(3));

    act(() => result.current.fecharPainelHistorico());
    expect(result.current.painelHistoricoAberto).toBe(false);
  });

  describe("simulacao de unidade indisponivel via URL", () => {
    afterEach(() => {
      window.history.pushState({}, "", "/");
    });

    it("marca a unidade como indisponivel quando status=3", async () => {
      window.history.pushState({}, "", "/?status=3");

      const result = await montarHook();

      expect(result.current.indisponivel).toBe(true);
    });

    it("nao marca como indisponivel sem o parametro status", async () => {
      const result = await montarHook();

      expect(result.current.indisponivel).toBe(false);
    });

    it("nao confunde indisponivel com nao encontrada para codigo valido", async () => {
      window.history.pushState({}, "", "/?status=3");

      const result = await montarHook();

      expect(result.current.indisponivel).toBe(true);
      expect(result.current.naoEncontrada).toBe(false);
    });

    it("ignora outros valores de status", async () => {
      window.history.pushState({}, "", "/?status=1");

      const result = await montarHook();

      expect(result.current.indisponivel).toBe(false);
    });
  });

  it("entra em modo somente leitura ao visualizar uma versao", async () => {
    const result = await montarHook();

    act(() =>
      result.current.visualizarVersao({
        id: "h1",
        acao: "Alteração de módulo de biologia",
        responsavel: "Maria Cecília Guimarães",
        data: "2026-08-07T12:02:00",
      }),
    );

    await waitFor(() => expect(result.current.somenteLeitura).toBe(true));
    expect(result.current.versaoVisualizada?.id).toBe("h1");

    act(() => result.current.voltarVersaoAtual());
    expect(result.current.somenteLeitura).toBe(false);
  });
});
