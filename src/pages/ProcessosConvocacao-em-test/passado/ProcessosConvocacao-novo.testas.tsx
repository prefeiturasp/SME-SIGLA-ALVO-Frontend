import { render, screen, fireEvent } from "@testing-library/react";
import ProcessosConvocacaoContainer from "../index";
import { vi } from "vitest";
import { renderWithProviders } from "../test-utils";

vi.mock("../hooks/useProcessosConvocacaoForm", () => ({
  defaultValues: {
    concurso: undefined,
    cargo: undefined,
    data_inicial: "",
    data_final: "",
  },
  useProcessosConvocacaoForm: () => ({
    control: {},
    handleSubmit: (fn: any) => fn,
    reset: vi.fn(),
    formState: { errors: {} },
  }),
}));

vi.mock("../hooks/useProcessosConvocacaoData", () => ({
  useProcessosConvocacaoData: () => ({
    concursosQuery: { data: [], isLoading: false },
    processosQuery: { data: { results: [], count: 0 }, isLoading: false },
  }),
}));

describe("ProcessosConvocacaoContainer", () => {
  it("renderiza view e botões", () => {
    renderWithProviders(<ProcessosConvocacaoContainer />);
    expect(screen.getByText("Pesquisar")).toBeInTheDocument();
    expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
  });
});
