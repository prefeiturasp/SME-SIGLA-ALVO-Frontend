// src/pages/ProcessosConvocacao/ProcessosConvocacao.integration.test.tsx
import { renderWithProviders } from "./test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProcessosConvocacao from "./index";
import { vi } from "vitest";

      const mockHandleSub = vi.fn();
      const mockHandleReset = vi.fn();

// Mock do hook useProcessosConvocacao
vi.mock("./hooks/useProcessosConvocacao", async () => {
  const actual = await vi.importActual("./hooks/useProcessosConvocacao");
  return {
    ...actual,
    useProcessosConvocacao: () => {


      return {
        control: {},
        handleSubmit: (fn: any) => fn,
        formErrors: {},
        concursosOptions: [
          { value: "123", label: "Concurso 123", cargos: [{ value: "abc", label: "Cargo ABC" }] },
        ],
        concursosIsLoading: false,
        selectedConcurso: { value: "123", label: "Concurso 123", cargos: [{ value: "abc", label: "Cargo ABC" }] },
        processosConvocacaoData: { results: [], count: 0 },
        processosConvocacaoIsLoading: false,
        listRequest: { pagination: { page: 1, page_size: 10 } },
        onAntTableChange: vi.fn(),
        handleSub: mockHandleSub,
        handleReset: mockHandleReset,
        dayjs: require("dayjs"),
        watch: vi.fn(),
      };
    },
  };
});

describe("ProcessosConvocacao - fluxo real com datas e filtros", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preenche formulário com concurso, cargo e datas, e clica em Pesquisar", async () => {
    renderWithProviders(<ProcessosConvocacao />);
    const user = userEvent.setup();

 

    // Preenche data inicial
    const dataInicialInput = screen.getAllByPlaceholderText("Selecione a data inicial")[0];
    await user.clear(dataInicialInput);
    await user.type(dataInicialInput, "01/08/2025");
    await user.keyboard("{Enter}");

    // Preenche data final
    const dataFinalInput = screen.getAllByPlaceholderText("Selecione a data final")[0];
    await user.clear(dataFinalInput);
    await user.type(dataFinalInput, "10/08/2025");
    await user.keyboard("{Enter}");

    // Clica em Pesquisar
    const searchButton = screen.getByTestId("submit");
    await user.click(searchButton);

    // Verifica se handleSub foi chamado
     await waitFor(() => {
      expect(mockHandleSub).toHaveBeenCalledTimes(1);
      expect(mockHandleSub).toHaveBeenCalledWith({
 
        data_inicial: "2025-08-01T00:00:00.000Z",
        data_final: "2025-08-10T00:00:00.000Z",
      });
    });
  });
});
