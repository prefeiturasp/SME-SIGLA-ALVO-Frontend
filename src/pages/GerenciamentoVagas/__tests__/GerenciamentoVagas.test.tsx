import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../test-utils';
import GerenciamentoVagasTela from '../GerenciamentoVagasTela';
import { App } from 'antd';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do useGetPermissions
const mockCan = jest.fn((codename: string) => {
  if (codename === 'add_importacaoarquivovagas') return true;
  if (codename === 'add_processoconvocacao') return true;
  return false;
});

jest.mock('../../../routes/PermissionContextGuard', () => ({
  useGetPermissions: () => ({
    can: mockCan,
  }),
}));

// Mock do react-hook-form
jest.mock('react-hook-form', () => {
  const actual = jest.requireActual('react-hook-form');
  const React = require('react');
  return {
    ...actual,
    Controller: ({ render, control, name }: any) => {
      const field = { 
        value: undefined, 
        onChange: jest.fn(),
        onBlur: jest.fn(),
        ref: jest.fn(),
        name: name || 'field'
      };
      const fieldState = { error: undefined, invalid: false, isDirty: false, isTouched: false };
      const formState = { errors: {}, touchedFields: {}, dirtyFields: {} };
      const result = render({ field, fieldState, formState });
      return React.createElement(React.Fragment, null, result);
    },
  };
});

// Mock do useGerenciamentoVagas
const mockHandleSelectProcessoConvocacao = jest.fn();
const mockHandleEnviarForm = jest.fn();
const mockHandleFileUpload = jest.fn();
const mockHandleSelectCargo = jest.fn();
const mockHandleBuscarVagas = jest.fn();
const mockHandleSalvar = jest.fn();
const mockHandleFiltrar = jest.fn();
const mockHandleLimparFiltros = jest.fn();
const mockSetVagasEscolasData = jest.fn();
const mockSetSelecionadas = jest.fn();
const mockSetSelecionadasKeys = jest.fn();
const mockHandleSubmit = jest.fn((fn) => fn);
const mockWatch = jest.fn();
const mockDadosVagasNasEscolasRefetch = jest.fn();

const createMockControl = () => ({
  _formValues: { processo_convocacao: undefined },
  _subjects: {
    values: { next: jest.fn(), subscribe: jest.fn() },
    array: { next: jest.fn(), subscribe: jest.fn() },
    state: { next: jest.fn(), subscribe: jest.fn() },
  },
});

const createMockData = (overrides = {}) => ({
  processosConvocacaoData: {
    results: [
      { uuid: 'proc-1', descricao: 'Processo 1', concurso_uuid: 'conc-1' },
      { uuid: 'proc-2', descricao: 'Processo 2', concurso_uuid: 'conc-2' },
    ],
  },
  processosConvocacaoIsLoading: false,
  dadosVagasNasEscolas: null,
  handleSelectProcessoConvocacao: mockHandleSelectProcessoConvocacao,
  control: createMockControl() as any,
  handleSubmit: mockHandleSubmit,
  handleEnviarForm: mockHandleEnviarForm,
  handleFileUpload: mockHandleFileUpload,
  uploadConcluido: false,
  concursoData: null,
  concursoIsLoading: false,
  handleSelectCargo: mockHandleSelectCargo,
  optionsDres: [],
  isLoadingVagasEscolas: false,
  vagasEscolasData: [],
  setVagasEscolasData: mockSetVagasEscolasData,
  handleBuscarVagas: mockHandleBuscarVagas,
  handleSalvar: mockHandleSalvar,
  handleFiltrar: mockHandleFiltrar,
  handleLimparFiltros: mockHandleLimparFiltros,
  controlFiltrar: createMockControl() as any,
  formErrorsFiltrar: {},
  setSelecionadas: mockSetSelecionadas,
  selecionadas: [],
  selecionadasKeys: [],
  setSelecionadasKeys: mockSetSelecionadasKeys,
  cargoSelecionado: undefined,
  postInclusaoVagasEscolasMutation: {
    mutate: jest.fn(),
    mutateAsync: jest.fn(),
    isLoading: false,
  },
  ...overrides,
});

jest.mock('../hooks/useGerenciamentoVagas', () => ({
  useGerenciamentoVagas: jest.fn(),
}));

