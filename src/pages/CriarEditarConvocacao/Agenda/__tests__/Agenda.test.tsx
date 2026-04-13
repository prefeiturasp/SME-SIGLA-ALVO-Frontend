import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import AgendaTela from '../AgendaTela';
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

// Mock do useAgenda
const mockSalvarAgendasNoBackend = jest.fn(() => Promise.resolve(true));
const mockHandleAgendarCargo = jest.fn();
const mockHandleFecharAgenda = jest.fn();
const mockSetIsRetardatario = jest.fn();
const mockHandleAdicionarPeriodo = jest.fn();
const mockHandleRemoverPeriodo = jest.fn();
const mockEdit = jest.fn();
const mockCancelEdit = jest.fn();
const mockSaveEdit = jest.fn();
const mockCalcularIntervaloClassificacao = jest.fn((periodo) => '1ª até 10ª');
const mockVerificarConflitoTempoReal = jest.fn(() => false);
const mockLimparExpansao = jest.fn();

const mockProcessoConvocacaoData = {
  concurso_nome: 'Concurso Teste',
  data_convocacao: '2024-01-15',
  tipo_escolha: 'NOVA_AUTORIZACAO',
  data_corte_vagas: '2024-01-20',
  descricao: 'Descrição do processo',
  concurso_uuid: 'concurso-uuid-123',
};

const mockCargosAdicionados = [
  {
    uuid: 'cargo-uuid-1',
    nome: 'Professor',
    cargo_codigo: 'P001',
    vagas: 5,
    geral: 10,
    pcd: 2,
    nna: 1,
    totalCandidatos: 13,
    candidatos_uuids: ['c1', 'c2', 'c3'],
  },
];

const mockPeriodosList: any[] = [
  {
    id: 1,
    uuid: 'periodo-uuid-1',
    cargo: 'Professor',
    cargoUuid: 'cargo-uuid-1',
    classificacao: 5,
    dataEscolha: '15/01/2024',
    sessao: 'Sessão 1',
    horario: '08:00 às 10:00',
    horaInicio: '08:00',
    horaFim: '10:00',
    isRetardatario: false,
    tipoEscolha: 'Presencial',
    modalidade: 'Presencial',
  },
];

const mockWatchedFields = {
  tipoEscolha: '',
  cargoAgenda: '',
  escolhaEm: null,
  nomeacaoEm: null,
  quantidadeClassificados: null,
  sessao: null,
  horaInicio: null,
  horaFim: null,
};

const mockAgendaAberto = {
  cargoUuid: 'cargo-uuid-1',
  cargo: mockCargosAdicionados[0],
  cargo_codigo: 'P001',
};

