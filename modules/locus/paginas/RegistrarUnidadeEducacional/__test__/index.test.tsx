import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { App as AntdApp } from "antd";
import { LayoutBase } from "@locus/componentes/layout/LayoutBase";
import { CAMINHOS } from "@locus/rotas/caminhos";
import { ComTema } from "@locus/testes/renderizarComTema";
import { RegistrarUnidadeEducacional } from "../index";

function renderNaCasca(children: ReactNode) {
  return render(
    <ComTema>
      <AntdApp>
        <MemoryRouter initialEntries={[CAMINHOS.cadastroRegistrarUE]}>
          <Routes>
            <Route element={<LayoutBase />}>
              <Route path={CAMINHOS.cadastroRegistrarUE} element={children} />
              <Route
                path={CAMINHOS.cadastroGestaoUnidades}
                element={<div>Gestão</div>}
              />
            </Route>
          </Routes>
        </MemoryRouter>
      </AntdApp>
    </ComTema>,
  );
}

describe("RegistrarUnidadeEducacional (integração com a casca)", () => {
  it("renderiza titulo, breadcrumb e cards do formulario", () => {
    renderNaCasca(<RegistrarUnidadeEducacional />);

    expect(
      screen.getByRole("heading", {
        name: "Registrar nova Unidade Educacional",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Cadastro" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Registrar Unidade Educacional")).toBeInTheDocument();

    expect(screen.getByText("Dados da unidade educacional")).toBeInTheDocument();
    expect(
      screen.getByText("Características da unidade educacional"),
    ).toBeInTheDocument();
    expect(screen.getByText("Componentes curriculares")).toBeInTheDocument();
    expect(screen.getByText("Nenhum componente adicionado")).toBeInTheDocument();
    expect(screen.getByLabelText("Contabilizar UE")).toBeChecked();
  });

  it("mantem campos de dados da unidade desabilitados e preenche ao consultar lotacao", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    expect(screen.getByPlaceholderText("Exemplo: 123")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Tipo da unidade" })).toBeDisabled();
    expect(
      screen.getByRole("combobox", {
        name: "Diretoria Regional de Educação (DRE)",
      }),
    ).toBeDisabled();
    expect(
      screen.getByPlaceholderText("Preenchido automaticamente após consulta"),
    ).toBeDisabled();

    await usuario.type(screen.getByPlaceholderText("Exemplo: 123"), "123");
    await usuario.click(screen.getByRole("button", { name: "Consultar" }));

    expect(
      screen.getByDisplayValue("EMEF Prof. Maria da Silva"),
    ).toBeInTheDocument();
    expect(screen.getByText("EMEF")).toBeInTheDocument();
    expect(screen.getByText("Itaquera")).toBeInTheDocument();
  });

  it("mantem campo de ano da municipalizacao visivel e habilita ao ativar escola municipalizada", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    const campoAno = screen.getByRole("combobox", {
      name: "Ano da municipalização",
    });

    expect(screen.getByText("Ano da municipalização")).toBeInTheDocument();
    expect(campoAno).toBeDisabled();

    await usuario.click(screen.getByLabelText("Escola Municipalizada"));

    expect(campoAno).toBeEnabled();
  });

  it("exibe textarea de motivo ao desabilitar contabilizar UE", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    expect(
      screen.queryByLabelText("Por que a unidade não deve ser contabilizada?"),
    ).not.toBeInTheDocument();

    await usuario.click(screen.getByLabelText("Contabilizar UE"));

    expect(
      screen.getByLabelText("Por que a unidade não deve ser contabilizada?"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite o motivo da não contabilização..."),
    ).toBeInTheDocument();
  });

  it("valida visualmente o motivo obrigatorio ao registrar sem preencher", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    await usuario.type(screen.getByPlaceholderText("Exemplo: 123"), "123");
    await usuario.click(screen.getByRole("button", { name: "Consultar" }));
    await usuario.click(screen.getByLabelText("Contabilizar UE"));
    await usuario.click(screen.getByRole("button", { name: "Registrar UE" }));

    expect(await screen.findAllByText("Campo obrigatório")).not.toHaveLength(0);
    expect(
      screen.getByLabelText("Por que a unidade não deve ser contabilizada?"),
    ).toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Erro")).not.toBeInTheDocument();
  });

  it("valida codigo de lotacao obrigatorio e incorreto com Zod", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    await usuario.click(screen.getByRole("button", { name: "Consultar" }));
    expect(await screen.findByText("Campo obrigatório")).toBeInTheDocument();

    await usuario.type(screen.getByPlaceholderText("Exemplo: 123"), "999");
    await usuario.click(screen.getByRole("button", { name: "Consultar" }));
    expect(
      await screen.findByText("Código de lotação incorreto"),
    ).toBeInTheDocument();
  });

  it("valida componente curricular obrigatorio ao adicionar", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    await usuario.click(
      screen.getByRole("button", { name: "Adicionar componente" }),
    );

    expect(await screen.findByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("bloqueia registro sem consulta e exibe campos obrigatorios", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    await usuario.click(screen.getByRole("button", { name: "Registrar UE" }));

    const mensagens = await screen.findAllByText("Campo obrigatório");
    expect(mensagens).toHaveLength(2);
    expect(screen.getByPlaceholderText("Exemplo: 123")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(document.querySelector(".ant-select-status-error")).toBeTruthy();
    expect(screen.queryByText("Erro")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        "Não conseguimos salvar as alterações. Por favor, tente novamente!",
      ),
    ).not.toBeInTheDocument();
  });

  it("bloqueia registro com lotacao consultada sem componente curricular", async () => {
    const usuario = userEvent.setup();
    renderNaCasca(<RegistrarUnidadeEducacional />);

    await usuario.type(screen.getByPlaceholderText("Exemplo: 123"), "123");
    await usuario.click(screen.getByRole("button", { name: "Consultar" }));
    await usuario.click(screen.getByRole("button", { name: "Registrar UE" }));

    expect(await screen.findByText("Campo obrigatório")).toBeInTheDocument();
    expect(document.querySelector(".ant-select-status-error")).toBeTruthy();
    expect(screen.queryByText("Sucesso!")).not.toBeInTheDocument();
  });
});
