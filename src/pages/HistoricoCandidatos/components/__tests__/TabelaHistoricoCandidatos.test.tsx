import React from "react";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme as appTheme } from "@/theme";
import TabelaHistoricoCandidatos from "../TabelaHistoricoCandidatos";
import type { LinhaHistoricoCandidatos } from "../../tipos";

const contagem = { total: 10, geral: 6, pcd: 2, nna: 2 };

const linha: LinhaHistoricoCandidatos = {
  key: "linha-1",
  descricao: "Processo Teste",
  data: "10/03/2025",
  convocados: contagem,
  escolhas: contagem,
  naoEscolhas: contagem,
  reconvocacao: contagem,
};

const renderTabela = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={appTheme as any}>{ui}</ThemeProvider>);

describe("TabelaHistoricoCandidatos", () => {
  it("renderiza cabeçalhos e dados com a coluna de descrição", () => {
    const { container } = renderTabela(
      <TabelaHistoricoCandidatos data={[linha]} />,
    );

    expect(screen.getByText("Processo Teste")).toBeInTheDocument();
    expect(screen.getByText("Convocados")).toBeInTheDocument();
    expect(screen.getByText("Escolhas")).toBeInTheDocument();
    expect(screen.getByText("Não Escolhas")).toBeInTheDocument();
    expect(screen.getByText("Reconvocação")).toBeInTheDocument();
    expect(screen.getAllByText("10").length).toBeGreaterThan(0);

    const thead = container.querySelector(".ant-table-thead");
    expect(thead).toBeTruthy();
    const headerRows = thead!.querySelectorAll("tr");
    expect(headerRows.length).toBeGreaterThanOrEqual(2);

    // descrição como grupo+filho: sem rowspan=2 (cores distintas header/subheader)
    expect(thead!.querySelector('th[rowspan="2"]')).toBeNull();
    expect(headerRows[0].querySelectorAll("th").length).toBeGreaterThan(0);
    expect(headerRows[1].querySelectorAll("th").length).toBeGreaterThan(0);
  });

  it("omite a coluna de descrição quando mostrarDescricao=false", () => {
    const { container } = renderTabela(
      <TabelaHistoricoCandidatos data={[linha]} mostrarDescricao={false} />,
    );

    expect(screen.queryByText("Processo Teste")).not.toBeInTheDocument();
    expect(screen.getByText("Convocados")).toBeInTheDocument();

    const thead = container.querySelector(".ant-table-thead");
    expect(thead!.querySelector('th[rowspan="2"]')).toBeNull();
  });

  it("aplica classes de borda nos grupos Escolhas e Não Escolhas", () => {
    const { container } = renderTabela(
      <TabelaHistoricoCandidatos data={[linha]} />,
    );

    expect(container.querySelector("th.header-escolhas")).toBeInTheDocument();
    expect(container.querySelector("th.header-nao-escolhas")).toBeInTheDocument();
    expect(
      container.querySelectorAll("th.borda-grupo-esquerda").length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll("th.borda-grupo-direita").length,
    ).toBeGreaterThan(0);
  });
});
