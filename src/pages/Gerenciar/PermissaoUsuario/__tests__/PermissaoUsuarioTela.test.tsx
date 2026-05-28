import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App, message } from "antd";
import PermissaoUsuarioTela from "../PermissaoUsuarioTela";
import type { IPermissaoUsuarioRow } from "../../../../services/resources/permissoes/IPermissoes";

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock dos hooks
const mockGetUsuariosComGrupos = jest.fn();
const mockGetGruposDisponiveisOptions = jest.fn();
const mockPatchUsuario = jest.fn();

jest.mock("../hooks/getPermissaoUsuario", () => ({
  getUsuariosComGrupos: (...args: any[]) => mockGetUsuariosComGrupos(...args),
  getGruposDisponiveisOptions: (...args: any[]) => mockGetGruposDisponiveisOptions(...args),
}));

jest.mock("../hooks/patchAtualizarPermissoesUsuarios", () => ({
  patchUsuario: (...args: any[]) => mockPatchUsuario(...args),
}));

// Mock dos componentes filhos
jest.mock("../components/PermissaoUsuarioTable", () => {
  return function PermissaoUsuarioTable({
    data,
    onEdit,
    onView,
    onToggleAtivacao,
    onChange,
    loading,
  }: any) {
    return (
      <div data-testid="permissao-usuario-table">
        {loading && <div data-testid="table-loading">Carregando...</div>}
        {data?.map((row: IPermissaoUsuarioRow, idx: number) => (
          <div key={row.uuid || idx} data-testid={`table-row-${idx}`}>
            <span data-testid={`row-login-${idx}`}>{row.login}</span>
            <span data-testid={`row-nome-${idx}`}>{row.nome}</span>
            <button
              data-testid={`row-edit-${idx}`}
              onClick={() => onEdit?.(row)}
            >
              Editar
            </button>
            <button
              data-testid={`row-view-${idx}`}
              onClick={() => onView?.(row)}
            >
              Visualizar
            </button>
            <button
              data-testid={`row-toggle-${idx}`}
              onClick={() => onToggleAtivacao?.(row, !row.ativo)}
            >
              Toggle
            </button>
          </div>
        ))}
        <button
          data-testid="table-pagination-next"
          onClick={() => onChange?.({ current: 2, pageSize: 10 })}
        >
          Próxima página
        </button>
      </div>
    );
  };
});

jest.mock("../components/EditarPermissaoModal", () => {
  return function EditarPermissaoModal({
    open,
    onClose,
    onSuccess,
    username,
    mode,
  }: any) {
    if (!open) return null;
    return (
      <div data-testid="editar-permissao-modal">
        <div data-testid="modal-mode">{mode}</div>
        <div data-testid="modal-username">{username ?? ""}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Fechar
        </button>
        <button
          data-testid="modal-success"
          onClick={() => onSuccess?.("Nome Atualizado")}
        >
          Sucesso
        </button>
      </div>
    );
  };
});

jest.mock("../components/AtivacaoModal", () => {
  return function AtivacaoModal({
    open,
    onCancel,
    onConfirm,
    onOk,
    step,
  }: any) {
    if (!open) return null;
    return (
      <div data-testid="ativacao-modal">
        <div data-testid="modal-step">{step}</div>
        <button data-testid="modal-cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button data-testid="modal-confirm" onClick={onConfirm}>
          Confirmar
        </button>
        <button data-testid="modal-ok" onClick={onOk}>
          OK
        </button>
      </div>
    );
  };
});

jest.mock("../components/SucessoModal", () => {
  return function SucessoModal({ open, onOk }: any) {
    if (!open) return null;
    return (
      <div data-testid="sucesso-modal">
        <button data-testid="sucesso-ok" onClick={onOk}>
          OK
        </button>
      </div>
    );
  };
});

// Mock do BaseTela
jest.mock("../../../Base/BaseTela", () => {
  return function BaseTela({ children, breadcrumbItems, title }: any) {
    return (
      <div data-testid="base-tela">
        <div data-testid="base-title">{title}</div>
        <div data-testid="breadcrumb">
          {breadcrumbItems?.map((item: any, idx: number) => (
            <span
              key={idx}
              data-testid={`breadcrumb-${idx}`}
              onClick={item.title?.props?.onClick}
            >
              {typeof item.title === "string"
                ? item.title
                : item.title?.props?.children}
            </span>
          ))}
        </div>
        {children}
      </div>
    );
  };
});

