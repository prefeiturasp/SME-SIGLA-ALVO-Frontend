import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UnidadesSemDados } from "../UnidadesSemDados";
import { renderizarComTema } from "@locus/testes/renderizarComTema";

describe("UnidadesSemDados", () => {
  it("renderiza titulo, descricao e o slot de acao", () => {
    renderizarComTema(
      <UnidadesSemDados
        titulo="Não há unidades educacionais cadastradas"
        descricao="Que tal registrar a primeira UE agora?"
        acao={<button type="button">Registrar UE</button>}
      />,
    );

    expect(
      screen.getByText("Não há unidades educacionais cadastradas"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Que tal registrar a primeira UE agora?"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Registrar UE" }),
    ).toBeInTheDocument();
  });

  it("omite descricao e acao quando nao informadas", () => {
    renderizarComTema(
      <UnidadesSemDados titulo="Não encontramos dados para esta busca" />,
    );

    expect(
      screen.getByText("Não encontramos dados para esta busca"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("aciona o callback da acao no clique", async () => {
    const aoAcionar = jest.fn();
    const usuario = userEvent.setup();

    renderizarComTema(
      <UnidadesSemDados
        titulo="Sem dados"
        acao={
          <button type="button" onClick={aoAcionar}>
            Registrar UE
          </button>
        }
      />,
    );

    await usuario.click(screen.getByRole("button", { name: "Registrar UE" }));

    expect(aoAcionar).toHaveBeenCalledTimes(1);
  });

  it("usa a ilustracao informada em vez da padrao", () => {
    renderizarComTema(
      <UnidadesSemDados
        titulo="Sem dados"
        ilustracao={<img alt="Ilustracao personalizada" src="vazio.png" />}
      />,
    );

    expect(
      screen.getByRole("img", { name: "Ilustracao personalizada" }),
    ).toBeInTheDocument();
  });
});
