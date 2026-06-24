import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ExtracaoDadosTela from "../ExtracaoDadosTela";
import {
  concursosOptionsMock,
  extracaoDadosFiltradoMock,
  extracaoDadosTodosMock,
} from "../testFixtures/extracaoDadosFixtures";

const mockConcursosOptions = concursosOptionsMock;
const mockExtracaoDadosTodos = extracaoDadosTodosMock;
const mockExtracaoDadosFiltrado = extracaoDadosFiltradoMock;

jest.mock("../../../../components/EstilosCompartilhados", () => {
  const actual = jest.requireActual("../../../../components/EstilosCompartilhados");
  const { createMockStyledSelect } = jest.requireActual("../testHelpers/testMocks");

  return {
    ...actual,
    StyledSelect: createMockStyledSelect(),
  };
});

jest.mock("../../../Base/BaseTela", () => {
  const { createMockBaseTela } = jest.requireActual("../testHelpers/testMocks");

  return {
    __esModule: true,
    default: createMockBaseTela(),
  };
});

jest.mock("../../../../hooks/useConcursos", () => ({
  useConcursos: () => ({
    concursosData: mockConcursosOptions,
    concursosOptionsIsLoading: false,
  }),
}));

jest.mock("../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao", () => ({
  __esModule: true,
  default: () => ({
    processosConvocacaoData: {
      results: [{ data_convocacao: "2024-03-15T00:00:00Z" }],
    },
    processosConvocacaoIsLoading: false,
  }),
}));

jest.mock("../hooks/useGetExtracaoDadosTodos", () => ({
  useGetExtracaoDadosTodos: () => ({
    extracaoDadosTodos: mockExtracaoDadosTodos,
    extracaoDadosTodosIsLoading: false,
  }),
}));

jest.mock("../hooks/useGetExtracaoDados", () => ({
  useGetExtracaoDados: (_uuid?: string, _ano?: string, enabled?: boolean) => ({
    extracaoDados: enabled ? mockExtracaoDadosFiltrado : undefined,
    extracaoDadosIsLoading: false,
  }),
}));

jest.mock("../components/GraficoBarrasDre", () => {
  const { createMockGraficoBarrasDre } = jest.requireActual("../testHelpers/testMocks");

  return {
    __esModule: true,
    default: createMockGraficoBarrasDre(),
  };
});

const renderTela = () => {
  const client = new QueryClient();
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <ExtracaoDadosTela />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ExtracaoDadosTela", () => {
  it("exibe visão consolidada com indicadores e seções principais", () => {
    renderTela();

    // Varios textos aparecem tanto na tela visivel quanto no conteudo oculto
    // capturado para o PDF (div fora da viewport), por isso usamos getAllBy*.
    expect(screen.getByRole("heading", { name: "Extração de dados" })).toBeInTheDocument();
    expect(screen.getAllByText("Indicadores").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Habilitados").length).toBeGreaterThan(0);
    expect(screen.getAllByText("1.000").length).toBeGreaterThan(0);
    expect(screen.getAllByTestId("grafico-Escolhas por DRE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Relatórios detalhados").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Autorizações Publicadas").length).toBeGreaterThan(0);
    expect(screen.getAllByRole("cell", { name: "Professor" }).length).toBeGreaterThan(0);
  });

  it("desabilita Filtrar até selecionar concurso e ano", async () => {
    const user = userEvent.setup();
    renderTela();

    const getFiltrarButton = () => screen.getAllByRole("button", { name: /filtrar/i })[0];

    expect(getFiltrarButton()).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("Selecione o concurso"), "uuid-concurso-1");

    expect(getFiltrarButton()).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("Selecione o ano"), "2024");

    expect(getFiltrarButton()).not.toBeDisabled();
  });

  it("aplica filtro e atualiza indicadores; limpar filtros restaura visão consolidada", async () => {
    const user = userEvent.setup();
    renderTela();

    await user.selectOptions(screen.getByLabelText("Selecione o concurso"), "uuid-concurso-1");
    await user.selectOptions(screen.getByLabelText("Selecione o ano"), "2024");

    await user.click(screen.getAllByRole("button", { name: /filtrar/i })[0]);

    expect(screen.getAllByText("200").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("1.000")).toHaveLength(0);

    await user.click(screen.getAllByRole("button", { name: /limpar filtros/i })[0]);

    expect(screen.getAllByText("1.000").length).toBeGreaterThan(0);
  });
});
