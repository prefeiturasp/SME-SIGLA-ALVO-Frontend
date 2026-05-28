import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import AlterarEmailModal from '../AlterarEmailModal';

jest.mock('../../hooks/usePostAlterarEmail', () => ({
  useAlterarEmail: jest.fn(),
}));


import { useAlterarEmail } from '../../hooks/usePostAlterarEmail';

const mockUseAlterarEmail = useAlterarEmail as jest.MockedFunction<typeof useAlterarEmail>;

const setupMutation = (overrides: Partial<any> = {}) => {
  const mutate = jest.fn();
  mockUseAlterarEmail.mockReturnValue({
    mutate,
    isPending: false,
    ...overrides,
  } as any);
  return mutate;
};

const renderModal = (props: Partial<any> = {}) => {
  const onClose = jest.fn();
  const utils = render(<AlterarEmailModal open={true} onClose={onClose} {...props} />);
  return { ...utils, onClose };
};

const fillForm = (values: { novo?: string; confirmacao?: string }) => {
  if (values.novo !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Digite o novo e-mail'), {
      target: { value: values.novo },
    });
  }
  if (values.confirmacao !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Digite o novo e-mail novamente'), {
      target: { value: values.confirmacao },
    });
  }
};

describe('AlterarEmailModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMutation();
  });

  describe('Renderização', () => {
    it('renderiza o título e os campos quando aberto', () => {
      renderModal();

      expect(screen.getByText('Alterar e-mail')).toBeInTheDocument();
      expect(screen.getByText('Novo e-mail')).toBeInTheDocument();
      expect(screen.getByText('Confirmação do novo e-mail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o novo e-mail')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite o novo e-mail novamente')).toBeInTheDocument();
    });

    it('não renderiza conteúdo quando open=false', () => {
      render(<AlterarEmailModal open={false} onClose={jest.fn()} />);

      expect(screen.queryByText('Alterar e-mail')).not.toBeInTheDocument();
    });

    it('renderiza alerta informativo', () => {
      renderModal();

      expect(
        screen.getByText(/Ao alterar a seu e-mail, ele se tornará padrão/),
      ).toBeInTheDocument();
    });

    it('renderiza botões Cancelar e Confirmar', () => {
      renderModal();

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Confirmar')).toBeInTheDocument();
    });
  });

  describe('Validação (via blur dos campos)', () => {
    it('exibe erro quando o e-mail é inválido após blur do campo', async () => {
      renderModal();
      const novoInput = screen.getByPlaceholderText('Digite o novo e-mail');
      fireEvent.change(novoInput, { target: { value: 'email-invalido' } });
      fireEvent.blur(novoInput);

      await waitFor(() => {
        expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
      });
    });

    it('exibe erro quando os e-mails não conferem após blur do campo de confirmação', async () => {
      renderModal();
      fillForm({ novo: 'novo@email.com' });
      const confirmacaoInput = screen.getByPlaceholderText('Digite o novo e-mail novamente');
      fireEvent.change(confirmacaoInput, { target: { value: 'outro@email.com' } });
      fireEvent.blur(confirmacaoInput);

      await waitFor(() => {
        expect(screen.getByText('Os e-mails não conferem.')).toBeInTheDocument();
      });
    });
  });

  describe('Submissão', () => {
    it('chama mutate com o novo e-mail trim() quando válido', async () => {
      const mutate = setupMutation();
      renderModal();
      fillForm({ novo: '  novo@email.com  ', confirmacao: '  novo@email.com  ' });

      fireEvent.click(screen.getByText('Confirmar'));

      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
          { novo_email: 'novo@email.com' },
          expect.objectContaining({ onSuccess: expect.any(Function) }),
        );
      });
    });

    it('chama onClose e reseta o formulário ao salvar com sucesso', async () => {
      const mutate = jest.fn((_payload, { onSuccess }) => onSuccess());
      mockUseAlterarEmail.mockReturnValue({ mutate, isPending: false } as any);

      const { onClose } = renderModal();
      fillForm({ novo: 'novo@email.com', confirmacao: 'novo@email.com' });

      fireEvent.click(screen.getByText('Confirmar'));

      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('não chama mutate quando o e-mail é inválido', async () => {
      const mutate = setupMutation();
      renderModal();
      const novoInput = screen.getByPlaceholderText('Digite o novo e-mail');
      fireEvent.change(novoInput, { target: { value: 'email-invalido' } });
      fireEvent.blur(novoInput);

      await waitFor(() => {
        expect(screen.getByText('Informe um e-mail válido.')).toBeInTheDocument();
      });
      expect(mutate).not.toHaveBeenCalled();
    });
  });

  describe('Estados', () => {
    it('desabilita botão Cancelar e marca botão Confirmar como loading quando isPending=true', () => {
      mockUseAlterarEmail.mockReturnValue({ mutate: jest.fn(), isPending: true } as any);

      renderModal();

      expect(screen.getByText('Cancelar').closest('button')).toBeDisabled();
      const confirmarBtn = screen.getByText('Confirmar').closest('button');
      expect(confirmarBtn?.className).toContain('ant-btn-loading');
    });
  });

  describe('Cancelar', () => {
    it('chama onClose ao clicar em Cancelar', () => {
      const { onClose } = renderModal();

      fireEvent.click(screen.getByText('Cancelar'));

      expect(onClose).toHaveBeenCalled();
    });
  });
});