// Mock do BaseTela
jest.mock('../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title, buttons }: any) => (
    <div data-testid="base-tela">
      <div data-testid="breadcrumb" data-count={breadcrumbItems?.length || 0}>
        {breadcrumbItems?.map((item: any, idx: number) => {
          const titleElement = typeof item.title === 'string' ? item.title : item.title;
          return (
            <span
              key={idx}
              data-testid={`breadcrumb-item-${idx}`}
              onClick={() => {
                if (typeof titleElement !== 'string' && titleElement?.props?.onClick) {
                  titleElement.props.onClick();
                }
              }}
            >
              {typeof titleElement === 'string' ? titleElement : titleElement}
            </span>
          );
        })}
      </div>
      <div data-testid="title">{title}</div>
      <div data-testid="buttons">{buttons}</div>
      {children}
    </div>
  ),
}));

// Mock dos componentes
jest.mock('../components/VagasEscolasTabela', () => ({
  __esModule: true,
  default: ({ filteredData, loading, onSelectionChange, onSelectionChangeKeys, setEditableData }: any) => (
    <div data-testid="vagas-escolas-tabela">
      {loading && <div data-testid="tabela-loading">Carregando...</div>}
      {filteredData?.length > 0 && (
        <div data-testid="tabela-data">
          {filteredData.map((item: any, idx: number) => (
            <div key={idx} data-testid={`tabela-row-${item.uuid || idx}`}>
              {item.escola?.nome_oficial || 'Escola'}
            </div>
          ))}
        </div>
      )}
      <button
        data-testid="tabela-select"
        onClick={() => {
          onSelectionChange?.(filteredData || []);
          onSelectionChangeKeys?.(filteredData?.map((item: any) => item.uuid) || []);
        }}
      >
        Selecionar
      </button>
      <button
        data-testid="tabela-set-editable"
        onClick={() => setEditableData?.(filteredData || [])}
      >
        Set Editable
      </button>
    </div>
  ),
}));

jest.mock('../components/IncluirEscolasModal', () => ({
  __esModule: true,
  default: ({ visible, onClose, onEscolasSelecionadas }: any) =>
    visible ? (
      <div data-testid="incluir-escolas-modal">
        <button data-testid="modal-close" onClick={onClose}>
          Fechar
        </button>
        <button
          data-testid="modal-submit"
          onClick={() =>
            onEscolasSelecionadas?.({
              processo_uuid: 'proc-1',
              processo_nome: 'Processo 1',
              vagas: [],
            })
          }
        >
          Salvar
        </button>
      </div>
    ) : null,
}));

// Mock dos componentes compartilhados
jest.mock('../../../components/EstilosCompartilhados', () => ({
  PrimaryButton: ({ children, onClick, disabled, ...props }: any) => (
    <button data-testid="primary-button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  SecondaryButton: ({ children, onClick, disabled, ...props }: any) => (
    <button data-testid="secondary-button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
  StyledSelect: ({ children, onChange, loading, placeholder, value, ...props }: any) => {
    const handleChange = (e: any) => {
      const newValue = e.target?.value || e;
      onChange?.(newValue);
    };
    return (
      <select
        data-testid="styled-select"
        onChange={handleChange}
        disabled={loading}
        value={value}
        {...props}
      >
        <option value="">{placeholder}</option>
        {children}
      </select>
    );
  },
  ActionButtonsContainer: ({ children, ...props }: any) => (
    <div data-testid="action-buttons-container" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('../../../components/FormStyle', () => ({
  CustomFormItem: ({ children, label, validateStatus, help }: any) => (
    <div data-testid="custom-form-item" data-validate-status={validateStatus}>
      {label && <label data-testid="form-label">{label}</label>}
      {children}
      {help && <span data-testid="form-help">{help}</span>}
    </div>
  ),
}));

// Mock dos ícones
jest.mock('@mui/icons-material/CloudUpload', () => () => <div data-testid="cloud-upload-icon" />);
jest.mock('@mui/icons-material/ExpandMore', () => () => <div data-testid="expand-more-icon" />);
jest.mock('@mui/icons-material/KeyboardArrowDownRounded', () => () => (
  <div data-testid="arrow-down-icon" />
));

// Mock do theme.useToken
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    theme: {
      ...actual.theme,
      useToken: () => ({
        token: {
          borderRadiusLG: 8,
        },
      }),
    },
  };
});

// Mock do message do antd
const mockMessage = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
};

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    message: mockMessage,
  };
});

