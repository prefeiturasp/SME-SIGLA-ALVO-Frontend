import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, vi } from "vitest";
import { useForm } from "react-hook-form";
import ProcessosConvocacaoView from "./ProcessosConvocacaoView";
import type { IFiltroProcessos } from "../../services/resources/convocacao/IConvocacao";
import { renderWithProviders } from "./test-utils";
import React from "react";

  const concursosOptions = {
    concursos: [{ label: "Concurso 1", value: "c1" }],
    cargos: [{ label: "Cargo 1", value: "cg1" }],
  };

function renderComponent(submitSpy = vi.fn(), resetSpy = vi.fn()) {
  const form = useForm<IFiltroProcessos>({
    defaultValues: {
      concurso: undefined,
      cargo: undefined,
      data_inicial: "",
      data_final: "",
    },
  });

  renderWithProviders(
    // <React.StrictMode>
      <ProcessosConvocacaoView
        form={form}
        concursosOptions={concursosOptions}
        processosData={{ results: [], count: 0 }}
        processosLoading={false}
        paginationPage={1}
        onSubmit={submitSpy}
        onReset={resetSpy}
        onAntTableChange={vi.fn()}
      />
    // </React.StrictMode>
  );

  return { submitSpy, resetSpy };
}


const mockOnSubmit = vi.fn();
const mockOnReset = vi.fn();

const RenderWithForm = () => {

    const form = useForm<IFiltroProcessos>({
    defaultValues: {
      concurso: undefined,
      cargo: undefined,
      data_inicial: "",
      data_final: "",
    },
  });

 
  return (
    <ProcessosConvocacaoView
      form={form}
      onSubmit={mockOnSubmit}
      onReset={mockOnReset}
        concursosOptions={concursosOptions}
        processosData={{ results: [], count: 0 }}
        processosLoading={false}
        paginationPage={1}
         onAntTableChange={vi.fn()}
    />
  );
};



describe("ProcessosConvocacaoView", () => {

  it("preenche duas datas e envia o form", async () => {
  renderWithProviders(<RenderWithForm />);

const dataInicial = screen.getByTestId("data_inicial");
const dataFinal = screen.getByTestId("data_final");

act(() => {
  // @ts-ignore: chamando onChange do DatePicker direto
  dataInicial.onChange(dayjs("2025-08-20"));
  // @ts-ignore
  dataFinal.onChange(dayjs("2025-08-28"));
});

await act(async () => {
  fireEvent.click(screen.getByTestId("submit"));
});

expect(mockOnSubmit).toHaveBeenCalledWith({
  data_inicial: "2025-08-20T00:00:00.000Z",
  data_final: "2025-08-28T00:00:00.000Z",
});
});



  it("deve preencher o formulário e chamar onSubmit", async () => {
    const { submitSpy } = renderComponent();

    // Preencher Concurso
    fireEvent.change(screen.getByRole("combobox", { name: /concurso/i }), {
      target: { value: "c1" },
    });

    // Preencher Cargo
    fireEvent.change(screen.getByRole("combobox", { name: /cargo/i }), {
      target: { value: "cg1" },
    });

    // Preencher datas
    fireEvent.change(screen.getByLabelText(/Data de Convocação/i), {
      target: { value: "2024-05-10" },
    });
    fireEvent.change(screen.getByLabelText(/ /i), {
      target: { value: "2024-05-15" },
    });

    // Clicar em Pesquisar
    fireEvent.click(screen.getByTestId("submit"));

    expect(submitSpy).toHaveBeenCalled();
    expect(submitSpy).toHaveBeenCalledWith({
      concurso: "c1",
      cargo: "cg1",
      data_inicial: "2024-05-10",
      data_final: "2024-05-15",
    });
  });

  it("deve chamar onReset ao clicar em Limpar filtros", () => {
    const { resetSpy } = renderComponent();

    const resetButton = screen.getByText(/Limpar filtros/i);
    fireEvent.click(resetButton);

    expect(resetSpy).toHaveBeenCalled();
  });
});
