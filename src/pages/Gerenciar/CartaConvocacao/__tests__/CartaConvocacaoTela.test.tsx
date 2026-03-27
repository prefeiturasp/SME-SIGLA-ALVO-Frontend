import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App } from "antd";
import CartaConvocacaoTela from "../CartaConvocacaoTela";
import { useCartaConvocacao } from "../hooks/useCartaConvocacao";
import useHistoricoCartaConvocacao from "../hooks/useHistoricoCartaConvocacao";
import dayjs from "dayjs";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../../routes/PermissionContextGuard", () => ({
  useGetPermissions: () => ({
    can: () => true,
  }),
}));

jest.mock("../../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({
    children,
    breadcrumbItems,
    title,
  }: {
    children: React.ReactNode;
    breadcrumbItems: Array<{ title: React.ReactNode }>;
    title: string;
  }) => (
    <div data-testid="base-tela">
      <span data-testid="title">{title}</span>
      <div data-testid="breadcrumb">
        {Array.isArray(breadcrumbItems) && breadcrumbItems.map((item, i) => (
          <span key={i}>{item.title}</span>
        ))}
      </div>
      {children}
    </div>
  ),
}));

const mockPostCartaConvocacao = jest.fn();
const mockGetHistoricoCartaConvocacao = jest.fn();
jest.mock("../../../../services", () => ({
  API: {
    Convocacao: {
      postCartaConvocacao: (...args: unknown[]) => mockPostCartaConvocacao(...args),
      getHistoricoCartaConvocacao: (...args: unknown[]) => mockGetHistoricoCartaConvocacao(...args),
    },
  },
}));

const listRequest = { pagination: { page: 1, page_size: 100 } };
jest.mock("../../../../hooks/useListRequest", () => ({
  __esModule: true,
  default: () => ({ listRequest }),
}));

const mockUseConvocacao = jest.fn();
jest.mock("../../../Processos/ConvocacaoCandidatos/hooks/useConvocacao", () => ({
  __esModule: true,
  default: (params: unknown) => mockUseConvocacao(params),
}));

jest.mock("../hooks/useCartaConvocacao", () => {
  const actual = jest.requireActual("../hooks/useCartaConvocacao");
  const realImpl = actual.useCartaConvocacao;
  const fn = jest.fn((...args: unknown[]) => realImpl(...args));
  (fn as unknown as { __realImpl: typeof realImpl }).__realImpl = realImpl;
  return { useCartaConvocacao: fn };
});

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    Controller: (props: { render: (p: unknown) => React.ReactNode }) =>
      props.render({ field: { value: undefined, onChange: () => {} }, fieldState: {}, formState: {} }),
  };
});

describe("CartaConvocacaoTela", () => {
  const mockHandleSubmit = jest.fn((fn: (d: unknown) => void) => (e?: React.BaseSyntheticEvent) => {
    e?.preventDefault?.();
    return fn({ processo_convocacao: "uuid-1", data: dayjs("2025-01-15") });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [{ uuid: "uuid-1", descricao: "Processo A" }, { uuid: "uuid-2", descricao: "Processo B" }] },
      processosConvocacaoIsLoading: false,
    });
    (useCartaConvocacao as jest.Mock).mockReturnValue({
      control: {},
      formErrors: {},
      handleSubmit: mockHandleSubmit,
      handleEnviarForm: jest.fn(),
      processosConvocacaoOptions: [
        { value: "uuid-1", label: "Processo A" },
        { value: "uuid-2", label: "Processo B" },
      ],
      processosConvocacaoOptionsIsLoading: false,
    });
  });

  it("renderiza título e conteúdo da tela", () => {
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    expect(screen.getByTestId("base-tela")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toHaveTextContent("E-mail de Convocação");
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Selecione a data")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Histórico/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Enviar/i })).toBeInTheDocument();
  });

  it("navega para histórico ao clicar no botão Histórico", () => {
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Histórico/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/gerenciar/carta-convocacao/historico");
  });

  it("chama handleSubmit ao clicar em Enviar", () => {
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Enviar/i }));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it("navega ao clicar em Home no breadcrumb", () => {
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Home"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navega ao clicar em Gerenciar no breadcrumb", () => {
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Gerenciar"));
    expect(mockNavigate).toHaveBeenCalledWith("/gerenciar");
  });

  it("exibe status de erro no campo processo quando formErrors.processo_convocacao existe", () => {
    (useCartaConvocacao as jest.Mock).mockReturnValue({
      control: {},
      formErrors: { processo_convocacao: { message: "Selecione o processo" } },
      handleSubmit: mockHandleSubmit,
      handleEnviarForm: jest.fn(),
      processosConvocacaoOptions: [],
      processosConvocacaoOptionsIsLoading: false,
    });
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    const errorEl = document.querySelector(".ant-form-item-explain-error");
    expect(errorEl).toHaveTextContent("Selecione o processo");
  });

  it("exibe status de erro no campo data quando formErrors.data existe", () => {
    (useCartaConvocacao as jest.Mock).mockReturnValue({
      control: {},
      formErrors: { data: { message: "Informe a data" } },
      handleSubmit: mockHandleSubmit,
      handleEnviarForm: jest.fn(),
      processosConvocacaoOptions: [],
      processosConvocacaoOptionsIsLoading: false,
    });
    render(
      <MemoryRouter>
        <CartaConvocacaoTela />
      </MemoryRouter>
    );
    expect(screen.getByText("Informe a data")).toBeInTheDocument();
  });
});

