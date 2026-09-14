import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MenuLateral } from "../MenuLateral";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { ComTema } from "@locus/testes/renderizarComTema";

function renderComRota(rota: string) {
  return render(
    <ComTema>
      <MemoryRouter initialEntries={[rota]}>
        <MenuLateral />
      </MemoryRouter>
    </ComTema>,
  );
}

describe("MenuLateral", () => {
  it("renderiza a logo LOCUS e os seis itens do menu", async () => {
    renderComRota(CAMINHOS.cadastroGestaoUnidades);

    expect(screen.getByRole("img", { name: "Locus" })).toBeInTheDocument();
    for (const rotulo of [
      "Cadastro",
      "Relatórios consultas",
      "Data base",
      "Vagas",
      "Remoção",
      "Integração",
    ]) {
      expect(await screen.findByText(rotulo)).toBeInTheDocument();
    }
  });

  it("destaca o item Cadastro quando a rota atual e de cadastro", async () => {
    renderComRota(CAMINHOS.cadastroGestaoUnidades);

    await waitFor(() => {
      const itemCadastro = screen.getByText("Cadastro").closest("li");
      expect(itemCadastro?.className).toMatch(/selected/);
    });
  });

  it("nao destaca Cadastro quando a rota atual e de outra secao", async () => {
    renderComRota("/vagas/listagem");

    await waitFor(() => {
      const itemCadastro = screen.getByText("Cadastro").closest("li");
      expect(itemCadastro?.className ?? "").not.toMatch(/selected/);
    });
  });
});
