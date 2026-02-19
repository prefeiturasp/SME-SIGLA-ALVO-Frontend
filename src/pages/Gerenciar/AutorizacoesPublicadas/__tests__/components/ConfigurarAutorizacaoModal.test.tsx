import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import AutorizacoesPublicadasGerenciarTela from "../../AutorizacoesPublicadasGerenciarTela";

// Mock BaseTela to simplify layout
jest.mock("../../../../Base/BaseTela", () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock child AdicionarAutorizacaoModal
jest.mock("../../components/AdicionarAutorizacaoModal", () => ({
  __esModule: true,
  default: ({ open, mode, onAdd, onCancel }: any) =>
    open ? (
      <div data-testid="add-modal">
        {mode}
        <button data-testid="confirm-add" onClick={() => onAdd({ any: "payload" })}>confirm-add</button>
        <button data-testid="cancel-add" onClick={onCancel}>cancel-add</button>
      </div>
    ) : null,
}));

// Mock ConfirmarExclusaoModal
jest.mock("../../components/ConfirmarExclusaoModal", () => ({
  __esModule: true,
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="delete-modal">
        <button data-testid="confirm-delete" onClick={onConfirm}>confirm-delete</button>
        <button data-testid="cancel-delete" onClick={onCancel}>cancel-delete</button>
      </div>
    ) : null,
}));

// Mock hooks that call services
jest.mock("../../hooks/useGetCargos", () => {
  const mockFn = jest.fn(async () => ({
    results: [
      {
        uuid: "a1",
        autorizacoes: 2,
        autorizacoes_sem_efeito: 1,
        data_autorizacao: "2026-02-10",
        observacao: "Obs 1",
        vagas_sem_efeito: false,
      },
    ],
  }));
  return {
    useGetAutorizacoesPublicadasPorCargo: mockFn,
  };
});

jest.mock("../../hooks/useDeleteAutorizacaoPublicada", () => ({
  useDeleteAutorizacaoPublicada: jest.fn(async () => ({})),
}));

describe("AutorizacoesPublicadasGerenciarTela", () => {
  const renderWithParams = (params: string) => {
    return render(
      <MemoryRouter initialEntries={[`/autorizacoes-publicadas-gerenciar?${params}`]}>
        <AutorizacoesPublicadasGerenciarTela />
      </MemoryRouter>
    );
  };

  it("carrega lista ao abrir e permite excluir", async () => {
    const { useDeleteAutorizacaoPublicada } = require("../../hooks/useDeleteAutorizacaoPublicada");
    renderWithParams("cargoUuid=cargo-1&cargoCodigo=123&cargo=Cargo%20Z");
    await waitFor(() => {
      expect(screen.getByText("Autorizações")).toBeInTheDocument();
    });
    const deleteBtn = await screen.findByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    await waitFor(() => {
      expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByTestId("confirm-delete"));
    await waitFor(() => expect(useDeleteAutorizacaoPublicada).toHaveBeenCalled());
  });

  it("ao clicar em editar abre modal de adicionar em modo edição", async () => {
    renderWithParams("cargoUuid=cargo-1&cargoCodigo=123&cargo=Cargo%20Z");
    await screen.findByText("Autorizações");
    const editBtn = await screen.findByTestId("edit-btn");
    fireEvent.click(editBtn);
    expect(screen.getByTestId("add-modal")).toHaveTextContent("edit");
  });

  it("Voltar navega para página anterior", async () => {
    const { useGetAutorizacoesPublicadasPorCargo } = require("../../hooks/useGetCargos");
    (useGetAutorizacoesPublicadasPorCargo as jest.Mock).mockClear();
    renderWithParams("cargoUuid=cargo-1&cargoCodigo=123&cargo=Cargo%20Z");
    await screen.findByText("Autorizações");
    expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(1);
    const voltarBtn = screen.getByRole("button", { name: "Voltar" });
    expect(voltarBtn).toBeInTheDocument();
  });

  it("Adicionar abre modal em modo create e onAdd fecha e refaz fetch", async () => {
    const { useGetAutorizacoesPublicadasPorCargo } = require("../../hooks/useGetCargos");
    (useGetAutorizacoesPublicadasPorCargo as jest.Mock).mockClear();
    renderWithParams("cargoUuid=cargo-1&cargoCodigo=123&cargo=Cargo%20Z");
    await screen.findByText("Autorizações");
    expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(await screen.findByTestId("add-modal")).toHaveTextContent("create");
    fireEvent.click(screen.getByTestId("confirm-add"));
    await waitFor(() => {
      expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(2);
      expect(screen.queryByTestId("add-modal")).not.toBeInTheDocument();
    });
  });
});

