import { act, renderHook, waitFor } from "@testing-library/react";
import { useGestaoUnidades } from "../useGestaoUnidades";

describe("useGestaoUnidades", () => {
  it("carrega listagem e painel do componente selecionado", async () => {
    const { result } = renderHook(() => useGestaoUnidades());

    await waitFor(() => expect(result.current.carregando).toBe(false));

    expect(result.current.unidades).toHaveLength(10);
    expect(result.current.total).toBe(5985);
    expect(result.current.painel?.estatisticas).toHaveLength(6);
    expect(result.current.componenteSelecionado).toBe("Arte");
  });

  it("troca o componente selecionado e recarrega o painel", async () => {
    const { result } = renderHook(() => useGestaoUnidades());

    await waitFor(() => expect(result.current.carregando).toBe(false));

    act(() => result.current.selecionarComponente("Matemática"));

    await waitFor(() =>
      expect(result.current.painel?.componente).toBe("Matemática"),
    );
    expect(result.current.componenteSelecionado).toBe("Matemática");
  });

  it("aplica e limpa filtros sem quebrar a listagem", async () => {
    const { result } = renderHook(() => useGestaoUnidades());

    await waitFor(() => expect(result.current.carregando).toBe(false));

    act(() => result.current.aplicarFiltros({ dre: "itaquera" }));
    await waitFor(() => expect(result.current.unidades).toHaveLength(10));

    act(() => result.current.limparFiltros());
    await waitFor(() => expect(result.current.unidades).toHaveLength(10));
  });

  describe("simulacao de status da listagem via URL", () => {
    afterEach(() => {
      window.history.pushState({}, "", "/");
    });

    it("devolve listagem vazia sem cadastro quando status=1", async () => {
      window.history.pushState({}, "", "/?status=1");

      const { result } = renderHook(() => useGestaoUnidades());

      await waitFor(() => expect(result.current.carregando).toBe(false));

      expect(result.current.unidades).toHaveLength(0);
      expect(result.current.total).toBe(0);
      expect(result.current.statusListagem).toBe("semCadastro");
    });

    it("devolve listagem vazia sem resultado quando status=2", async () => {
      window.history.pushState({}, "", "/?status=2");

      const { result } = renderHook(() => useGestaoUnidades());

      await waitFor(() => expect(result.current.carregando).toBe(false));

      expect(result.current.unidades).toHaveLength(0);
      expect(result.current.total).toBe(0);
      expect(result.current.statusListagem).toBe("semResultado");
    });

    it("mantem a listagem completa com outro valor de status", async () => {
      window.history.pushState({}, "", "/?status=0");

      const { result } = renderHook(() => useGestaoUnidades());

      await waitFor(() => expect(result.current.carregando).toBe(false));

      expect(result.current.unidades).toHaveLength(10);
      expect(result.current.total).toBe(5985);
      expect(result.current.statusListagem).toBe("comDados");
    });
  });
});
