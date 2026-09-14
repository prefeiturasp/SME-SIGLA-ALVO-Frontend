import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { ComProvedores } from "@locus/testes/renderizarComTema";
import { NaoEncontrado } from "../index";

function renderizar() {
  return render(
    <ComProvedores rota={CAMINHOS.naoEncontrado}>
      <Routes>
        <Route path="*" element={<NaoEncontrado />} />
        <Route
          path={CAMINHOS.cadastroGestaoUnidades}
          element={<h1>Gestão das unidades educacionais (listagem)</h1>}
        />
      </Routes>
    </ComProvedores>,
  );
}

describe("NaoEncontrado", () => {
  it("mostra o titulo e a orientacao da pagina nao encontrada", () => {
    renderizar();

    expect(
      screen.getByText("Não encontramos esta página..."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A página que você procura não está disponível/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Volte à tela inicial para continuar/),
    ).toBeInTheDocument();
  });

  it("nao renderiza cabecalho de pagina", () => {
    renderizar();

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Registrar UE/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Exportar relatório/ }),
    ).not.toBeInTheDocument();
  });

  it("oferece o botao de ir para a tela inicial", () => {
    renderizar();

    expect(
      screen.getByRole("button", { name: /Ir para tela inicial/ }),
    ).toBeInTheDocument();
  });

  it("navega para a listagem ao clicar em ir para tela inicial", async () => {
    const usuario = userEvent.setup();
    renderizar();

    await usuario.click(
      screen.getByRole("button", { name: /Ir para tela inicial/ }),
    );

    expect(
      screen.getByText("Gestão das unidades educacionais (listagem)"),
    ).toBeInTheDocument();
  });
});
