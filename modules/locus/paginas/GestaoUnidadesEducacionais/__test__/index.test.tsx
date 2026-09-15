import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { LayoutBase } from "@locus/componentes/layout/LayoutBase";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { ComTema } from "@locus/testes/renderizarComTema";
import { GestaoUnidadesEducacionais } from "../index";

function renderNaCasca(children: ReactNode) {
  return render(
    <ComTema>
      <MemoryRouter initialEntries={[CAMINHOS.cadastroGestaoUnidades]}>
        <Routes>
          <Route element={<LayoutBase />}>
            <Route path={CAMINHOS.cadastroGestaoUnidades} element={children} />
          </Route>
        </Routes>
      </MemoryRouter>
    </ComTema>,
  );
}

describe("GestaoUnidadesEducacionais (integração com a casca)", () => {
  it("renderiza titulo, breadcrumb, painel e tabela dentro do layout base", async () => {
    renderNaCasca(<GestaoUnidadesEducacionais />);

    expect(
      screen.getByRole("heading", {
        name: "Gestão das unidades educacionais",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Início")).toBeInTheDocument();

    expect(
      await screen.findByText(
        "Painel de informações por componente curricular",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByText("Módulos")).toBeInTheDocument();

    expect(
      await screen.findByText("Mostrando 1-10 de 5.985 registro(s)"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Versão v2.3 - Homologada/),
    ).toBeInTheDocument();
  });
});
