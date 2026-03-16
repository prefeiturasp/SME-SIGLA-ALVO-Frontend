import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ExportacaoDadosTela from "../ExportacaoDadosTela";

jest.mock("../components/ExportacaoVagasFormTab", () => {
  return function ExportacaoVagasFormTabMock(props: any) {
    return <div data-testid={`exportacao-vagas-tab-${props.tipo}`} />;
  };
});

jest.mock("../components/ExportacaoCandidatosFormTab", () => {
  return function ExportacaoCandidatosFormTabMock() {
    return <div data-testid="exportacao-candidatos-tab" />;
  };
});

jest.mock("../../Base/BaseTela", () => {
  return function BaseTelaMock({ children, title, breadcrumbItems }: any) {
    return (
      <div>
        <h1>{title}</h1>
        <nav data-testid="breadcrumb">
          {breadcrumbItems.map((item: any, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={index}>{item.title}</span>
          ))}
        </nav>
        {children}
      </div>
    );
  };
});

jest.mock("../ImportacaoDados/styles", () => ({
  StyledTabs: ({ activeKey, onChange, items }: any) => (
    <div>
      <div data-testid="tabs">
        {items.map((item: any) => (
          <button
            key={item.key}
            type="button"
            data-testid={`tab-${item.key}`}
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div data-testid="active-tab">{activeKey}</div>
      {items.find((i: any) => i.key === activeKey)?.children}
    </div>
  ),
}));

const renderComponent = () =>
  render(
    <BrowserRouter>
      <ExportacaoDadosTela />
    </BrowserRouter>,
  );

describe("ExportacaoDadosTela", () => {
  it("deve renderizar título e breadcrumbs", () => {
    renderComponent();

    expect(screen.getByText("Exportação de Dados")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Processos")).toBeInTheDocument();
    expect(screen.getByText("Exportação de Dados")).toBeInTheDocument();
  });

  it("deve iniciar na aba VAGAS_PROCESSO com componente correto", () => {
    renderComponent();

    expect(screen.getByTestId("active-tab")).toHaveTextContent("VAGAS_PROCESSO");
    expect(screen.getByTestId("exportacao-vagas-tab-vagas-processo")).toBeInTheDocument();
  });

  it("deve alternar entre abas e renderizar children corretos", () => {
    renderComponent();

    const tabVagasProcesso = screen.getByTestId("tab-VAGAS_PROCESSO");
    const tabCandidatosProcesso = screen.getByTestId("tab-CANDIDATOS_PROCESSO");
    const tabVagasSigpec = screen.getByTestId("tab-VAGAS_SIGPEC");

    // Aba inicial
    expect(screen.getByTestId("active-tab")).toHaveTextContent("VAGAS_PROCESSO");
    expect(screen.getByTestId("exportacao-vagas-tab-vagas-processo")).toBeInTheDocument();

    // Muda para candidatos
    tabCandidatosProcesso.click();
    expect(screen.getByTestId("active-tab")).toHaveTextContent("CANDIDATOS_PROCESSO");
    expect(screen.getByTestId("exportacao-candidatos-tab")).toBeInTheDocument();

    // Muda para vagas SIGPEC
    tabVagasSigpec.click();
    expect(screen.getByTestId("active-tab")).toHaveTextContent("VAGAS_SIGPEC");
    expect(screen.getByTestId("exportacao-vagas-tab-vagas-sigpec")).toBeInTheDocument();

    // Volta para vagas processo
    tabVagasProcesso.click();
    expect(screen.getByTestId("active-tab")).toHaveTextContent("VAGAS_PROCESSO");
  });
});

