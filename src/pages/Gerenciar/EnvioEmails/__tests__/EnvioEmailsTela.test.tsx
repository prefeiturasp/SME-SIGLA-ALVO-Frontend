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
  return function MockQuillEditor(props: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    editorId?: string;
  }) {
    const ariaLabel = props.editorId
      ? `quill-editor-${props.editorId}`
      : "quill-editor";
    return (
      <textarea
        aria-label={ariaLabel}
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
    conteudoGabarito: "",
    assunto: "",
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

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Convocação"));

    expect(screen.getByRole("button", { name: /filtrar/i })).not.toBeDisabled();

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito padrao</p>",
          conteudo: "",
          assunto: "Assunto de convocação",
        },
      ],
    });

    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("quill-editor-conteudo-gabarito")).toBeInTheDocument();
      expect(screen.getByLabelText("quill-editor-conteudo")).toBeInTheDocument();
    });

    expect(screen.getByText(/E-mail de Convocação/i)).toBeInTheDocument();
    expect(screen.getByText("Assunto do E-mail:")).toBeInTheDocument();
    expect(screen.getByLabelText("assunto")).toHaveValue("");
    expect(screen.getByLabelText("quill-editor-conteudo-gabarito")).toHaveValue("<p>gabarito padrao</p>");
    expect(screen.getByText("Copiar conteúdo gabarito")).toBeInTheDocument();
  });

  it("copia conteúdo gabarito para o conteúdo ao clicar no botão de copiar", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Convocação"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito padrao</p>",
          conteudo: "",
          assunto: "Assunto inicial",
        },
      ],
    });

    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("quill-editor-conteudo-gabarito")).toHaveValue("<p>gabarito padrao</p>");
    });

    fireEvent.change(screen.getByLabelText("quill-editor-conteudo-gabarito"), {
      target: { value: "<p>gabarito editado</p>" },
    });
    await user.click(screen.getByText("Copiar conteúdo gabarito"));

    expect(screen.getByLabelText("quill-editor-conteudo")).toHaveValue("<p>gabarito editado</p>");
  });

  it("mantém assunto em branco ao filtrar independentemente da API", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito resultado</p>",
          conteudo: "<p>resultado</p>",
          assunto: "Assunto de resultados",
        },
      ],
    });

    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("assunto")).toHaveValue("");
    });
  });

  it("envia assunto em branco quando o usuário não preenche o campo", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito resultado</p>",
          conteudo: "",
          assunto: "Assunto de resultados",
        },
      ],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("assunto")).toHaveValue("");
    });

    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        processo_uuid: "p1",
        processo_nome: "Processo 1",
        tipo: "RESULTADOS",
        conteudo: "<p>gabarito resultado</p>",
        assunto: "",
      });
    });
  });

  it("envia assunto customizado quando o usuário preenche o campo", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Convocação"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito</p>",
          conteudo: "",
          assunto: "Assunto da API",
        },
      ],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("assunto")).toHaveValue("");
    });

    fireEvent.change(screen.getByLabelText("assunto"), {
      target: { value: "Meu assunto personalizado" },
    });
    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        processo_uuid: "p1",
        processo_nome: "Processo 1",
        tipo: "CONVOCACAO",
        conteudo: "<p>gabarito</p>",
        assunto: "Meu assunto personalizado",
      });
    });
  });

  it("envia conteúdo customizado quando preenchido; caso contrário usa gabarito", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito resultado</p>",
          conteudo: "",
          assunto: "Assunto de resultados",
        },
      ],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("quill-editor-conteudo-gabarito")).toHaveValue("<p>gabarito resultado</p>");
    });

    const enviarBtn = screen.getByRole("button", { name: /enviar/i });
    await user.click(enviarBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        processo_uuid: "p1",
        processo_nome: "Processo 1",
        tipo: "RESULTADOS",
        conteudo: "<p>gabarito resultado</p>",
        assunto: "",
      });
    });
  });

  it("envia conteúdo editado no segundo textarea quando preenchido", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));

    mockRefetchConteudo.mockResolvedValueOnce({
      data: [
        {
          conteudo_gabarito: "<p>gabarito</p>",
          conteudo: "<p>customizado</p>",
          assunto: "Assunto customizado",
        },
      ],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("quill-editor-conteudo")).toHaveValue("<p>customizado</p>");
    });

    await user.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        processo_uuid: "p1",
        processo_nome: "Processo 1",
        tipo: "RESULTADOS",
        conteudo: "<p>customizado</p>",
        assunto: "",
      });
    });
  });

  it("mostra e esconde o botão Voltar do topo conforme visibilidade do conteúdo", async () => {
    const user = userEvent.setup();
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails"]}>
          <EnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole("button", { name: "Voltar" })).toBeInTheDocument();

    const combos = screen.getAllByRole("combobox");
    await user.click(combos[0]);
    await user.click(screen.getByText("Processo 1"));
    await user.click(combos[1]);
    await user.click(screen.getByText("Resultados"));
    mockRefetchConteudo.mockResolvedValueOnce({
      data: [{ conteudo_gabarito: "<p>gabarito</p>", conteudo: "", assunto: "Assunto" }],
    });
    await user.click(screen.getByRole("button", { name: /filtrar/i }));

    await waitFor(() => {
      expect(screen.getAllByRole("button", { name: "Voltar" }).length).toBe(1);
    });
  });
});
