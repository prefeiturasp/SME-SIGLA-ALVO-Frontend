import { screen } from "@testing-library/react";
import { CabecalhoSecao } from "../CabecalhoSecao";
import { renderizarComTema } from "@locus/testes/renderizarComTema";

describe("CabecalhoSecao", () => {
  it("renderiza titulo, descricao e o slot de acao", () => {
    renderizarComTema(
      <CabecalhoSecao
        titulo="Unidades educacionais"
        descricao="Clique em uma unidade educacional."
        acao={<button type="button">Filtrar</button>}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Unidades educacionais" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Clique em uma unidade educacional."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filtrar" })).toBeInTheDocument();
  });

  it("omite descricao e acao quando nao informadas", () => {
    renderizarComTema(<CabecalhoSecao titulo="Somente titulo" />);

    expect(
      screen.getByRole("heading", { name: "Somente titulo" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
