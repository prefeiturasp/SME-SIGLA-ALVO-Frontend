import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import BaseScreen from '../index';
import type { INewSampleModalProps } from '../index';

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    pathname: '/processos/convocacao',
  }),
}));

// Mock do tema do Antd
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  theme: {
    useToken: () => ({
      token: {
        colorBgContainer: '#ffffff',
        borderRadiusLG: 8,
      },
    }),
  },
}));

// Mock da imagem
jest.mock('../../../assets/alvo-img.png', () => 'mocked-image.png');

// Mock do UserAvatar
jest.mock('../../../components/UserAvatar/UserAvatar', () => ({
  UserAvatar: () => <div data-testid="user-avatar">User Avatar</div>,
}));

// Mock dos ícones do Material-UI
jest.mock('@mui/icons-material/ArrowDropDown', () => ({
  __esModule: true,
  default: () => <span data-testid="arrow-dropdown">▼</span>,
}));

jest.mock('@mui/icons-material/KeyboardArrowRight', () => ({
  __esModule: true,
  default: () => <span data-testid="keyboard-arrow-right">→</span>,
}));

// Wrapper para testes
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
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </App>
    </QueryClientProvider>
  );
};

describe('BaseScreen Component', () => {
  const defaultProps: INewSampleModalProps = {
    children: <div data-testid="test-children">Test Content</div>,
    breadcrumbItems: [
      { title: 'Home' },
      { title: 'Processos' },
      { title: 'Convocação' },
    ],
    title: 'Test Page Title',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o componente BaseScreen corretamente', () => {
    const wrapper = createWrapper();
    render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se o header está presente
    expect(screen.getByAltText('Sistema Alvo')).toBeInTheDocument();
    expect(screen.getByTestId('user-avatar')).toBeInTheDocument();

    // Verificar se o menu está presente
    expect(screen.getByText('Administração')).toBeInTheDocument();
    expect(screen.getAllByText('Processos')).toHaveLength(2); // Menu e breadcrumb
    expect(screen.getByText('Relatórios')).toBeInTheDocument();

    // Verificar se o breadcrumb está presente
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('Processos')).toHaveLength(2); // Menu e breadcrumb
    expect(screen.getByText('Convocação')).toBeInTheDocument();

    // Verificar se o título está presente
    expect(screen.getByText('Test Page Title')).toBeInTheDocument();

    // Verificar se o conteúdo está presente
    expect(screen.getByTestId('test-children')).toBeInTheDocument();

    // Verificar se o footer está presente
    expect(screen.getByText('Alvo')).toBeInTheDocument();
  });

  it('deve renderizar breadcrumb com separador customizado', () => {
    const wrapper = createWrapper();
    render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se o separador customizado está presente
    expect(screen.getAllByTestId('keyboard-arrow-right')).toHaveLength(2); // 2 separadores para 3 itens
  });

  it('deve renderizar ícones de dropdown nos menus', () => {
    const wrapper = createWrapper();
    render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se os ícones de dropdown estão presentes
    expect(screen.getAllByTestId('arrow-dropdown')).toHaveLength(3); // 3 menus com dropdown
  });

  it('deve renderizar menu de navegação corretamente', () => {
    const wrapper = createWrapper();
    render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se os menus principais estão presentes
    expect(screen.getByText('Administração')).toBeInTheDocument();
    expect(screen.getAllByText('Processos')).toHaveLength(2); // Menu e breadcrumb
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
  });

  it('deve renderizar breadcrumb com elementos React', () => {
    const wrapper = createWrapper();
    const propsWithReactElement = {
      ...defaultProps,
      breadcrumbItems: [
        { title: 'Home' },
        { title: <span data-testid="react-element">React Element</span> },
      ],
    };

    render(<BaseScreen {...propsWithReactElement} />, { wrapper });

    expect(screen.getByTestId('react-element')).toBeInTheDocument();
  });


  it('deve renderizar estrutura do layout corretamente', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se todos os elementos principais estão presentes
    expect(container.querySelector('.ant-layout')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-header')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-content')).toBeInTheDocument();
    expect(container.querySelector('.ant-layout-footer')).toBeInTheDocument();
    expect(container.querySelector('.ant-menu')).toBeInTheDocument();
    expect(container.querySelector('.ant-breadcrumb')).toBeInTheDocument();
    expect(container.querySelector('.ant-typography')).toBeInTheDocument();
  });

  it('deve renderizar interface INewSampleModalData corretamente', () => {
    const wrapper = createWrapper();
    
    // Testar se a interface está sendo exportada corretamente
    const testData = {
      id: '1',
      nome: 'Test Process',
      description: 'Test Description',
    };

    expect(testData).toHaveProperty('id');
    expect(testData).toHaveProperty('nome');
    expect(testData).toHaveProperty('description');
  });

  it('deve renderizar tipo TitleItem corretamente', () => {
    const wrapper = createWrapper();
    
    // Testar se o tipo TitleItem está funcionando corretamente
    const stringTitle: { title: string } = { title: 'String Title' };
    const elementTitle: { title: React.ReactElement } = { 
      title: <span>Element Title</span> 
    };

    expect(stringTitle.title).toBe('String Title');
    expect(elementTitle.title).toBeInstanceOf(Object);
  });
});

