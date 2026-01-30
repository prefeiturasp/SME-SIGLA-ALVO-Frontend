import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ConfigurarAutorizacaoModal from "../../components/ConfigurarAutorizacaoModal";

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

describe("ConfigurarAutorizacaoModal", () => {
  it("carrega lista ao abrir e permite excluir", async () => {
    const { useDeleteAutorizacaoPublicada } = require("../../hooks/useDeleteAutorizacaoPublicada");
    render(
      <ConfigurarAutorizacaoModal
        open
        onCancel={() => {}}
        onAdd={() => {}}
        cargoUuid="cargo-1"
        cargo="Cargo Z"
        cargoCodigo={123}
      />
    );
    await waitFor(() => {
      expect(screen.getByText("Autorizações")).toBeInTheDocument();
    });
    const deleteBtn = await screen.findByTestId("delete-btn");
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(useDeleteAutorizacaoPublicada).toHaveBeenCalled());
  });

  it("ao clicar em editar abre modal de adicionar em modo edição", async () => {
    render(
      <ConfigurarAutorizacaoModal
        open
        onCancel={() => {}}
        onAdd={() => {}}
        cargoUuid="cargo-1"
        cargo="Cargo Z"
        cargoCodigo={123}
      />
    );
    await screen.findByText("Autorizações");
    const editBtn = await screen.findByTestId("edit-btn");
    fireEvent.click(editBtn);
    expect(screen.getByTestId("add-modal")).toHaveTextContent("edit");
  });

  it("Voltar incrementa refresh e chama onCancel", async () => {
    const { useGetAutorizacoesPublicadasPorCargo } = require("../../hooks/useGetCargos");
    (useGetAutorizacoesPublicadasPorCargo as jest.Mock).mockClear();
    const onCancel = jest.fn();
    render(
      <ConfigurarAutorizacaoModal
        open
        onCancel={onCancel}
        onAdd={() => {}}
        cargoUuid="cargo-1"
        cargo="Cargo Z"
        cargoCodigo={123}
      />
    );
    await screen.findByText("Autorizações");
    expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Voltar" }));
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalled();
      expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(2);
    });
  });

  it("Adicionar abre modal em modo create e onAdd fecha e refaz fetch", async () => {
    const { useGetAutorizacoesPublicadasPorCargo } = require("../../hooks/useGetCargos");
    (useGetAutorizacoesPublicadasPorCargo as jest.Mock).mockClear();
    const onAdd = jest.fn();
    render(
      <ConfigurarAutorizacaoModal
        open
        onCancel={() => {}}
        onAdd={onAdd}
        cargoUuid="cargo-1"
        cargo="Cargo Z"
        cargoCodigo={123}
      />
    );
    await screen.findByText("Autorizações");
    expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(await screen.findByTestId("add-modal")).toHaveTextContent("create");
    fireEvent.click(screen.getByTestId("confirm-add"));
    await waitFor(() => {
      expect(onAdd).toHaveBeenCalled();
      expect(useGetAutorizacoesPublicadasPorCargo).toHaveBeenCalledTimes(2);
      expect(screen.queryByTestId("add-modal")).not.toBeInTheDocument();
    });
  });
});

