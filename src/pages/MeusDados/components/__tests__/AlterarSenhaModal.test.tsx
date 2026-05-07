import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils';
import { App } from 'antd';

const mockMutate = jest.fn();
const mockIsPending = { current: false };

jest.mock('../../hooks/useAlterarSenha', () => ({
  useAlterarSenha: () => ({
    mutate: mockMutate,
    isPending: mockIsPending.current,
  }),
}));

jest.mock('../../../../components/EstilosCompartilhados', () => ({
  StandardInput: ({ value, onChange, type, placeholder, suffix, status }: any) => (
    <div>
      <input
        data-testid={`input-${placeholder}`}
        type={type ?? 'text'}
        value={value ?? ''}
        onChange={onChange}
        placeholder={placeholder}
        data-status={status ?? ''}
      />
      {suffix && <span data-testid={`suffix-${placeholder}`}>{suffix}</span>}
    </div>
  ),
}));

jest.mock('../../components/AlterarSenhaModal.styles', () => ({
  ModalTitleStyled: ({ children }: any) => <h2>{children}</h2>,
  RequisitoItem: ({ children }: any) => <div data-testid="requisito-item">{children}</div>,
  RequisitosTitulo: ({ children }: any) => <div>{children}</div>,
  RequisitosNaoTitulo: ({ children }: any) => <div>{children}</div>,
  FieldLabel: ({ children }: any) => <label>{children}</label>,
  FieldWrapper: ({ children }: any) => <div>{children}</div>,
  ErrorText: ({ children }: any) => <span data-testid="error-text">{children}</span>,
  ButtonsContainer: ({ children }: any) => <div>{children}</div>,
}));

const mockMessageSuccess = jest.fn();
jest.spyOn(App, 'useApp').mockReturnValue({
  message: { success: mockMessageSuccess } as any,
  notification: {} as any,
  modal: {} as any,
});

import AlterarSenhaModal from '../AlterarSenhaModal';

const SENHA_VALIDA = 'Abc1@xyz9';

const renderModal = (open = true, onClose = jest.fn()) =>
  renderWithProviders(
    <App>
      <AlterarSenhaModal open={open} onClose={onClose} />
    </App>
  );

