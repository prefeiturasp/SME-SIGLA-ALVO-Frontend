import { render, screen, fireEvent, act } from "@testing-library/react";
import ProcessosConvocacaoView from "../view";
import { useForm, type Resolver } from "react-hook-form";
import { vi } from "vitest";
import { renderWithProviders } from "../test-utils";
import { yupResolver } from "@hookform/resolvers/yup";
import useConvocacaoSchema from "../useConvocacaoSchema";
import userEvent from "@testing-library/user-event";

interface IFiltroProcessos {
  data_inicial?: string;
  data_final?: string;
}

const mockOnSubmit = vi.fn();
const mockOnReset = vi.fn();

const defaultValues: IFiltroProcessos = {
  data_inicial: "",
  data_final: "",
};

const RenderWithRealForm = () => {
  const form =  useForm<IFiltroProcessos>({
    defaultValues,
    resolver: yupResolver(useConvocacaoSchema()) as Resolver<IFiltroProcessos>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,    
  });

  return (
    <ProcessosConvocacaoView
      form={form}
      concursosQuery={{ data: [], isLoading: false }}
      processosQuery={{ data: { results: [], count: 0 }, isLoading: false }}
      onSubmit={mockOnSubmit}
      onReset={mockOnReset}
    />
  );
};





describe("ProcessosConvocacaoView com useForm real", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnReset.mockClear();
  });

  it("renderiza inputs e botões", () => {
    renderWithProviders(<RenderWithRealForm />);
    expect(screen.getByText("Pesquisar")).toBeInTheDocument();
    expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
  });


  
  

it("chama onSubmit com valores inputados no form", async () => {
  renderWithProviders(<RenderWithRealForm />);

  const dataInicialInput = screen.getByPlaceholderText("Selecione a data inicial");
  const dataFinalInput = screen.getByPlaceholderText("Selecione a data final");
  const submitButton = screen.getByTestId("submit");

  // Simula input via onChange do DatePicker
  await act(async () => {
    userEvent.type(dataInicialInput, "2025-08-20"); // data inicial
    userEvent.type(dataFinalInput, "2025-08-10");   // data final
  });

  // Clica no submit
  await act(async () => {
    userEvent.click(submitButton);
  });

  // Espera que onSubmit seja chamado com os valores reais inputados
  expect(mockOnSubmit).toHaveBeenCalledWith({
    data_inicial: "2025-08-20T00:00:00.000Z",
    data_final: "2025-08-10T00:00:00.000Z",
  });
});


  it("chama onReset ao clicar em Limpar filtros", () => {
    render(<RenderWithRealForm />);
    const resetButton = screen.getByText("Limpar filtros");

    act(() => {
      fireEvent.click(resetButton);
    });

    expect(mockOnReset).toHaveBeenCalled();
  });
});
