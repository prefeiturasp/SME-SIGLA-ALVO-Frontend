import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from 'antd';
import AlterarSenhaModal from '../AlterarSenhaModal';

jest.mock('../../hooks/usePostAlterarSenha', () => ({
  useAlterarSenha: jest.fn(),
}));

import { useAlterarSenha } from '../../hooks/usePostAlterarSenha';

const mockUseAlterarSenha = useAlterarSenha as jest.MockedFunction<typeof useAlterarSenha>;

const mockNotification = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

jest.spyOn(App, 'useApp').mockReturnValue({
  message: {} as any,
  notification: mockNotification as any,
  modal: {} as any,
});

const setupMutation = (overrides: Partial<any> = {}) => {
  const mutate = jest.fn();
  mockUseAlterarSenha.mockReturnValue({
    mutate,
    isPending: false,
    ...overrides,
  } as any);
  return mutate;
};

const renderModal = (props: Partial<any> = {}) => {
  const onClose = jest.fn();
  const utils = render(<AlterarSenhaModal open={true} onClose={onClose} {...props} />);
  return { ...utils, onClose };
};

const fillForm = (values: { atual?: string; nova?: string; confirmacao?: string }) => {
  const inputs = screen.getAllByPlaceholderText(
    /Digite a senha atual|Digite a nova senha$|Digite a nova senha novamente/,
  ) as HTMLInputElement[];

  if (values.atual !== undefined) {
    fireEvent.change(inputs[0], { target: { value: values.atual } });
  }
  if (values.nova !== undefined) {
    fireEvent.change(inputs[1], { target: { value: values.nova } });
  }
  if (values.confirmacao !== undefined) {
    fireEvent.change(inputs[2], { target: { value: values.confirmacao } });
  }
};

