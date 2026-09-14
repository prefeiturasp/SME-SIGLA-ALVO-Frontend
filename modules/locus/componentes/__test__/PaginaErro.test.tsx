import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "antd";
import { ComTema } from "@locus/testes/renderizarComTema";
import { PaginaErro } from "../PaginaErro";

describe("PaginaErro", () => {
  it("mostra o titulo recebido", () => {
    render(
      <ComTema>
        <PaginaErro titulo="Não encontramos esta página..." />
      </ComTema>,
    );

    expect(
      screen.getByText("Não encontramos esta página..."),
    ).toBeInTheDocument();
  });

  it("mostra a descricao quando recebida", () => {
    render(
      <ComTema>
        <PaginaErro titulo="Título" descricao="Detalhe do problema." />
      </ComTema>,
    );

    expect(screen.getByText("Detalhe do problema.")).toBeInTheDocument();
  });

  it("nao renderiza acao quando nao ha slot", () => {
    render(
      <ComTema>
        <PaginaErro titulo="Título" />
      </ComTema>,
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renderiza a acao recebida e responde ao clique", async () => {
    const aoClicar = jest.fn();
    const usuario = userEvent.setup();

    render(
      <ComTema>
        <PaginaErro
          titulo="Título"
          acao={
            <Button type="primary" onClick={aoClicar}>
              Ir para tela inicial
            </Button>
          }
        />
      </ComTema>,
    );

    await usuario.click(
      screen.getByRole("button", { name: /Ir para tela inicial/ }),
    );

    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it("aceita uma ilustracao customizada no lugar da padrao", () => {
    render(
      <ComTema>
        <PaginaErro
          titulo="Título"
          ilustracao={<img alt="Ilustração customizada" src="/exemplo.png" />}
        />
      </ComTema>,
    );

    expect(
      screen.getByRole("img", { name: "Ilustração customizada" }),
    ).toBeInTheDocument();
  });
});
