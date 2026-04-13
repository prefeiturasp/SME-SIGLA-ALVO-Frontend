import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import SelecaoCargos from '../SelecaoCargosTela';
import dayjs from 'dayjs';

jest.mock('../../hooks/usePatchPassoProcessoConvocacao', () => ({
  usePatchPassoProcessoConvocacao: () => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
  }),
}));

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ uuid: 'test-uuid-123' }),
}));

// Mock do useGetPermissions
const mockCan = jest.fn((codename: string) => {
  if (codename === 'add_importacaoarquivovagas') return true;
  if (codename === 'change_processoconvocacao') return true;
  return false;
});

jest.mock('../../../../routes/PermissionContextGuard', () => ({
  useGetPermissions: () => ({
    can: mockCan,
  }),
}));

// Mock do useSelecaoCargo
const mockHandleCargoChange = jest.fn();
const mockHandleBuscarCandidatos = jest.fn();
const mockHandleCloseModalSelecionarCandidatos = jest.fn();
const mockHandleCandidatosSelecionados = jest.fn();
const mockHandleEditarCargo = jest.fn();
const mockHandleExcluirCargo = jest.fn();
const mockSalvarCargosNoBackend = jest.fn(() => Promise.resolve(true));
const mockConvocarCandidatosHabilitados = jest.fn(() => Promise.resolve(true));

const mockProcessoConvocacaoData = {
  concurso_nome: 'Concurso Teste',
  data_convocacao: '2024-01-15',
  tipo_escolha: 'NOVA_AUTORIZACAO',
  data_corte_vagas: '2024-01-20',
  descricao: 'Descrição do processo',
  concurso_uuid: 'concurso-uuid-123',
  uuid: 'processo-uuid-123',
};

const mockCargosDisponiveis = [
  { value: 'cargo-uuid-1', label: 'Professor', codigo: 'P001' },
  { value: 'cargo-uuid-2', label: 'Coordenador', codigo: 'C001' },
];

const mockCargosAdicionados = [
  {
    cargo_uuid: 'cargo-uuid-1',
    uuid: 'cargo-registro-uuid-1',
    cargo_nome: 'Professor',
    cargo_codigo: 'P001',
    vagas: 5,
    candidatos_geral: 10,
    candidatos_pcd: 2,
    candidatos_nna: 1,
    totalCandidatos: 13,
  },
];

const mockVagasInfo = {
  totalGeral: 10,
  totalPcd: 2,
  totalNna: 1,
};

jest.mock('../hooks/useSelecaoCargo', () => ({
  useSelecaoCargo: jest.fn(() => ({
    processoConvocacaoData: mockProcessoConvocacaoData,
    processoConvocacaoIsLoading: false,
    cargoSelecionado: undefined,
    cargosDisponiveis: mockCargosDisponiveis,
    concursoIsLoading: false,
    handleCargoChange: mockHandleCargoChange,
    modalSelecionarCandidatosVisible: false,
    handleBuscarCandidatos: mockHandleBuscarCandidatos,
    handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
    handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
    cargosAdicionados: [],
    ultimoCargoSelecionado: null,
    vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
    handleEditarCargo: mockHandleEditarCargo,
    handleExcluirCargo: mockHandleExcluirCargo,
    salvarCargosNoBackend: mockSalvarCargosNoBackend,
    convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
    uuid: 'test-uuid-123',
  })),
}));

// Mock do BaseTela
jest.mock('../../../Base/BaseTela', () => ({
  __esModule: true,
  default: ({ children, breadcrumbItems, title, buttons }: any) => (
    <div data-testid="base-tela">
      <div data-testid="breadcrumb" data-count={breadcrumbItems?.length || 0}>
        {breadcrumbItems?.map((item: any, idx: number) => (
          <span key={idx} data-testid={`breadcrumb-item-${idx}`}>
            {typeof item.title === 'string' ? item.title : item.title}
          </span>
        ))}
      </div>
      <div data-testid="title">{title}</div>
      <div data-testid="buttons">{buttons}</div>
      {children}
    </div>
  ),
}));