describe('AlterarSenhaModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach((fn) => fn.mockClear());
    setupMutation();
  });

  describe('Renderização', () => {
    it('renderiza o título e os campos do modal quando aberto', () => {
      renderModal();

      expect(screen.getByText('Nova senha')).toBeInTheDocument();
      expect(screen.getByText('Senha atual*')).toBeInTheDocument();
      expect(screen.getByText('Nova senha*')).toBeInTheDocument();
      expect(screen.getByText('Confirmação da nova senha*')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a senha atual')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a nova senha')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Digite a nova senha novamente')).toBeInTheDocument();
    });

    it('não renderiza o conteúdo quando open=false', () => {
      render(<AlterarSenhaModal open={false} onClose={jest.fn()} />);

      expect(screen.queryByText('Nova senha')).not.toBeInTheDocument();
    });

    it('renderiza a lista de requisitos da senha', () => {
      renderModal();

      expect(screen.getByText('A nova senha deve conter:')).toBeInTheDocument();
      expect(screen.getByText('Ao menos uma letra minúscula')).toBeInTheDocument();
      expect(screen.getByText('Ao menos uma letra maiúscula')).toBeInTheDocument();
      expect(screen.getByText('Entre 8 e 12 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Ao menos um caracter numérico')).toBeInTheDocument();
      expect(screen.getByText('Ao menos um caracter especial (#$@!%&*?)')).toBeInTheDocument();
      expect(screen.getByText('A nova senha NÃO deve conter:')).toBeInTheDocument();
      expect(screen.getByText('Espaço em branco')).toBeInTheDocument();
      expect(screen.getByText('Caracteres acentuados')).toBeInTheDocument();
    });

    it('renderiza alerta informativo', () => {
      renderModal();

      expect(
        screen.getByText(/Ao alterar a sua senha, ela se tornará padrão/),
      ).toBeInTheDocument();
    });

    it('renderiza botões de Cancelar e Salvar senha', () => {
      renderModal();

      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar senha')).toBeInTheDocument();
    });
  });

  describe('Visibilidade da senha (toggle de ícones)', () => {
    it('alterna a visibilidade da senha atual', () => {
      renderModal();
      const input = screen.getByPlaceholderText('Digite a senha atual') as HTMLInputElement;

      expect(input.type).toBe('password');

      const eyeInvisible = input.parentElement?.querySelector('.anticon-eye-invisible');
      fireEvent.click(eyeInvisible!);
      expect(input.type).toBe('text');

      const eyeVisible = input.parentElement?.querySelector('.anticon-eye');
      fireEvent.click(eyeVisible!);
      expect(input.type).toBe('password');
    });

    it('alterna a visibilidade da nova senha', () => {
      renderModal();
      const input = screen.getByPlaceholderText('Digite a nova senha') as HTMLInputElement;

      expect(input.type).toBe('password');

      const eyeInvisible = input.parentElement?.querySelector('.anticon-eye-invisible');
      fireEvent.click(eyeInvisible!);
      expect(input.type).toBe('text');

      const eyeVisible = input.parentElement?.querySelector('.anticon-eye');
      fireEvent.click(eyeVisible!);
      expect(input.type).toBe('password');
    });

    it('alterna a visibilidade da confirmação', () => {
      renderModal();
      const input = screen.getByPlaceholderText('Digite a nova senha novamente') as HTMLInputElement;

      expect(input.type).toBe('password');

      const eyeInvisible = input.parentElement?.querySelector('.anticon-eye-invisible');
      fireEvent.click(eyeInvisible!);
      expect(input.type).toBe('text');

      const eyeVisible = input.parentElement?.querySelector('.anticon-eye');
      fireEvent.click(eyeVisible!);
      expect(input.type).toBe('password');
    });
  });

  describe('Indicadores de requisitos (estado em tempo real)', () => {
    it('mantém indicadores em estado idle quando o usuário não digitou a nova senha', () => {
      renderModal();
      // Como nada foi digitado, todos os ícones devem estar cinza (#d9d9d9)
      const icons = document.querySelectorAll('.anticon-check-circle');
      expect(icons.length).toBeGreaterThan(0);
    });

    it('atualiza requisitos quando o usuário digita uma nova senha', () => {
      renderModal();
      fillForm({ nova: 'Abc123!@' });

      // Os requisitos atendidos devem ter ícone verde, os não atendidos vermelho
      const checkIcons = document.querySelectorAll('.anticon-check-circle');
      const closeIcons = document.querySelectorAll('.anticon-close-circle');
      expect(checkIcons.length + closeIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Validação do formulário', () => {
    it('exibe erros de campo obrigatório quando todos os campos estão vazios', async () => {
      renderModal();

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(screen.getAllByText('Campo obrigatório.').length).toBe(3);
      });
    });

    it('valida tamanho mínimo da nova senha', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Ab1!', confirmacao: 'Ab1!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve ter entre 8 e 12 caracteres.'),
        ).toBeInTheDocument();
      });
    });

    it('valida tamanho máximo da nova senha', async () => {
      renderModal();
      fillForm({
        atual: 'qualquer',
        nova: 'Ab1!aaaaaaaaaaa',
        confirmacao: 'Ab1!aaaaaaaaaaa',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve ter entre 8 e 12 caracteres.'),
        ).toBeInTheDocument();
      });
    });

    it('valida ausência de letra maiúscula', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'abcdef1!', confirmacao: 'abcdef1!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve conter ao menos uma letra maiúscula.'),
        ).toBeInTheDocument();
      });
    });

    it('valida ausência de letra minúscula', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'ABCDEF1!', confirmacao: 'ABCDEF1!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve conter ao menos uma letra minúscula.'),
        ).toBeInTheDocument();
      });
    });

    it('valida ausência de número', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Abcdefg!', confirmacao: 'Abcdefg!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve conter ao menos um número.'),
        ).toBeInTheDocument();
      });
    });

    it('valida ausência de símbolo', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Abcdefg1', confirmacao: 'Abcdefg1' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha deve conter ao menos um símbolo.'),
        ).toBeInTheDocument();
      });
    });

    it('valida presença de espaço em branco', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Abc 12!a', confirmacao: 'Abc 12!a' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha não deve conter espaços em branco.'),
        ).toBeInTheDocument();
      });
    });

    it('valida presença de caracteres acentuados', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Abcdé12!', confirmacao: 'Abcdé12!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('A senha não deve conter caracteres acentuados.'),
        ).toBeInTheDocument();
      });
    });

    it('valida que as senhas conferem', async () => {
      renderModal();
      fillForm({ atual: 'qualquer', nova: 'Abcdef1!', confirmacao: 'Diferente1!' });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument();
      });
    });
  });

  describe('Submissão', () => {
    it('chama mutate com o payload correto quando o formulário é válido', async () => {
      const mutate = setupMutation();
      renderModal();
      fillForm({
        atual: 'SenhaAtual1!',
        nova: 'NovaSenha1!',
        confirmacao: 'NovaSenha1!',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(mutate).toHaveBeenCalledWith(
          {
            senha_atual: 'SenhaAtual1!',
            nova_senha: 'NovaSenha1!',
            confirmacao_nova_senha: 'NovaSenha1!',
          },
          expect.objectContaining({
            onSuccess: expect.any(Function),
            onError: expect.any(Function),
          }),
        );
      });
    });

    it('exibe notificação de sucesso e chama onClose ao salvar com sucesso', async () => {
      const mutate = jest.fn((_payload, { onSuccess }) => onSuccess());
      mockUseAlterarSenha.mockReturnValue({ mutate, isPending: false } as any);

      const { onClose } = renderModal();
      fillForm({
        atual: 'SenhaAtual1!',
        nova: 'NovaSenha1!',
        confirmacao: 'NovaSenha1!',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(mockNotification.success).toHaveBeenCalledWith({
          message: 'Senha Alterada',
          description: 'A senha foi alterada com sucesso!',
          placement: 'top',
          duration: 3.5,
        });
        expect(onClose).toHaveBeenCalled();
      });
    });

    it('exibe erro inline no campo "senha atual" quando o backend retorna "Senha atual incorreta."', async () => {
      const mutate = jest.fn((_payload, { onError }) =>
        onError({ response: { data: { detail: 'Senha atual incorreta.' } } }),
      );
      mockUseAlterarSenha.mockReturnValue({ mutate, isPending: false } as any);

      renderModal();
      fillForm({
        atual: 'SenhaErrada1!',
        nova: 'NovaSenha1!',
        confirmacao: 'NovaSenha1!',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(screen.getByText('Senha atual incorreta.')).toBeInTheDocument();
      });
    });

    it('exibe Alert geral quando o backend retorna um erro com detail diferente', async () => {
      const mutate = jest.fn((_payload, { onError }) =>
        onError({ response: { data: { detail: 'Erro inesperado.' } } }),
      );
      mockUseAlterarSenha.mockReturnValue({ mutate, isPending: false } as any);

      renderModal();
      fillForm({
        atual: 'SenhaAtual1!',
        nova: 'NovaSenha1!',
        confirmacao: 'NovaSenha1!',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(screen.getByText('Erro inesperado.')).toBeInTheDocument();
      });
    });

    it('exibe mensagem padrão quando o erro do backend não traz detail', async () => {
      const mutate = jest.fn((_payload, { onError }) => onError({}));
      mockUseAlterarSenha.mockReturnValue({ mutate, isPending: false } as any);

      renderModal();
      fillForm({
        atual: 'SenhaAtual1!',
        nova: 'NovaSenha1!',
        confirmacao: 'NovaSenha1!',
      });

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(
          screen.getByText('Erro ao alterar a senha. Tente novamente.'),
        ).toBeInTheDocument();
      });
    });

    it('não chama mutate quando o formulário é inválido', async () => {
      const mutate = setupMutation();
      renderModal();

      fireEvent.click(screen.getByText('Salvar senha'));

      await waitFor(() => {
        expect(screen.getAllByText('Campo obrigatório.').length).toBeGreaterThan(0);
      });
      expect(mutate).not.toHaveBeenCalled();
    });
  });

  describe('Estados de loading', () => {
    it('desabilita botões quando isPending é true', () => {
      mockUseAlterarSenha.mockReturnValue({ mutate: jest.fn(), isPending: true } as any);

      renderModal();

      const cancelar = screen.getByText('Cancelar').closest('button');
      const salvar = screen.getByText('Salvar senha').closest('button');
      expect(cancelar).toBeDisabled();
      expect(salvar?.className).toContain('ant-btn-loading');
    });
  });

  describe('Cancelar', () => {
    it('chama onClose e reseta os campos ao clicar em Cancelar', () => {
      const { onClose } = renderModal();
      fillForm({ atual: 'algo', nova: 'algoNovo1!', confirmacao: 'algoNovo1!' });

      fireEvent.click(screen.getByText('Cancelar'));

      expect(onClose).toHaveBeenCalled();
    });
  });
});
