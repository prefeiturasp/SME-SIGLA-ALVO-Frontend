import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import VagasFormTab from '../VagasFormTab';

// Mocks
const mockNavigate = jest.fn();
const mockHandleFileUpload = jest.fn();
const mockHandleSubmit = jest.fn((callback) => callback);
const mockHandleEnviarForm = jest.fn();
const mockWatch = jest.fn(() => null);
const mockHandleBaixarArquivo = jest.fn();
const mockOnShowLayoutPadrao = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useImportacaoDadosVagas', () => ({
  useImportacaoDadosVagas: jest.fn(() => ({
    control: {},
    formErrors: {},
    handleFileUpload: mockHandleFileUpload,
    handleSubmit: mockHandleSubmit,
    handleEnviarForm: mockHandleEnviarForm,
    processosConvocacaoOptions: [],
    processosConvocacaoOptionsIsLoading: false,
    watch: mockWatch,
    handleBaixarArquivo: mockHandleBaixarArquivo,
  })),
}));

// Mock react-hook-form Controller
jest.mock('react-hook-form', () => {
  const React = require('react');
  return {
    Controller: ({ render }: any) => {
      const mockField = { value: '', onChange: jest.fn(), onBlur: jest.fn(), ref: jest.fn(), name: 'test' };
      return <div>{render({ field: mockField, fieldState: {}, formState: {} })}</div>;
    },
  };
});

// Mock componentes Antd
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Row: ({ children, ...props }: any) => <div data-testid="row" {...props}>{children}</div>,
    Col: ({ children }: any) => <div data-testid="col">{children}</div>,
    Select: { Option: ({ children, value }: any) => <option value={value}>{children}</option> },
    Button: ({ children, onClick, disabled, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
    Tooltip: ({ children, title }: any) => <div title={title}>{children}</div>,
    Typography: {
      Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
      Title: ({ children, level, ...props }: any) => <h1 data-level={level} {...props}>{children}</h1>,
    },
    Space: ({ children }: any) => <div>{children}</div>,
    DatePicker: ({ onChange }: any) => <input type="date" onChange={(e) => onChange?.(e.target.value)} />,
    Radio: ({ children }: any) => <div>{children}</div>,
  };
});

// Mock FormItem do Antd
jest.mock('antd/es/form/FormItem', () => {
  return ({ children, help, validateStatus }: any) => (
    <div data-testid="form-item" data-status={validateStatus}>
      {help && <span data-testid="error">{help}</span>}
      {children}
    </div>
  );
});