describe("useCartaConvocacao", () => {
  const mockNotification = { success: jest.fn(), error: jest.fn() };
  const realImpl = (useCartaConvocacao as jest.Mock & { __realImpl?: typeof useCartaConvocacao }).__realImpl;

  beforeEach(() => {
    jest.clearAllMocks();
    if (realImpl) (useCartaConvocacao as jest.Mock).mockImplementation(realImpl as any);
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: null,
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({ response: Promise.resolve(), abort: () => {} });
    jest.spyOn(App, "useApp").mockReturnValue({ notification: mockNotification } as ReturnType<typeof App.useApp>);
  });

  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <App>{children}</App>
    </QueryClientProvider>
  );

  it("retorna control, formErrors, handleSubmit, handleEnviarForm, options e loading", async () => {
    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await waitFor(() => {
      expect(result.current.control).toBeDefined();
      expect(result.current.formErrors).toBeDefined();
      expect(result.current.handleSubmit).toBeDefined();
      expect(result.current.handleEnviarForm).toBeDefined();
      expect(result.current.processosConvocacaoOptions).toEqual([]);
      expect(result.current.processosConvocacaoOptionsIsLoading).toBe(false);
    });
  });

  it("processosConvocacaoOptions mapeia results quando processosConvocacaoData tem results", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: {
        results: [
          { uuid: "u1", descricao: "Proc 1" },
          { uuid: "u2", descricao: "Proc 2" },
        ],
      },
      processosConvocacaoIsLoading: false,
    });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await waitFor(() => {
      expect(result.current.processosConvocacaoOptions).toEqual([
        { value: "u1", label: "Proc 1" },
        { value: "u2", label: "Proc 2" },
      ]);
    });
  });

  it("handleEnviarForm exibe erro quando dados incompletos (sem processo)", async () => {
    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await waitFor(() => expect(result.current.handleEnviarForm).toBeDefined());
    await act(async () => {
      await result.current.handleEnviarForm({
        processo_convocacao: undefined,
        data: dayjs("2025-01-15"),
      });
    });
    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Dados incompletos",
        description: "Selecione o processo de convocação e a data.",
      })
    );
  });

  it("handleEnviarForm exibe erro quando dados incompletos (sem data)", async () => {
    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await waitFor(() => expect(result.current.handleEnviarForm).toBeDefined());
    await act(async () => {
      await result.current.handleEnviarForm({
        processo_convocacao: "uuid-1",
        data: null,
      });
    });
    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Dados incompletos" })
    );
  });

  it("handleEnviarForm envia com sucesso e exibe notification.success", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [{ uuid: "uuid-1", descricao: "Processo A" }] },
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({ response: Promise.resolve(), abort: () => {} });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await waitFor(() => expect(result.current.processosConvocacaoOptions.length).toBeGreaterThanOrEqual(0));

    await act(async () => {
      await result.current.handleEnviarForm({
        processo_convocacao: "uuid-1",
        data: dayjs("2025-01-15"),
      });
    });

    expect(mockPostCartaConvocacao).toHaveBeenCalledWith({
      processo_uuid: "uuid-1",
      processo_nome: "Processo A",
      data: "15-01-2025",
    });
    expect(mockNotification.success).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Envio de e-mails iniciado." })
    );
  });

  it("handleEnviarForm usa label vazio quando processo não está nas options", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [] },
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({ response: Promise.resolve(), abort: () => {} });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await act(async () => {
      await result.current.handleEnviarForm({
        processo_convocacao: "uuid-outro",
        data: dayjs("2025-01-15"),
      });
    });

    expect(mockPostCartaConvocacao).toHaveBeenCalledWith(
      expect.objectContaining({ processo_nome: "" })
    );
  });

  it("handleEnviarForm em erro exibe notification.error com detail da resposta", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [{ uuid: "uuid-1", descricao: "Processo A" }] },
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({
      response: Promise.reject({ response: { data: { detail: "Erro do servidor" } } }),
      abort: () => {},
    });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await act(async () => {
      try {
        await result.current.handleEnviarForm({
          processo_convocacao: "uuid-1",
          data: dayjs("2025-01-15"),
        });
      } catch {
        // rejeição tratada pelo hook
      }
    });

    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erro ao enviar carta de convocação",
        description: "Erro do servidor",
      })
    );
  });

  it("handleEnviarForm em erro usa message do Error quando não há response.detail", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [{ uuid: "uuid-1", descricao: "Processo A" }] },
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({
      response: Promise.reject(new Error("Falha de rede")),
      abort: () => {},
    });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await act(async () => {
      try {
        await result.current.handleEnviarForm({
          processo_convocacao: "uuid-1",
          data: dayjs("2025-01-15"),
        });
      } catch {
        // rejeição tratada pelo hook
      }
    });

    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({ description: "Falha de rede" })
    );
  });

  it("handleEnviarForm em erro usa mensagem fallback quando não há detail nem message", async () => {
    mockUseConvocacao.mockReturnValue({
      processosConvocacaoData: { results: [{ uuid: "uuid-1", descricao: "Processo A" }] },
      processosConvocacaoIsLoading: false,
    });
    mockPostCartaConvocacao.mockReturnValue({
      response: Promise.reject({}),
      abort: () => {},
    });

    const { result } = renderHook(() => useCartaConvocacao(), { wrapper });
    await act(async () => {
      try {
        await result.current.handleEnviarForm({
          processo_convocacao: "uuid-1",
          data: dayjs("2025-01-15"),
        });
      } catch {
        // rejeição tratada pelo hook
      }
    });

    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({
        description: "Ocorreu um erro ao enviar a carta de convocação. Tente novamente.",
      })
    );
  });
});