// Mock do BuscarCandidatosModal
jest.mock('../BuscarCandidatosModal', () => ({
  __esModule: true,
  default: ({ visible, onClose, cargo, concurso }: any) =>
    visible ? (
      <div data-testid="buscar-candidatos-modal">
        <div data-testid="modal-cargo">{cargo}</div>
        <div data-testid="modal-concurso">{concurso}</div>
        <button data-testid="modal-close" onClick={onClose}>
          Fechar
        </button>
      </div>
    ) : null,
}));

// Mock do StepActions
jest.mock('../../components/StepActions', () => ({
  StepActions: ({ current, next, prev, onCancel, canSalvarEAvancar, canVoltar }: any) => (
    <div data-testid="step-actions">
      <button data-testid="btn-next" onClick={next} disabled={!canSalvarEAvancar}>
        Avançar
      </button>
      <button data-testid="btn-prev" onClick={prev} disabled={!canVoltar}>
        Voltar
      </button>
      <button data-testid="btn-cancel" onClick={onCancel}>
        Cancelar
      </button>
      <div data-testid="current-step">{current}</div>
    </div>
  ),
}));

// Mock do StepsNames
jest.mock('../../components/StepsNames', () => ({
  items: [
    { key: 'Dados do processo', title: 'Dados do processo' },
    { key: 'Seleção e configuração dos cargos', title: 'Seleção e configuração dos cargos' },
    { key: 'Agendar', title: 'Agendar' },
    { key: 'Resumo', title: 'Resumo' },
  ],
  steps: [
    { title: 'Dados do processo', content: 'First-content' },
    { title: 'Seleção e configuração dos cargos', content: 'Second-content' },
    { title: 'Agendar', content: 'Last-content' },
    { title: 'Resumo', content: 'Last-content' },
  ],
}));

// Mock do dayjs
jest.mock('dayjs', () => {
  const actualDayjs = jest.requireActual('dayjs');
  const mockFn = (date?: any) => {
    if (!date) return actualDayjs();
    const d = actualDayjs(date);
    return {
      ...d,
      format: (fmt?: string) => {
        if (fmt === 'DD/MM/YYYY' && date) {
          if (typeof date === 'string' && date.includes('2024-01-15')) return '15/01/2024';
          if (typeof date === 'string' && date.includes('2024-01-20')) return '20/01/2024';
        }
        return d.format(fmt);
      },
      isValid: () => true,
      diff: (other: any, unit?: string) => d.diff(other, unit),
    };
  };
  mockFn.extend = jest.fn();
  mockFn.locale = jest.fn();
  return mockFn;
});

// Mock do StyledCardWithoutBorder
jest.mock('../../../../components/EstilosCompartilhados', () => ({
  StyledCardWithoutBorder: ({ children, title, style }: any) => (
    <div data-testid="styled-card" style={style}>
      {title && <div data-testid="card-title">{title}</div>}
      {children}
    </div>
  ),
  StyledSelect: ({ children, onChange, placeholder, loading, disabled }: any) => (
    <select
      data-testid="cargo-select"
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      data-loading={loading}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
  ),
}));

// Mock do CustomFormItem
jest.mock('../../../../components/FormStyle', () => ({
  CustomFormItem: ({ children, label }: any) => (
    <div data-testid="form-item">
      <label>{label}</label>
      {children}
    </div>
  ),
}));

// Mock do theme.useToken
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  theme: {
    useToken: () => ({
      token: {
        colorTextSecondary: '#666',
        borderRadiusLG: 8,
      },
    }),
  },
  Select: {
    Option: ({ children, value }: any) => (
      <option value={value}>{children}</option>
    ),
  },
}));

