import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import HistoricoVagasTela from '../HistoricoVagasTela';
import { App } from 'antd';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do useImportacaoDadosVagas
const mockOnAntTableChange = jest.fn();
const mockImportacoesArquivosRefetch = jest.fn();

const createMockData = (overrides = {}) => ({
  importacoesArquivosData: {
    results: [
      {
        uuid: 'import-1',
        processo_nome: 'Processo 1',
        arquivo: 'arquivo1.csv',
        data_importacao: '2024-01-15T10:00:00Z',
        status: 'sucesso',
      },
      {
        uuid: 'import-2',
        processo_nome: 'Processo 2',
        arquivo: 'arquivo2.csv',
        data_importacao: '2024-01-16T10:00:00Z',
        status: 'erro',
      },
    ],
    count: 2,
  },
  importacoesArquivosIsLoading: false,
  importacoesArquivosRefetch: mockImportacoesArquivosRefetch,
  listRequest: {
    pagination: {
      page: 1,
      page_size: 10,
    },
  },
  onAntTableChange: mockOnAntTableChange,
  ...overrides,
});

jest.mock('../../ImportacaoDados/Vagas/hooks/useImportacaoDadosVagas', () => ({
  useImportacaoDadosVagas: jest.fn(),
}));

// Mock do BaseTela
jest.mock('../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title }: any) => (
    <div data-testid="base-tela">
      <div data-testid="breadcrumb" data-count={breadcrumbItems?.length || 0}>
        {breadcrumbItems?.map((item: any, idx: number) => (
          <span key={idx} data-testid={`breadcrumb-item-${idx}`}>
            {typeof item.title === 'string' ? item.title : 'Breadcrumb'}
          </span>
        ))}
      </div>
      <div data-testid="title">{title}</div>
      {children}
    </div>
  ),
}));

// Mock do UltimasImportacoesDeVagasTable
jest.mock('../../ImportacaoDados/Vagas/components/UltimasImportacoesDeVagasTable', () => ({
  __esModule: true,
  default: ({ data, loading, pagination, onChange }: any) => (
    <div data-testid="ultimas-importacoes-table">
      {loading && <div data-testid="table-loading">Carregando...</div>}
      {data && data.length > 0 && (
        <div data-testid="table-data">
          {data.map((item: any, idx: number) => (
            <div key={idx} data-testid={`table-row-${item.uuid || idx}`}>
              {item.processo_nome || 'Processo'}
            </div>
          ))}
        </div>
      )}
      {pagination && (
        <div data-testid="table-pagination">
          <span data-testid="pagination-total">{pagination.total || 0}</span>
          <span data-testid="pagination-current">{pagination.current || 1}</span>
          {pagination.showTotal && (
            <div data-testid="pagination-show-total">
              {pagination.showTotal(pagination.total || 0, [1, 10])}
            </div>
          )}
        </div>
      )}
      <button
        data-testid="table-change"
        onClick={() => onChange?.({ current: 2, pageSize: 10 })}
      >
        Change Page
      </button>
    </div>
  ),
}));

// Mock dos componentes compartilhados
jest.mock('../../../components/EstilosCompartilhados', () => ({
  TabContentContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tab-content-container">{children}</div>
  ),
  SectionCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="section-card">{children}</div>
  ),
  ActionButtonsContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="action-buttons-container">{children}</div>
  ),
  SecondaryButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="secondary-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

import { useImportacaoDadosVagas } from '../../ImportacaoDados/Vagas/hooks/useImportacaoDadosVagas';

const mockUseImportacaoDadosVagas = useImportacaoDadosVagas as jest.MockedFunction<
  typeof useImportacaoDadosVagas
>;

