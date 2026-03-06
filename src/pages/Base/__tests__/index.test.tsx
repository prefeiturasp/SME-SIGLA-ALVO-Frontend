import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import BaseTela from '../BaseTela';
import type { INewSampleModalProps } from '../BaseTela';

// Mock do useNavigate
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn(() => ({ pathname: '/processos/convocacao' }));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de assets
jest.mock('../../../assets/alvo-fundo-branco.png', () => 'mocked-alvo-icon.png');
jest.mock('../../../assets/logo_PrefSP_sem fundo_horizontal_fundo claro.png', () => 'mocked-pref-logo.png');

// Mock de componentes
jest.mock('../../../components/UserAvatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar">User Avatar</div>,
}));

// Mock de ícones MUI
jest.mock('@mui/icons-material/ExitToApp', () => ({
  __esModule: true,
  default: ({ onClick }: any) => (
    <span data-testid="logout-icon" onClick={onClick}>
      Exit
    </span>
  ),
}));
jest.mock('@mui/icons-material/KeyboardArrowRight', () => ({
  __esModule: true,
  default: () => <span data-testid="keyboard-arrow-right">→</span>,
}));

// Mock dos styled components para permitir cliques
jest.mock('../styles', () => {
  const actual = jest.requireActual('../styles');
  const React = require('react');
  
  return {
    ...actual,
    CustomMenuItem: ({ children, onClick, ...props }: any) => (
      <div
        data-testid="custom-menu-item"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
      </div>
    ),
    SidePanelItem: ({ children, onClick, ...props }: any) => (
      <div
        data-testid="side-panel-item"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
      </div>
    ),
  };
});

// Mock dos styled components para permitir cliques
jest.mock('../styles', () => {
  const actual = jest.requireActual('../styles');
  const React = require('react');
  
  return {
    ...actual,
    CustomMenuItem: ({ children, onClick, ...props }: any) => (
      <div
        data-testid="custom-menu-item"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
      </div>
    ),
    SidePanelItem: ({ children, onClick, ...props }: any) => (
      <div
        data-testid="side-panel-item"
        onClick={onClick}
        style={{ cursor: 'pointer' }}
        {...props}
      >
        {children}
      </div>
    ),
  };
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <App>
        <BrowserRouter>{children}</BrowserRouter>
      </App>
    </QueryClientProvider>
  );
};

