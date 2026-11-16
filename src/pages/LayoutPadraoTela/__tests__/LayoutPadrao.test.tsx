import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import LayoutPadraoTela from '../LayoutPadraoTela';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock do useLayout
const mockDataLayout = {
  results: [{
    estrutura: [
      { ordem: 1, campo: 'campo1', tipoDado: 'string', tamanho: 10, regrasValidacao: 'obrigatório' },
      { ordem: 2, campo: 'campo2', tipoDado: 'number', tamanho: 5, regrasValidacao: 'opcional' },
    ]
  }]
};

const mockUseLayout = jest.fn(() => ({
  dataLayout: mockDataLayout,
  layoutIsLoading: false,
}));

jest.mock('../useLayout', () => ({
  __esModule: true,
  default: (...args: any[]) => mockUseLayout(...args),
}));

// Mock do useGetPermissions
const mockCan = jest.fn();
jest.mock('../../../routes/PermissionContextGuard', () => ({
  useGetPermissions: () => ({
    can: mockCan,
  }),
}));

// Mock do BaseTela
jest.mock('../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title }: any) => (
    <div data-testid="base-tela">
      <div data-testid="breadcrumb" data-count={breadcrumbItems?.length || 0}>
        {breadcrumbItems?.map((item: any, idx: number) => (
          <span key={idx} data-testid={`breadcrumb-item-${idx}`}>
            {typeof item.title === 'string' ? item.title : 'Link'}
          </span>
        ))}
      </div>
      <div data-testid="title">{title}</div>
      {children}
    </div>
  ),
}));

