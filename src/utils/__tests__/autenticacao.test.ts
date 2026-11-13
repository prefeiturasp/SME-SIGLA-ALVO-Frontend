import {
  aplicarSessaoDaQuery,
  encerrarSessao,
  URL_LOGIN_PORTAL,
} from "../autenticacao";

describe("autenticacao", () => {
  beforeEach(() => {
    localStorage.clear();
    window.__ENV__ = {};
    window.history.replaceState(null, "", "/alvo/");
  });

  it("expõe a URL do login do portal", () => {
    expect(URL_LOGIN_PORTAL).toBe("/login");
  });

  it("limpa a sessão e chama o callback ao encerrar", () => {
    const aoFinalizar = jest.fn();
    localStorage.setItem("TOKEN", "token");
    localStorage.setItem("USUARIO", "123");
    localStorage.setItem("NOME_USUARIO", "Nome");

    encerrarSessao(aoFinalizar);

    expect(localStorage.getItem("TOKEN")).toBeNull();
    expect(localStorage.getItem("USUARIO")).toBeNull();
    expect(localStorage.getItem("NOME_USUARIO")).toBeNull();
    expect(aoFinalizar).toHaveBeenCalledTimes(1);
  });

  describe("aplicarSessaoDaQuery", () => {
    it("não faz nada quando ENVIRONMENT não é local", () => {
      const aplicou = aplicarSessaoDaQuery(
        "?TOKEN=abc&USUARIO=1&NOME_USUARIO=Vitor",
        "qa",
      );

      expect(aplicou).toBe(false);
      expect(localStorage.getItem("TOKEN")).toBeNull();
    });

    it("não faz nada quando ENVIRONMENT está ausente", () => {
      const aplicou = aplicarSessaoDaQuery(
        "?TOKEN=abc&USUARIO=1&NOME_USUARIO=Vitor",
        undefined,
      );

      expect(aplicou).toBe(false);
      expect(localStorage.getItem("TOKEN")).toBeNull();
    });

    it("grava TOKEN, USUARIO e NOME_USUARIO quando não existem e limpa a query", () => {
      const search =
        "?TOKEN=abc.def&USUARIO=46231288064&NOME_USUARIO=Vitor%20Campos";

      const aplicou = aplicarSessaoDaQuery(search, "local");

      expect(aplicou).toBe(true);
      expect(localStorage.getItem("TOKEN")).toBe("abc.def");
      expect(localStorage.getItem("USUARIO")).toBe("46231288064");
      expect(localStorage.getItem("NOME_USUARIO")).toBe("Vitor Campos");
      expect(window.location.search).toBe("");
    });

    it("não sobrescreve valores já existentes no localStorage", () => {
      localStorage.setItem("TOKEN", "token-atual");
      localStorage.setItem("USUARIO", "111");
      localStorage.setItem("NOME_USUARIO", "Ja Existe");

      const aplicou = aplicarSessaoDaQuery(
        "?TOKEN=novo&USUARIO=222&NOME_USUARIO=Novo%20Nome",
        "local",
      );

      expect(aplicou).toBe(false);
      expect(localStorage.getItem("TOKEN")).toBe("token-atual");
      expect(localStorage.getItem("USUARIO")).toBe("111");
      expect(localStorage.getItem("NOME_USUARIO")).toBe("Ja Existe");
    });

    it("preenche só os campos ausentes", () => {
      localStorage.setItem("TOKEN", "token-atual");

      const aplicou = aplicarSessaoDaQuery(
        "?TOKEN=novo&USUARIO=46231288064&NOME_USUARIO=Vitor%20Campos",
        "local",
      );

      expect(aplicou).toBe(true);
      expect(localStorage.getItem("TOKEN")).toBe("token-atual");
      expect(localStorage.getItem("USUARIO")).toBe("46231288064");
      expect(localStorage.getItem("NOME_USUARIO")).toBe("Vitor Campos");
    });
  });
});
