import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProcessosConvocacaoView from "./ProcessosConvocacaoView";
import { vi } from "vitest";
import { renderWithProviders } from "./test-utils";

const handleSubmit = vi.fn();

const submitSpy = vi.fn();
const resetSpy = vi.fn();

// const mockLogin = vi.fn((email, password) => {
//   return Promise.resolve({ email, password });
// });

const concursosOptions = {
  concursos: [{ label: "Concurso 1", value: "c1" }],
  cargos: [{ label: "Cargo 1", value: "cg1" }],
};

    
it("deve mostrar erro quando data inicial for maior que data final", async () => {
  renderWithProviders(
    <ProcessosConvocacaoView
      concursosOptions={concursosOptions}
      processosConvocacaoData={{ results: [], count: 0 }}
      processosLoading={false}
      concursosIsLoading={false}
      paginationPage={1}
      handleSub={submitSpy}
      handleReset={resetSpy}
      onAntTableChange={vi.fn()}
      listRequest={{ pagination: { page: 1, page_size: 10 } }}
    />
  );

  fireEvent.change(document.getElementById("data_convocacao_inicio")!, {
    target: { value: "2025-08-20" },
  });

  fireEvent.change(document.getElementById("data_convocacao_fim")!, {
    target: { value: "2025-08-10" },
  });

  fireEvent.submit(screen.getByTestId("submit-button"));

  await waitFor(() => {
    expect(
      screen.getByText(/Data final não pode ser menor que data inicial/i)
    ).toBeInTheDocument();
  });

  expect(submitSpy).not.toHaveBeenCalled();
  // expect(mockLogin).not.toHaveBeenCalled();
});

it("deve submeter com datas válidas e verificar o que foi enviado", async () => {
  renderWithProviders(
    <ProcessosConvocacaoView
      concursosOptions={concursosOptions}
      processosConvocacaoData={{ results: [], count: 0 }}
      processosLoading={false}
      concursosIsLoading={false}
      paginationPage={1}
      handleSub={submitSpy}
      handleReset={resetSpy}
      onAntTableChange={vi.fn()}
      listRequest={{ pagination: { page: 1, page_size: 10 } }}
      // login={mockLogin}
    />
  );

  // Preencher datas
  fireEvent.change(document.getElementById("data_convocacao_inicio")!, {
    target: { value: "2025-08-10" },
  });

  fireEvent.change(document.getElementById("data_convocacao_fim")!, {
    target: { value: "2025-08-20" },
  });

  // Submeter formulário
  fireEvent.submit(screen.getByTestId("submit-button"));

  // Esperar que o submit tenha sido chamado
  await waitFor(() => expect(submitSpy).toHaveBeenCalled());

  // Verificar exatamente com quais valores o submit foi chamado
  const calledWith = submitSpy.mock.calls[0][0];
  console.log("submitSpy foi chamado com:", calledWith);

  expect(calledWith).toEqual(
    expect.objectContaining({
      data_convocacao_inicio: "2025-08-10",
      data_convocacao_fim: "2025-08-20",
    })
  );
});
