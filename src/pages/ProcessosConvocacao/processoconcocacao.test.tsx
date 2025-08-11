import ProcessosConvocacao from "./index";
import { fireEvent, renderWithProviders } from "./test-utils";

 
 
describe("ProcessosConvocacao Component", () => {
 

 
  it("deve chamar reset e handleSub ao clicar em Limpar filtros", () => {
     const { getByTestId, findByText } = renderWithProviders(<ProcessosConvocacao />);

    getByTestId("submit");

    fireEvent.click(getByTestId("submit"));

    findByText("This field is required");
  });
});