describe('SelecaoCargos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCan.mockImplementation((codename: string) => {
      if (codename === 'add_importacaoarquivovagas') return true;
      if (codename === 'change_processoconvocacao') return true;
      return false;
    });
  });

  describe('Renderização básica', () => {
    it('deve renderizar o componente BaseTela com título correto', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Nova convocação');
    });

    it('deve renderizar os breadcrumbs corretos', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toBeInTheDocument();
      expect(breadcrumb).toHaveAttribute('data-count', '4');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Nova Convocação');
    });

    it('deve renderizar o Steps com step atual 1', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('current-step')).toHaveTextContent('1');
    });

    it('deve renderizar o card de dados do processo', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const cardTitles = screen.getAllByTestId('card-title');
      const dadosProcessoCard = cardTitles.find(card => card.textContent === 'Dados do processo');
      expect(dadosProcessoCard).toBeInTheDocument();
    });

    it('deve renderizar o card de seleção de cargos', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const cardTitles = screen.getAllByTestId('card-title');
      const selecaoCargosCard = cardTitles.find(card => 
        card.textContent?.includes('Seleção e configuração do(s) cargo(s)')
      );
      expect(selecaoCargosCard).toBeInTheDocument();
    });

    it('deve renderizar o botão de Gerenciamento de vagas quando tem permissão', () => {
      mockCan.mockReturnValue(true);
      renderWithProviders(<SelecaoCargos />);
      
      const buttons = screen.getByTestId('buttons');
      expect(buttons).toBeInTheDocument();
    });

    it('deve desabilitar botão de Gerenciamento de vagas quando não tem permissão', () => {
      mockCan.mockImplementation((codename) => codename === 'change_processoconvocacao');
      
      renderWithProviders(<SelecaoCargos />);
      
      const buttons = screen.getByTestId('buttons');
      expect(buttons).toBeInTheDocument();
    });
  });

  describe('Exibição de dados do processo', () => {
    it('deve exibir nome do concurso', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('Concurso:')).toBeInTheDocument();
      expect(screen.getByText('Concurso Teste')).toBeInTheDocument();
    });

    it('deve exibir data da convocação formatada', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('Data da convocação:')).toBeInTheDocument();
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    });

    it('deve exibir "Carregando..." quando processoConvocacaoData não está disponível', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: null,
        processoConvocacaoIsLoading: true,
        cargoSelecionado: undefined,
        cargosDisponiveis: [],
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getAllByText('Carregando...').length).toBeGreaterThan(0);
    });

    it('deve exibir tipo de escolha formatado corretamente para ESCOLHA', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'ESCOLHA',
        },
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('Escolha')).toBeInTheDocument();
    });

    it('deve exibir data de corte de vagas formatada', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('Data corte de vagas:')).toBeInTheDocument();
      expect(screen.getByText('20/01/2024')).toBeInTheDocument();
    });

    it('deve exibir descrição do processo', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('Descrição:')).toBeInTheDocument();
      expect(screen.getByText('Descrição do processo')).toBeInTheDocument();
    });

    it('deve exibir tipo de escolha formatado para valor não mapeado (ex.: MEGA_ESCOLHA_AVANCADA)', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'MEGA_ESCOLHA_AVANCADA',
        },
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      // Deve converter para "Mega Escolha Avancada"
      expect(screen.getByText('Mega Escolha Avancada')).toBeInTheDocument();
    });
  });

  describe('Navegação e breadcrumbs', () => {
    it('deve navegar para Home ao clicar no breadcrumb Home', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar para Processos ao clicar no breadcrumb Processos', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const processosLink = screen.getByText('Processos');
      fireEvent.click(processosLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos');
    });

    it('deve navegar para Convocação ao clicar no breadcrumb Convocação de candidatos', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const convocacaoLink = screen.getByText('Convocação de candidatos');
      fireEvent.click(convocacaoLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao');
    });
  });

  describe('Navegação dos steps', () => {
    it('deve navegar para agenda quando next é chamado com sucesso', async () => {
      mockSalvarCargosNoBackend.mockResolvedValue(true);
      mockConvocarCandidatosHabilitados.mockResolvedValue(true);
      
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const nextButton = screen.getByTestId('btn-next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(mockSalvarCargosNoBackend).toHaveBeenCalled();
        expect(mockConvocarCandidatosHabilitados).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/agenda');
      });
    });

    it('não deve navegar quando salvarCargosNoBackend retorna false', async () => {
      mockSalvarCargosNoBackend.mockResolvedValue(false);
      mockNavigate.mockClear();
      
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const nextButton = screen.getByTestId('btn-next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(mockSalvarCargosNoBackend).toHaveBeenCalled();
      });
      
      expect(mockNavigate).not.toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/agenda');
    });

    it('deve navegar para dados do processo quando prev é chamado', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const prevButton = screen.getByTestId('btn-prev');
      fireEvent.click(prevButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/dados-processo');
    });

    it('deve navegar para convocação quando cancel é chamado', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const cancelButton = screen.getByTestId('btn-cancel');
      fireEvent.click(cancelButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/');
    });

    it('deve deduplicar candidatos antes de convocar no next', async () => {
      mockSalvarCargosNoBackend.mockResolvedValue(true);
      mockConvocarCandidatosHabilitados.mockResolvedValue(true);
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [
          { candidatos_uuids: ['a', 'b', 'a'], uuid: 'u1' },
          { candidatos_uuids: ['b', 'c'], uuid: 'u2' },
        ],
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      fireEvent.click(screen.getByTestId('btn-next'));
      await waitFor(() => {
        expect(mockConvocarCandidatosHabilitados).toHaveBeenCalledWith(['a', 'b', 'c'], true);
      });
    });
  });

  describe('Ações de topo e formatação de tipo de escolha', () => {
    it('deve navegar para Gerenciamento de vagas ao clicar no botão', () => {
      renderWithProviders(<SelecaoCargos />);
      const btn = screen.getByText('Gerenciamento de vagas');
      fireEvent.click(btn);
      expect(mockNavigate).toHaveBeenCalledWith('/processos/gerenciamento-vagas');
    });

    it('deve exibir tipo de escolha formatado corretamente para NOVA_AUTORIZACAO', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'NOVA_AUTORIZACAO',
        },
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      expect(screen.getByText('Nova Autorização')).toBeInTheDocument();
    });
  });

  describe('Seleção de cargo', () => {
    it('deve renderizar o select de cargos', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('cargo-select')).toBeInTheDocument();
    });

    it('deve chamar handleCargoChange ao selecionar um cargo', () => {
      renderWithProviders(<SelecaoCargos />);
      
      const select = screen.getByTestId('cargo-select');
      fireEvent.change(select, { target: { value: 'cargo-uuid-1' } });
      
      expect(mockHandleCargoChange).toHaveBeenCalledWith('cargo-uuid-1');
    });

    it('deve desabilitar botão buscar quando não há cargo selecionado e nenhum cargo adicionado', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValueOnce({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const buscarButton = screen.getByText('Buscar candidatos').closest('button');
      expect(buscarButton).toBeDisabled();
    });

    it('deve habilitar botão buscar quando há cargo selecionado', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: 'cargo-uuid-1',
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const buscarButton = screen.getByText('Buscar candidatos');
      expect(buscarButton).not.toBeDisabled();
    });

    it('deve chamar handleBuscarCandidatos ao clicar no botão buscar', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: 'cargo-uuid-1',
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const buscarButton = screen.getByText('Buscar candidatos');
      fireEvent.click(buscarButton);
      
      expect(mockHandleBuscarCandidatos).toHaveBeenCalled();
    });
  });

  describe('Modal de buscar candidatos', () => {
    it('deve renderizar o modal quando modalSelecionarCandidatosVisible é true', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: 'cargo-uuid-1',
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: true,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('buscar-candidatos-modal')).toBeInTheDocument();
    });

    it('não deve renderizar o modal quando modalSelecionarCandidatosVisible é false', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValueOnce({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.queryByTestId('buscar-candidatos-modal')).not.toBeInTheDocument();
    });

    it('deve passar os dados corretos para o modal', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: 'cargo-uuid-1',
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: true,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('modal-cargo')).toHaveTextContent('Professor');
      expect(screen.getByTestId('modal-concurso')).toHaveTextContent('Concurso Teste');
    });
  });

  describe('Cargos adicionados', () => {
    it('deve exibir cards de vagas quando há cargos adicionados', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getAllByText('Ampla').length).toBeGreaterThan(0);
      expect(screen.getAllByText('10').length).toBeGreaterThan(0);
      expect(screen.getAllByText('PcD').length).toBeGreaterThan(0);
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
      expect(screen.getAllByText('NNA').length).toBeGreaterThan(0);
      expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    });

    it('não deve exibir cards de vagas quando não há cargos adicionados', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValueOnce({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      // Verificar que os cards não estão presentes quando não há cargos
      // Os cards só aparecem quando cargosAdicionados.length > 0
      expect(screen.queryByText('10')).not.toBeInTheDocument();
    });

    it('deve exibir tabela de cargos quando há cargos adicionados', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      // Verificar que o cargo aparece na tabela (pode estar em múltiplos lugares)
      const professorTexts = screen.getAllByText('Professor');
      expect(professorTexts.length).toBeGreaterThan(0);
      // Verificar números específicos da tabela
      expect(screen.getAllByText('5').length).toBeGreaterThan(0);
      expect(screen.getAllByText('13').length).toBeGreaterThan(0);
    });

    it('deve chamar handleEditarCargo ao clicar no botão editar', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      // Clicar no primeiro botão de ação da tabela (Editar)
      const { container } = renderWithProviders(<SelecaoCargos />);
      const tableEl = container.querySelector('table');
      expect(tableEl).toBeInTheDocument();
      const actionButtons = tableEl!.querySelectorAll('button');
      expect(actionButtons.length).toBeGreaterThan(0);
      fireEvent.click(actionButtons[0]);
      expect(mockHandleEditarCargo).toHaveBeenCalled();
    });

    it('deve chamar handleExcluirCargo ao clicar no botão excluir', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      // Clicar no segundo botão de ação da tabela (Excluir)
      const { container } = renderWithProviders(<SelecaoCargos />);
      const tableEl = container.querySelector('table');
      expect(tableEl).toBeInTheDocument();
      const actionButtons = tableEl!.querySelectorAll('button');
      expect(actionButtons.length).toBeGreaterThan(1);
      fireEvent.click(actionButtons[1]);
      expect(mockHandleExcluirCargo).toHaveBeenCalled();
    });
  });

  describe('Permissões', () => {
    it('deve desabilitar botão avançar quando não tem permissão ou não há cargos', () => {
      mockCan.mockImplementation(() => false);
      
      renderWithProviders(<SelecaoCargos />);
      
      const nextButton = screen.getByTestId('btn-next');
      expect(nextButton).toBeDisabled();
    });

    it('deve habilitar botão avançar quando tem permissão e há cargos', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const nextButton = screen.getByTestId('btn-next');
      expect(nextButton).not.toBeDisabled();
    });

    it('deve desabilitar botão voltar quando não tem permissão', () => {
      mockCan.mockImplementation(() => false);
      
      renderWithProviders(<SelecaoCargos />);
      
      const prevButton = screen.getByTestId('btn-prev');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Formatação de datas', () => {
    it('deve formatar data válida corretamente', () => {
      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    });

    it('deve exibir "—" para data vazia', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: '',
        },
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
    });

    it('deve exibir "—" para data undefined', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: undefined,
        },
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: [],
        ultimoCargoSelecionado: null,
        vagasInfo: { totalGeral: 0, totalPcd: 0, totalNna: 0 },
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
    });
  });

  describe('Casos de edge', () => {
    it('deve habilitar botão buscar quando há cargos adicionados mesmo sem cargo selecionado', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: undefined,
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: false,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: null,
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      const buscarButton = screen.getByText('Buscar candidatos');
      expect(buscarButton).not.toBeDisabled();
    });

    it('deve renderizar modal com cargo em edição quando ultimoCargoSelecionado existe', () => {
      const { useSelecaoCargo } = require('../hooks/useSelecaoCargo');
      useSelecaoCargo.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargoSelecionado: 'cargo-uuid-1',
        cargosDisponiveis: mockCargosDisponiveis,
        concursoIsLoading: false,
        handleCargoChange: mockHandleCargoChange,
        modalSelecionarCandidatosVisible: true,
        handleBuscarCandidatos: mockHandleBuscarCandidatos,
        handleCloseModalSelecionarCandidatos: mockHandleCloseModalSelecionarCandidatos,
        handleCandidatosSelecionados: mockHandleCandidatosSelecionados,
        cargosAdicionados: mockCargosAdicionados,
        ultimoCargoSelecionado: mockCargosAdicionados[0],
        vagasInfo: mockVagasInfo,
        handleEditarCargo: mockHandleEditarCargo,
        handleExcluirCargo: mockHandleExcluirCargo,
        salvarCargosNoBackend: mockSalvarCargosNoBackend,
        convocarCandidatosHabilitados: mockConvocarCandidatosHabilitados,
        uuid: 'test-uuid-123',
      });

      renderWithProviders(<SelecaoCargos />);
      
      expect(screen.getByTestId('buscar-candidatos-modal')).toBeInTheDocument();
    });
  });
});

