import dayjs from "dayjs";

import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import ProcessosConvocacaoView from "./index-tt";
import { useForm } from "react-hook-form";
import { vi } from "vitest";
import { renderWithProviders } from "./test-utils";

const mockOnSubmit = vi.fn();
const mockOnReset = vi.fn();

const RenderWithForm = () => {
  const form = useForm({
    defaultValues: {
      data_inicial: "",
      data_final: "",
    },
  });
  return (
    <ProcessosConvocacaoView
      form={form}
      onSubmit={mockOnSubmit}
      onReset={mockOnReset}
    />
  );
};


it("preenche duas datas e envia o form", async () => {
  renderWithProviders(<RenderWithForm />);

const dataInicial = screen.getByTestId("concurso");
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



// it("preenche duas datas e envia o form", async () => {
//   const { container } = renderWithProviders(<RenderWithForm />);

//   const formElement = container.querySelector("form")!;

//   // Pega o form do RenderWithForm via react-hook-form
//   // Como o DatePicker não reage ao fireEvent.change, setamos direto:
//   const { control, setValue } = (RenderWithForm() as any).props.form;

//   act(() => {
//     setValue("data_inicial", "2025-08-20T00:00:00.000Z");
//     setValue("data_final", "2025-08-28T00:00:00.000Z");
//   });

//   // Submete
//   await act(async () => {
//     fireEvent.click(screen.getByTestId("submit"));
//   });

//   await waitFor(() => {
//     expect(mockOnSubmit).toHaveBeenCalledWith({
//       data_inicial: "2025-08-20T00:00:00.000Z",
//       data_final: "2025-08-28T00:00:00.000Z",
//     });
//   });
// });




// it("preenche duas datas e envia o form", async () => {
//   const { container } = renderWithProviders(<RenderWithForm />);

//   // Campo data inicial

//   const dataInicialWrapper = screen.getByTestId("data_inicial"); // pega o container <div class="ant-picker">
//   fireEvent.mouseDown(dataInicialWrapper); // abre o calendário

//   expect(dataInicialWrapper).toBeVisible();

//   fireEvent.change(dataInicialWrapper, { target: { value: "2025-08-20" } });
//   fireEvent.click(document.querySelector(".ant-picker-cell-selected")!);

  

//   const dataFinalWrapper = screen.getByTestId("data_final"); // pega o container <div class="ant-picker">
//   fireEvent.mouseDown(dataFinalWrapper); // abre o calendário

//   expect(dataFinalWrapper).toBeVisible();

//   fireEvent.change(dataFinalWrapper, { target: { value: "2025-08-28" } });
//   fireEvent.click(document.querySelector(".ant-picker-cell-selected")!);

//   // Submeter
//   act(async () => {
//     await fireEvent.click(screen.getByTestId("submit"));
//   });
//   // expect(container).toMatchSnapshot(); // vai criar o arquivo de snapshot

  

//   await waitFor(() => {
//     expect(mockOnSubmit).toHaveBeenCalledWith({
//       data_inicial: "2025-08-20",
//     });
//   });

 
// });

// it("preenche duas datas e envia o form", async () => {
//   renderWithProviders(<RenderWithForm />);

//   // Preenche data inicial
//   const dataInicialWrapper = screen.getByTestId("data_inicial");
//   fireEvent.mouseDown(dataInicialWrapper);
//   fireEvent.change(dataInicialWrapper, { target: { value: "2025-08-20" } });
//   fireEvent.blur(dataInicialWrapper);

//   // Preenche data final
//   const dataFinalWrapper = screen.getByTestId("data_final");
//   fireEvent.mouseDown(dataFinalWrapper);
//   fireEvent.change(dataFinalWrapper, { target: { value: "2025-08-28" } });
//   fireEvent.blur(dataFinalWrapper);

//   // Submete o formulário
//   await act(async () => {
//     fireEvent.click(screen.getByTestId("submit"));
//   });

//   await waitFor(() => {
//     expect(mockOnSubmit).toHaveBeenCalledWith({
//       data_inicial: "2025-08-20T00:00:00.000Z",
//       data_final: "2025-08-28T00:00:00.000Z",
//     });
//   });
// });

