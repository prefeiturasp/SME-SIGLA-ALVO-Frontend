import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import MeusDadosTela from '../MeusDadosTela';

jest.mock('../hooks/useGetMeusDados', () => ({
  useGetMeusDados: jest.fn(),
}));

jest.mock('../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title }: any) => (
    <div data-testid="base-tela">
      <div data-testid="title">{title}</div>
      <div data-testid="breadcrumb">
        {breadcrumbItems?.map((item: any, idx: number) => (
          <span key={idx} data-testid={`breadcrumb-item-${idx}`}>
            {item.title}
          </span>
        ))}
      </div>
      {children}
    </div>
  ),
}));

jest.mock('../components/AlterarSenhaModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: any) => (
    <div data-testid="alterar-senha-modal" data-open={open}>
      <button data-testid="close-senha-modal" onClick={onClose}>
        Close senha
      </button>
    </div>
  ),
}));

jest.mock('../components/AlterarEmailModal', () => ({
  __esModule: true,
  default: ({ open, onClose }: any) => (
    <div data-testid="alterar-email-modal" data-open={open}>
      <button data-testid="close-email-modal" onClick={onClose}>
        Close email
      </button>
    </div>
  ),
}));

jest.mock('../../../components/EstilosCompartilhados', () => ({
  StandardInput: ({ value, disabled, type, style }: any) => (
    <input
      data-testid="standard-input"
      value={value}
      disabled={disabled}
      type={type}
      readOnly
      style={style}
    />
  ),
}));

import { useGetMeusDados } from '../hooks/useGetMeusDados';

const mockUseGetMeusDados = useGetMeusDados as jest.MockedFunction<typeof useGetMeusDados>;

const createMockData = (overrides: Partial<any> = {}) =>
  ({
    data: {
      nome_completo: 'João da Silva',
      rf: '1234567',
      email: 'joao@example.com',
      perfil_acesso: ['Administrador', 'Operador'],
      ...overrides,
    },
    isLoading: false,
  }) as any;

describe('MeusDadosTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGetMeusDados.mockReturnValue(createMockData());
  });

  describe('Renderização inicial', () => {
    it('renderiza BaseTela com título e breadcrumbs corretos', () => {
      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Meus dados');
      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Início');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Meus dados');
    });

    it('renderiza dados do usuário quando carregados', () => {
      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText('João da Silva')).toBeInTheDocument();
      expect(screen.getByText(/RF:/)).toBeInTheDocument();
      expect(screen.getByText(/1234567/)).toBeInTheDocument();
    });

    it('renderiza os labels dos campos', () => {
      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText('Nome completo')).toBeInTheDocument();
      expect(screen.getByText('E-mail')).toBeInTheDocument();
      expect(screen.getByText('Senha')).toBeInTheDocument();
      expect(screen.getByText('RF')).toBeInTheDocument();
      expect(screen.getByText('Perfil de acesso')).toBeInTheDocument();
    });

    it('renderiza os botões de alterar e-mail e alterar senha', () => {
      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText('Alterar e-mail')).toBeInTheDocument();
      expect(screen.getByText('Alterar senha')).toBeInTheDocument();
    });

    it('renderiza os modais fechados por padrão', () => {
      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByTestId('alterar-senha-modal')).toHaveAttribute('data-open', 'false');
      expect(screen.getByTestId('alterar-email-modal')).toHaveAttribute('data-open', 'false');
    });
  });

  describe('Estado de carregamento', () => {
    it('exibe Spin enquanto carrega', () => {
      mockUseGetMeusDados.mockReturnValue({ data: undefined, isLoading: true } as any);

      const { container } = renderWithProviders(<MeusDadosTela />);

      expect(container.querySelector('.ant-spin')).toBeInTheDocument();
      expect(screen.queryByText('Nome completo')).not.toBeInTheDocument();
    });

    it('não exibe Spin quando isLoading é false', () => {
      const { container } = renderWithProviders(<MeusDadosTela />);

      expect(container.querySelector('.ant-spin')).not.toBeInTheDocument();
    });
  });

  describe('Dados ausentes', () => {
    it('exibe "—" quando nome_completo está vazio', () => {
      mockUseGetMeusDados.mockReturnValue(createMockData({ nome_completo: '' }));

      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('exibe "—" quando rf está vazio', () => {
      mockUseGetMeusDados.mockReturnValue(createMockData({ rf: '' }));

      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText((_content, node) => node?.textContent === 'RF: —')).toBeInTheDocument();
    });

    it('exibe "—" quando perfil_acesso é vazio', () => {
      mockUseGetMeusDados.mockReturnValue(createMockData({ perfil_acesso: [] }));

      renderWithProviders(<MeusDadosTela />);

      const inputs = screen.getAllByTestId('standard-input') as HTMLInputElement[];
      const perfilInput = inputs[inputs.length - 1];
      expect(perfilInput.value).toBe('—');
    });

    it('lida com data undefined retornado pelo hook', () => {
      mockUseGetMeusDados.mockReturnValue({ data: undefined, isLoading: false } as any);

      renderWithProviders(<MeusDadosTela />);

      expect(screen.getByText('Nome completo')).toBeInTheDocument();
    });

    it('renderiza perfis separados por vírgula', () => {
      renderWithProviders(<MeusDadosTela />);

      const inputs = screen.getAllByTestId('standard-input') as HTMLInputElement[];
      const perfilInput = inputs[inputs.length - 1];
      expect(perfilInput.value).toBe('Administrador, Operador');
    });
  });

  describe('Interação com modais', () => {
    it('abre o modal de alterar senha ao clicar no botão', () => {
      renderWithProviders(<MeusDadosTela />);

      fireEvent.click(screen.getByText('Alterar senha'));

      expect(screen.getByTestId('alterar-senha-modal')).toHaveAttribute('data-open', 'true');
    });

    it('abre o modal de alterar e-mail ao clicar no botão', () => {
      renderWithProviders(<MeusDadosTela />);

      fireEvent.click(screen.getByText('Alterar e-mail'));

      expect(screen.getByTestId('alterar-email-modal')).toHaveAttribute('data-open', 'true');
    });

    it('fecha o modal de alterar senha ao chamar onClose', () => {
      renderWithProviders(<MeusDadosTela />);

      fireEvent.click(screen.getByText('Alterar senha'));
      expect(screen.getByTestId('alterar-senha-modal')).toHaveAttribute('data-open', 'true');

      fireEvent.click(screen.getByTestId('close-senha-modal'));
      expect(screen.getByTestId('alterar-senha-modal')).toHaveAttribute('data-open', 'false');
    });

    it('fecha o modal de alterar e-mail ao chamar onClose', () => {
      renderWithProviders(<MeusDadosTela />);

      fireEvent.click(screen.getByText('Alterar e-mail'));
      expect(screen.getByTestId('alterar-email-modal')).toHaveAttribute('data-open', 'true');

      fireEvent.click(screen.getByTestId('close-email-modal'));
      expect(screen.getByTestId('alterar-email-modal')).toHaveAttribute('data-open', 'false');
    });
  });
});
