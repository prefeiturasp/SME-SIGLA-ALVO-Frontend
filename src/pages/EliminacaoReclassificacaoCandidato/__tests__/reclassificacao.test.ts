import {
  obterTagReclassificacao,
  possuiDesclassificacaoAtiva,
} from "../utils/reclassificacao";

describe("obterTagReclassificacao", () => {
  it("retorna null sem histórico", () => {
    expect(obterTagReclassificacao([])).toBeNull();
  });

  it("retorna desclassificado quando a mais recente não é mandado judicial", () => {
    expect(
      obterTagReclassificacao([{ desclassificado_de: "NNA", mandado_judicial: false }])
    ).toBe("desclassificado");
  });

  it("retorna reclassificado quando a mais recente é mandado judicial", () => {
    expect(
      obterTagReclassificacao([
        { desclassificado_de: "GERAL", nova_classificacao: "NNA", mandado_judicial: true },
        { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
      ])
    ).toBe("reclassificado");
  });
});

describe("possuiDesclassificacaoAtiva", () => {
  it("continua indicando desclassificação ativa independentemente da tag", () => {
    const historico = [
      { desclassificado_de: "NNA", nova_classificacao: "GERAL", mandado_judicial: false },
    ];
    expect(possuiDesclassificacaoAtiva(historico, "NNA")).toBe(true);
    expect(obterTagReclassificacao(historico)).toBe("desclassificado");
  });
});
