import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import EnvioEmailsTela from "../EnvioEmailsTela";

// Mocks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock do QuillEditor para um textarea simples
jest.mock("../../../Relatorios/components/QuillEditor", () => {
  return function MockQuillEditor(props: { value: string; onChange: (v: string) => void; placeholder?: string }) {
    return (
      <textarea
        aria-label="quill-editor"
        value={props.value || ""}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
      />
    );
  };
});

// Mock do hook de conteúdo por tipo
const mockRefetchConteudo = jest.fn();
jest.mock("../hooks/useGetEnvioEmailConteudo", () => ({
  __esModule: true,
  default: () => ({
    conteudo: "",
    isLoading: false,
    refetch: mockRefetchConteudo,
  }),
}));

// Mock do hook de listar processos
jest.mock("../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao", () => ({
  __esModule: true,
  default: () => ({
    processosConvocacaoData: {
      results: [
        { uuid: "p1", descricao: "Processo 1" },
        { uuid: "p2", descricao: "Processo 2" },
      ],
    },
    processosConvocacaoIsLoading: false,
  }),
}));

// Mock do post (usePostEnvioEmail)
const mockMutateAsync = jest.fn().mockResolvedValue({});
jest.mock("../hooks/usePostEnvioEmail", () => ({
  __esModule: true,
  default: () => ({
    mutateAsync: mockMutateAsync,
  }),
}));

describe("EnvioEmailsTela", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("desabilita Filtrar até selecionar processo e tipo; carrega conteúdo e mostra textarea", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const filtrarBtn = screen.getByRole("button", { name: /filtrar/i });
    expect(filtrarBtn).toBeDisabled();

    // Selecionar processo (primeiro combobox)
    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));

    // Selecionar tipo (segundo combobox)
    await user.click(combos[1]);
    await user.click(screen.getByText("Convocação"));

    // Agora pode filtrar
    expect(screen.getByRole("button", { name: /filtrar/i })).not.toBeDisabled();

    // Mock do refetch retornando conteúdo
    mockRefetchConteudo.mockResolvedValueOnce({
      data: [{ conteudo: "<p>conteudo padrao</p>" }],
    });

    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    // textarea aparece
    await waitFor(() => {
      expect(screen.getByLabelText("quill-editor")).toBeInTheDocument();
    });

    // Label inclui o tipo
    expect(screen.getByText(/E-mail de Convocação/i)).toBeInTheDocument();
  });

  it("mostra e esconde o botão Voltar do topo conforme visibilidade do conteúdo; envia com payload correto", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Voltar do topo visível inicialmente (conteúdo oculto)
    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();

    // Selecionar ambos e filtrar
    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));
    mockRefetchConteudo.mockResolvedValueOnce({
      data: [{ conteudo: "<p>resultado</p>" }],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    // Aparece os botões de rodapé
    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Voltar" }).length).toBe(1);
    });
    const enviarBtn = screen.getByRole("button", { name: /enviar/i });

    // Enviar dispara mutate com payload esperado
    await user.click(enviarBtn);
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        processo_uuid: "p1",
        processo_nome: "Processo 1",
        tipo: "RESULTADOS",
        conteudo: "<p>resultado</p>",
      });
    });
  });
});

