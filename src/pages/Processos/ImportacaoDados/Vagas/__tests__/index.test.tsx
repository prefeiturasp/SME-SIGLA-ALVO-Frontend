import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { App } from 'antd';
import Vagas from '../VagasTela';
import { renderWithProviders } from '../../../../../test-utils';
import { useImportacaoDadosVagas } from '../hooks/useImportacaoDadosVagas';

// Mocks consolidados
const mockController = jest.fn();
jest.mock('react-hook-form', () => ({
  useForm: () => ({ 
    control: {}, 
    handleSubmit: jest.fn((fn) => fn), 
    reset: jest.fn(), 
    watch: jest.fn(), 
    setValue: jest.fn(), 
    clearErrors: jest.fn(), 
    formState: { errors: {}, isValid: true } 
  }),
  Controller: ({ render }: any) => {
    const field = { value: undefined, onChange: jest.fn() };
    mockController.mockImplementation(() => render({ field }));
    return render({ field });
  },
}));

jest.mock('../hooks/useImportacaoDadosVagas', () => ({ useImportacaoDadosVagas: jest.fn() }));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'), useNavigate: () => mockNavigate }));

jest.mock('@mui/icons-material/CalendarMonthRounded', () => () => <div data-testid="calendar-icon" />);
jest.mock('@mui/icons-material/UploadFile', () => () => <div data-testid="upload-icon" />);
jest.mock('@mui/icons-material/ExpandMore', () => () => <div data-testid="expand-icon" />);

jest.mock('../../../../../components/EstilosCompartilhados', () => ({
  TabContentContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="tab-content-container">{children}</div>,
  SectionCard: ({ children }: { children: React.ReactNode }) => <div data-testid="section-card">{children}</div>,
  SectionTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="section-title">{children}</div>,
  StyledSelect: ({ children, ...props }: any) => <select data-testid="styled-select" {...props}>{children}</select>,
  UploadArea: ({ children }: { children: React.ReactNode }) => <div data-testid="upload-area">{children}</div>,
  StyledUpload: ({ children, beforeUpload }: any) => <div data-testid="styled-upload" onClick={() => beforeUpload?.(new File(['test'], 'test.csv', { type: 'text/csv' }))}>{children}</div>,
  ActionButtonsContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="action-buttons-container">{children}</div>,
}));

jest.mock('../../../../../components/FormStyle', () => ({
  CustomFormItem: ({ children, label, validateStatus, help }: any) => (
    <div data-testid="custom-form-item" data-validate-status={validateStatus}>
      {label && <label>{label}</label>}{children}{help && <span data-testid="form-help">{help}</span>}
    </div>
  ),
}));

jest.mock('../../../../../services', () => ({ 
  API: { 
    ImportacaoDados: { getUltimasImportacoesArquivosVagas: jest.fn(), postImportacaoArquivosVagas: jest.fn() }, 
    Cargos: { getCargos: jest.fn() },
    Concursos: { getConcursos: jest.fn() }
  } 
}));
jest.mock('../components/UltimasImportacoesDeVagasTable', () => ({ __esModule: true, default: ({ data }: { data: any[] }) => <div data-testid="ultimas-importacoes-table">{data?.length ? `Table with ${data.length} items` : 'Empty table'}</div> }));

const mockUseImportacaoDadosVagas = useImportacaoDadosVagas as jest.MockedFunction<typeof useImportacaoDadosVagas>;