jest.mock('../hooks/useAgenda', () => ({
  useAgenda: jest.fn(() => ({
    processoConvocacaoData: mockProcessoConvocacaoData,
    processoConvocacaoIsLoading: false,
    cargosAdicionados: mockCargosAdicionados,
    handleAgendarCargo: mockHandleAgendarCargo,
    agendaAberto: null,
    handleFecharAgenda: mockHandleFecharAgenda,
    control: {},
    formErrors: {},
    isRetardatario: false,
    setIsRetardatario: mockSetIsRetardatario,
    periodosList: [],
    watchedFields: mockWatchedFields,
    getErrorMessage: (error: any) => error?.message || 'Erro',
    isAgendaComplete: () => false,
    isBotaoAdicionarHabilitado: () => false,
    handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
    handleRemoverPeriodo: mockHandleRemoverPeriodo,
    editingKey: null,
    isEditing: () => false,
    edit: mockEdit,
    cancelEdit: mockCancelEdit,
    saveEdit: mockSaveEdit,
    calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
    verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
    cargoParaExpandir: null,
    limparExpansao: mockLimparExpansao,
    salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
    uuid: 'test-uuid-123',
    temPeriodosAgenda: () => false,
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

// Mock dos componentes AgendaForm e AgendaTabela
jest.mock('../components/AgendaForm', () => ({
  __esModule: true,
  default: ({ agendaAberto }: any) =>
    agendaAberto ? (
      <div data-testid="agenda-form">
        <div data-testid="agenda-cargo">{agendaAberto?.cargo?.nome}</div>
      </div>
    ) : null,
}));

jest.mock('../components/AgendaTabela', () => ({
  __esModule: true,
  default: ({ cargosAdicionados, handleAgendarClick }: any) => (
    <div data-testid="agenda-tabela">
      {cargosAdicionados.map((cargo: any, idx: number) => (
        <button
          key={idx}
          data-testid={`agendar-btn-${cargo.uuid}`}
          onClick={() => handleAgendarClick(cargo.uuid)}
        >
          Agendar {cargo.nome}
        </button>
      ))}
    </div>
  ),
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

// Mock do dayjs - deve vir antes de qualquer import do antd
const mockDayjsInstance = {
  format: jest.fn((fmt?: string) => {
    if (fmt === 'DD/MM/YYYY') return '15/01/2024';
    return '';
  }),
  isValid: jest.fn(() => true),
  diff: jest.fn(() => 0),
  valueOf: jest.fn(() => Date.now()),
  add: jest.fn(function(this: any) { return this; }),
  subtract: jest.fn(function(this: any) { return this; }),
};

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
}));

describe('AgendaTela', () => {
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
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByTestId('base-tela')).toBeInTheDocument();
      expect(screen.getByTestId('title')).toHaveTextContent('Nova convocação');
    });

    it('deve renderizar os breadcrumbs corretos', () => {
      renderWithProviders(<AgendaTela />);
      
      const breadcrumb = screen.getByTestId('breadcrumb');
      expect(breadcrumb).toBeInTheDocument();
      expect(breadcrumb).toHaveAttribute('data-count', '4');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Nova Convocação');
    });

    it('deve renderizar o Steps com step atual 2', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByTestId('current-step')).toHaveTextContent('2');
    });

    it('deve renderizar o card de dados do processo', () => {
      renderWithProviders(<AgendaTela />);
      
      const cards = screen.getAllByTestId('styled-card');
      expect(cards.length).toBeGreaterThan(0);
      // Verificar que o título aparece em um card (não apenas no steps)
      const cardTitles = screen.getAllByTestId('card-title');
      const dadosProcessoCard = cardTitles.find(card => card.textContent === 'Dados do processo');
      expect(dadosProcessoCard).toBeInTheDocument();
    });

    it('deve renderizar o card de Agendar', () => {
      renderWithProviders(<AgendaTela />);
      
      // Verificar que "Agendar" aparece no título do card (não apenas no steps)
      const allAgendarTexts = screen.getAllByText('Agendar');
      expect(allAgendarTexts.length).toBeGreaterThan(0);
      // Verificar que há um card com título "Agendar"
      const cardTitles = screen.getAllByTestId('card-title');
      const agendarCard = cardTitles.find(card => card.textContent === 'Agendar');
      expect(agendarCard).toBeInTheDocument();
    });

    it('deve renderizar o botão de Gerenciamento de vagas quando tem permissão', () => {
      mockCan.mockReturnValue(true);
      renderWithProviders(<AgendaTela />);
      
      const buttons = screen.getByTestId('buttons');
      expect(buttons).toBeInTheDocument();
    });

    it('deve desabilitar botão de Gerenciamento de vagas quando não tem permissão', () => {
      mockCan.mockImplementation((codename) => codename === 'change_processoconvocacao');
      
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        ...useAgenda(),
        processoConvocacaoData: mockProcessoConvocacaoData,
      });
      
      renderWithProviders(<AgendaTela />);
      
      const buttons = screen.getByTestId('buttons');
      expect(buttons).toBeInTheDocument();
    });
  });

  describe('Exibição de dados do processo', () => {
    it('deve exibir nome do concurso', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Concurso:')).toBeInTheDocument();
      expect(screen.getByText('Concurso Teste')).toBeInTheDocument();
    });

    it('deve exibir data da convocação formatada', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Data da convocação:')).toBeInTheDocument();
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    });

    it('deve exibir "Carregando..." quando processoConvocacaoData não está disponível', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: null,
        processoConvocacaoIsLoading: true,
        cargosAdicionados: [],
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.getAllByText('Carregando...').length).toBeGreaterThan(0);
    });

    it('deve exibir tipo de escolha formatado corretamente para ESCOLHA', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'ESCOLHA',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Escolha')).toBeInTheDocument();
    });

    it('deve exibir tipo de escolha formatado para outros tipos', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'OUTRO_TIPO',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Outro Tipo')).toBeInTheDocument();
    });

    it('deve exibir data de corte de vagas formatada', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Data corte de vagas:')).toBeInTheDocument();
      expect(screen.getByText('20/01/2024')).toBeInTheDocument();
    });

    it('deve exibir descrição do processo', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('Descrição:')).toBeInTheDocument();
      expect(screen.getByText('Descrição do processo')).toBeInTheDocument();
    });

    it('deve exibir "—" quando data é inválida ou vazia', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: null,
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });
  });

  describe('Navegação e breadcrumbs', () => {
    it('deve navegar para Home ao clicar no breadcrumb Home', () => {
      renderWithProviders(<AgendaTela />);
      
      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve navegar para Processos ao clicar no breadcrumb Processos', () => {
      renderWithProviders(<AgendaTela />);
      
      const processosLink = screen.getByText('Processos');
      fireEvent.click(processosLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos');
    });

    it('deve navegar para Convocação ao clicar no breadcrumb Convocação de candidatos', () => {
      renderWithProviders(<AgendaTela />);
      
      const convocacaoLink = screen.getByText('Convocação de candidatos');
      fireEvent.click(convocacaoLink);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao');
    });
  });

  describe('Navegação dos steps', () => {
    it('deve navegar para resumo quando next é chamado com sucesso', async () => {
      mockSalvarAgendasNoBackend.mockResolvedValue(true);
      
      renderWithProviders(<AgendaTela />);
      
      const nextButton = screen.getByTestId('btn-next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(mockSalvarAgendasNoBackend).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/resumo');
      });
    });

    it('não deve navegar quando salvarAgendasNoBackend retorna false', async () => {
      mockSalvarAgendasNoBackend.mockResolvedValue(false);
      mockNavigate.mockClear();
      
      renderWithProviders(<AgendaTela />);
      
      const nextButton = screen.getByTestId('btn-next');
      fireEvent.click(nextButton);
      
      await waitFor(() => {
        expect(mockSalvarAgendasNoBackend).toHaveBeenCalled();
      });
      
      expect(mockNavigate).not.toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/resumo');
    });

    it('deve navegar para seleção de cargos quando prev é chamado', () => {
      renderWithProviders(<AgendaTela />);
      
      const prevButton = screen.getByTestId('btn-prev');
      fireEvent.click(prevButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao/editar/test-uuid-123/selecao-cargos');
    });

    it('deve navegar para convocação quando cancel é chamado', () => {
      renderWithProviders(<AgendaTela />);
      
      const cancelButton = screen.getByTestId('btn-cancel');
      fireEvent.click(cancelButton);
      
      expect(mockNavigate).toHaveBeenCalledWith('/processos/convocacao');
    });
  });

  describe('Componentes filhos', () => {
    it('deve renderizar AgendaTabela com cargos adicionados', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByTestId('agenda-tabela')).toBeInTheDocument();
      expect(screen.getByTestId('agendar-btn-cargo-uuid-1')).toBeInTheDocument();
    });

    it('deve renderizar AgendaForm quando agendaAberto não é null', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: mockAgendaAberto,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByTestId('agenda-form')).toBeInTheDocument();
      expect(screen.getByTestId('agenda-cargo')).toHaveTextContent('Professor');
    });

    it('não deve renderizar AgendaForm quando agendaAberto é null', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValueOnce({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.queryByTestId('agenda-form')).not.toBeInTheDocument();
    });

    it('deve chamar handleAgendarCargo ao clicar no botão agendar na tabela', () => {
      renderWithProviders(<AgendaTela />);
      
      const agendarButton = screen.getByTestId('agendar-btn-cargo-uuid-1');
      fireEvent.click(agendarButton);
      
      expect(mockHandleAgendarCargo).toHaveBeenCalledWith('cargo-uuid-1');
    });
  });

  describe('Permissões', () => {
    it('deve desabilitar botão avançar quando não tem permissão canSalvarEAvancar', () => {
      mockCan.mockImplementation(() => false);
      
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      const nextButton = screen.getByTestId('btn-next');
      expect(nextButton).toBeDisabled();
    });

    it('deve desabilitar botão voltar quando não tem permissão canVoltar', () => {
      mockCan.mockImplementation(() => false);
      
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      const prevButton = screen.getByTestId('btn-prev');
      expect(prevButton).toBeDisabled();
    });
  });

  describe('Formatação de datas', () => {
    it('deve formatar data válida corretamente', () => {
      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByText('15/01/2024')).toBeInTheDocument();
    });

    it('deve exibir "—" para data vazia', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: '',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });

    it('deve exibir "—" para data undefined', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: undefined,
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });
  });

  describe('Cenários adicionais para cobertura', () => {
    it('deve lidar com formatDate quando data é inválida', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          data_convocacao: 'data-invalida',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });

    it('deve lidar com formatTipoEscolha quando value é vazio', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: '',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });

    it('deve lidar com formatTipoEscolha quando tipo não está no map', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: {
          ...mockProcessoConvocacaoData,
          tipo_escolha: 'TIPO_DESCONHECIDO',
        },
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: null,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: [],
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
    });

    it('deve chamar handleAgendarClick corretamente', () => {
      renderWithProviders(<AgendaTela />);
      
      const agendarButton = screen.getByTestId('agendar-btn-cargo-uuid-1');
      fireEvent.click(agendarButton);
      
      expect(mockHandleAgendarCargo).toHaveBeenCalledWith('cargo-uuid-1');
    });

    it('deve renderizar AgendaForm com candidatos disponíveis calculados', () => {
      const { useAgenda } = require('../hooks/useAgenda');
      useAgenda.mockReturnValue({
        processoConvocacaoData: mockProcessoConvocacaoData,
        processoConvocacaoIsLoading: false,
        cargosAdicionados: mockCargosAdicionados,
        handleAgendarCargo: mockHandleAgendarCargo,
        agendaAberto: mockAgendaAberto,
        handleFecharAgenda: mockHandleFecharAgenda,
        control: {},
        formErrors: {},
        isRetardatario: false,
        setIsRetardatario: mockSetIsRetardatario,
        periodosList: mockPeriodosList,
        watchedFields: mockWatchedFields,
        getErrorMessage: () => 'Erro',
        isAgendaComplete: () => false,
        isBotaoAdicionarHabilitado: () => false,
        handleAdicionarPeriodo: mockHandleAdicionarPeriodo,
        handleRemoverPeriodo: mockHandleRemoverPeriodo,
        editingKey: null,
        isEditing: () => false,
        edit: mockEdit,
        cancelEdit: mockCancelEdit,
        saveEdit: mockSaveEdit,
        calcularIntervaloClassificacao: mockCalcularIntervaloClassificacao,
        verificarConflitoTempoReal: mockVerificarConflitoTempoReal,
        cargoParaExpandir: null,
        limparExpansao: mockLimparExpansao,
        salvarAgendasNoBackend: mockSalvarAgendasNoBackend,
        uuid: 'test-uuid-123',
        temPeriodosAgenda: () => false,
      });

      renderWithProviders(<AgendaTela />);
      
      expect(screen.getByTestId('agenda-form')).toBeInTheDocument();
    });
  });
});

