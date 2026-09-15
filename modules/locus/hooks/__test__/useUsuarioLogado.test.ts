import { renderHook } from "@testing-library/react";
import { useUsuarioLogado } from "../useUsuarioLogado";
import { USUARIO_MOCK } from "@locus/servicos/recursos/autenticacao";

describe("useUsuarioLogado", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("retorna o usuario mock quando nao ha nada no storage", () => {
    const { result } = renderHook(() => useUsuarioLogado());

    expect(result.current.rf).toBe(USUARIO_MOCK.rf);
    expect(result.current.nome).toBe(USUARIO_MOCK.nome);
  });

  it("retorna o usuario gravado no storage quando presente", () => {
    localStorage.setItem(
      "USUARIO",
      JSON.stringify({ rf: "7654321", nome: "Ana Lima" }),
    );

    const { result } = renderHook(() => useUsuarioLogado());

    expect(result.current.rf).toBe("7654321");
    expect(result.current.nome).toBe("Ana Lima");
  });
});