describe("useHistoricoCartaConvocacao", () => {
  const listRequest = { pagination: { page: 1, page_size: 10 } };

  const createWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna historicoData, historicoIsLoading e historicoRefetch", async () => {
    mockGetHistoricoCartaConvocacao.mockReturnValue({
      response: Promise.resolve({ results: [{ id: 1 }], count: 1 }),
      abort: () => {},
    });

    const { result } = renderHook(
      () => useHistoricoCartaConvocacao(listRequest),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.historicoIsLoading).toBe(false);
    });
    expect(result.current.historicoData).toBeDefined();
    expect(result.current.historicoRefetch).toBeDefined();
  });

  it("preenche historicoData com results e count quando API retorna dados", async () => {
    const dados = { results: [{ uuid: "h1" }], count: 1 };
    mockGetHistoricoCartaConvocacao.mockReturnValue({
      response: Promise.resolve(dados),
      abort: () => {},
    });

    const { result } = renderHook(
      () => useHistoricoCartaConvocacao(listRequest),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.historicoData.results).toEqual([{ uuid: "h1" }]);
      expect(result.current.historicoData.count).toBe(1);
    });
  });

  it("retorna results e count vazios quando API lança erro", async () => {
    mockGetHistoricoCartaConvocacao.mockReturnValue({
      response: Promise.reject(new Error("Erro")),
      abort: () => {},
    });

    const { result } = renderHook(
      () => useHistoricoCartaConvocacao(listRequest),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.historicoIsLoading).toBe(false);
      expect(result.current.historicoData.results).toEqual([]);
      expect(result.current.historicoData.count).toBe(0);
    });
  });
});
