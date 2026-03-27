import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { renderHook, waitFor as waitForHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EliminacaoReclassificacaoCandidatoTela from "../EliminacaoReclassificacaoCandidatoTela";
import { useGetHablitados } from "../hooks/useGetHablitados";
import { usePostHabilitadoEliminar } from "../hooks/usePostHabilitadoEliminar";
import { usePostReclassificarCandidato } from "../hooks/usePostReclassificarCandidato";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../../../routes/PermissionContextGuard", () => ({
  useGetPermissions: () => ({
    can: () => true,
  }),
}));

const formState = { useFilterValues: false };
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useForm: (opts: unknown) => {
      const form = actual.useForm(opts);
      if (formState.useFilterValues) {
        const filterValues = { concurso: "conc-1", cargo: "cargo-1", nome: "", rf: "", rg: "", cpf: "" };
        return {
          ...form,
          watch: (name?: string) => (name ? (filterValues as Record<string, string | undefined>)[name] : filterValues),
          handleSubmit: (fn: (data: typeof filterValues) => void) => (e?: React.BaseSyntheticEvent) => {
            e?.preventDefault?.();
            fn(filterValues);
          },
        };
      }
      return form;
    },
  };
});

const mockGetCandidatosHabilitados = jest.fn();
const mockPostHabilitadoEliminar = jest.fn();
const mockPostReclassificarCandidato = jest.fn();
jest.mock("../../../services/resources/candidatos", () => ({
  getCandidatosHabilitados: (...args: unknown[]) => mockGetCandidatosHabilitados(...args),
  postHabilitadoEliminar: (...args: unknown[]) => mockPostHabilitadoEliminar(...args),
  postReclassificarCandidato: (...args: unknown[]) => mockPostReclassificarCandidato(...args),
}));

const mockConcursosData = { results: [{ uuid: "conc-1", descricao: "Concurso 1" }] };
const mockConcursoData = { cargos: [{ uuid: "cargo-1", codigo: "C1", nome: "Cargo 1" }] };
jest.mock("../../../hooks/useConcursos", () => ({
  useConcursos: () => ({
    concursosData: mockConcursosData,
    concursosOptionsIsLoading: false,
  }),
}));

jest.mock("../../GerenciamentoVagas/hooks/useGetConcursoPorUuid", () => ({
  useGetConcursoByUuid: (uuid: string) => ({
    concursoData: uuid ? mockConcursoData : undefined,
    concursoIsLoading: false,
  }),
}));

jest.mock("../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title }: { children: React.ReactNode; breadcrumbItems: unknown[]; title: string }) => (
    <div data-testid="base-tela">
      <span data-testid="title">{title}</span>
      {breadcrumbItems?.map((item: any, i: number) => (
        <button key={i} type="button" onClick={item.title?.props?.onClick} data-testid={`breadcrumb-${i}`}>
          {typeof item.title?.props?.children === "string" ? item.title.props.children : "Home"}
        </button>
      ))}
      {children}
    </div>
  ),
}));

jest.mock("../components/AlterarSituacaoCandidatoModal", () => ({
  __esModule: true,
  default: ({ open, onCancel, onSave }: { open: boolean; onCancel: () => void; onSave: (s: string) => void }) =>
    open ? (
      <div data-testid="modal-alterar">
        <button type="button" onClick={onCancel} data-testid="modal-cancelar">Cancelar</button>
        <button type="button" onClick={() => onSave("Eliminado")} data-testid="modal-salvar">Salvar</button>
      </div>
    ) : null,
}));

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const habilitadoItem = {
  uuid: "hab-1",
  candidato: { nome: "João", registro_funcional: "RF1", rg: "RG1", cpf: "111.222.333-44", uuid: "cand-1" },
  categoria_efetiva: "Ampla",
  classificacao: 1,
  classificacao_pcd: null,
  classificacao_nna: null,
  reclassificacoes: [],
  eliminado: false,
};

