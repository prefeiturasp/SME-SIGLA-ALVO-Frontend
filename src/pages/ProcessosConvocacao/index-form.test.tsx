import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./index-form";
import { vi } from "vitest";

  const handleSubmit = vi.fn();

 
  const submitSpy = vi.fn()
  const  resetSpy = vi.fn()

const mockLogin = vi.fn((email, password) => {
  return Promise.resolve({ email, password });
});

     const concursosOptions = {
    concursos: [{ label: "Concurso 1", value: "c1" }],
    cargos: [{ label: "Cargo 1", value: "cg1" }],
  };

//   // it("should display required error when value is invalid", async () => {
//   //   render(<App 
      
//   //             concursosOptions={concursosOptions}
//   //             processosData={{ results: [], count: 0 }}
//   //             processosLoading={false}
//   //             paginationPage={1}
//   //             onSubmit2={submitSpy}
//   //             onReset={resetSpy}
//   //             onAntTableChange={vi.fn()}  
      
//   //     login={mockLogin} />);

//   //   fireEvent.submit(screen.getByRole("button"));

//   //   expect(await screen.findAllByRole("alert")).toHaveLength(2);
//   //   expect(mockLogin).not.toBeCalled();
//   // });

//   // it("should display matching error when email is invalid", async () => {
//   //   render(<App 
      
//   //             concursosOptions={concursosOptions}
//   //             processosData={{ results: [], count: 0 }}
//   //             processosLoading={false}
//   //             paginationPage={1}
//   //             onSubmit2={submitSpy}
//   //             onReset={resetSpy}
//   //             onAntTableChange={vi.fn()}  
      
//   //     login={mockLogin} />);
    
//   //   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
//   //     target: {
//   //       value: "test"
//   //     }
//   //   });

//   //   fireEvent.input(screen.getByLabelText("password"), {
//   //     target: {
//   //       value: "password"
//   //     }
//   //   });

//   //   fireEvent.submit(screen.getByRole("button"));

//   //   expect(await screen.findAllByRole("alert")).toHaveLength(1);
//   //   expect(mockLogin).not.toBeCalled();
//   //   expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("test");
//   //   expect(screen.getByLabelText("password")).toHaveValue("password");
//   // });

//   // it("should display min length error when password is invalid", async () => {
//   //   render(<App 
      
//   //             concursosOptions={concursosOptions}
//   //             processosData={{ results: [], count: 0 }}
//   //             processosLoading={false}
//   //             paginationPage={1}
//   //             onSubmit2={submitSpy}
//   //             onReset={resetSpy}
//   //             onAntTableChange={vi.fn()}  
      
//   //     login={mockLogin} />);
    
//   //   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
//   //     target: {
//   //       value: "test@mail.com"
//   //     }
//   //   });

//   //   fireEvent.input(screen.getByLabelText("password"), {
//   //     target: {
//   //       value: "pass"
//   //     }
//   //   });

//   //   fireEvent.submit(screen.getByRole("button"));

//   //   expect(await screen.findAllByRole("alert")).toHaveLength(1);
//   //   expect(mockLogin).not.toBeCalled();
//   //   expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue(
//   //     "test@mail.com"
//   //   );
//   //   expect(screen.getByLabelText("password")).toHaveValue("pass");
//   // });

//   // it("should not display error when value is valid", async () => {
//   //   render(<App 
      
//   //             concursosOptions={concursosOptions}
//   //             processosData={{ results: [], count: 0 }}
//   //             processosLoading={false}
//   //             paginationPage={1}
//   //             onSubmit2={submitSpy}
//   //             onReset={resetSpy}
//   //             onAntTableChange={vi.fn()}  
      
//   //     login={mockLogin} />);

//   //   fireEvent.input(screen.getByTestId("data_final"), {
//   //     target: {
//   //       value: "11-05-2025"
//   //     }
//   //   });

//   //   fireEvent.input(screen.getByLabelText("password"), {
//   //     target: {
//   //       value: "password"
//   //     }
//   //   });

//   //   fireEvent.submit(screen.getByRole("button"));

//   //   await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
//   //   expect(mockLogin).toBeCalledWith("11-05-2025", "password");
//   //   expect(screen.getByRole("textbox", { name: /email/i })).toHaveValue("");
//   //   expect(screen.getByLabelText("password")).toHaveValue("");
//   // });

