import React from "react";
import { render, screen } from "@testing-library/react";
import IndicadorCard from "../../components/IndicadorCard";

describe("IndicadorCard", () => {
  it("renderiza valor formatado e descrição", () => {
    render(
      <IndicadorCard
        icon={<span data-testid="icon" />}
        title="Habilitados"
        value={1500}
        description="Total de pessoas aprovadas"
      />
    );

    expect(screen.getByText("Habilitados")).toBeInTheDocument();
    expect(screen.getByText("1.500")).toBeInTheDocument();
    expect(screen.getByText("Total de pessoas aprovadas")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renderiza breakdown quando informado", () => {
    render(
      <IndicadorCard
        icon={<span />}
        title="Lista específica"
        value={100}
        description="Distribuição por lista"
        breakdown={[
          { label: "Geral", value: 80 },
          { label: "PCD", value: 10 },
        ]}
      />
    );

    expect(screen.getByText("Geral:")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("PCD:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });
});
