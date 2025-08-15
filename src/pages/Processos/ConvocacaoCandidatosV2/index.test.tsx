import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import ProcessosConvocacaoV2 from ".";
import * as ReactQuery from "@tanstack/react-query";
import { renderWithProviders } from "../../../utils/test-utils";

const mockSetListRequest = vi.fn();

// mocks dos hooks externos
vi.mock("../../../hooks/useListRequest", () => ({
  __esModule: true,
  default: vi.fn(() => ({
    listRequest: { pagination: { page: 1, page_size: 10 } },
    setListRequest: mockSetListRequest,
    onAntTableChange: vi.fn(),
  })),
  removeUndefinedFields: (obj: any) => obj,
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../../services", () => ({
  API: {
    Convocacao: {
      getConcursosOptions: vi.fn(),
      getProcessosConvocacao: vi.fn(),
    },
  },
}));

describe("ProcessosConvocacaoV2", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(ReactQuery, "useQuery").mockImplementation(({ queryKey }) => {
      if (queryKey[0] === "getConcursosOptions") {
        return {
          data: {
            concursos: [
              { value: "c1", label: "Concurso 1" },
              { value: "c2", label: "Concurso 2" },
            ],
            cargos: [
              { value: "g1", label: "Cargo 1" },
              { value: "g2", label: "Cargo 2" },
            ],
          },
          isLoading: false,
        };
      }
      if (queryKey[0] === "getProcessosConvocacao") {
        return { data: { results: [], count: 0 }, isLoading: false };
      }
      return { data: null, isLoading: false };
    });
  });

  it("envia filtros corretos no submit", () => {
    renderWithProviders(<ProcessosConvocacaoV2 />);

    const concursoSelect = screen.getByLabelText("Concurso");
    fireEvent.mouseDown(concursoSelect);
    fireEvent.click(screen.getByRole("option", { name: "Concurso 1" }));

    const dataInicioInput = screen.getByLabelText("Data Inicial");
    const dataFimInput = screen.getByLabelText("Data Final");

    fireEvent.change(dataInicioInput, { target: { value: "2025-08-20" } });
    fireEvent.change(dataFimInput, { target: { value: "2025-08-28" } });

    const cargoSelect = screen.getByLabelText("Cargo");
    fireEvent.mouseDown(cargoSelect);
    fireEvent.click(screen.getByRole("option", { name: "Cargo 1" }));

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(mockSetListRequest).toHaveBeenCalledWith(expect.any(Function));
  });

  it("mostra erro se data inicial > data final", () => {
    renderWithProviders(<ProcessosConvocacaoV2 />);

    const dataInicioInput = screen.getByLabelText("Data Inicial");
    const dataFimInput = screen.getByLabelText("Data Final");

    fireEvent.change(dataInicioInput, { target: { value: "2025-08-30" } });
    fireEvent.change(dataFimInput, { target: { value: "2025-08-20" } });

    fireEvent.click(screen.getByTestId("submit-button"));

    expect(
      screen.getByText("Data final não pode ser menor que data inicial")
    ).toBeInTheDocument();
  });
});
