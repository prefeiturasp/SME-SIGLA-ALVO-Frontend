import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, beforeEach, vi } from "vitest";
import Administracao from "./index";

// Faz mock do módulo inteiro ANTES de importar o componente
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );
  return {
    ...actual,
    useQuery: vi.fn(), // cria função mock
  };
});

import { useQuery } from "@tanstack/react-query";

import { MemoryRouter } from "react-router-dom";
 
import * as ReactQuery from "@tanstack/react-query"; // importa o módulo para mockar
vi.mock("@tanstack/react-query", () => ({
  ...vi.importActual("@tanstack/react-query"),
  useQuery: vi.fn(),
}));



import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
 
 

 

const setup = (queriesMock: any) => {
  (ReactQuery.useQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(queriesMock);

  return render(
        <ConfigProvider locale={ptBR}>

    <MemoryRouter>
      <Administracao />
    </MemoryRouter>
    </ConfigProvider>
  );
};

 

 

describe("Página Administração", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adicionando filtros de datas com intervalo válido e clicando em pesquisar", () => {
    setup(() => ({ data: [], isLoading: false }));
    // simula preenchimento e clique
    fireEvent.change(screen.getByLabelText(/data inicial/i), { target: { value: "2025-01-01" } });
    fireEvent.change(screen.getByLabelText(/data final/i), { target: { value: "2025-01-31" } });
    fireEvent.click(screen.getByRole("button", { name: /pesquisar/i }));
    // verificação
    expect(useQuery).toHaveBeenCalled();
  });

  it("adicionando filtros de datas com intervalo inválido e clicando em pesquisar", () => {
    setup(() => ({ data: [], isLoading: false }));
    fireEvent.change(screen.getByLabelText(/data inicial/i), { target: { value: "2025-02-01" } });
    fireEvent.change(screen.getByLabelText(/data final/i), { target: { value: "2025-01-01" } });
    fireEvent.click(screen.getByRole("button", { name: /pesquisar/i }));
    expect(screen.getByText(/intervalo inválido/i)).toBeInTheDocument();
  });

  it("selecionando concurso, depois cargo e clicando em pesquisar", () => {
    setup(() => ({
      data: [{ id: 1, nome: "Cargo Teste" }],
      isLoading: false,
    }));
    fireEvent.change(screen.getByLabelText(/concurso/i), { target: { value: "Concurso X" } });
    fireEvent.change(screen.getByLabelText(/cargo/i), { target: { value: "Cargo Teste" } });
    fireEvent.click(screen.getByRole("button", { name: /pesquisar/i }));
    expect(screen.getByText(/cargo teste/i)).toBeInTheDocument();
  });
});