// it("deve mostrar erro quando data inicial for maior que data final", async () => {
//   render(
//     <App
//       concursosOptions={concursosOptions}
//       processosData={{ results: [], count: 0 }}
//       processosLoading={false}
//       paginationPage={1}
//       onSubmit2={submitSpy}
//       onReset={resetSpy}
//       onAntTableChange={vi.fn()}
//       login={mockLogin}
//     />
//   );

//   fireEvent.input(screen.getByTestId("data_inicial"), {
//     target: { value: "2025-08-20" }
//   });

//   fireEvent.input(screen.getByTestId("data_final"), {
//     target: { value: "2025-08-10" }
//   });

//   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
//     target: { value: "test@mail.com" }
//   });

//   fireEvent.input(screen.getByLabelText("password"), {
//     target: { value: "password" }
//   });

//   fireEvent.submit(screen.getByRole("button"));

//   await waitFor(() => {
//     expect(
//       screen.getByText(/Data final não pode ser menor que data inicial/i)
//     ).toBeInTheDocument();
//   });

//   expect(mockLogin).not.toHaveBeenCalled();
// });

// it("deve submeter com datas válidas", async () => {
//   render(
//     <App
//       concursosOptions={concursosOptions}
//       processosData={{ results: [], count: 0 }}
//       processosLoading={false}
//       paginationPage={1}
//       onSubmit2={submitSpy}
//       onReset={resetSpy}
//       onAntTableChange={vi.fn()}
//       login={mockLogin}
//     />
//   );

//   fireEvent.input(screen.getByTestId("data_inicial"), {
//     target: { value: "2025-08-10" }
//   });

//   fireEvent.input(screen.getByTestId("data_final"), {
//     target: { value: "2025-08-20" }
//   });

//   fireEvent.input(screen.getByRole("textbox", { name: /email/i }), {
//     target: { value: "test@mail.com" }
//   });

//   fireEvent.input(screen.getByLabelText("password"), {
//     target: { value: "password" }
//   });

//   fireEvent.submit(screen.getByRole("button"));

//   expect(submitSpy).toHaveBeenCalledWith(
//     expect.objectContaining({
//       data_inicial: "2025-08-10",
//       data_final: "2025-08-20"
//     })
//   );
// });
it("deve mostrar erro quando data inicial for maior que data final", async () => {
  render(
    <App
      concursosOptions={concursosOptions}
      processosData={{ results: [], count: 0 }}
      processosLoading={false}
      paginationPage={1}
      onSubmit2={submitSpy}
      onReset={resetSpy}
      onAntTableChange={vi.fn()}
      login={mockLogin}
    />
  );

  fireEvent.change(document.getElementById("data_inicial")!, {
    target: { value: "2025-08-20" }
  });

  fireEvent.change(document.getElementById("data_final")!, {
    target: { value: "2025-08-10" }
  });

  fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
    target: { value: "test@mail.com" }
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password" }
  });

  fireEvent.submit(screen.getByRole("button"));

  await waitFor(() => {
    expect(
      screen.getByText(/Data final não pode ser menor que data inicial/i)
    ).toBeInTheDocument();
  });

  expect(mockLogin).not.toHaveBeenCalled();
});



it("deve submeter com datas válidas e verificar o que foi enviado", async () => {
  render(
    <App
      concursosOptions={concursosOptions}
      processosData={{ results: [], count: 0 }}
      processosLoading={false}
      paginationPage={1}
      onSubmit2={submitSpy}
      onReset={resetSpy}
      onAntTableChange={vi.fn()}
      login={mockLogin}
    />
  );

  // Preencher datas
  fireEvent.change(document.getElementById("data_inicial")!, {
    target: { value: "2025-08-10" }
  });

  fireEvent.change(document.getElementById("data_final")!, {
    target: { value: "2025-08-20" }
  });

  // Preencher email e senha
  fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
    target: { value: "test@mail.com" }
  });

  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password" }
  });

  // Submeter formulário
  fireEvent.submit(screen.getByRole("button"));

  // Esperar que o submit tenha sido chamado
  await waitFor(() => expect(submitSpy).toHaveBeenCalled());

  // Verificar exatamente com quais valores o submit foi chamado
  const calledWith = submitSpy.mock.calls[0][0];
  console.log("submitSpy foi chamado com:", calledWith);

  expect(calledWith).toEqual(
    expect.objectContaining({
      data_inicial: "2025-08-10",
      data_final: "2025-08-20",
      email: "test@mail.com",
      password: "password"
    })
  );
});
