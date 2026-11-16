import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Mock services to avoid axios/import.meta issues
jest.mock("../../../../services", () => ({
  __esModule: true,
  API: {
    Convocacao: {
      getDetalheCartaConvocacao: jest.fn(() => ({ response: Promise.resolve({}) })),
    },
  },
}));

// NOTE: import the SUT after mocks
const HistoricoEnvioEmailsTela = require("../HistoricoEnvioEmailsTela").default;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

// Mock do hook de histórico
jest.mock("../hooks/useGetHistoricoEnvioEmail", () => ({
  __esModule: true,
  default: () => ({
    historicoData: [
      {
        uuid: "h1",
        processo_nome: "Processo 1",
        tipo: "CONVOCACAO",
        quantidade_candidatos: 10,
        criado_em: "2026-05-20T12:34:56",
      },
      {
        uuid: "h2",
        processo_nome: "Processo 2",
        tipo: "VAGAS",
        quantidade_candidatos: 5,
        criado_em: "2026-05-21T08:10:00",
      },
    ],
    historicoIsLoading: false,
  }),
}));

// Mock EyeOutlined para facilitar o clique, preservando os demais ícones
jest.mock("@ant-design/icons", () => {
  const actual = jest.requireActual("@ant-design/icons");
  return {
    __esModule: true,
    ...actual,
    EyeOutlined: (props: any) => (
      <button aria-label="ver-detalhes" onClick={props.onClick} />
    ),
  };
});

// Mock do modal de detalhe
jest.mock("../components/DetalheEnvioEmailModal", () => ({
  __esModule: true,
  default: (props: { open: boolean; onClose: () => void }) =>
    props.open ? (
      <div>
        <span data-testid="modal-open">Modal Aberto</span>
        <button onClick={props.onClose}>Fechar</button>
      </div>
    ) : null,
}));

describe("HistoricoEnvioEmailsTela", () => {
  it("renderiza tabela com showTotal estilizado e dados do histórico", () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails/historico"]}>
          <HistoricoEnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Cabeçalho e linhas
    expect(screen.getByText("Processo")).toBeInTheDocument();
    expect(screen.getByText("Processo 1")).toBeInTheDocument();
    expect(screen.getByText("Processo 2")).toBeInTheDocument();
    expect(screen.getByText("Convocação")).toBeInTheDocument();
    expect(screen.getByText("Vagas")).toBeInTheDocument();
  });

  it("abre e fecha o modal ao acionar o botão de detalhes", async () => {
    const client = new QueryClient();
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/gerenciar/disparo-emails/historico"]}>
          <HistoricoEnvioEmailsTela />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const user = userEvent.setup();
    const btns = screen.getAllByRole("button", { name: "ver-detalhes" });
    await user.click(btns[0]);
    await waitFor(() => {
      expect(screen.getByTestId("modal-open")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Fechar"));
    await waitFor(() => {
      expect(screen.queryByTestId("modal-open")).not.toBeInTheDocument();
    });
  });
});

