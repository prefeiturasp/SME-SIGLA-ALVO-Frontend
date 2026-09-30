import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../../services", () => ({
  __esModule: true,
  API: {
    Convocacao: {
      postHistoricoCandidatos: jest.fn(),
    },
  },
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockUseHistoricoCandidatos = jest.fn();
jest.mock("../hooks/useHistoricoCandidatos", () => ({
  useHistoricoCandidatos: (...args: unknown[]) =>
    mockUseHistoricoCandidatos(...args),
}));

jest.mock("../components/TabelaHistoricoCandidatos", () => ({
  __esModule: true,
  default: ({ data, loading, mostrarDescricao }: any) => (
    <div
      data-testid="tabela-historico"
      data-loading={String(!!loading)}
      data-mostrar-descricao={String(mostrarDescricao !== false)}
      data-count={data?.length ?? 0}
    />
  ),
}));

jest.mock("../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({ title, buttons, children }: any) => (
    <div>
      <h1>{title}</h1>
      <div data-testid="base-tela-buttons">{buttons}</div>
      {children}
    </div>
  ),
}));

import HistoricoCandidatosTela from "../HistoricoCandidatosTela";

describe("HistoricoCandidatosTela", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHistoricoCandidatos.mockReturnValue({
      linhas: [{ key: "1", descricao: "Proc" }],
      carregando: false,
    });
  });

  it("renderiza título, subtítulo e passa uuids do location.state", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/processos/convocacao/historico-candidatos",
            state: { processos_uuids: ["uuid-1", "uuid-2"] },
          },
        ]}
      >
        <HistoricoCandidatosTela />
      </MemoryRouter>,
    );

    expect(screen.getByText("Histórico de candidatos")).toBeInTheDocument();
    expect(screen.getByText("Histórico de convocações")).toBeInTheDocument();
    expect(
      screen.getByText(/Consulte o histórico de convocações por categoria/),
    ).toBeInTheDocument();

    expect(mockUseHistoricoCandidatos).toHaveBeenCalledWith([
      "uuid-1",
      "uuid-2",
    ]);

    const tabela = screen.getByTestId("tabela-historico");
    expect(tabela).toHaveAttribute("data-count", "1");
    expect(tabela).toHaveAttribute("data-loading", "false");
    expect(tabela).toHaveAttribute("data-mostrar-descricao", "true");
  });

  it("usa lista vazia quando não há processos_uuids no state", () => {
    render(
      <MemoryRouter initialEntries={["/processos/convocacao/historico-candidatos"]}>
        <HistoricoCandidatosTela />
      </MemoryRouter>,
    );

    expect(mockUseHistoricoCandidatos).toHaveBeenCalledWith([]);
  });

  it("exibe botão Voltar e navega para listagem de convocações", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/processos/convocacao/historico-candidatos"]}>
        <HistoricoCandidatosTela />
      </MemoryRouter>,
    );

    const voltar = screen.getByRole("button", { name: "Voltar" });
    expect(voltar).toBeInTheDocument();

    await user.click(voltar);

    expect(mockNavigate).toHaveBeenCalledWith("/processos/convocacao");
  });
});