describe("EliminacaoReclassificacaoCandidatoTela", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    formState.useFilterValues = false;
    queryClient.clear();
    mockGetCandidatosHabilitados.mockReturnValue({ response: Promise.resolve({ results: [] }), abort: () => {} });
  });

  describe("renderização e breadcrumb", () => {
    it("renderiza título e breadcrumb e navega ao clicar em Home", () => {
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      expect(screen.getByTestId("title")).toHaveTextContent("Eliminação e Reclassificação de Candidato");
      fireEvent.click(screen.getByTestId("breadcrumb-0"));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  describe("filtros e botões", () => {
    it("botão Filtrar está desabilitado sem concurso e cargo selecionados", () => {
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      expect(screen.getByRole("button", { name: /filtrar/i })).toBeDisabled();
    });

    it("ao limpar, reseta filtros e paginação", () => {
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /limpar/i }));
      expect(screen.getByPlaceholderText(/digite o nome/i)).toHaveValue("");
    });
  });

  describe("handleFiltrar e useGetHablitados", () => {
    it("ao filtrar com concurso e cargo, chama useGetHablitados com params e atualiza tabela quando há dados", async () => {
      formState.useFilterValues = true;
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([habilitadoItem]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(mockGetCandidatosHabilitados).toHaveBeenCalled());
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());
      formState.useFilterValues = false;
    });
  });

  describe("tabela e filteredRows", () => {
    it("exibe texto de reclassificação quando há linhas na tabela com reclassificações", async () => {
      formState.useFilterValues = true;
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([{ ...habilitadoItem, reclassificacoes: [{ desclassificado_de: "PCD" }] }]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText(/\* Candidato reclassificado/)).toBeInTheDocument(), { timeout: 5000 });
      formState.useFilterValues = false;
    });
  });

  describe("modal e alterar situação", () => {
    it("abre modal ao clicar em alterar e fecha ao cancelar", async () => {
      formState.useFilterValues = true;
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([habilitadoItem]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());
      fireEvent.click(document.querySelector(".anticon-edit")!);
      await waitFor(() => expect(screen.getByTestId("modal-alterar")).toBeInTheDocument());
      fireEvent.click(screen.getByTestId("modal-cancelar"));
      await waitFor(() => expect(screen.queryByTestId("modal-alterar")).not.toBeInTheDocument());
      formState.useFilterValues = false;
    });

    it("ao salvar no modal atualiza situacao da linha e fecha modal", async () => {
      formState.useFilterValues = true;
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([habilitadoItem]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());
      fireEvent.click(document.querySelector(".anticon-edit")!);
      await waitFor(() => expect(screen.getByTestId("modal-alterar")).toBeInTheDocument());
      fireEvent.click(screen.getByTestId("modal-salvar"));
      await waitFor(() => expect(screen.queryByTestId("modal-alterar")).not.toBeInTheDocument());
      formState.useFilterValues = false;
    });
  });

  describe("candidato eliminado não permite clicar em alterar", () => {
    it("ícone de alterar não abre modal quando situação é Eliminado", async () => {
      formState.useFilterValues = true;
      const eliminado = { ...habilitadoItem, eliminado: true };
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([eliminado]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument(), { timeout: 5000 });
      const iconeEliminado = document.querySelector(".anticon-edit");
      if (iconeEliminado) fireEvent.click(iconeEliminado);
      expect(screen.queryByTestId("modal-alterar")).not.toBeInTheDocument();
      formState.useFilterValues = false;
    });
  });

  describe("paginação", () => {
    it("tabela está presente na tela", () => {
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  describe("useEffect habilitadosData - mapeamento", () => {
    it("mapeia lista de habilitados para linhas da tabela (inclui reclassificações)", async () => {
      formState.useFilterValues = true;
      mockGetCandidatosHabilitados.mockReturnValue({
        response: Promise.resolve([
          { ...habilitadoItem, reclassificacoes: [{ desclassificado_de: "PCD" }], candidato: { ...habilitadoItem.candidato } },
        ]),
        abort: () => {},
      });
      render(<EliminacaoReclassificacaoCandidatoTela />, { wrapper });
      fireEvent.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());
      expect(screen.getByText(/\* Candidato reclassificado/)).toBeInTheDocument();
      formState.useFilterValues = false;
    });
  });
});

describe("useGetHablitados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCandidatosHabilitados.mockReturnValue({ response: Promise.resolve([]), abort: () => {} });
  });

  it("retorna dados e estados quando enabled é true", async () => {
    const data = [{ uuid: "1" }];
    mockGetCandidatosHabilitados.mockReturnValue({ response: Promise.resolve(data), abort: () => {} });
    const { result } = renderHook(() => useGetHablitados({ lote__concurso_uuid: "c1" }, true), { wrapper });
    await waitForHook(() => expect(result.current.habilitadosData).toBeDefined());
    expect(result.current.habilitadosIsLoading).toBe(false);
    expect(result.current.habilitadosRefetch).toBeDefined();
  });

  it("não dispara query quando enabled é false", () => {
    renderHook(() => useGetHablitados(undefined, false), { wrapper });
    expect(mockGetCandidatosHabilitados).not.toHaveBeenCalled();
  });

  it("repassa axiosRequestConfig para getCandidatosHabilitados", async () => {
    mockGetCandidatosHabilitados.mockReturnValue({ response: Promise.resolve([]), abort: () => {} });
    renderHook(() => useGetHablitados({ x: "y" }, true, { timeout: 5000 }), { wrapper });
    await waitForHook(() => expect(mockGetCandidatosHabilitados).toHaveBeenCalled());
    expect(mockGetCandidatosHabilitados).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ timeout: 5000 }));
  });
});

