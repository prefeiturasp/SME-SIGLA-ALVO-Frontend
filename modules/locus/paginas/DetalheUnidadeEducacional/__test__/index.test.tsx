import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { LayoutBase } from "@locus/componentes/layout/LayoutBase";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { reiniciarModulosSalvos } from "@locus/servicos/recursos/unidadesEducacionais";
import { ComProvedores } from "@locus/testes/renderizarComTema";
import { DetalheUnidadeEducacional } from "../index";
const ESPERA = { timeout: 5000 };

function renderNaCasca(codigo = "091488") {
  return render(
    <ComProvedores rota={`/locus/cadastro/unidade-educacional/${codigo}`}>
      <Routes>
        <Route element={<LayoutBase />}>
          <Route
            path={CAMINHOS.cadastroDetalheUE}
            element={<DetalheUnidadeEducacional />}
          />
        </Route>
      </Routes>
    </ComProvedores>,
  );
}

describe("DetalheUnidadeEducacional (integração com a casca)", () => {
  beforeEach(() => reiniciarModulosSalvos());

  it("renderiza cabecalho, subtitulo e cartoes dentro do layout", async () => {
    renderNaCasca();

    expect(
      await screen.findByRole(
        "heading",
        { name: "CECI Cidade Tiradentes" },
        ESPERA,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("DRE Itaquera | Código 091488"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Informações da unidade educacional"),
    ).toBeInTheDocument();
    const informacoes = screen
      .getByText("Informações da unidade educacional")
      .closest(".ant-card") as HTMLElement;
    expect(within(informacoes).getByText("Módulos")).toBeInTheDocument();
    expect(within(informacoes).getByText("Lotação")).toBeInTheDocument();
    expect(within(informacoes).getByText("Afastados")).toBeInTheDocument();
    expect(within(informacoes).getByText("Vagas")).toBeInTheDocument();

    const breadcrumb = document.querySelector(
      ".ant-breadcrumb",
    ) as HTMLElement;
    expect(within(breadcrumb).getByText("Início")).toBeInTheDocument();
    expect(within(breadcrumb).getByText("Cadastro")).toBeInTheDocument();
    expect(
      within(breadcrumb).getByText("Unidade Educacional"),
    ).toBeInTheDocument();
  });

  it("mantem Salvar desabilitado ate existir alteracao", async () => {
    renderNaCasca();

    const salvar = await screen.findByRole(
      "button",
      { name: "Salvar" },
      ESPERA,
    );
    expect(salvar).toBeDisabled();

    const campoArte = await screen.findByLabelText("Módulo de Arte", {}, ESPERA);
    await userEvent.clear(campoArte);
    await userEvent.type(campoArte, "9");

    await waitFor(() => expect(salvar).toBeEnabled());
  });

  it("abre o painel de lotacao ao clicar em um numero diferente de zero", async () => {
    renderNaCasca();

    await userEvent.click(
      await screen.findByLabelText("Lotação de Arte", {}, ESPERA),
    );

    expect(
      await screen.findByText(
        "Confira os professores em atividades neste componente curricular.",
        {},
        ESPERA,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Componente curricular: Arte")).toBeInTheDocument();
    expect(screen.getByText("João da Silva")).toBeInTheDocument();
    expect(screen.getByText("Tipo de vaga")).toBeInTheDocument();
  });

  it("exibe o estado de nao encontrada para codigo inexistente", async () => {
    renderNaCasca("999999");

    expect(
      await screen.findByText(
        "Unidade educacional não encontrada",
        {},
        ESPERA,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Voltar para a listagem" }),
    ).toBeInTheDocument();
  });

  describe("unidade indisponivel (status=3)", () => {
    afterEach(() => {
      window.history.pushState({}, "", "/");
    });

    function renderIndisponivel() {
      window.history.pushState({}, "", "/?status=3");
      return renderNaCasca("093703");
    }

    it("mostra o cabecalho da gestao de UEs", async () => {
      renderIndisponivel();

      expect(
        await screen.findByRole(
          "heading",
          { name: "Gestão das unidades educacionais" },
          ESPERA,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Registrar UE/ }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Exportar relatório/ }),
      ).not.toBeInTheDocument();
    });

    it("mostra o card de informacao indisponivel", async () => {
      renderIndisponivel();

      expect(
        await screen.findByText(
          "Esta informação não está mais disponível!",
          {},
          ESPERA,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Atualizar página/ }),
      ).toBeInTheDocument();
    });

    it("nao mostra os cartoes do detalhe nem o erro de nao encontrada", async () => {
      renderIndisponivel();

      await screen.findByText(
        "Esta informação não está mais disponível!",
        {},
        ESPERA,
      );

      expect(
        screen.queryByText("Informações da unidade educacional"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Unidade educacional não encontrada"),
      ).not.toBeInTheDocument();
    });
  });

});