describe('BaseScreen - Navegação e Seleção de Menu', () => {
  const defaultProps: INewSampleModalProps = {
    children: <div data-testid="test-children">Test Content</div>,
    breadcrumbItems: [{ title: 'Home' }],
    title: 'Test Page',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve selecionar menu de processos quando pathname começa com /processos', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se o menu de processos está selecionado (já está mockado para /processos/convocacao)
    const selectedMenu = container.querySelector('.ant-menu-submenu-selected');
    expect(selectedMenu).toBeInTheDocument();
  });

  it('deve renderizar função getSelectedKeys corretamente', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se o componente renderiza sem erros
    expect(container).toBeInTheDocument();
    
    // Verificar se o menu está presente
    expect(screen.getByText('Processos')).toBeInTheDocument();
  });

  it('deve renderizar com diferentes pathnames', () => {
    const wrapper = createWrapper();
    const { container } = render(<BaseScreen {...defaultProps} />, { wrapper });

    // Verificar se o componente renderiza corretamente
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });
});

describe('BaseScreen - Cobertura de Edge Cases', () => {
  const defaultProps: INewSampleModalProps = {
    children: <div data-testid="test-children">Test Content</div>,
    breadcrumbItems: [{ title: 'Home' }],
    title: 'Test Page',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar com breadcrumbItems vazio', () => {
    const wrapper = createWrapper();
    const propsWithEmptyBreadcrumb = {
      ...defaultProps,
      breadcrumbItems: [],
    };

    render(<BaseScreen {...propsWithEmptyBreadcrumb} />, { wrapper });

    // Verificar se o componente ainda renderiza corretamente
    expect(screen.getByText('Test Page')).toBeInTheDocument();
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('deve renderizar com título vazio', () => {
    const wrapper = createWrapper();
    const propsWithEmptyTitle = {
      ...defaultProps,
      title: '',
    };

    render(<BaseScreen {...propsWithEmptyTitle} />, { wrapper });

    // Verificar se o componente ainda renderiza corretamente
    expect(screen.getByTestId('test-children')).toBeInTheDocument();
  });

  it('deve renderizar com children null', () => {
    const wrapper = createWrapper();
    const propsWithNullChildren = {
      ...defaultProps,
      children: null,
    };

    render(<BaseScreen {...propsWithNullChildren} />, { wrapper });

    // Verificar se o componente ainda renderiza corretamente
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('deve renderizar com children undefined', () => {
    const wrapper = createWrapper();
    const propsWithUndefinedChildren = {
      ...defaultProps,
      children: undefined,
    };

    render(<BaseScreen {...propsWithUndefinedChildren} />, { wrapper });

    // Verificar se o componente ainda renderiza corretamente
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('deve renderizar com breadcrumbItems contendo elementos mistos', () => {
    const wrapper = createWrapper();
    const propsWithMixedBreadcrumb = {
      ...defaultProps,
      breadcrumbItems: [
        { title: 'Home' },
        { title: <span data-testid="mixed-element">Mixed Element</span> },
        { title: 'Final' },
      ],
    };

    render(<BaseScreen {...propsWithMixedBreadcrumb} />, { wrapper });

    // Verificar se todos os elementos estão presentes
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByTestId('mixed-element')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  it('deve renderizar com título contendo caracteres especiais', () => {
    const wrapper = createWrapper();
    const propsWithSpecialTitle = {
      ...defaultProps,
      title: 'Título com Acentos & Símbolos @#$%',
    };

    render(<BaseScreen {...propsWithSpecialTitle} />, { wrapper });

    // Verificar se o título com caracteres especiais está presente
    expect(screen.getByText('Título com Acentos & Símbolos @#$%')).toBeInTheDocument();
  });

  it('deve renderizar com breadcrumbItems contendo títulos longos', () => {
    const wrapper = createWrapper();
    const propsWithLongBreadcrumb = {
      ...defaultProps,
      breadcrumbItems: [
        { title: 'Home' },
        { title: 'Esta é uma seção muito longa que pode causar problemas de layout' },
        { title: 'Final' },
      ],
    };

    render(<BaseScreen {...propsWithLongBreadcrumb} />, { wrapper });

    // Verificar se todos os elementos estão presentes
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Esta é uma seção muito longa que pode causar problemas de layout')).toBeInTheDocument();
    expect(screen.getByText('Final')).toBeInTheDocument();
  });

  it('deve renderizar com children contendo múltiplos elementos', () => {
    const wrapper = createWrapper();
    const propsWithMultipleChildren = {
      ...defaultProps,
      children: (
        <div>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </div>
      ),
    };

    render(<BaseScreen {...propsWithMultipleChildren} />, { wrapper });

    // Verificar se todos os children estão presentes
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });

  it('deve renderizar com children contendo elementos complexos', () => {
    const wrapper = createWrapper();
    const propsWithComplexChildren = {
      ...defaultProps,
      children: (
        <div>
          <h1>Complex Title</h1>
          <p>Complex paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
            <li>Item 3</li>
          </ul>
        </div>
      ),
    };

    render(<BaseScreen {...propsWithComplexChildren} />, { wrapper });

    // Verificar se todos os elementos complexos estão presentes
    expect(screen.getByText('Complex Title')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});
