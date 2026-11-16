import React from "react";
import { render, screen } from "@testing-library/react";
import TabelaVagasDre from "../../components/TabelaVagasDre";

describe("TabelaVagasDre", () => {
  it("renderiza colunas e dados da tabela", () => {
    render(
      <TabelaVagasDre
        data={[
          {
            key: "butanta",
            nome: "Butantã",
            escolhas: 50,
            vagas: 100,
            percentualPreenchimento: 50,
          },
        ]}
      />
    );

    expect(screen.getByText("Total de vagas ofertadas por DRE")).toBeInTheDocument();
    expect(screen.getByText("Butantã")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
