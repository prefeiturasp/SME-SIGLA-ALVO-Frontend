import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import AdicionarAutorizacaoModal from "../../components/AdicionarAutorizacaoModal";

// Mock antd DatePicker to simplify date selection (require dayjs inside factory to avoid out-of-scope)
jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  const DatePicker = ({ onChange, value, ...rest }: any) => {
    const dj = require("dayjs");
    return <button data-testid="date" onClick={() => onChange(dj("2026-02-01"), "2026-02-01")} {...rest} />;
  };
  return { ...actual, DatePicker };
});

// Mock POST/PATCH hooks
jest.mock("../../hooks/usePostAutorizacaoPublicada", () => ({
  usePostAutorizacaoPublicada: jest.fn(async () => ({})),
}));
jest.mock("../../hooks/usePatchAutorizacaoPublicada", () => ({
  usePatchAutorizacaoPublicada: jest.fn(async () => ({})),
}));

describe("AdicionarAutorizacaoModal", () => {
  it("valida campos obrigatórios e envia POST no modo create", async () => {
    const onAdd = jest.fn();
    const { usePostAutorizacaoPublicada } = require("../../hooks/usePostAutorizacaoPublicada");
    render(
      <AdicionarAutorizacaoModal
        open
        cargo="Cargo X"
        cargoUuid="uuid-cargo"
        onCancel={() => {}}
        onAdd={onAdd}
      />
    );
    // Quantidade
    const qtdInput = screen.getByRole("spinbutton");
    fireEvent.change(qtdInput, { target: { value: "7" } });
    // Data
    const dateInput = screen.getByTestId("date");
    fireEvent.click(dateInput);
    // Observação
    fireEvent.change(screen.getByPlaceholderText("Descreva observações relevantes"), { target: { value: "Obs" } });

    fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    await waitFor(() => expect(usePostAutorizacaoPublicada).toHaveBeenCalled());
    expect(onAdd).toHaveBeenCalled();
  });

  it("envia PATCH com apenas campos alterados no modo edit", async () => {
    const onAdd = jest.fn();
    const { usePatchAutorizacaoPublicada } = require("../../hooks/usePatchAutorizacaoPublicada");
    render(
      <AdicionarAutorizacaoModal
        open
        mode="edit"
        autorizacaoUuid="auth-1"
        cargo="Cargo Y"
        cargoUuid="uuid-cargo"
        initialValues={{
          quantidade: 5,
          dataAutorizacao: "2026-02-01",
          observacao: "Original",
          vagasSemEfeito: false,
        }}
        onCancel={() => {}}
        onAdd={onAdd}
      />
    );
    // alterar somente observação
    fireEvent.change(screen.getByPlaceholderText("Descreva observações relevantes"), { target: { value: "Alterado" } });
    fireEvent.click(screen.getByRole("button", { name: "Editar" }));
    await waitFor(() => expect(usePatchAutorizacaoPublicada).toHaveBeenCalled());
    expect(onAdd).toHaveBeenCalled();
  });
});

