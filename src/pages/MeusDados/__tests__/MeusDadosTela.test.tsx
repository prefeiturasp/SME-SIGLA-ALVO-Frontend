import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test-utils';

const mockUseGetMeusDados = jest.fn();
jest.mock('../hooks/useGetMeusDados', () => ({
  useGetMeusDados: () => mockUseGetMeusDados(),
}));

jest.mock('../components/AlterarSenhaModal', () => {
  return function MockAlterarSenhaModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    return open ? (
      <div data-testid="alterar-senha-modal">
        <button onClick={onClose} data-testid="fechar-modal">Fechar</button>
      </div>
    ) : null;
  };
});

jest.mock('../../Base/BaseTela', () => {
  return function MockBaseTela({ children, title }: any) {
    return (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

jest.mock('../../../components/EstilosCompartilhados', () => ({
  StandardInput: ({ value, disabled }: any) => (
    <input data-testid="standard-input" value={value ?? ''} disabled={disabled} readOnly />
  ),
}));

jest.mock('../MeusDadosTela.styles', () => ({
  CardContainer: ({ children }: any) => <div data-testid="card-container">{children}</div>,
  AvatarCard: ({ children }: any) => <div data-testid="avatar-card">{children}</div>,
  NomeUsuario: ({ children }: any) => <div data-testid="nome-usuario">{children}</div>,
  InfoLine: ({ children }: any) => <div data-testid="info-line">{children}</div>,
  FieldsContainer: ({ children }: any) => <div data-testid="fields-container">{children}</div>,
  FieldLabel: ({ children }: any) => <label>{children}</label>,
  FieldRow: ({ children }: any) => <div>{children}</div>,
}));

import MeusDadosTela from '../MeusDadosTela';

const mockDados = {
  rf: '1234567',
  nome_completo: 'João da Silva',
  email: 'joao@prefeitura.sp.gov.br',
  perfil_acesso: ['Gestor'],
};

describe('MeusDadosTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe spinner enquanto carregando', () => {
    mockUseGetMeusDados.mockReturnValue({ data: undefined, isLoading: true });
    renderWithProviders(<MeusDadosTela />);
    expect(document.querySelector('.ant-spin')).toBeInTheDocument();
  });

  it('exibe dados do usuário após carregamento', () => {
    mockUseGetMeusDados.mockReturnValue({ data: mockDados, isLoading: false });
    renderWithProviders(<MeusDadosTela />);

    expect(screen.getByTestId('nome-usuario')).toHaveTextContent('João da Silva');
    expect(screen.getByTestId('info-line')).toHaveTextContent('1234567');
  });

  it('exibe "—" para nome vazio', () => {
    mockUseGetMeusDados.mockReturnValue({
      data: { ...mockDados, nome_completo: '' },
      isLoading: false,
    });
    renderWithProviders(<MeusDadosTela />);
    expect(screen.getByTestId('nome-usuario')).toHaveTextContent('—');
  });

  it('exibe os campos de email e RF nos inputs', () => {
    mockUseGetMeusDados.mockReturnValue({ data: mockDados, isLoading: false });
    renderWithProviders(<MeusDadosTela />);

    const inputs = screen.getAllByTestId('standard-input');
    const values = inputs.map((el) => el.getAttribute('value'));
    expect(values).toContain('joao@prefeitura.sp.gov.br');
    expect(values).toContain('1234567');
  });

  it('exibe perfis de acesso unidos por vírgula', () => {
    mockUseGetMeusDados.mockReturnValue({
      data: { ...mockDados, perfil_acesso: ['Gestor', 'Analista'] },
      isLoading: false,
    });
    renderWithProviders(<MeusDadosTela />);

    const inputs = screen.getAllByTestId('standard-input');
    const perfisInput = inputs.find((el) => el.getAttribute('value') === 'Gestor, Analista');
    expect(perfisInput).toBeTruthy();
  });

  it('exibe "—" quando perfil_acesso está vazio', () => {
    mockUseGetMeusDados.mockReturnValue({
      data: { ...mockDados, perfil_acesso: [] },
      isLoading: false,
    });
    renderWithProviders(<MeusDadosTela />);

    const inputs = screen.getAllByTestId('standard-input');
    const perfisInput = inputs.find((el) => el.getAttribute('value') === '—');
    expect(perfisInput).toBeTruthy();
  });

  it('abre o modal ao clicar em "Alterar senha"', async () => {
    mockUseGetMeusDados.mockReturnValue({ data: mockDados, isLoading: false });
    renderWithProviders(<MeusDadosTela />);

    expect(screen.queryByTestId('alterar-senha-modal')).not.toBeInTheDocument();
    await userEvent.click(screen.getByText('Alterar senha'));
    expect(screen.getByTestId('alterar-senha-modal')).toBeInTheDocument();
  });

  it('fecha o modal ao chamar onClose', async () => {
    mockUseGetMeusDados.mockReturnValue({ data: mockDados, isLoading: false });
    renderWithProviders(<MeusDadosTela />);

    await userEvent.click(screen.getByText('Alterar senha'));
    expect(screen.getByTestId('alterar-senha-modal')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('fechar-modal'));
    expect(screen.queryByTestId('alterar-senha-modal')).not.toBeInTheDocument();
  });
});
