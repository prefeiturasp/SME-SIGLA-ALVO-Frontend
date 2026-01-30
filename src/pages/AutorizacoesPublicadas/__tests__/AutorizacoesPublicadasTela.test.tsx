import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import AutorizacoesPublicadasTela from "../AutorizacoesPublicadasTela";

// Mock BaseTela to simplify layout
jest.mock("../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock ConfigurarAutorizacaoModal
jest.mock("../components/ConfigurarAutorizacaoModal", () => ({
  __esModule: true,
  default: ({ open, onCancel }: any) =>
    open ? (
      <div data-testid="config-modal">
        Config modal open
        <button data-testid="close-config" onClick={onCancel}>close</button>
      </div>
    ) : null,
}));

// Mock services
jest.mock("../../../services", () => {
  return {
    API: {
      Cargos: {
        getCargosAutorizacoesPublicadas: jest.fn(() => ({
          response: Promise.resolve([
            { uuid: "1", nome: "Analista de Sistemas", codigo: 1001, autorizacoes: 10, autorizacoes_sem_efeito: 0, total_escolhas: 4, data_autorizacao_mais_recente: "2026-02-10" },
            { uuid: "2", nome: "UX/UI Designer", codigo: 1010, autorizacoes: 3, autorizacoes_sem_efeito: 1, total_escolhas: 1, data_autorizacao_mais_recente: "2026-02-15" },
          ]),
          abort: () => {},
        })),
      },
    },
  };
});

describe("AutorizacoesPublicadasTela", () => {
  it("carrega e exibe cargos na tabela", async () => {
    render(
      <MemoryRouter>
        <AutorizacoesPublicadasTela />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Analista de Sistemas")).toBeInTheDocument();
      expect(screen.getByText("UX/UI Designer")).toBeInTheDocument();
    });

    // Saldo atual coluna (autorizacoes - total_escolhas, mínimo 0)
    expect(screen.getByText("6")).toBeInTheDocument(); // 10 - 4
    expect(screen.getByText("2")).toBeInTheDocument(); // 3 - 1
  });

  it("filtra somente ao clicar no botão 'Filtrar' pelo nome do cargo", async () => {
    render(
      <MemoryRouter>
        <AutorizacoesPublicadasTela />
      </MemoryRouter>
    );

    await screen.findByText("Analista de Sistemas");
    const input = screen.getByPlaceholderText("Digite um termo");
    fireEvent.change(input, { target: { value: "analista" } });

    // Ainda não filtrou
    expect(screen.getByText("Analista de Sistemas")).toBeInTheDocument();
    expect(screen.getByText("UX/UI Designer")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Filtrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Analista de Sistemas")).toBeInTheDocument();
      expect(screen.queryByText("UX/UI Designer")).not.toBeInTheDocument();
    });
  });

  it("abre o modal de gerenciamento ao clicar no ícone", async () => {
    render(
      <MemoryRouter>
        <AutorizacoesPublicadasTela />
      </MemoryRouter>
    );

    await screen.findByText("Analista de Sistemas");
    const gerenciarButtons = screen.getAllByTitle("Gerenciar");
    fireEvent.click(gerenciarButtons[0]);
    expect(screen.getByTestId("config-modal")).toBeInTheDocument();
  });

  it("onCancel do modal fecha e faz novo request", async () => {
    const { API } = require("../../../services");
    (API.Cargos.getCargosAutorizacoesPublicadas as jest.Mock).mockClear();

    render(
      <MemoryRouter>
        <AutorizacoesPublicadasTela />
      </MemoryRouter>
    );
    // 1ª chamada no mount
    await screen.findByText("Analista de Sistemas");
    expect(API.Cargos.getCargosAutorizacoesPublicadas).toHaveBeenCalledTimes(1);

    // abrir modal
    fireEvent.click(screen.getAllByTitle("Gerenciar")[0]);
    expect(screen.getByTestId("config-modal")).toBeInTheDocument();

    // onCancel
    fireEvent.click(screen.getByTestId("close-config"));

    // modal fechado e fetch reexecutado
    await waitFor(() => {
      expect(screen.queryByTestId("config-modal")).not.toBeInTheDocument();
      expect(API.Cargos.getCargosAutorizacoesPublicadas).toHaveBeenCalledTimes(2);
    });
  });
});

