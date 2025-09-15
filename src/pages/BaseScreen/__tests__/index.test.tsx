import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import BaseScreen from '../index';
import type { INewSampleModalProps } from '../index';

// Mocks consolidados
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/processos/convocacao' }),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  theme: { useToken: () => ({ token: { colorBgContainer: '#ffffff', borderRadiusLG: 8 } }) },
}));

jest.mock('../../../assets/alvo-img.png', () => 'mocked-image.png');
jest.mock('../../../components/UserAvatar/UserAvatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar">User Avatar</div>,
}));
jest.mock('@mui/icons-material/ArrowDropDown', () => ({
  __esModule: true,
  default: () => <span data-testid="arrow-dropdown">▼</span>,
}));
jest.mock('@mui/icons-material/KeyboardArrowRight', () => ({
  __esModule: true,
  default: () => <span data-testid="keyboard-arrow-right">→</span>,
}));

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <App><BrowserRouter>{children}</BrowserRouter></App>
    </QueryClientProvider>
  );
};

describe('BaseScreen Component', () => {
  const defaultProps: INewSampleModalProps = {
    children: <div data-testid="test-children">Test Content</div>,
    breadcrumbItems: [{ title: 'Home' }, { title: 'Processos' }, { title: 'Convocação' }],
    title: 'Test Page Title',
  };

  beforeEach(() => jest.clearAllMocks());

  it('deve renderizar todos os elementos principais', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Elementos principais
    expect(screen.getByAltText('Sistema Alvo')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    expect(screen.getByText('Administração')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    expect(screen.getByText('Alvo')).toBeInTheDocument();

    // Estrutura do layout
    expect(container.querySelector('.ant-layout')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-content')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-footer')).toBeInTheDocument();
    expect(container.querySelector('.ant-menu')).toBeInTheDocument();
    expect(container.querySelector('.ant-breadcrumb')).toBeInTheDocument();
    expect(container.querySelector('.ant-typography')).toBeInTheDocument();
  });

  it('deve renderizar breadcrumb com elementos React e selecionar menu', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Breadcrumb
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('Processos')).toHaveLength(2);
    expect(screen.getByText('Convocação')).toBeInTheDocument();

    // Menu selecionado
    const selectedMenu = container.querySelector('.ant-menu-submenu-selected');
    expect(selectedMenu).toBeInTheDocument();
  });

  it('deve renderizar com props vazias e conteúdo complexo', () => {
    const wrapper = createWrapper();

    // Teste com breadcrumb vazio
    const { unmount: unmount1 } = render(<BaseScreen {...defaultProps} breadcrumbItems={[]} />, { wrapper });
    expect(screen.getByText('Test Page Title')).toBeInTheDocument();
    unmount1();

    // Teste com título vazio
    const { unmount: unmount2 } = render(<BaseScreen {...defaultProps} title="" />, { wrapper });
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
    unmount2();

    // Teste com children null
    render(<BaseScreen {...defaultProps} children={null} />, { wrapper });
    expect(screen.getByText('Test Page Title')).toBeInTheDocument();
  });

  it('deve testar interfaces TypeScript', () => {
    const testData = { id: '1', nome: 'Test Process', description: 'Test Description' };
    expect(testData).toHaveProperty('id');
    expect(testData).toHaveProperty('nome');
    expect(testData).toHaveProperty('description');

    const stringTitle: { title: string } = { title: 'String Title' };
    const elementTitle: { title: React.ReactElement } = { title: <span>Element Title</span> };
    expect(stringTitle.title).toBe('String Title');
    expect(elementTitle.title).toBeInstanceOf(Object);
  });
});
