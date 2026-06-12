import React from "react";
import { render, screen } from "@testing-library/react";
import GraficoBarrasDre from "../../components/GraficoBarrasDre";

jest.mock("@ant-design/charts", () => ({
  Bar: (props: { data: unknown[] }) => (
    <div data-testid="bar-chart" data-count={props.data.length} />
  ),
}));

describe("GraficoBarrasDre", () => {
  it("renderiza título, subtítulo e gráfico", () => {
    render(
      <GraficoBarrasDre
        title="Escolhas por DRE"
        subtitle="Distribuição consolidada"
        data={[
          { nome: "DRE Butantã", valor: 50 },
          { nome: "DRE Centro", valor: 30 },
        ]}
        tooltipLabel="escolhas"
        barColor="#002C8C"
      />
    );

    expect(screen.getByText("Escolhas por DRE")).toBeInTheDocument();
    expect(screen.getByText("Distribuição consolidada")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toHaveAttribute("data-count", "2");
  });
});