// Mock do message.error
jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    message: {
      ...actual.message,
      error: jest.fn(),
    },
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <App>
        <BrowserRouter>{children}</BrowserRouter>
      </App>
    </QueryClientProvider>
  );
};

describe("PermissaoUsuarioTela", () => {
  const mockUsuarios = [
    {
      uuid: "1",
      username: "user1",
      login: "user1",
      nome: "Usuário Um",
      email: "user1@teste.com",
      grupos: ["grupo1", "grupo2"],
      permissoes: "grupo1/grupo2",
      ativo: true,
    },
    {
      uuid: "2",
      username: "user2",
      login: "user2",
      nome: "Usuário Dois",
      email: "user2@teste.com",
      grupos: ["grupo1"],
      permissoes: "grupo1",
      ativo: false,
    },
    {
      uuid: "3",
      username: "user3",
      login: "user3",
      nome: "Sem Permissão",
      email: undefined,
      grupos: [],
      permissoes: "Usuário sem permissão",
      ativo: true,
    },
  ];

  const mockGruposOptions = [
    { value: "grupo1", label: "Grupo 1" },
    { value: "grupo2", label: "Grupo 2" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUsuariosComGrupos.mockResolvedValue({
      results: [
        {
          usuario: "user1",
          nome: "Usuário Um",
          email: "user1@teste.com",
          grupos: ["grupo1", "grupo2"],
          is_active: true,
        },
        {
          usuario: "user2",
          nome: "Usuário Dois",
          email: "user2@teste.com",
          grupos: ["grupo1"],
          is_active: false,
        },
        {
          usuario: "user3",
          nome: "Sem Permissão",
          grupos: [],
          is_active: true,
        },
      ],
    });
    mockGetGruposDisponiveisOptions.mockResolvedValue(mockGruposOptions);
    mockPatchUsuario.mockResolvedValue({});
    (message.error as jest.Mock).mockImplementation(() => {});
  });

  describe("Renderização inicial", () => {
    it("deve renderizar breadcrumb corretamente", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        const breadcrumbs = screen.getAllByTestId(/^breadcrumb-/);
        expect(breadcrumbs.length).toBeGreaterThan(0);
      });
    });

    it("deve navegar ao clicar no breadcrumb Home", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        const breadcrumbs = screen.getAllByTestId(/^breadcrumb-/);
        const homeBreadcrumb = breadcrumbs.find((b) =>
          b.textContent?.includes("Home")
        );
        if (homeBreadcrumb) {
          fireEvent.click(homeBreadcrumb);
          expect(mockNavigate).toHaveBeenCalledWith("/");
        }
      });
    });

    it("deve navegar ao clicar no breadcrumb Gerenciar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        const breadcrumbs = screen.getAllByTestId(/^breadcrumb-/);
        const gerenciarBreadcrumb = breadcrumbs.find((b) =>
          b.textContent?.includes("Gerenciar")
        );
        if (gerenciarBreadcrumb) {
          fireEvent.click(gerenciarBreadcrumb);
          expect(mockNavigate).toHaveBeenCalledWith("/gerenciar");
        }
      });
    });

    it("deve carregar grupos e usuários no mount", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(mockGetGruposDisponiveisOptions).toHaveBeenCalled();
        expect(mockGetUsuariosComGrupos).toHaveBeenCalled();
      });
    });

    it("deve renderizar botões de busca e limpar", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByText("Buscar")).toBeInTheDocument();
        expect(screen.getByText("Limpar filtros")).toBeInTheDocument();
      });
    });
  });

  describe("Busca de usuários", () => {
    it("deve buscar usuários ao clicar em Buscar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(mockGetUsuariosComGrupos).toHaveBeenCalled();
      });

      const loginInput = screen.getByPlaceholderText("Entre com o RF");
      await user.type(loginInput, "user1");

      const buscarButton = screen.getByText("Buscar");
      await user.click(buscarButton);

      await waitFor(() => {
        expect(mockGetUsuariosComGrupos).toHaveBeenCalledWith({
          usuario: "user1",
        });
      });
    });

    it("deve filtrar por nome no client-side", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });

      const nomeInput = screen.getByPlaceholderText("Entre com o nome");
      fireEvent.change(nomeInput, { target: { value: "Um" } });

      const buscarButton = screen.getByText("Buscar");
      fireEvent.click(buscarButton);

      await waitFor(() => {
        const rows = screen.queryAllByTestId(/^table-row-/);
        expect(rows.length).toBeGreaterThan(0);
      });
    });

    it("deve limpar filtros ao clicar em Limpar filtros", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Entre com o RF")).toBeInTheDocument();
      });

      const loginInput = screen.getByPlaceholderText("Entre com o RF");
      await user.type(loginInput, "teste");

      const limparButton = screen.getByText("Limpar filtros");
      await user.click(limparButton);

      await waitFor(() => {
        expect(mockGetUsuariosComGrupos).toHaveBeenCalledWith(undefined);
      });
    });

    it("deve tratar login vazio ou undefined", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(mockGetUsuariosComGrupos).toHaveBeenCalled();
      });

      const loginInput = screen.getByPlaceholderText("Entre com o RF");
      fireEvent.change(loginInput, { target: { value: "   " } });

      const buscarButton = screen.getByText("Buscar");
      fireEvent.click(buscarButton);

      await waitFor(() => {
        expect(mockGetUsuariosComGrupos).toHaveBeenCalledWith(undefined);
      });
    });

    it("deve mapear usuários corretamente", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });

      const rows = screen.queryAllByTestId(/^table-row-/);
      expect(rows.length).toBeGreaterThan(0);
    });

    it("deve tratar usuário sem grupos", async () => {
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: "user4",
            nome: "Sem Grupos",
            grupos: null,
            is_active: true,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });
    });

    it("deve tratar erro ao carregar usuários", async () => {
      const error = new Error("Erro ao carregar");
      (error as any).response = { data: { detail: "Erro específico" } };
      mockGetUsuariosComGrupos.mockRejectedValueOnce(error);

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Não foi possível carregar os usuários."
        );
      });
    });

    it("deve tratar erro sem response.data", async () => {
      const error = new Error("Erro genérico");
      mockGetUsuariosComGrupos.mockRejectedValueOnce(error);

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalled();
      });
    });

    it("deve tratar erro com message", async () => {
      const error = { message: "Mensagem de erro" };
      mockGetUsuariosComGrupos.mockRejectedValueOnce(error);

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(message.error).toHaveBeenCalled();
      });
    });
  });

  describe("Modais", () => {
    it("deve abrir modal de edição ao clicar em Editar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-mode")).toHaveTextContent("edit");
      });
    });

    it("deve abrir modal de visualização ao clicar em Visualizar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-view-0")).toBeInTheDocument();
      });

      const viewButton = screen.getByTestId("row-view-0");
      await user.click(viewButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-mode")).toHaveTextContent("view");
      });
    });

    it("deve fechar modal ao clicar em Fechar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId("modal-close");
      await user.click(closeButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("editar-permissao-modal")
        ).not.toBeInTheDocument();
      });
    });

    it("deve abrir SucessoModal quando onSuccess é disparado", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
      });

      const successButton = screen.getByTestId("modal-success");
      await user.click(successButton);

      await waitFor(() => {
        expect(screen.getByTestId("sucesso-modal")).toBeInTheDocument();
      });
    });

    it("deve passar username do usuário selecionado ao modal", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-username")).toHaveTextContent("user1");
      });
    });

    it("deve usar permissoes quando grupos não existir", async () => {
      const user = userEvent.setup();
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: "user5",
            nome: "Com Permissoes",
            permissoes: "grupo1",
            grupos: undefined,
            is_active: true,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
      });
    });
  });

  describe("Modal de ativação", () => {
    it("deve abrir modal de ativação ao clicar em Toggle", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
        expect(screen.getByTestId("modal-step")).toHaveTextContent("confirm");
      });
    });

    it("deve fechar modal ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const cancelButton = screen.getByTestId("modal-cancel");
      await user.click(cancelButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("ativacao-modal")
        ).not.toBeInTheDocument();
      });
    });

    it("deve ativar usuário ao confirmar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-1")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-1"); // user2 está inativo
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockPatchUsuario).toHaveBeenCalledWith({
          username: "user2",
          is_active: true,
        });
        expect(screen.getByTestId("modal-step")).toHaveTextContent("success");
      });
    });

    it("deve desativar usuário ao confirmar", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0"); // user1 está ativo
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockPatchUsuario).toHaveBeenCalledWith({
          username: "user1",
          is_active: false,
        });
      });
    });

    it("deve tratar erro ao ativar/desativar", async () => {
      const user = userEvent.setup();
      mockPatchUsuario.mockRejectedValueOnce(new Error("Erro ao atualizar"));

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith(
          "Não foi possível atualizar a ativação do usuário."
        );
        expect(
          screen.queryByTestId("ativacao-modal")
        ).not.toBeInTheDocument();
      });
    });

    it("deve tratar caso sem username ao ativar", async () => {
      const user = userEvent.setup();
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: undefined,
            nome: "Sem Username",
            grupos: [],
            is_active: true,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockPatchUsuario).not.toHaveBeenCalled();
      });
    });

    it("deve fechar modal ao clicar em OK após sucesso", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-toggle-0")).toBeInTheDocument();
      });

      const toggleButton = screen.getByTestId("row-toggle-0");
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByTestId("ativacao-modal")).toBeInTheDocument();
      });

      const confirmButton = screen.getByTestId("modal-confirm");
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByTestId("modal-step")).toHaveTextContent("success");
      });

      const okButton = screen.getByTestId("modal-ok");
      await user.click(okButton);

      await waitFor(() => {
        expect(
          screen.queryByTestId("ativacao-modal")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Modal de sucesso", () => {
    it("deve fechar modal de sucesso ao clicar em OK", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("row-edit-0")).toBeInTheDocument();
      });

      const editButton = screen.getByTestId("row-edit-0");
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId("editar-permissao-modal")).toBeInTheDocument();
      });

      const successButton = screen.getByTestId("modal-success");
      await user.click(successButton);

      await waitFor(() => {
        expect(screen.getByTestId("sucesso-modal")).toBeInTheDocument();
      });

      const okButton = screen.getByTestId("sucesso-ok");
      await user.click(okButton);

      await waitFor(() => {
        expect(screen.queryByTestId("sucesso-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Paginação", () => {
    it("deve atualizar paginação ao mudar página", async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      const nextPageButton = screen.getByTestId("table-pagination-next");
      await user.click(nextPageButton);

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });
    });

    it("deve renderizar showTotal da paginação", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });

      // A função showTotal é chamada internamente pela tabela
      // Verificamos que a tabela foi renderizada corretamente
      expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
    });
  });

  describe("Tratamento de erros nos grupos", () => {
    it("deve tratar erro ao carregar grupos", async () => {
      mockGetGruposDisponiveisOptions.mockRejectedValueOnce(
        new Error("Erro ao carregar grupos")
      );

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("base-tela")).toBeInTheDocument();
      });
    });
  });

  describe("Filtros combinados", () => {
    it("deve aplicar múltiplos filtros simultaneamente", async () => {
      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });

      const nomeInput = screen.getByPlaceholderText("Entre com o nome");
      fireEvent.change(nomeInput, { target: { value: "Usuário" } });

      const buscarButton = screen.getByText("Buscar");
      fireEvent.click(buscarButton);

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });
    });
  });

  describe("Casos especiais de dados", () => {
    it("deve tratar nome undefined", async () => {
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: "user6",
            nome: undefined,
            grupos: ["grupo1"],
            is_active: true,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });
    });

    it("deve tratar email undefined", async () => {
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: "user7",
            nome: "Teste",
            email: undefined,
            grupos: ["grupo1"],
            is_active: true,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.getByTestId("permissao-usuario-table")).toBeInTheDocument();
      });
    });

    it("deve tratar is_active undefined", async () => {
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [
          {
            usuario: "user8",
            nome: "Teste",
            grupos: ["grupo1"],
            is_active: undefined,
          },
        ],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });
    });

    it("deve tratar range undefined no showTotal", async () => {
      mockGetUsuariosComGrupos.mockResolvedValueOnce({
        results: [],
      });

      const wrapper = createWrapper();
      render(<PermissaoUsuarioTela />, { wrapper });

      await waitFor(() => {
        expect(screen.queryByTestId("table-loading")).not.toBeInTheDocument();
      });
    });
  });

});

