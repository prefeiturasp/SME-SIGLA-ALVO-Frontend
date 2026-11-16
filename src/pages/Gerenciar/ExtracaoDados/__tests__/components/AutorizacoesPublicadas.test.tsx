import React from "react";
import { render, screen } from "@testing-library/react";
import AutorizacoesPublicadas from "../../components/AutorizacoesPublicadas";

describe("AutorizacoesPublicadas", () => {
  it("renderiza título, colunas e dados da tabela", () => {
    render(
      <AutorizacoesPublicadas
        data={[
          {
            key: "cargo-1",
            cargo: "Analista de Sistemas",
            quantidade: 32,
            data_autorizacao: "18/06/2026",
          },
        ]}
      />
    );

    expect(screen.getByText("Autorizações Publicadas")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Cargo" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Quantidade" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Última atualização" })
    ).toBeInTheDocument();
    expect(screen.getByText("Analista de Sistemas")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("18/06/2026")).toBeInTheDocument();
  });

  it("exibe mensagem de vazio quando não há dados", () => {
    render(<AutorizacoesPublicadas data={[]} />);

    expect(screen.getByText("Nenhum dado encontrado")).toBeInTheDocument();
  });
});