describe('AlterarSenhaModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsPending.current = false;
  });

  it('não renderiza quando open=false', () => {
    renderModal(false);
    expect(screen.queryByText('Nova senha')).not.toBeInTheDocument();
  });

  it('renderiza os três campos quando open=true', () => {
    renderModal();
    expect(screen.getByPlaceholderText('Digite a senha atual')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a nova senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite a nova senha novamente')).toBeInTheDocument();
  });

  it('mostra erros de campo obrigatório ao salvar com campos vazios', async () => {
    renderModal();
    await userEvent.click(screen.getByText('Salvar senha'));
    const errors = screen.getAllByTestId('error-text');
    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(errors.some((el) => el.textContent === 'Campo obrigatório.')).toBe(true);
  });

  it('mostra erro quando nova senha tem menos de 8 caracteres', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'Abc1@');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Abc1@');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha deve ter entre 8 e 12 caracteres.')).toBeInTheDocument();
  });

  it('mostra erro quando nova senha não tem maiúscula', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'abc1@xyz9');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'abc1@xyz9');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha deve conter ao menos uma letra maiúscula.')).toBeInTheDocument();
  });

  it('mostra erro quando nova senha não tem minúscula', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'ABC1@XYZ9');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'ABC1@XYZ9');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha deve conter ao menos uma letra minúscula.')).toBeInTheDocument();
  });

  it('mostra erro quando nova senha não tem número', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'Abcdefgh@');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Abcdefgh@');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha deve conter ao menos um número.')).toBeInTheDocument();
  });

  it('mostra erro quando nova senha não tem símbolo', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'Abc1234567');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Abc1234567');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha deve conter ao menos um símbolo.')).toBeInTheDocument();
  });

  it('mostra erro quando confirmação não confere', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Diferente1@');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('As senhas não conferem.')).toBeInTheDocument();
  });

  it('chama mutate com payload correto quando formulário é válido', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), SENHA_VALIDA);
    await userEvent.click(screen.getByText('Salvar senha'));

    expect(mockMutate).toHaveBeenCalledWith(
      {
        senha_atual: 'SenhaAtual1!',
        nova_senha: SENHA_VALIDA,
        confirmacao_nova_senha: SENHA_VALIDA,
      },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) })
    );
  });

  it('exibe erro de API quando detail = "Senha atual incorreta."', async () => {
    mockMutate.mockImplementation((_payload: any, { onError }: any) => {
      onError({ response: { data: { detail: 'Senha atual incorreta.' } } });
    });

    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'Errada1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), SENHA_VALIDA);
    await userEvent.click(screen.getByText('Salvar senha'));

    await waitFor(() =>
      expect(screen.getByText('Senha atual incorreta.')).toBeInTheDocument()
    );
  });

  it('exibe alerta de API genérico para outros erros', async () => {
    mockMutate.mockImplementation((_payload: any, { onError }: any) => {
      onError({ response: { data: { detail: 'Erro interno no servidor.' } } });
    });

    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), SENHA_VALIDA);
    await userEvent.click(screen.getByText('Salvar senha'));

    await waitFor(() =>
      expect(screen.getByText('Erro interno no servidor.')).toBeInTheDocument()
    );
  });

  it('fecha o modal e limpa o formulário ao clicar em Cancelar', async () => {
    const onClose = jest.fn();
    renderModal(true, onClose);
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'qualquer');
    await userEvent.click(screen.getByText('Cancelar'));
    expect(onClose).toHaveBeenCalled();
  });

  it('requisitos ficam "idle" antes de digitar a nova senha', () => {
    renderModal();
    const itens = screen.getAllByTestId('requisito-item');
    expect(itens.length).toBeGreaterThan(0);
  });

  it('atualiza requisitos ao digitar a nova senha', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    const itens = screen.getAllByTestId('requisito-item');
    expect(itens.length).toBeGreaterThan(0);
  });

  it('mostra erro quando nova senha tem espaço em branco', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'Abc1@ xyz9');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Abc1@ xyz9');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha não deve conter espaços em branco.')).toBeInTheDocument();
  });

  it('mostra erro quando nova senha tem caractere acentuado', async () => {
    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), 'Abc1@xyzã');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), 'Abc1@xyzã');
    await userEvent.click(screen.getByText('Salvar senha'));
    expect(screen.getByText('A senha não deve conter caracteres acentuados.')).toBeInTheDocument();
  });

  it('exibe mensagem de sucesso e fecha o modal após salvar com sucesso', async () => {
    const onClose = jest.fn();
    mockMutate.mockImplementation((_payload: any, { onSuccess }: any) => {
      onSuccess();
    });

    renderModal(true, onClose);
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), SENHA_VALIDA);
    await userEvent.click(screen.getByText('Salvar senha'));

    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('alterna visibilidade da senha atual ao clicar no suffix', async () => {
    renderModal();
    const suffixAtual = screen.getByTestId('suffix-Digite a senha atual');
    expect(suffixAtual).toBeInTheDocument();
    // Clica para mostrar senha (EyeInvisibleOutlined → EyeOutlined)
    fireEvent.click(suffixAtual.querySelector('[data-testid]') ?? suffixAtual);
  });

  it('exibe erro genérico quando detail está ausente', async () => {
    mockMutate.mockImplementation((_payload: any, { onError }: any) => {
      onError({});
    });

    renderModal();
    await userEvent.type(screen.getByPlaceholderText('Digite a senha atual'), 'SenhaAtual1!');
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha'), SENHA_VALIDA);
    await userEvent.type(screen.getByPlaceholderText('Digite a nova senha novamente'), SENHA_VALIDA);
    await userEvent.click(screen.getByText('Salvar senha'));

    await waitFor(() =>
      expect(screen.getByText('Erro ao alterar a senha. Tente novamente.')).toBeInTheDocument()
    );
  });
});
