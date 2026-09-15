import { montarLinhasAgrupadas } from "../utilitarios";
import { componentesDetalhe } from "../dados/dadosEstaticos";

describe("montarLinhasAgrupadas", () => {
  it("intercala os cabecalhos de grupo na ordem definida", () => {
    const linhas = montarLinhasAgrupadas(componentesDetalhe);
    const grupos = linhas.filter((linha) => linha.tipo === "grupo");

    expect(grupos.map((grupo) => grupo.rotulo)).toEqual([
      "Base comum",
      "Linguagens adicionais",
    ]);
    expect(linhas[0].tipo).toBe("grupo");
  });

  it("mantem todos os componentes", () => {
    const linhas = montarLinhasAgrupadas(componentesDetalhe);
    expect(linhas.filter((l) => l.tipo === "componente")).toHaveLength(22);
  });

  it("alterna a zebra contando apenas linhas de componente", () => {
    const linhas = montarLinhasAgrupadas(componentesDetalhe);
    const classes = linhas
      .filter((linha) => linha.tipo === "componente")
      .map((linha) => linha.classe);

    expect(classes.slice(0, 4)).toEqual(["", "linhaPar", "", "linhaPar"]);
  });

  it("omite grupos sem componentes", () => {
    const somenteBase = componentesDetalhe.filter(
      (componente) => componente.grupo === "baseComum",
    );
    const linhas = montarLinhasAgrupadas(somenteBase);

    expect(linhas.filter((linha) => linha.tipo === "grupo")).toHaveLength(1);
  });
});