describe('Componente Vagas - Testes de Cobertura', () => {
  const mockOnShowLayoutPadrao = jest.fn();
  
  const createMockData = (overrides = {}) => ({
    control: {} as any, 
    formErrors: {}, 
    handleFileUpload: jest.fn(), 
    handleSubmit: jest.fn((fn) => fn), 
    handleEnviarForm: jest.fn(),
    processosConvocacaoOptions: [
      { value: 'processo-1', label: 'Processo 1' },
      { value: 'processo-2', label: 'Processo 2' }
    ],
    processosConvocacaoOptionsIsLoading: false,
    watch: jest.fn().mockImplementation((field: string) => {
      if (field === 'arquivo') return null;
      return undefined;
    }),
    isCreatingImportacao: false, 
    createImportacaoError: null,
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseImportacaoDadosVagas.mockReturnValue(createMockData());
  });

  const renderComponent = () => renderWithProviders(<App><Vagas onShowLayoutPadrao={mockOnShowLayoutPadrao} /></App>);

  describe('Renderização inicial e estrutura básica', () => {
    it('deve renderizar todos os elementos principais', () => {
      renderComponent();
      
      expect(screen.getByText('Vagas')).toBeInTheDocument();
      expect(screen.getByText('Processo de convocação')).toBeInTheDocument();
      expect(screen.getByText('Arquivo para importação')).toBeInTheDocument();
      
      expect(screen.getByTestId('tab-content-container')).toBeInTheDocument();
      expect(screen.getByTestId('section-card')).toBeInTheDocument();
      expect(screen.getByTestId('section-title')).toBeInTheDocument();
      expect(screen.getByTestId('action-buttons-container')).toBeInTheDocument();
    });

    it('deve renderizar botões de ação', () => {
      renderComponent();
      
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('Importar')).toBeInTheDocument();
      expect(screen.getByText('Layout padrão')).toBeInTheDocument();
    });
  });

  describe('Renderização de campos de upload', () => {
    it('deve renderizar campo de arquivo para importação', () => {
      renderComponent();
      
      expect(screen.getByText('Arquivo para importação')).toBeInTheDocument();
      expect(screen.getByTestId('upload-area')).toBeInTheDocument();
      expect(screen.getByTestId('upload-icon')).toBeInTheDocument();
    });

    it('deve renderizar texto padrão quando nenhum arquivo selecionado', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        watch: jest.fn().mockImplementation((field: string) => {
          if (field === 'arquivo') return null;
          return undefined;
        })
      }));
      
      renderComponent();
      
      expect(screen.getByText('Clique ou arraste os arquivos')).toBeInTheDocument();
    });

    it('deve renderizar nome do arquivo quando arquivo selecionado', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        watch: jest.fn().mockImplementation((field: string) => {
          if (field === 'arquivo') return new File(['test'], 'test.csv', { type: 'text/csv' });
          return undefined;
        })
      }));
      
      renderComponent();
      
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });

  describe('Campo de processo de convocação', () => {
    it('deve renderizar campo de processo de convocação', () => {
      renderComponent();
      
      expect(screen.getByText('Processo de convocação')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Selecione o processo de convocação')).toBeInTheDocument();
    });

    it('deve mostrar loading no select de processo de convocação', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        processosConvocacaoOptionsIsLoading: true
      }));
      
      renderComponent();
      
      expect(screen.getByPlaceholderText('Selecione o processo de convocação')).toBeInTheDocument();
    });
  });

  describe('Validações e estados de erro', () => {
    it('deve mostrar erros de validação para processo de convocação', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        formErrors: {
          processo_convocacao: { message: 'Processo de convocação é obrigatório', type: 'required' }
        }
      }));
      
      renderComponent();
      
      expect(screen.getByText('Processo de convocação é obrigatório')).toBeInTheDocument();
      expect(screen.getAllByTestId('custom-form-item')[0]).toHaveAttribute('data-validate-status', 'error');
    });

    it('deve mostrar erros de validação para arquivo', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        formErrors: {
          arquivo: { message: 'Arquivo é obrigatório', type: 'required' }
        }
      }));
      
      renderComponent();
      
      expect(screen.getByText('Arquivo é obrigatório')).toBeInTheDocument();
    });
  });

  describe('Interações e eventos', () => {
    it('deve navegar para histórico ao clicar no botão', () => {
      renderComponent();
      
      fireEvent.click(screen.getByText('Histórico'));
      expect(mockNavigate).toHaveBeenCalledWith('/processos/importacao-dados/historico-vagas');
    });

    it('deve chamar onShowLayoutPadrao ao clicar no botão', () => {
      renderComponent();
      
      fireEvent.click(screen.getByText('Layout padrão'));
      expect(mockOnShowLayoutPadrao).toHaveBeenCalled();
    });

    it('deve chamar handleSubmit com handleEnviarForm ao clicar em Importar', () => {
      const mockHandleSubmit = jest.fn();
      const mockHandleEnviarForm = jest.fn();
      
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({ 
        handleSubmit: mockHandleSubmit, 
        handleEnviarForm: mockHandleEnviarForm 
      }));
      
      renderComponent();
      
      fireEvent.click(screen.getByText('Importar'));
      expect(mockHandleSubmit).toHaveBeenCalledWith(mockHandleEnviarForm);
    });

    it('deve chamar handleFileUpload ao fazer upload de arquivo', () => {
      const mockHandleFileUpload = jest.fn();
      
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
        handleFileUpload: mockHandleFileUpload
      }));
      
      renderComponent();
      
      fireEvent.click(screen.getByTestId('styled-upload'));
      expect(mockHandleFileUpload).toHaveBeenCalledWith(expect.objectContaining({ 
        name: 'test.csv', 
        type: 'text/csv' 
      }));
    });
  });


  describe('Estados de loading e criação', () => {
    it('deve mostrar estado de criação de importação', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({ 
        isCreatingImportacao: true 
      }));
      
      renderComponent();
      
      expect(screen.getByText('Importar')).toBeInTheDocument();
    });

    it('deve lidar com erro na criação de importação', () => {
      mockUseImportacaoDadosVagas.mockReturnValue(createMockData({ 
        createImportacaoError: new Error('Erro na importação')
      }));
      
      renderComponent();
      
      expect(screen.getByText('Importar')).toBeInTheDocument();
    });
  });

  describe('Cenários de edge cases', () => {
    it('deve lidar com diferentes tipos de arquivo', () => {
      const fileTypes = [
        { file: new File(['test'], 'test.csv', { type: 'text/csv' }), expectedName: 'test.csv' },
        { file: new File(['data'], 'arquivo.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), expectedName: 'arquivo.xlsx' },
        { file: new File(['content'], 'documento.txt', { type: 'text/plain' }), expectedName: 'documento.txt' }
      ];

      fileTypes.forEach(({ file, expectedName }) => {
        mockUseImportacaoDadosVagas.mockReturnValue(createMockData({
          watch: jest.fn().mockImplementation((field: string) => {
            if (field === 'arquivo') return file;
            return undefined;
          })
        }));
        
        renderComponent();
        expect(screen.getByText(expectedName)).toBeInTheDocument();
      });
    });
  });
});
