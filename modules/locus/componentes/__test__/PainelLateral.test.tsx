import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PainelLateral } from "../PainelLateral";
import { ComProvedores } from "@locus/testes/renderizarComTema";

function renderizarPainel(aberto: boolean, aoFechar = jest.fn()) {
  render(
    <ComProvedores>
      <PainelLateral
        aberto={aberto}
        titulo="Lotação"
        descricao="Confira os professores em atividades neste componente curricular."
        contexto="Componente curricular: Arte"
        aoFechar={aoFechar}
      >
        <p>conteudo do painel</p>
      </PainelLateral>
    </ComProvedores>,
  );
  return aoFechar;
}

describe("PainelLateral", () => {
  it("nao renderiza o conteudo quando fechado", () => {
    renderizarPainel(false);
    expect(screen.queryByText("conteudo do painel")).not.toBeInTheDocument();
  });

  it("renderiza titulo, descricao, contexto e conteudo quando aberto", () => {
    renderizarPainel(true);

    expect(screen.getByText("Lotação")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Confira os professores em atividades neste componente curricular.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Componente curricular: Arte")).toBeInTheDocument();
    expect(screen.getByText("conteudo do painel")).toBeInTheDocument();
  });

  it("dispara aoFechar ao clicar no botao de fechar", async () => {
    const aoFechar = renderizarPainel(true);

    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));

    expect(aoFechar).toHaveBeenCalledTimes(1);
  });
});