describe("usePostHabilitadoEliminar", () => {
  const invalidateSpy = jest.spyOn(QueryClient.prototype, "invalidateQueries");
  const notificationSuccess = jest.spyOn(require("antd").notification, "success").mockImplementation(() => ({}));

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostHabilitadoEliminar.mockReturnValue({ response: Promise.resolve({}) });
  });

  it("chama postHabilitadoEliminar, invalida getHabilitados e exibe notificação em sucesso", async () => {
    const { result } = renderHook(() => usePostHabilitadoEliminar(), { wrapper });
    await waitForHook(() => {
      result.current.mutate({ candidato_uuid: "c1", motivo: "Motivo" });
    });
    await waitForHook(() => expect(mockPostHabilitadoEliminar).toHaveBeenCalledWith({ candidato_uuid: "c1", motivo: "Motivo" }, undefined));
    await waitForHook(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["getHabilitados"] }));
    expect(notificationSuccess).toHaveBeenCalledWith(expect.objectContaining({ message: "Candidato eliminado com sucesso" }));
  });

  it("aceita axiosRequestConfig opcional", async () => {
    mockPostHabilitadoEliminar.mockReturnValue({ response: Promise.resolve({}) });
    const { result } = renderHook(() => usePostHabilitadoEliminar({ timeout: 1000 }), { wrapper });
    result.current.mutate({ candidato_uuid: "c1", motivo: "m" });
    await waitForHook(() => expect(mockPostHabilitadoEliminar).toHaveBeenCalledWith(expect.any(Object), { timeout: 1000 }));
  });
});

describe("usePostReclassificarCandidato", () => {
  const invalidateSpy = jest.spyOn(QueryClient.prototype, "invalidateQueries");
  const notificationSuccess = jest.spyOn(require("antd").notification, "success").mockImplementation(() => ({}));

  beforeEach(() => {
    jest.clearAllMocks();
    mockPostReclassificarCandidato.mockReturnValue({ response: Promise.resolve({}) });
  });

  it("chama postReclassificarCandidato, invalida getHabilitados e exibe notificação em sucesso", async () => {
    const { result } = renderHook(() => usePostReclassificarCandidato(), { wrapper });
    result.current.mutate({ candidato_uuid: "c1", desclassificar_de: "PCD", motivo: "Motivo" });
    await waitForHook(() => expect(mockPostReclassificarCandidato).toHaveBeenCalledWith(
      { candidato_uuid: "c1", desclassificar_de: "PCD", motivo: "Motivo" },
      undefined
    ));
    await waitForHook(() => expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["getHabilitados"] }));
    expect(notificationSuccess).toHaveBeenCalledWith(expect.objectContaining({ message: "Candidato reclassificado com sucesso" }));
  });

  it("aceita axiosRequestConfig opcional", async () => {
    mockPostReclassificarCandidato.mockReturnValue({ response: Promise.resolve({}) });
    const { result } = renderHook(() => usePostReclassificarCandidato({ timeout: 1000 }), { wrapper });
    result.current.mutate({ candidato_uuid: "c1", desclassificar_de: "NNA", motivo: "m" });
    await waitForHook(() => expect(mockPostReclassificarCandidato).toHaveBeenCalledWith(expect.any(Object), { timeout: 1000 }));
  });
});