// Mock do Upload.Dragger
jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    Upload: {
      ...actual.Upload,
      Dragger: ({ children, beforeUpload, onChange, disabled, ...props }: any) => {
        return (
          <div data-testid="upload-dragger" data-disabled={disabled} {...props}>
            {children}
            <input
              type="file"
              data-testid="upload-input"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  beforeUpload?.(file);
                  // Simular diferentes status baseado no nome do arquivo
                  const status = file.name.includes('error') ? 'error' : 'done';
                  // Chamar onChange com o formato esperado
                  if (onChange) {
                    onChange({ file: { status, name: file.name } });
                  }
                }
              }}
              disabled={disabled}
            />
          </div>
        );
      },
    },
  };
});

import { useGerenciamentoVagas } from '../hooks/useGerenciamentoVagas';

const mockUseGerenciamentoVagas = useGerenciamentoVagas as jest.MockedFunction<
  typeof useGerenciamentoVagas
>;

describe('GerenciamentoVagasTela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGerenciamentoVagas.mockReturnValue(createMockData());
    mockCan.mockImplementation((codename: string) => {
      if (codename === 'add_importacaoarquivovagas') return true;
      if (codename === 'add_processoconvocacao') return true;
      return false;
    });
  });

  const renderComponent = () => {
    return renderWithProviders(
      <App>
        <GerenciamentoVagasTela />
      </App>
    );
  };

  describe('Renderização inicial', () => {
    it('deve renderizar o componente BaseTela com título correto', () => {
      renderComponent();

      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Gerenciamento de vagas');
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('deve renderizar o select de processo de convocação', () => {
      renderComponent();

      expect(screen.getByText('Processo')).toBeInTheDocument();
      expect(screen.getByTestId('styled-select')).toBeInTheDocument();
    });

    it('deve renderizar botão Nova convocação quando tem permissão', () => {
      mockCan.mockReturnValue(true);
      renderComponent();

      expect(screen.getByText('Nova convocação')).toBeInTheDocument();
    });

    it('deve desabilitar botão Nova convocação quando não tem permissão', () => {
      mockCan.mockImplementation((codename: string) => {
        if (codename === 'add_processoconvocacao') return false;
        return true;
      });
      renderComponent();

      const button = screen.getByText('Nova convocação');
      expect(button.closest('button')).toBeDisabled();
    });
  });

  describe('Seleção de processo de convocação', () => {
    it('deve renderizar opções de processo de convocação', () => {
      renderComponent();

      expect(screen.getByText('Processo')).toBeInTheDocument();
    });

    it('deve chamar handleSelectProcessoConvocacao ao selecionar processo', () => {
      renderComponent();

      const select = screen.getByTestId('styled-select');
      // Simular onChange do StyledSelect que recebe o valor diretamente
      const mockEvent = { target: { value: 'proc-1' } };
      fireEvent.change(select, mockEvent as any);
      
      // O onChange do StyledSelect mockado chama onChange?.(e.target.value)
      // que então chama handleSelectProcessoConvocacao
      expect(mockHandleSelectProcessoConvocacao).toHaveBeenCalled();
    });

    it('deve mostrar loading no select quando processosConvocacaoIsLoading é true', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          processosConvocacaoIsLoading: true,
        })
      );

      renderComponent();

      const select = screen.getByTestId('styled-select');
      expect(select).toBeDisabled();
    });
  });

  describe('Seleção de cargo', () => {
    it('deve renderizar select de cargo quando showCargo é true', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          concursoData: {
            cargos: [
              { uuid: 'cargo-1', nome: 'Professor', codigo: 'P001' },
              { uuid: 'cargo-2', nome: 'Diretor', codigo: 'D001' },
            ],
          },
        })
      );

      renderComponent();

      expect(screen.getByText('Cargo')).toBeInTheDocument();
    });

    it('não deve renderizar select de cargo quando showCargo é false', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: undefined,
          dadosVagasNasEscolas: null,
        })
      );

      renderComponent();

      expect(screen.queryByText('Cargo')).not.toBeInTheDocument();
    });

    it('deve mostrar cargo quando dadosVagasNasEscolas tem vagas', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          dadosVagasNasEscolas: {
            vagas: [{ uuid: 'vaga-1', escola: { nome_oficial: 'Escola 1' } }],
          },
        })
      );

      renderComponent();

      expect(screen.getByText('Cargo')).toBeInTheDocument();
    });
  });

  describe('Filtros e tabela de vagas', () => {
    beforeEach(() => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          dadosVagasNasEscolas: {
            vagas: [
              {
                uuid: 'vaga-1',
                escola: {
                  nome_oficial: 'Escola 1',
                  dre: { uuid: 'dre-1', nome: 'DRE 1' },
                },
              },
              {
                uuid: 'vaga-2',
                escola: {
                  nome_oficial: 'Escola 2',
                  dre: { uuid: 'dre-2', nome: 'DRE 2' },
                },
              },
            ],
            dres: [
              { uuid: 'dre-1', nome: 'DRE 1' },
              { uuid: 'dre-2', nome: 'DRE 2' },
            ],
          },
          vagasEscolasData: [
            {
              uuid: 'vaga-1',
              escola: {
                nome_oficial: 'Escola 1',
                dre: { uuid: 'dre-1', nome: 'DRE 1' },
              },
            },
            {
              uuid: 'vaga-2',
              escola: {
                nome_oficial: 'Escola 2',
                dre: { uuid: 'dre-2', nome: 'DRE 2' },
              },
            },
          ],
          optionsDres: [
            { value: 'dre-1', label: 'DRE 1' },
            { value: 'dre-2', label: 'DRE 2' },
          ],
        })
      );
    });

    it('deve renderizar card de filtros quando há cargo selecionado e vagas', () => {
      renderComponent();

      expect(screen.getByText('DRE')).toBeInTheDocument();
      expect(screen.getByText('Escola')).toBeInTheDocument();
    });

    it('deve renderizar botões de ação dos filtros', () => {
      renderComponent();

      expect(screen.getByText('Limpar filtros')).toBeInTheDocument();
      expect(screen.getByText('Buscar')).toBeInTheDocument();
      expect(screen.getByText('Incluir escola')).toBeInTheDocument();
    });

    it('deve chamar handleLimparFiltros ao clicar em Limpar filtros', () => {
      renderComponent();

      const button = screen.getByText('Limpar filtros');
      fireEvent.click(button);

      expect(mockHandleLimparFiltros).toHaveBeenCalled();
    });

    it('deve chamar handleFiltrar ao clicar em Buscar', () => {
      renderComponent();

      const button = screen.getByText('Buscar');
      fireEvent.click(button);

      expect(mockHandleFiltrar).toHaveBeenCalled();
    });

    it('deve renderizar tabela de vagas quando há dados', () => {
      renderComponent();

      expect(screen.getByTestId('vagas-escolas-tabela')).toBeInTheDocument();
      expect(screen.getByText('Vagas por unidade escolar')).toBeInTheDocument();
    });

    it('deve chamar setSelecionadas e setSelecionadasKeys ao selecionar linhas na tabela', () => {
      renderComponent();

      const selectButton = screen.getByTestId('tabela-select');
      fireEvent.click(selectButton);

      expect(mockSetSelecionadas).toHaveBeenCalled();
      expect(mockSetSelecionadasKeys).toHaveBeenCalled();
    });

    it('deve chamar setVagasEscolasData ao atualizar dados editáveis na tabela', () => {
      renderComponent();

      const setEditableButton = screen.getByTestId('tabela-set-editable');
      fireEvent.click(setEditableButton);

      expect(mockSetVagasEscolasData).toHaveBeenCalled();
    });

    it('deve mostrar loading na tabela quando isLoadingVagasEscolas é true', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          dadosVagasNasEscolas: {
            vagas: [{ uuid: 'vaga-1' }],
          },
          isLoadingVagasEscolas: true,
        })
      );

      renderComponent();

      expect(screen.getByTestId('tabela-loading')).toBeInTheDocument();
    });

    it('deve renderizar botão Salvar quando há cargo e vagas', () => {
      renderComponent();

      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    it('deve chamar handleSalvar ao clicar em Salvar', () => {
      renderComponent();

      const button = screen.getByText('Salvar');
      fireEvent.click(button);

      expect(mockHandleSalvar).toHaveBeenCalled();
    });
  });

  describe('Upload de arquivo', () => {
    beforeEach(() => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          uploadConcluido: false,
          dadosVagasNasEscolas: {
            vagas: [],
          },
        })
      );
    });

    it('deve renderizar área de upload quando não há upload concluído e não há vagas', () => {
      renderComponent();

      expect(screen.getByText('Importar vagas')).toBeInTheDocument();
      expect(screen.getByTestId('upload-dragger')).toBeInTheDocument();
    });

    it('não deve renderizar área de upload quando uploadConcluido é true', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          uploadConcluido: true,
        })
      );

      renderComponent();

      expect(screen.queryByText('Importar vagas')).not.toBeInTheDocument();
    });

    it('deve desabilitar upload quando não tem permissão', () => {
      mockCan.mockImplementation((codename: string) => {
        if (codename === 'add_importacaoarquivovagas') return false;
        return true;
      });

      renderComponent();

      const dragger = screen.getByTestId('upload-dragger');
      expect(dragger).toHaveAttribute('data-disabled', 'true');
    });

    it('deve chamar handleFileUpload ao fazer upload de arquivo', () => {
      renderComponent();

      const input = screen.getByTestId('upload-input');
      const file = new File(['test'], 'test.csv', { type: 'text/csv' });
      
      fireEvent.change(input, { target: { files: [file] } });

      expect(mockHandleFileUpload).toHaveBeenCalledWith(file);
    });


    it('deve chamar handleSubmit com handleEnviarForm ao clicar em Importar', () => {
      renderComponent();

      const button = screen.getByText('Importar');
      fireEvent.click(button);

      expect(mockHandleSubmit).toHaveBeenCalled();
    });
  });

  describe('Modal de incluir escolas', () => {
    beforeEach(() => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          dadosVagasNasEscolas: {
            vagas: [{ uuid: 'vaga-1' }],
          },
          concursoData: {
            cargos: [{ uuid: 'cargo-1', nome: 'Professor', codigo: 'P001' }],
          },
          processosConvocacaoData: {
            results: [{ uuid: 'proc-1', descricao: 'Processo 1', concurso_uuid: 'conc-1' }],
          },
        })
      );
    });

    it('deve abrir modal ao clicar em Incluir escola', () => {
      renderComponent();

      const button = screen.getByText('Incluir escola');
      fireEvent.click(button);

      expect(screen.getByTestId('incluir-escolas-modal')).toBeInTheDocument();
    });

    it('deve fechar modal ao clicar em Fechar', () => {
      renderComponent();

      const button = screen.getByText('Incluir escola');
      fireEvent.click(button);

      const closeButton = screen.getByTestId('modal-close');
      fireEvent.click(closeButton);

      expect(screen.queryByTestId('incluir-escolas-modal')).not.toBeInTheDocument();
    });

    it('deve chamar postInclusaoVagasEscolasMutation.mutate ao submeter escolas', () => {
      const mockMutate = jest.fn();
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          dadosVagasNasEscolas: {
            vagas: [{ uuid: 'vaga-1' }],
          },
          concursoData: {
            cargos: [{ uuid: 'cargo-1', nome: 'Professor', codigo: 'P001' }],
          },
          processosConvocacaoData: {
            results: [{ uuid: 'proc-1', descricao: 'Processo 1', concurso_uuid: 'conc-1' }],
          },
          postInclusaoVagasEscolasMutation: {
            mutate: mockMutate,
            mutateAsync: jest.fn(),
            isLoading: false,
          },
        })
      );

      renderComponent();

      const button = screen.getByText('Incluir escola');
      fireEvent.click(button);

      const submitButton = screen.getByTestId('modal-submit');
      fireEvent.click(submitButton);

      expect(mockMutate).toHaveBeenCalled();
    });
  });

  describe('Navegação', () => {
    it('deve navegar para home ao clicar no breadcrumb Home', () => {
      renderComponent();

      const breadcrumbItems = screen.getAllByTestId(/breadcrumb-item-/);
      const homeItem = breadcrumbItems[0];
      fireEvent.click(homeItem);

      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar para processos ao clicar no breadcrumb Processos', () => {
      renderComponent();

      const breadcrumbItems = screen.getAllByTestId(/breadcrumb-item-/);
      const processosItem = breadcrumbItems[1];
      fireEvent.click(processosItem);

      expect(mockNavigate).toHaveBeenCalledWith('/processos');
    });

    it('deve navegar para criar convocação ao clicar em Nova convocação', () => {
      renderComponent();

      const button = screen.getByText('Nova convocação');
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/dados-processo/criar');
    });
  });

  describe('Estados e condições de renderização', () => {
    it('não deve renderizar card de filtros quando não há cargo selecionado', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: undefined,
          dadosVagasNasEscolas: null,
        })
      );

      renderComponent();

      expect(screen.queryByText('DRE')).not.toBeInTheDocument();
    });

    it('não deve renderizar tabela quando não há vagas', () => {
      mockUseGerenciamentoVagas.mockReturnValue(
        createMockData({
          cargoSelecionado: 'cargo-1',
          dadosVagasNasEscolas: {
            vagas: [],
          },
        })
      );

      renderComponent();

      expect(screen.queryByText('Vagas por unidade escolar')).not.toBeInTheDocument();
    });
  });
});

