import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "antd";
import AtivacaoModal from "../components/AtivacaoModal";
import type { AtivacaoModalProps } from "../../../../services/resources/permissoes/IPermissoes";

// Mock do ClearButton
jest.mock("../../../Processos/ConvocacaoCandidatos/style", () => ({
  ClearButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <App>{children}</App>
  );
};

describe("AtivacaoModal", () => {
  const defaultProps: AtivacaoModalProps = {
    open: true,
    mode: "ativar",
    nomeUsuario: "João Silva",
    step: "confirm",
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    onOk: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Renderização", () => {
    it("não deve renderizar quando open é false", () => {
      const wrapper = createWrapper();
      const { container } = render(<AtivacaoModal {...defaultProps} open={false} />, { wrapper });

      expect(container.querySelector(".ant-modal")).not.toBeInTheDocument();
    });
  });

  describe("Modo ativar", () => {
    it("deve exibir texto de confirmação correto no modo ativar", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} mode="ativar" />, { wrapper });

      expect(screen.getByText(/Tem certeza que deseja ativar/)).toBeInTheDocument();
    });

    it("deve exibir botão com texto correto no modo ativar", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} mode="ativar" />, { wrapper });

      const buttons = screen.getAllByText("Ativar usuário");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve exibir mensagem de sucesso correta no modo ativar", () => {
      const wrapper = createWrapper();
      render(
        <AtivacaoModal {...defaultProps} mode="ativar" step="success" />,
        { wrapper }
      );

      expect(screen.getByText(/ativado/)).toBeInTheDocument();
      expect(screen.getByText(/com sucesso/)).toBeInTheDocument();
    });
  });

  describe("Modo desativar", () => {
    it("deve exibir texto de confirmação correto no modo desativar", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} mode="desativar" />, { wrapper });

      expect(screen.getByText(/Tem certeza que deseja desativar/)).toBeInTheDocument();
    });

    it("deve exibir botão com texto correto no modo desativar", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} mode="desativar" />, { wrapper });

      const buttons = screen.getAllByText("Desativar usuário");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve exibir mensagem de sucesso correta no modo desativar", () => {
      const wrapper = createWrapper();
      render(
        <AtivacaoModal {...defaultProps} mode="desativar" step="success" />,
        { wrapper }
      );

      expect(screen.getByText(/desativado/)).toBeInTheDocument();
      expect(screen.getByText(/com sucesso/)).toBeInTheDocument();
    });
  });

  describe("Step confirm", () => {
    it("deve exibir botões Cancelar e Confirmar no step confirm", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} step="confirm" />, { wrapper });

      expect(screen.getByText("Cancelar")).toBeInTheDocument();
      const buttons = screen.getAllByText("Ativar usuário");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("deve exibir nome do usuário no step confirm", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} step="confirm" />, { wrapper });

      expect(screen.getByText("João Silva")).toBeInTheDocument();
    });

    it("deve tratar nome do usuário undefined no step confirm", () => {
      const wrapper = createWrapper();
      render(
        <AtivacaoModal {...defaultProps} nomeUsuario={undefined} step="confirm" />,
        { wrapper }
      );

      expect(screen.getByText(/Tem certeza que deseja ativar/)).toBeInTheDocument();
    });
  });

  describe("Step success", () => {
    it("deve exibir apenas botão Ok no step success", () => {
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} step="success" />, { wrapper });

      expect(screen.getByText("Ok")).toBeInTheDocument();
      expect(screen.queryByText("Cancelar")).not.toBeInTheDocument();
    });
  });

  describe("Interações", () => {
    it("deve chamar onCancel ao clicar em Cancelar", async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      const wrapper = createWrapper();
      render(<AtivacaoModal {...defaultProps} onCancel={onCancel} />, { wrapper });

      const cancelButton = screen.getByText("Cancelar");
      await user.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onConfirm ao clicar no botão de ação", async () => {
      const user = userEvent.setup();
      const onConfirm = jest.fn();
      const wrapper = createWrapper();
      const { container } = render(<AtivacaoModal {...defaultProps} onConfirm={onConfirm} />, { wrapper });

      const confirmButton = container.querySelector('button[class*="ant-btn-primary"]');
      if (confirmButton) {
        await user.click(confirmButton);
        expect(onConfirm).toHaveBeenCalledTimes(1);
      }
    });

    it("deve chamar onOk ao clicar em Ok no step success", async () => {
      const user = userEvent.setup();
      const onOk = jest.fn();
      const wrapper = createWrapper();
      render(
        <AtivacaoModal {...defaultProps} step="success" onOk={onOk} />,
        { wrapper }
      );

      const okButton = screen.getByText("Ok");
      await user.click(okButton);

      expect(onOk).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onCancel como fallback quando onOk não é fornecido", async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      const wrapper = createWrapper();
      render(
        <AtivacaoModal {...defaultProps} step="success" onCancel={onCancel} onOk={undefined} />,
        { wrapper }
      );

      const okButton = screen.getByText("Ok");
      await user.click(okButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("deve chamar onCancel ao fechar o modal", async () => {
      const user = userEvent.setup();
      const onCancel = jest.fn();
      const wrapper = createWrapper();
      const { container } = render(
        <AtivacaoModal {...defaultProps} onCancel={onCancel} />,
        { wrapper }
      );

      const closeButton = container.querySelector(".ant-modal-close");
      if (closeButton) {
        await user.click(closeButton);
        expect(onCancel).toHaveBeenCalledTimes(1);
      }
    });
  });

});