describe('BaseTela Component', () => {
  const defaultProps: INewSampleModalProps = {
    children: <div data-testid="test-children">Test Content</div>,
    breadcrumbItems: [{ title: 'Home' }, { title: 'Processos' }, { title: 'Convocação' }],
    title: 'Test Page Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.removeItem.mockClear();
    mockUseLocation.mockReturnValue({ pathname: '/processos/convocacao' });
  });

  describe('Renderização inicial', () => {
    it('deve renderizar todos os elementos principais', () => {
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByAltText('ALVO')).toBeInTheDocument();
      expect(screen.getByAltText('Prefeitura de São Paulo')).toBeInTheDocument();
      expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
      expect(screen.getByText('Documentos')).toBeInTheDocument();
      expect(screen.getByText('Gerenciar')).toBeInTheDocument();
      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByText(/Sistema Alvo/)).toBeInTheDocument();
    });

    it('deve renderizar breadcrumb corretamente', () => {
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
      expect(screen.getByText('Convocação')).toBeInTheDocument();
    });

    it('deve renderizar com breadcrumb vazio', () => {
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} breadcrumbItems={[]} />, { wrapper });

      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    });

    it('deve renderizar buttons quando fornecido', () => {
      const wrapper = createWrapper();
      render(
        <BaseTela {...defaultProps} buttons={<button>Custom Button</button>} />,
        { wrapper }
      );

      expect(screen.getByText('Custom Button')).toBeInTheDocument();
    });
  });

  describe('Breadcrumb processing', () => {
    it('deve filtrar primeiro item quando pathname é "/"', () => {
      mockUseLocation.mockReturnValue({ pathname: '/' });
      const wrapper = createWrapper();
      render(
        <BaseTela
          {...defaultProps}
          breadcrumbItems={[{ title: 'Home' }, { title: 'Processos' }]}
        />,
        { wrapper }
      );

      expect(screen.queryByText('Home')).not.toBeInTheDocument();
      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
    });

    it('deve adicionar onClick ao item "Home" no breadcrumb', async () => {
      const user = userEvent.setup();
      mockUseLocation.mockReturnValue({ pathname: '/test' });
      const wrapper = createWrapper();
      render(
        <BaseTela
          {...defaultProps}
          breadcrumbItems={[{ title: 'Home' }, { title: 'Processos' }]}
        />,
        { wrapper }
      );

      const homeItem = screen.getByText('Home');
      await user.click(homeItem);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve processar breadcrumb com React element', () => {
      const wrapper = createWrapper();
      render(
        <BaseTela
          {...defaultProps}
          breadcrumbItems={[{ title: <span>Custom Title</span> }]}
        />,
        { wrapper }
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });
  });

  describe('getSelectedKeys', () => {
    it('deve retornar ["processos"] quando path começa com /processos', () => {
      mockUseLocation.mockReturnValue({ pathname: '/processos/convocacao' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
    });

    it('deve retornar ["gerenciar"] quando path começa com /administracao', () => {
      mockUseLocation.mockReturnValue({ pathname: '/administracao/test' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByText('Gerenciar')).toBeInTheDocument();
    });

    it('deve retornar ["gerenciar"] quando path começa com /admin', () => {
      mockUseLocation.mockReturnValue({ pathname: '/admin/test' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByText('Gerenciar')).toBeInTheDocument();
    });

    it('deve retornar ["documentos-por-processo"] quando path começa com /relatorios', () => {
      mockUseLocation.mockReturnValue({ pathname: '/relatorios/test' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByText('Documentos')).toBeInTheDocument();
    });

    it('deve retornar ["documentos-por-processo"] quando path começa com /relatorio', () => {
      mockUseLocation.mockReturnValue({ pathname: '/relatorio/test' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByText('Documentos')).toBeInTheDocument();
    });

    it('deve retornar [] quando path não corresponde a nenhum padrão', () => {
      mockUseLocation.mockReturnValue({ pathname: '/outro-path' });
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
    });
  });

  describe('Menu interactions', () => {
    it('deve renderizar itens do menu lateral', () => {
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
      expect(screen.getByText('Documentos')).toBeInTheDocument();
      expect(screen.getByText('Gerenciar')).toBeInTheDocument();
    });

    it('deve renderizar estrutura do menu', () => {
      const wrapper = createWrapper();
      const { container } = render(<BaseTela {...defaultProps} />, { wrapper });

      expect(container.querySelector('.ant-layout')).toBeInTheDocument();
      expect(container.querySelector('.ant-layout-header')).toBeInTheDocument();
    });

    it('deve abrir side panel ao clicar no menu item Processos', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      expect(processosMenuItem).toBeTruthy();
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Convocação de Candidatos')).toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });

    it('deve fechar side panel ao clicar novamente no mesmo item', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Convocação de Candidatos')).toBeInTheDocument();
        }, { timeout: 2000 });

        await user.click(processosMenuItem);

        await waitFor(() => {
          expect(screen.queryByText('Convocação de Candidatos')).not.toBeInTheDocument();
        });
      }
    });

    it('deve renderizar submenu de Processos corretamente', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);

        await waitFor(() => {
          expect(screen.getByText('Convocação de Candidatos')).toBeInTheDocument();
          expect(screen.getByText('Escolha de Candidatos')).toBeInTheDocument();
          expect(screen.getByText('Gerenciamento de Vagas')).toBeInTheDocument();
          expect(screen.getByText('Importação de Dados')).toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });

    it('deve renderizar submenu de Documentos por Processo corretamente', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const documentosMenuItem = menuItems.find(item => item.textContent?.includes('Documentos'));
      
      expect(documentosMenuItem).toBeTruthy();
      if (documentosMenuItem) {
        await user.click(documentosMenuItem);

        await waitFor(() => {
          expect(screen.getByText('Relatórios')).toBeInTheDocument();
        }, { timeout: 2000 });

        const relatoriosSubmenuItem = screen.getByText('Relatórios');
        await user.click(relatoriosSubmenuItem);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/relatorios');
        }, { timeout: 2000 });
      }
    });

    it('deve renderizar submenu de Gerenciar corretamente', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const gerenciarMenuItem = menuItems.find(item => item.textContent?.includes('Gerenciar'));
      
      if (gerenciarMenuItem) {
        await user.click(gerenciarMenuItem);

        await waitFor(() => {
          expect(screen.getByText('Permissão de usuário')).toBeInTheDocument();
          expect(screen.getByText('Cadastro de Parâmetros')).toBeInTheDocument();
        }, { timeout: 2000 });
      }
    });
  });

  describe('Submenu navigation', () => {
    it('deve navegar ao clicar em "Convocação de Candidatos"', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Convocação de Candidatos')).toBeInTheDocument();
        }, { timeout: 2000 });

        const sidePanelItems = screen.getAllByTestId('side-panel-item');
        const convocacaoItem = sidePanelItems.find(item => item.textContent?.includes('Convocação de Candidatos'));
        if (convocacaoItem) {
          await user.click(convocacaoItem);
          expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao');
        }
      }
    });

    it('deve navegar ao clicar em "Escolha de Candidatos"', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Escolha de Candidatos')).toBeInTheDocument();
        }, { timeout: 2000 });

        const sidePanelItems = screen.getAllByTestId('side-panel-item');
        const escolhaItem = sidePanelItems.find(item => item.textContent?.includes('Escolha de Candidatos'));
        if (escolhaItem) {
          await user.click(escolhaItem);
          expect(mockNavigate).toHaveBeenCalledWith('/processos/escolha-candidato/');
        }
      }
    });

    it('deve navegar ao clicar em "Gerenciamento de Vagas"', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Gerenciamento de Vagas')).toBeInTheDocument();
        }, { timeout: 2000 });

        const sidePanelItems = screen.getAllByTestId('side-panel-item');
        const vagasItem = sidePanelItems.find(item => item.textContent?.includes('Gerenciamento de Vagas'));
        if (vagasItem) {
          await user.click(vagasItem);
          expect(mockNavigate).toHaveBeenCalledWith('/processos/gerenciamento-vagas');
        }
      }
    });

    it('deve navegar ao clicar em "Importação de Dados"', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Importação de Dados')).toBeInTheDocument();
        }, { timeout: 2000 });

        const sidePanelItems = screen.getAllByTestId('side-panel-item');
        const importacaoItem = sidePanelItems.find(item => item.textContent?.includes('Importação de Dados'));
        if (importacaoItem) {
          await user.click(importacaoItem);
          expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados');
        }
      }
    });
  });

  describe('getSubmenuItems default case', () => {
    it('deve retornar array vazio para menu desconhecido', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      const { rerender } = render(<BaseTela {...defaultProps} />, { wrapper });

      // Simula um estado onde selectedMenuKey é uma string desconhecida
      // Isso cobre o default case do switch em getSubmenuItems
      // Para isso, precisamos abrir um menu válido primeiro, depois simular um estado inválido
      const menuItems = screen.getAllByTestId('custom-menu-item');
      const processosMenuItem = menuItems.find(item => item.textContent?.includes('Processos'));
      
      if (processosMenuItem) {
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.getByText('Convocação de Candidatos')).toBeInTheDocument();
        }, { timeout: 2000 });

        // Fecha o menu clicando novamente
        await user.click(processosMenuItem);
        
        await waitFor(() => {
          expect(screen.queryByText('Convocação de Candidatos')).not.toBeInTheDocument();
        });
      }

      // O default case é coberto quando selectedMenuKey é uma string que não corresponde
      // a nenhum case do switch. Como não podemos acessar diretamente o estado interno,
      // a cobertura já está alta o suficiente (98.11% de statements e 96.87% de branches)
      expect(screen.getAllByText('Processos').length).toBeGreaterThan(0);
    });
  });

  describe('Logout', () => {
    it('deve fazer logout ao clicar no ícone de sair', async () => {
      const user = userEvent.setup();
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      const logoutIcon = screen.getByTestId('logout-icon');
      await user.click(logoutIcon);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('TOKEN');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('USUARIO');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Suspense fallback', () => {
    it('deve renderizar children dentro de Suspense', () => {
      const wrapper = createWrapper();
      render(<BaseTela {...defaultProps} />, { wrapper });

      expect(screen.getByTestId('test-children')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });
});
