import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import HabilitadosFormTab from '../HabilitadosFormTab';

// Mocks
const mockNavigate = jest.fn();
const mockHandleFileUpload = jest.fn();
const mockHandleSubmit = jest.fn((callback) => callback);
const mockHandleEnviarForm = jest.fn();
const mockWatch = jest.fn(() => null);
const mockOnShowLayoutPadrao = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../hooks/useImportacaoDadosHabilitados', () => ({
  useImportacaoDados: jest.fn(() => ({
    control: {},
    formErrors: {},
    handleFileUpload: mockHandleFileUpload,
    handleSubmit: mockHandleSubmit,
    handleEnviarForm: mockHandleEnviarForm,
    watch: mockWatch,
  })),
}));

jest.mock('../../../../hooks/useConcursos', () => ({
  useConcursos: jest.fn(() => ({
    concursosData: [],
    concursosOptionsIsLoading: false,
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
    Row: ({ children }: any) => <div data-testid="row">{children}</div>,
    Col: ({ children }: any) => <div data-testid="col">{children}</div>,
    Select: { Option: ({ children, value }: any) => <option value={value}>{children}</option> },
    Button: ({ children, onClick, disabled, type, ghost, ...props }: any) => (
      <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
    ),
    Tooltip: ({ children, title }: any) => <div title={title}>{children}</div>,
    message: { success: jest.fn(), error: jest.fn() },
    Upload: { Dragger: ({ children }: any) => <div>{children}</div> },
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
  TabContentContainer: ({ children }: any) => <div>{children}</div>,
  StyledSelect: ({ children, onChange, loading, disabled, placeholder }: any) => (
    <select 
      onChange={(e) => onChange?.(e.target.value)} 
      disabled={loading || disabled}
      data-testid="select"
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  ),
  UploadArea: ({ children, status }: any) => <div data-testid="upload-area" data-status={status}>{children}</div>,
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
  ActionButtonsContainer: ({ children }: any) => <div>{children}</div>,
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
jest.mock('@ant-design/icons', () => ({ CloudUploadOutlined: () => <span>☁</span> }));

const { useImportacaoDados } = require('../hooks/useImportacaoDadosHabilitados');
const { useConcursos } = require('../../../../hooks/useConcursos');

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const defaultProps = {
    onShowLayoutPadrao: mockOnShowLayoutPadrao,
    canViewHistoricoHabilitados: true,
    canImportarHabilitados: true,
    ...props,
  };

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <HabilitadosFormTab {...defaultProps} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('HabilitadosFormTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWatch.mockReturnValue(null);
  });

  describe('Renderização', () => {
    it('renderiza o componente', () => {
      renderComponent();
      expect(screen.getByText('Concurso')).toBeInTheDocument();
      expect(screen.getByText(/Selecione ou arraste/i)).toBeInTheDocument();
    });

    it('renderiza botões de ação', () => {
      renderComponent();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('Importar')).toBeInTheDocument();
    });
  });

  describe('Select de Concursos', () => {
    it('renderiza com array de concursos', () => {
      useConcursos.mockReturnValue({
        concursosData: [
          { value: '1', label: 'Concurso A' },
          { value: '2', label: 'Concurso B' },
        ],
        concursosOptionsIsLoading: false,
      });

      renderComponent();
      expect(screen.getByText('Concurso A')).toBeInTheDocument();
      expect(screen.getByText('Concurso B')).toBeInTheDocument();
    });

    it('renderiza com objeto results', () => {
      useConcursos.mockReturnValue({
        concursosData: {
          results: [
            { value: '3', label: 'Concurso C' },
          ],
        },
        concursosOptionsIsLoading: false,
      });

      renderComponent();
      expect(screen.getByText('Concurso C')).toBeInTheDocument();
    });

    it('renderiza quando concursosData é undefined', () => {
      useConcursos.mockReturnValue({
        concursosData: undefined,
        concursosOptionsIsLoading: false,
      });

      renderComponent();
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('desabilita select quando está carregando', () => {
      useConcursos.mockReturnValue({
        concursosData: [],
        concursosOptionsIsLoading: true,
      });

      renderComponent();
      expect(screen.getByTestId('select')).toBeDisabled();
    });
  });

  describe('Upload de Arquivo', () => {
    it('mostra placeholder quando não há arquivo', () => {
      mockWatch.mockReturnValue(null);
      renderComponent();
      expect(screen.getByText(/Selecione ou arraste/i)).toBeInTheDocument();
    });

    it('mostra nome do arquivo quando selecionado', () => {
      const mockFile = { name: 'arquivo.csv' };
      mockWatch.mockReturnValue(mockFile);
      renderComponent();
      expect(screen.getByText('arquivo.csv')).toBeInTheDocument();
    });

    it('chama handleFileUpload ao selecionar arquivo', async () => {
      const user = userEvent.setup();
      renderComponent();

      const file = new File(['conteudo'], 'teste.csv', { type: 'text/csv' });
      const input = screen.getByTestId('file-input');
      
      await user.upload(input, file);
      expect(mockHandleFileUpload).toHaveBeenCalledWith(file);
    });

    it('desabilita upload quando não tem permissão', () => {
      renderComponent({ canImportarHabilitados: false });
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });

    it('habilita upload quando tem permissão', () => {
      renderComponent({ canImportarHabilitados: true });
      expect(screen.getByTestId('file-input')).not.toBeDisabled();
    });
  });

  describe('Validação', () => {
    it('mostra erro de concurso', () => {
      useImportacaoDados.mockReturnValue({
        control: {},
        formErrors: { concurso: { message: 'Campo obrigatório' } },
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        watch: mockWatch,
      });

      renderComponent();
      expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    });

    it('mostra erro de arquivo', () => {
      useImportacaoDados.mockReturnValue({
        control: {},
        formErrors: { arquivo: { message: 'Arquivo obrigatório' } },
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        watch: mockWatch,
      });

      renderComponent();
      expect(screen.getByText('Arquivo obrigatório')).toBeInTheDocument();
      expect(screen.getByTestId('upload-area')).toHaveAttribute('data-status', 'error');
    });

    it('não mostra erro quando formErrors vazio', () => {
      useImportacaoDados.mockReturnValue({
        control: {},
        formErrors: {},
        handleFileUpload: mockHandleFileUpload,
        handleSubmit: mockHandleSubmit,
        handleEnviarForm: mockHandleEnviarForm,
        watch: mockWatch,
      });

      renderComponent();
      expect(screen.queryByTestId('help')).not.toBeInTheDocument();
    });
  });

  describe('Permissões', () => {
    it('desabilita botão Histórico sem permissão', () => {
      renderComponent({ canViewHistoricoHabilitados: false });
      const button = screen.getByText('Histórico').closest('button');
      expect(button).toBeDisabled();
    });

    it('habilita botão Histórico com permissão', () => {
      renderComponent({ canViewHistoricoHabilitados: true });
      const button = screen.getByText('Histórico').closest('button');
      expect(button).not.toBeDisabled();
    });

    it('desabilita botão Importar sem permissão', () => {
      renderComponent({ canImportarHabilitados: false });
      const button = screen.getByText('Importar').closest('button');
      expect(button).toBeDisabled();
    });

    it('habilita botão Importar com permissão', () => {
      renderComponent({ canImportarHabilitados: true });
      const button = screen.getByText('Importar').closest('button');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Tooltips', () => {
    it('mostra tooltip de sem permissão para upload', () => {
      renderComponent({ canImportarHabilitados: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('mostra tooltip normal para upload', () => {
      renderComponent({ canImportarHabilitados: true });
      expect(screen.getByTitle('Selecionar arquivo')).toBeInTheDocument();
    });

    it('mostra tooltip de sem permissão para histórico', () => {
      renderComponent({ canViewHistoricoHabilitados: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('mostra tooltip normal para histórico', () => {
      renderComponent({ canViewHistoricoHabilitados: true });
      expect(screen.getByTitle('Histórico')).toBeInTheDocument();
    });

    it('mostra tooltip de sem permissão para importar', () => {
      renderComponent({ canImportarHabilitados: false });
      const tooltips = screen.getAllByTitle(/não possui permissão/i);
      expect(tooltips.length).toBeGreaterThan(0);
    });

    it('mostra tooltip normal para importar', () => {
      renderComponent({ canImportarHabilitados: true });
      expect(screen.getByTitle('Importar')).toBeInTheDocument();
    });
  });

  describe('Ações', () => {
    it('deve navegar para histórico ao clicar em Histórico', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByText('Histórico').closest('button');
      await user.click(button!);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados/historico-habilitados');
    });

    it('chama handleSubmit ao clicar em Importar', async () => {
      const user = userEvent.setup();
      renderComponent();
      
      const button = screen.getByText('Importar').closest('button');
      await user.click(button!);
      
      expect(mockHandleSubmit).toHaveBeenCalledWith(mockHandleEnviarForm);
    });
  });

  describe('Cenários completos', () => {
    it('funciona com todas permissões', () => {
      renderComponent({
        canViewHistoricoHabilitados: true,
        canImportarHabilitados: true,
      });

      const historicoBtn = screen.getByText('Histórico').closest('button');
      const importarBtn = screen.getByText('Importar').closest('button');
      
      expect(historicoBtn).not.toBeDisabled();
      expect(importarBtn).not.toBeDisabled();
      expect(screen.getByTestId('file-input')).not.toBeDisabled();
    });

    it('funciona sem nenhuma permissão', () => {
      renderComponent({
        canViewHistoricoHabilitados: false,
        canImportarHabilitados: false,
      });

      const historicoBtn = screen.getByText('Histórico').closest('button');
      const importarBtn = screen.getByText('Importar').closest('button');
      
      expect(historicoBtn).toBeDisabled();
      expect(importarBtn).toBeDisabled();
      expect(screen.getByTestId('file-input')).toBeDisabled();
    });
  });
});

