/**
 * Testes unitários da tela Pesquisar Concursados.
 */
import React from "react";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { theme as appTheme } from "../../../../theme";
import { renderWithProviders } from "../../../../test-utils";
import PesquisarConcursadosTela from "../PesquisarConcursadosTela";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
}));

const mockGetBuscarCandidatos = jest.fn();
jest.mock("../../../../services/resources/escolhas", () => ({
  getBuscarCandidatos: (params: Record<string, string | undefined>) => mockGetBuscarCandidatos(params),
}));

jest.mock("../../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({
    children,
    title,
    breadcrumbItems,
  }: {
    children: React.ReactNode;
    title: string;
    breadcrumbItems: unknown[];
  }) => (
    <div data-testid="base-tela">
      <h1 data-testid="page-title">{title}</h1>
      <div data-testid="breadcrumb-count">{breadcrumbItems?.length ?? 0}</div>
      {children}
    </div>
  ),
}));

jest.mock("../components/AlterarCandidatoModal", () => ({
  __esModule: true,
  default: ({
    open,
    nomeCandidato,
    onClose,
  }: {
    open: boolean;
    nomeCandidato?: string;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="modal-alterar-candidato">
        <span data-testid="modal-alterar-nome">{nomeCandidato ?? ""}</span>
        <button type="button" onClick={onClose} data-testid="modal-alterar-fechar">
          Fechar
        </button>
      </div>
    ) : null,
}));

jest.mock("../components/HistoricoCandidatoModal", () => ({
  __esModule: true,
  default: ({
    open,
    nomeCandidato,
    onClose,
  }: {
    open: boolean;
    nomeCandidato?: string;
    onClose: () => void;
  }) =>
    open ? (
      <div data-testid="modal-historico-candidato">
        <span data-testid="modal-historico-nome">{nomeCandidato ?? ""}</span>
        <button type="button" onClick={onClose} data-testid="modal-historico-fechar">
          Fechar
        </button>
      </div>
    ) : null,
}));

const MOCK_CANDIDATO = {
  uuid: "cand-1",
  nome: "Maria Silva",
  cpf: "111.222.333-44",
  rg: "12.345.678-9",
  registro_funcional: "RF001",
  concursos: [
    {
      concurso_nome: "Concurso Teste",
      concurso_uuid: "conc-1",
      concurso_candidato_uuid: "cc-1",
      descricao_cargo: "Professor",
      classificacao: 1,
      classificacao_nna: null,
      classificacao_pcd: null,
    },
  ],
};

describe("PesquisarConcursadosTela", () => {
  const renderComponent = () =>
    renderWithProviders(
      <SCThemeProvider theme={appTheme as never}>
        <PesquisarConcursadosTela />
      </SCThemeProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetBuscarCandidatos.mockImplementation(() => ({
      response: Promise.resolve([]),
      abort: jest.fn(),
    }));
  });

  it("exporta componente como default", () => {
    expect(PesquisarConcursadosTela).toBeDefined();
    expect(typeof PesquisarConcursadosTela).toBe("function");
  });

  describe("renderização e interação", () => {
    it("renderiza título, base, filtros (Nome, RF, RG, CPF) e botões Limpar/Filtrar", () => {
      renderComponent();
      expect(screen.getByTestId("page-title")).toHaveTextContent("Pesquisar Concursados");
      expect(screen.getByTestId("base-tela")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Digite o nome")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Digite o RF")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Digite o RG")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Digite o CPF")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /limpar/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /filtrar/i })).toBeInTheDocument();
    });

    it("botão Filtrar está desabilitado sem filtro e habilitado com pelo menos um filtro", async () => {
      const user = userEvent.setup();
      renderComponent();
      const btnFiltrar = screen.getByRole("button", { name: /filtrar/i });
      expect(btnFiltrar).toBeDisabled();
      await user.type(screen.getByPlaceholderText("Digite o nome"), "João");
      expect(btnFiltrar).not.toBeDisabled();
    });

    it("ao Filtrar com nome preenchido chama getBuscarCandidatos e exibe resultados", async () => {
      const user = userEvent.setup();
      mockGetBuscarCandidatos.mockImplementation(() => ({
        response: Promise.resolve([MOCK_CANDIDATO]),
        abort: jest.fn(),
      }));
      renderComponent();
      await user.type(screen.getByPlaceholderText("Digite o nome"), "Maria");
      await user.click(screen.getByRole("button", { name: /filtrar/i }));

      await waitFor(() => {
        expect(mockGetBuscarCandidatos).toHaveBeenCalledWith(
          expect.objectContaining({ nome: "Maria" })
        );
      });
      await waitFor(() => {
        expect(screen.getByText("Maria Silva")).toBeInTheDocument();
        expect(screen.getByText("Concurso Teste")).toBeInTheDocument();
        expect(screen.getByText("Professor")).toBeInTheDocument();
      });
    });

    it("ao Limpar zera filtros e tabela", async () => {
      const user = userEvent.setup();
      mockGetBuscarCandidatos.mockImplementation(() => ({
        response: Promise.resolve([{ uuid: "c-1", nome: "João", concursos: [{ concurso_nome: "Conc", concurso_candidato_uuid: "cc1" }] }]),
        abort: jest.fn(),
      }));
      renderComponent();
      await user.type(screen.getByPlaceholderText("Digite o nome"), "João");
      await user.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(screen.getByText("João")).toBeInTheDocument());

      await user.click(screen.getByRole("button", { name: /limpar/i }));
      await waitFor(() => expect(screen.getByPlaceholderText("Digite o nome")).toHaveValue(""));
      expect(screen.queryByText("João")).not.toBeInTheDocument();
    });

    it("renderiza tabela com colunas Concurso, Cargo, Candidato, RF, RG, CPF", () => {
      renderComponent();
      const table = screen.getByRole("table");
      ["Concurso", "Cargo", "Candidato", "RF", "RG", "CPF"].forEach((col) =>
        expect(within(table).getAllByText(col).length).toBeGreaterThanOrEqual(1)
      );
    });

    it("em erro na busca chama getBuscarCandidatos", async () => {
      const user = userEvent.setup();
      mockGetBuscarCandidatos.mockImplementation(() => ({
        response: Promise.reject(new Error("Erro de rede")),
        abort: jest.fn(),
      }));
      renderComponent();
      await user.type(screen.getByPlaceholderText("Digite o CPF"), "123");
      await user.click(screen.getByRole("button", { name: /filtrar/i }));
      await waitFor(() => expect(mockGetBuscarCandidatos).toHaveBeenCalled());
    });
  });
});
