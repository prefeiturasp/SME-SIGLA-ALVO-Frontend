import React from 'react';
import { screen, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';

// Mock do useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock dos componentes filhos
jest.mock('../components/AbaRelatorios', () => {
  return function MockAbaRelatorios() {
    return <div data-testid="aba-relatorios">Aba Relatórios</div>;
  };
});

jest.mock('../components/AbaConvocacao', () => {
  return function MockAbaConvocacao() {
    return <div data-testid="aba-convocacao">Aba Convocação</div>;
  };
});

jest.mock('../components/AbaTipoUnidade', () => {
  return function MockAbaTipoUnidade() {
    return <div data-testid="aba-tipo-unidade">Aba Tipo Unidade</div>;
  };
});

// Mock do BaseTela
jest.mock('../../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title }: any) => (
    <div data-testid="base-tela">
      <div data-testid="base-title">{title}</div>
      <div data-testid="breadcrumb">
        {breadcrumbItems?.map((item: any, idx: number) => {
          const titleContent = typeof item.title === 'string' 
            ? item.title 
            : item.title?.props?.children || item.title;
          return (
            <div
              key={idx}
              data-testid={`breadcrumb-${idx}`}
              onClick={() => {
                if (typeof item.title !== 'string' && item.title?.props?.onClick) {
                  item.title.props.onClick();
                }
              }}
            >
              {titleContent}
            </div>
          );
        })}
      </div>
      {children}
    </div>
  ),
}));

import CadastroParametrosTela from '../CadastroParametrosTela';

// Wrapper para testes com QueryClient e BrowserRouter
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App>
          {children}
        </App>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('CadastroParametrosTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Renderização inicial', () => {
    it('deve renderizar o componente BaseTela com título correto', () => {
      render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('base-title')).toHaveTextContent('Cadastro de Parâmetros');
    });

    it('deve renderizar breadcrumbs corretos', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('breadcrumb-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-1')).toHaveTextContent('Gerenciar');
      expect(screen.getByTestId('breadcrumb-2')).toHaveTextContent('Cadastro de Parâmetros');
    });

    it('deve renderizar a aba Relatório por padrão', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('aba-relatorios')).toBeInTheDocument();
      expect(screen.queryByTestId('aba-convocacao')).not.toBeInTheDocument();
      expect(screen.queryByTestId('aba-tipo-unidade')).not.toBeInTheDocument();
    });

    it('deve renderizar todas as abas no componente Tabs', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Relatório')).toBeInTheDocument();
      expect(screen.getByText('Convocação')).toBeInTheDocument();
      expect(screen.getByText('Tipos de Unidade')).toBeInTheDocument();
    });
  });

  describe('Navegação via breadcrumbs', () => {
    it('deve navegar para home ao clicar no breadcrumb Home', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      const homeBreadcrumb = screen.getByTestId('breadcrumb-0');
      fireEvent.click(homeBreadcrumb);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar para gerenciar ao clicar no breadcrumb Gerenciar', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      const gerenciarBreadcrumb = screen.getByTestId('breadcrumb-1');
      fireEvent.click(gerenciarBreadcrumb);

      expect(mockNavigate).toHaveBeenCalledWith('/gerenciar');
    });

    it('não deve navegar ao clicar no breadcrumb atual (Cadastro de Parâmetros)', () => {
      require('@testing-library/react').render(
        <CadastroParametrosTela />,
        { wrapper: createWrapper() }
      );

      const cadastroBreadcrumb = screen.getByTestId('breadcrumb-2');
      fireEvent.click(cadastroBreadcrumb);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});

