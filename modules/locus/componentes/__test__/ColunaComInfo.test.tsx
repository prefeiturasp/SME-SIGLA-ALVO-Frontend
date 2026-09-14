import { screen } from "@testing-library/react";
import { ColunaComInfo } from "../ColunaComInfo";
import { renderizarComTema } from "@locus/testes/renderizarComTema";

describe("ColunaComInfo", () => {
  it("renderiza o titulo e expoe a dica de forma acessivel", () => {
    renderizarComTema(
      <ColunaComInfo titulo="Módulo" dica="Quantidade total de vagas." />,
    );

    expect(screen.getByText("Módulo")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Quantidade total de vagas." }),
    ).toBeInTheDocument();
  });
});
