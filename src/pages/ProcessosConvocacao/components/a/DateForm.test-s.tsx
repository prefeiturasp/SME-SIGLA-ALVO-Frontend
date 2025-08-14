import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import DateForm from "./DateForm";
import { useForm } from "react-hook-form";
import type { IFiltroProcessos } from "../../../../services/resources/convocacao/IConvocacao";
import { vi } from "vitest";
import { renderWithProviders } from "../../test-utils";
//todo evoluir esse 
describe("DateForm", () => {
  it("deve enviar as datas corretamente usando fireEvent", () => {
    const handleSubmit = vi.fn();


      const concursosOptions = {
    concursos: [{ label: "Concurso 1", value: "c1" }],
    cargos: [{ label: "Cargo 1", value: "cg1" }],
  };

   const form = useForm<IFiltroProcessos>({
    defaultValues: {
      concurso: undefined,
      cargo: undefined,
      data_inicial: "",
      data_final: "",
    },
  });

  const submitSpy = vi.fn()
  const  resetSpy = vi.fn()
  //não consigo passsar o form por parametro pois da erro de referencia 

    renderWithProviders(<DateForm form={form}         concursosOptions={concursosOptions}
        processosData={{ results: [], count: 0 }}
        processosLoading={false}
        paginationPage={1}
        onSubmit2={submitSpy}
        onReset={resetSpy}
        onAntTableChange={vi.fn()}  onSubmit={handleSubmit} />);

    const startInput = screen.getByTestId("start-date").querySelector("input")!;
    const endInput = screen.getByTestId("end-date").querySelector("input")!;
    const submitButton = screen.getByRole("button", { name: /Pesquisar/i });

    // preenche os inputs
    fireEvent.change(startInput, { target: { value: "2024-05-10" } });
    fireEvent.change(endInput, { target: { value: "2024-05-15" } });

    // clica no botão de submit
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      startDate: "2024-05-10",
      endDate: "2024-05-15"
    });
  });
});

// import React from "react";
// import { render, screen } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import DateForm from "./DateForm";

// describe("DateForm", () => {
//   it("deve enviar as datas corretamente", async () => {
//     const handleSubmit = vi.fn();
//     const user = userEvent.setup();

//     render(<DateForm onSubmit={handleSubmit} />);

//     await user.type(screen.getByTestId("start-date"), "2024-05-10");
//     await user.type(screen.getByTestId("end-date"), "2024-05-15");

//     await user.click(screen.getByRole("button", { name: /enviar/i }));

//     expect(handleSubmit).toHaveBeenCalledWith({
//       startDate: "2024-05-10",
//       endDate: "2024-05-15"
//     });
//   });
// });
