import ProcessosConvocacao from "../index_old";
import { fireEvent, renderWithProviders } from "../test-utils";

 
 
describe("ProcessosConvocacao Component", () => {
 

 
  it("deve chamar reset e handleSub ao clicar em Limpar filtros", () => {
     const { getByTestId, findByText,  } = renderWithProviders(<ProcessosConvocacao />);

    getByTestId("submit");

    fireEvent.click(getByTestId("submit"));

    
    const errorMessage = findByText("Data final deve ser maior ou igual à inicial");
    // expect(errorMessage).toBeInTheDocument();
  });
});


// import React from "react";
// import { render, fireEvent, screen } from "@testing-library/react";
// import ProcessosConvocacao from "./index";
// import { renderWithProviders } from "./test-utils";

// describe("ProcessosConvocacao Component", () => {
//   it("deve chamar reset e handleSub ao clicar em Limpar filtros", async () => {
//     renderWithProviders(<ProcessosConvocacao />);

//     // Supondo que você tenha um botão com data-testid="submit"
//     const submitButton = screen.getByTestId("submit");

//     fireEvent.click(submitButton);

//     // Espera a mensagem de erro aparecer no DOM (ex: validação Yup)
//     const errorMessage = await screen.findByText("Data final deve ser maior ou igual à inicial");
//     expect(errorMessage).toBeInTheDocument();
//   });
// });