// Mock do LayoutPadrao
const mockOnVoltar = jest.fn();
jest.mock('../components/LayoutPadrao', () => ({
  __esModule: true,
  default: ({ loading, tipo, title, onVoltar, dataSource, canExportar }: any) => (
    <div data-testid="layout-padrao">
      <div data-testid="layout-loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="layout-tipo">{tipo}</div>
      <div data-testid="layout-title">{title}</div>
      <div data-testid="layout-data-source" data-count={dataSource?.length || 0}>
        {dataSource?.map((item: any, idx: number) => (
          <div key={idx} data-testid={`layout-item-${idx}`}>
            {item.campo}
          </div>
        ))}
      </div>
      <button data-testid="layout-voltar" onClick={onVoltar}>
        Voltar
      </button>
      <button data-testid="layout-exportar" disabled={!canExportar}>
        Exportar
      </button>
    </div>
  ),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

describe('LayoutPadraoTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCan.mockReturnValue(true);
    mockUseLayout.mockReturnValue({
      dataLayout: mockDataLayout,
      layoutIsLoading: false,
    });
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o componente corretamente', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('layout-padrao')).toBeInTheDocument();
    });

    it('deve renderizar breadcrumbs corretamente', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toHaveAttribute('data-count', '4');
      expect(screen.getByTestId('breadcrumb-item-0')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb-item-3')).toBeInTheDocument();
    });

    it('deve renderizar título correto', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(screen.getByTestId('title')).toHaveTextContent('Importação de dados');
    });

    it('deve usar tipo padrão VAGAS quando não fornecido', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(screen.getByTestId('layout-tipo')).toHaveTextContent('VAGAS');
    });
  });

  describe('Diferentes tipos', () => {
    it('deve renderizar título correto para tipo VAGAS', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="VAGAS" />, { wrapper });

      expect(screen.getByTestId('layout-title')).toHaveTextContent('Layout: Arquivo de Vagas');
    });

    it('deve renderizar título correto para tipo HABILITADOS', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="HABILITADOS" />, { wrapper });

      expect(screen.getByTestId('layout-title')).toHaveTextContent('Layout: Arquivo de Aprovados (HABILITADOS)');
    });

    it('deve passar o tipo correto para useLayout', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="HABILITADOS" />, { wrapper });

      expect(mockUseLayout).toHaveBeenCalledWith('HABILITADOS');
    });

    it('deve passar o tipo correto para LayoutPadrao', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="VAGAS" />, { wrapper });

      expect(screen.getByTestId('layout-tipo')).toHaveTextContent('VAGAS');
    });
  });

  describe('Dados do layout', () => {
    it('deve passar estrutura de dados corretamente para LayoutPadrao', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const dataSource = screen.getByTestId('layout-data-source');
      expect(dataSource).toHaveAttribute('data-count', '2');
      expect(screen.getByTestId('layout-item-0')).toHaveTextContent('campo1');
      expect(screen.getByTestId('layout-item-1')).toHaveTextContent('campo2');
    });

    it('deve passar array vazio quando estrutura não existe em results[0]', () => {
      mockUseLayout.mockReturnValue({
        dataLayout: { results: [{ estrutura: undefined }] },
        layoutIsLoading: false,
      });

      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const dataSource = screen.getByTestId('layout-data-source');
      expect(dataSource).toHaveAttribute('data-count', '0');
    });
  });

  describe('Loading states', () => {
    it('deve passar loading true quando layoutIsLoading é true', () => {
      mockUseLayout.mockReturnValue({
        dataLayout: mockDataLayout,
        layoutIsLoading: true,
      });

      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(screen.getByTestId('layout-loading')).toHaveTextContent('loading');
    });

    it('deve passar loading false quando layoutIsLoading é false', () => {
      mockUseLayout.mockReturnValue({
        dataLayout: mockDataLayout,
        layoutIsLoading: false,
      });

      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(screen.getByTestId('layout-loading')).toHaveTextContent('not-loading');
    });
  });

  describe('Permissões', () => {
    it('deve verificar permissão view_layoutarquivoimportacao', () => {
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      expect(mockCan).toHaveBeenCalledWith('view_layoutarquivoimportacao');
    });

    it('deve passar canExportar como true quando tem permissão', () => {
      mockCan.mockReturnValue(true);
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const exportarButton = screen.getByTestId('layout-exportar');
      expect(exportarButton).not.toBeDisabled();
    });

    it('deve passar canExportar como false quando não tem permissão', () => {
      mockCan.mockReturnValue(false);
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const exportarButton = screen.getByTestId('layout-exportar');
      expect(exportarButton).toBeDisabled();
    });
  });

  describe('Navegação', () => {
    it('deve navegar corretamente ao voltar para tipo VAGAS', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="VAGAS" />, { wrapper });

      const voltarButton = screen.getByTestId('layout-voltar');
      await user.click(voltarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados', {
        state: { tipo: 'VAGAS' },
      });
    });

    it('deve navegar corretamente ao voltar para tipo HABILITADOS', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="HABILITADOS" />, { wrapper });

      const voltarButton = screen.getByTestId('layout-voltar');
      await user.click(voltarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados', {
        state: { tipo: 'HABILITADOS' },
      });
    });

    it('deve navegar com tipo padrão quando não fornecido', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<LayoutPadraoTela />, { wrapper });

      const voltarButton = screen.getByTestId('layout-voltar');
      await user.click(voltarButton);

      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados', {
        state: { tipo: 'VAGAS' },
      });
    });
  });

  describe('Integração completa', () => {
    it('deve renderizar todos os elementos com configuração completa', () => {
      mockCan.mockReturnValue(true);
      mockUseLayout.mockReturnValue({
        dataLayout: mockDataLayout,
        layoutIsLoading: false,
      });

      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="VAGAS" />, { wrapper });

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('layout-padrao')).toBeInTheDocument();
      expect(screen.getByTestId('layout-tipo')).toHaveTextContent('VAGAS');
      expect(screen.getByTestId('layout-title')).toHaveTextContent('Layout: Arquivo de Vagas');
      expect(screen.getByTestId('layout-data-source')).toHaveAttribute('data-count', '2');
      expect(screen.getByTestId('layout-voltar')).toBeInTheDocument();
      expect(screen.getByTestId('layout-exportar')).not.toBeDisabled();
    });

    it('deve funcionar corretamente com tipo HABILITADOS e sem permissão', () => {
      mockCan.mockReturnValue(false);
      mockUseLayout.mockReturnValue({
        dataLayout: mockDataLayout,
        layoutIsLoading: false,
      });

      const wrapper = createWrapper();
      render(<LayoutPadraoTela tipo="HABILITADOS" />, { wrapper });

      expect(screen.getByTestId('layout-title')).toHaveTextContent('Layout: Arquivo de Aprovados (HABILITADOS)');
      expect(screen.getByTestId('layout-exportar')).toBeDisabled();
    });
  });
});

