// src/pages/ProcessosConvocacao/ProcessosConvocacao-submit.test.tsx
import { renderWithProviders } from "../test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProcessosConvocacao from "../index_old";
import { vi } from "vitest";
import dayjs from "dayjs";

// Mock apenas os dados externos da API
vi.mock("./hooks/useProcessosConvocacao", async () => {
  const actual = await vi.importActual("./hooks/useProcessosConvocacao");
  return {
    ...actual,
    useProcessosConvocacao: () => {
      const hook = actual.useProcessosConvocacao();

      // Criando spy para handleSub
      const mockHandleSub = vi.fn();
      return {
        ...hook,
        concursosOptions: [
          { value: "123", label: "Concurso 123", cargos: [{ value: "abc", label: "Cargo ABC" }] },
        ],
        processosConvocacaoData: { results: [], count: 0 },
        concursosIsLoading: false,
        processosConvocacaoIsLoading: false,
        handleSub: mockHandleSub,
      };
    },
  };
});

describe("ProcessosConvocacao - envia formulário e chama handleSubmit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("preenche Concurso, Cargo, Datas e clica em Pesquisar", async () => {
    renderWithProviders(<ProcessosConvocacao />);
    const user = userEvent.setup();

    // // Seleciona Concurso
    // const concursoDropdown = screen.getByText("Selecione o concurso");
    // await user.click(concursoDropdown);
    // const concursoOption = await screen.findByText("Concurso 123");
    // await user.click(concursoOption);

    // // Seleciona Cargo
    // const cargoDropdown = screen.getByText("Selecione o cargo");
    // await user.click(cargoDropdown);
    // const cargoOption = await screen.findByText("Cargo ABC");
    // await user.click(cargoOption);

    // Preenche Data Inicial
    const dataInicialInput = screen.getAllByPlaceholderText("Selecione a data inicial")[0];
    await user.clear(dataInicialInput);
    await user.type(dataInicialInput, "20/08/2025");
    await user.keyboard("{Enter}");

    // Preenche Data Final
    const dataFinalInput = screen.getAllByPlaceholderText("Selecione a data final")[0];
    await user.clear(dataFinalInput);
    await user.type(dataFinalInput, "25/08/2025");
    await user.keyboard("{Enter}");

    // Clica em Pesquisar
    const searchButton = screen.getByTestId("submit");
    await user.click(searchButton);

    // Espera que handleSub tenha sido chamado
    const { handleSub } = require("./hooks/useProcessosConvocacao").useProcessosConvocacao();
    await waitFor(() => {
      expect(handleSub).toHaveBeenCalledTimes(1);
      expect(handleSub).toHaveBeenCalledWith({
        concurso: "123",
        cargo: "abc",
        data_inicial: "2025-08-20T00:00:00.000Z",
        data_final: "2025-08-25T00:00:00.000Z",
      });
    });
  });
});