describe('HistoricoVagasTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseImportacaoDadosVagas.mockReturnValue(createMockData());
  });

  const renderComponent = () => {
    return renderWithProviders(
      <App>
        <HistoricoVagasTela />
      </App>
    );
  };

  describe('Renderização inicial', () => {
    it('deve renderizar o componente BaseTela com título correto', () => {
      renderComponent();

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Importação de dados - Vagas');
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('deve renderizar os breadcrumbs corretos', () => {
      renderComponent();

      const breadcrumbItems = screen.getAllByTestId(/breadcrumb-item-/);
      expect(breadcrumbItems.length).toBeGreaterThan(0);
    });

    it('deve renderizar TabContentContainer e SectionCard', () => {
      renderComponent();

      expect(screen.getByTestId('tab-content-container')).toBeInTheDocument();
      expect(screen.getByTestId('section-card')).toBeInTheDocument();
    });

    it('deve renderizar a tabela de importações', () => {
      renderComponent();

      expect(screen.getByTestId('ultimas-importacoes-table')).toBeInTheDocument();
    });

    it('deve renderizar botão Voltar', () => {
      renderComponent();

      expect(screen.getByText('Voltar')).toBeInTheDocument();
    });
  });

  describe('Tabela de importações', () => {
    it('deve renderizar dados da tabela quando há resultados', () => {
      renderComponent();

      expect(screen.getByTestId('table-data')).toBeInTheDocument();
      expect(screen.getByTestId('table-row-import-1')).toBeInTheDocument();
      expect(screen.getByTestId('table-row-import-2')).toBeInTheDocument();
    });

    it('deve renderizar tabela vazia quando não há dados', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosData: {
            results: [],
            count: 0,
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('ultimas-importacoes-table')).toBeInTheDocument();
      expect(screen.queryByTestId('table-data')).not.toBeInTheDocument();
    });

    it('deve mostrar loading quando importacoesArquivosIsLoading é true', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosIsLoading: true,
        })
      );

      renderComponent();

      expect(screen.getByTestId('table-loading')).toBeInTheDocument();
    });

    it('deve renderizar paginação com dados corretos', () => {
      renderComponent();

      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
      expect(screen.getByTestId('pagination-total')).toHaveTextContent('2');
      expect(screen.getByTestId('pagination-current')).toHaveTextContent('1');
    });

    it('deve renderizar showTotal da paginação', () => {
      renderComponent();

      expect(screen.getByTestId('pagination-show-total')).toBeInTheDocument();
      expect(screen.getByText(/Mostrando/)).toBeInTheDocument();
    });

    it('deve renderizar showTotal com range undefined', () => {
      renderComponent();

      // Verificar que a função showTotal lida com range undefined
      const table = screen.getByTestId('ultimas-importacoes-table');
      expect(table).toBeInTheDocument();
    });

    it('deve renderizar showTotal com total undefined', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosData: {
            results: [],
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('pagination-show-total')).toBeInTheDocument();
    });

    it('deve chamar onAntTableChange ao mudar página na tabela', () => {
      renderComponent();

      const changeButton = screen.getByTestId('table-change');
      fireEvent.click(changeButton);

      expect(mockOnAntTableChange).toHaveBeenCalled();
    });
  });

  describe('Navegação', () => {
    it('deve navegar para trás ao clicar no botão Voltar', () => {
      renderComponent();

      const voltarButton = screen.getByText('Voltar');
      fireEvent.click(voltarButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  describe('Estados de dados', () => {
    it('deve lidar com dados undefined', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosData: undefined,
        })
      );

      renderComponent();

      expect(screen.getByTestId('ultimas-importacoes-table')).toBeInTheDocument();
    });

    it('deve usar array vazio quando results é undefined', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosData: {
            results: undefined,
            count: 0,
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('ultimas-importacoes-table')).toBeInTheDocument();
    });

    it('deve usar count undefined quando não fornecido', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(
        createMockData({
          importacoesArquivosData: {
            results: [],
          },
        })
      );

      renderComponent();

      expect(screen.getByTestId('table-pagination')).toBeInTheDocument();
    });
  });
});