// Mock componentes customizados
jest.mock('../../../../components/EstilosCompartilhados', () => ({
  TabContentContainer: ({ children }: any) => <div data-testid="tab-content">{children}</div>,
  SectionCard: ({ children }: any) => <div>{children}</div>,
  SectionTitle: ({ children }: any) => <h2>{children}</h2>,
  StyledSelect: ({ children, onChange, loading, disabled, value, placeholder }: any) => (
    <select 
      onChange={(e) => onChange?.(e.target.value)} 
      disabled={loading || disabled}
      value={value}
      data-testid="styled-select"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  ),
  UploadArea: ({ children, status, style }: any) => (
    <div data-testid="upload-area" data-status={status} style={style}>{children}</div>
  ),
  StyledUpload: ({ children, beforeUpload, disabled }: any) => (
    <div>
      <input
        type="file"
        data-testid="file-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) beforeUpload(file);
        }}
        disabled={disabled}
      />
      {children}
    </div>
  ),
  ActionButtonsContainer: ({ children }: any) => <div data-testid="action-buttons">{children}</div>,
  GrupoEsquerda: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('../../../../components/FormStyle', () => ({
  CustomFormItem: ({ children, label, help, validateStatus }: any) => (
    <div data-testid="custom-form-item" data-validate={validateStatus}>
      {label && <label>{label}</label>}
      {help && <span data-testid="help">{help}</span>}
      {children}
    </div>
  ),
}));

// Mock ícones
jest.mock('@mui/icons-material/ExpandMore', () => () => <span>▼</span>);
jest.mock('@mui/icons-material/UploadFile', () => () => <span>📤</span>);
jest.mock('@ant-design/icons', () => ({ CloudUploadOutlined: () => <span>☁</span> }));

const { useImportacaoDadosVagas } = require('../hooks/useImportacaoDadosVagas');

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const defaultProps = {
    onShowLayoutPadrao: mockOnShowLayoutPadrao,
    canViewHistoricoVagas: true,
    canImportarVagas: true,
    ...props,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <VagasFormTab {...defaultProps} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('VagasFormTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockReturnValue(null);
  });

  describe('Renderização', () => {
    it('deve renderizar o componente', () => {
      renderComponent();
      expect(screen.getByText('Selecione abaixo o tipo de arquivo que deseja carregar')).toBeInTheDocument();
      expect(screen.getByText(/Nesta aba, você pode consultar as vagas/i)).toBeInTheDocument();
      expect(screen.getByText('Processo de convocação')).toBeInTheDocument();
    });

    it('deve renderizar botões de ação', () => {
      renderComponent();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('Importar')).toBeInTheDocument();
    });

    it('deve renderizar área de upload', () => {
      renderComponent();
      expect(screen.getByText(/Selecione ou arraste e solte aqui/i)).toBeInTheDocument();
      expect(screen.getByText('Selecionar')).toBeInTheDocument();
    });
  });

  describe('Select de Processo de Convocação', () => {
    it('deve renderizar com options vazias', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByTestId('styled-select')).toBeInTheDocument();
    });

    it('deve renderizar com options preenchidas', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [
          { value: '1', label: 'Processo 1' },
          { value: '2', label: 'Processo 2' },
        ],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByText('Processo 1')).toBeInTheDocument();
      expect(screen.getByText('Processo 2')).toBeInTheDocument();
    });

    it('deve desabilitar select quando está carregando', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: true,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByTestId('styled-select')).toBeDisabled();
    });

    it('deve renderizar quando processosConvocacaoOptions não é array', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: null,
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByTestId('styled-select')).toBeInTheDocument();
    });
  });

  describe('Upload de Arquivo', () => {
    it('deve mostrar placeholder quando não há arquivo', () => {
      mockWatch.mockReturnValue(null);
      renderComponent();
      expect(screen.getByText(/Selecione ou arraste e solte aqui/i)).toBeInTheDocument();
    });

    it('deve mostrar nome do arquivo quando selecionado', () => {
      const mockFile = { name: 'arquivo.csv' };
      mockWatch.mockReturnValue(mockFile);
      renderComponent();
      expect(screen.getByText('arquivo.csv')).toBeInTheDocument();
    });

    it('deve chamar handleFileUpload ao selecionar arquivo', async () => {
      const user = userEvent.setup();
      renderComponent();

      const file = new File(['conteudo'], 'teste.csv', { type: 'text/csv' });
      const input = screen.getByTestId('file-input');
      
      await user.upload(input, file);
      expect(mockHandleFileUpload).toHaveBeenCalledWith(file);
    });

    it('deve desabilitar upload quando não tem permissão', () => {
      renderComponent({ canImportarVagas: false });
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });

    it('deve habilitar upload quando tem permissão', () => {
      renderComponent({ canImportarVagas: true });
      expect(screen.getByTestId('file-input')).not.toBeDisabled();
    });

    it('deve desabilitar botão Selecionar quando não tem permissão', () => {
      renderComponent({ canImportarVagas: false });
      const buttons = screen.getAllByText('Selecionar');
      const selectButton = buttons.find(btn => btn.closest('button'));
      expect(selectButton).toBeDisabled();
    });
  });

  describe('Validação', () => {
    it('deve mostrar erro de processo de convocação', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: { processo_convocacao: { message: 'Campo obrigatório' } },
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    it('deve mostrar erro de arquivo', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: { arquivo: { message: 'Arquivo obrigatório' } },
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.getByText('Arquivo obrigatório')).toBeInTheDocument();
      expect(screen.getByTestId('upload-area')).toHaveAttribute('data-status', 'error');
    });

    it('não deve mostrar erro quando formErrors vazio', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      expect(screen.queryByTestId('help')).not.toBeInTheDocument();
    });
  });

  describe('Permissões', () => {
    it('deve desabilitar botão Histórico sem permissão', () => {
      renderComponent({ canViewHistoricoVagas: false });
      const button = screen.getByText('Histórico').closest('button');
      expect(button).toBeDisabled();
    });

    it('deve habilitar botão Histórico com permissão', () => {
      renderComponent({ canViewHistoricoVagas: true });
      const button = screen.getByText('Histórico').closest('button');
      expect(button).not.toBeDisabled();
    });

    it('deve desabilitar botão Importar sem permissão', () => {
      renderComponent({ canImportarVagas: false });
      const button = screen.getByText('Importar').closest('button');
      expect(button).toBeDisabled();
    });

    it('deve habilitar botão Importar com permissão', () => {
      renderComponent({ canImportarVagas: true });
      const button = screen.getByText('Importar').closest('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Tooltips', () => {
    it('deve mostrar tooltip de sem permissão para upload', () => {
      renderComponent({ canImportarVagas: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('deve mostrar tooltip normal para upload', () => {
      renderComponent({ canImportarVagas: true });
      expect(screen.getByTitle('Selecionar arquivo')).toBeInTheDocument();
    });

    it('deve mostrar tooltip de sem permissão para histórico', () => {
      renderComponent({ canViewHistoricoVagas: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('deve mostrar tooltip normal para histórico', () => {
      renderComponent({ canViewHistoricoVagas: true });
      expect(screen.getByTitle('Histórico')).toBeInTheDocument();
    });

    it('deve mostrar tooltip de sem permissão para importar', () => {
      renderComponent({ canImportarVagas: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('deve mostrar tooltip normal para importar', () => {
      renderComponent({ canImportarVagas: true });
      expect(screen.getByTitle('Importar')).toBeInTheDocument();
    });
  });

  describe('Ações', () => {
    it('deve navegar para histórico ao clicar em Histórico', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByText('Histórico').closest('button');
      await user.click(button!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados/historico-vagas');
    });

    it('deve chamar handleSubmit ao clicar em Importar', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByText('Importar').closest('button');
      await user.click(button!);
      
      expect(mockHandleSubmit).toHaveBeenCalledWith(mockHandleEnviarForm);
    });
  });

  describe('Cenários completos', () => {
    it('deve funcionar com todas permissões', () => {
      renderComponent({
        canViewHistoricoVagas: true,
        canImportarVagas: true,
      });

      const historicoBtn = screen.getByText('Histórico').closest('button');
      const importarBtn = screen.getByText('Importar').closest('button');
      
      expect(historicoBtn).not.toBeDisabled();
      expect(importarBtn).not.toBeDisabled();
      expect(screen.getByTestId('file-input')).not.toBeDisabled();
    });

    it('deve funcionar sem nenhuma permissão', () => {
      renderComponent({
        canViewHistoricoVagas: false,
        canImportarVagas: false,
      });

      const historicoBtn = screen.getByText('Histórico').closest('button');
      const importarBtn = screen.getByText('Importar').closest('button');
      
      expect(historicoBtn).toBeDisabled();
      expect(importarBtn).toBeDisabled();
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });

    it('deve renderizar com processo selecionado e arquivo', () => {
      const mockFile = { name: 'vagas.csv' };
      mockWatch.mockReturnValue(mockFile);

      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [
          { value: '1', label: 'Processo Teste' },
        ],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();

      expect(screen.getByText('Processo Teste')).toBeInTheDocument();
      expect(screen.getByText('vagas.csv')).toBeInTheDocument();
    });
  });

  describe('Estrutura do componente', () => {
    it('deve renderizar título secundário', () => {
      renderComponent();
      const title = screen.getByText('Selecione abaixo o tipo de arquivo que deseja carregar');
      expect(title).toBeInTheDocument();
    });

    it('deve renderizar descrição completa', () => {
      renderComponent();
      const description = screen.getByText(/Nesta aba, você pode consultar as vagas atualmente disponíveis/i);
      expect(description).toBeInTheDocument();
    });

    it('deve renderizar todos os elementos estruturais', () => {
      renderComponent();
      expect(screen.getByTestId('tab-content')).toBeInTheDocument();
      expect(screen.getByTestId('action-buttons')).toBeInTheDocument();
      expect(screen.getAllByTestId('row')).toHaveLength(2);
    });

    it('deve renderizar UploadArea com atributo style', () => {
      renderComponent();
      const uploadArea = screen.getByTestId('upload-area');
      expect(uploadArea).toHaveAttribute('style');
    });
  });

  describe('Interações do usuário', () => {
    it('deve permitir selecionar processo quando habilitado', async () => {
      const user = userEvent.setup();
      
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [
          { value: '1', label: 'Processo 1' },
        ],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();
      
      const select = screen.getByTestId('styled-select');
      await user.selectOptions(select, '1');
      
      // Verifica que o select existe e não está desabilitado
      expect(select).not.toBeDisabled();
    });

    it('deve exibir múltiplas opções de processo', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [
          { value: '1', label: 'Processo A' },
          { value: '2', label: 'Processo B' },
          { value: '3', label: 'Processo C' },
        ],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();

      expect(screen.getByText('Processo A')).toBeInTheDocument();
      expect(screen.getByText('Processo B')).toBeInTheDocument();
      expect(screen.getByText('Processo C')).toBeInTheDocument();
    });
  });

  describe('Estados de erro combinados', () => {
    it('deve mostrar ambos os erros simultaneamente', () => {
      useImportacaoDadosVagas.mockReturnValue({
        control: {},
        formErrors: {
          processo_convocacao: { message: 'Selecione um processo' },
          arquivo: { message: 'Selecione um arquivo' },
        },
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        processosConvocacaoOptions: [],
        processosConvocacaoOptionsIsLoading: false,
        watch: mockWatch,
        handleBaixarArquivo: mockHandleBaixarArquivo,
      });

      renderComponent();

      expect(screen.getByText('Selecione um processo')).toBeInTheDocument();
      expect(screen.getByText('Selecione um arquivo')).toBeInTheDocument();
    });
  });
});

