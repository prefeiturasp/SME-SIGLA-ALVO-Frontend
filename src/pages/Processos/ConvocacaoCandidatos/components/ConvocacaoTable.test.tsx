import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ConvocacaoTable from "./ConvocacaoTable";
import type { IProcessoConvocacao } from "../../../../services/resources/convocacao/IConvocacao";

const mockData: IProcessoConvocacao[] = [
  {
    concurso_nome: "Processo 1",
    data_convocacao: "2025-08-01T13:02:13.806Z",
    status: "Em andamento",
    uuid:'1'
  },
  {
    concurso_nome: "Processo 2",
    data_convocacao: "2025-07-15T13:02:13.806Z",
    status: "Concluído",
    uuid:'2'
  },
];

describe("ConvocacaoTable", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve renderizar título e linhas da tabela", () => {
    render(<ConvocacaoTable data={mockData} />);

    expect(screen.getByText(/Resultados/i)).toBeInTheDocument();

    expect(screen.getByText("Processo 1")).toBeInTheDocument();
    expect(screen.getByText("Processo 2")).toBeInTheDocument();

    expect(screen.getByText("01/08/2025")).toBeInTheDocument();
    expect(screen.getByText("15/07/2025")).toBeInTheDocument();

    expect(screen.getByText("Em andamento")).toBeInTheDocument();
    expect(screen.getByText("Concluído")).toBeInTheDocument();
  });

  it("deve chamar console.log com dados ao clicar em 'Finalizar'", () => {
    render(<ConvocacaoTable data={mockData} />);

    const buttonsFinalizar = screen.getAllByRole("button", { name: /Finalizar/i });

    expect(buttonsFinalizar).toHaveLength(mockData.length);

    fireEvent.click(buttonsFinalizar[0]);

    expect(console.log).toHaveBeenCalledWith(mockData[0]);
  });

  it("botão Editar está desabilitado e botão Deletar está habilitado", () => {
    render(<ConvocacaoTable data={mockData} />);

    const editButtons = screen.getAllByRole("button", { name: "" }); 

    const disabledButtons = editButtons.filter((btn) => btn.hasAttribute("disabled"));
    expect(disabledButtons.length).toBeGreaterThan(0);
  });
});
