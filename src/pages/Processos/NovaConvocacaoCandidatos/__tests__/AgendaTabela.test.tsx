import { screen, fireEvent } from '@testing-library/react';
import { message } from 'antd';
import AgendaTabela from '../components/Agenda/AgendaTabela';
import { renderWithProviders } from '../../../../test-utils';

// Mocks simplificados
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: { error: jest.fn() },
  TimePicker: ({ onChange, value, ...props }: any) => (
    <input
      {...props}
      data-testid="time-picker"
      value={value ? value.format('HH:mm') : ''}
      onChange={(e) => {
        const mockDayjs = require('dayjs');
        onChange(mockDayjs(e.target.value, 'HH:mm'));
      }}
    />
  ),
}));

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn((date?: any): any => ({
    format: jest.fn((): string => date || ''),
    isValid: jest.fn((): boolean => true),
    valueOf: jest.fn((): number => Date.now()),
    hour: jest.fn((): any => mockDayjs()),
    minute: jest.fn((): any => mockDayjs()),
    second: jest.fn((): any => mockDayjs()),
    millisecond: jest.fn((): any => mockDayjs()),
    year: jest.fn((): any => mockDayjs()),
    month: jest.fn((): any => mockDayjs()),
    date: jest.fn((): any => mockDayjs()),
    day: jest.fn((): any => mockDayjs()),
    startOf: jest.fn((): any => mockDayjs()),
    endOf: jest.fn((): any => mockDayjs()),
    add: jest.fn((): any => mockDayjs()),
    subtract: jest.fn((): any => mockDayjs()),
    isSame: jest.fn((): boolean => false),
    isBefore: jest.fn((): boolean => false),
    isAfter: jest.fn((): boolean => false),
    isBetween: jest.fn((): boolean => false),
    diff: jest.fn((): number => 0),
    toDate: jest.fn((): Date => new Date()),
    toISOString: jest.fn((): string => '2024-01-01T00:00:00.000Z'),
    unix: jest.fn((): number => 1704067200),
  }));
  
  Object.assign(mockDayjs, {
    extend: jest.fn(),
    locale: jest.fn(),
    tz: jest.fn(),
    utc: jest.fn(),
    unix: jest.fn(),
    max: jest.fn(),
    min: jest.fn(),
  });
  
  return mockDayjs;
});

// Dados de teste simplificados
const createMockPeriodo = (id: number, tipoEscolha = 'Presencial') => ({
  id,
  cargo: `Cargo ${id}`,
  classificacao: id * 2,
  dataEscolha: `2024-01-${15 + id}`,
  sessao: `Sessão ${id}`,
  horario: `${8 + id}:00 às ${10 + id}:00`,
  horaInicio: `${8 + id}:00`,
  horaFim: `${10 + id}:00`,
  tipoEscolha,
});

const mockPeriodosList = [
  createMockPeriodo(1, 'Presencial'),
  createMockPeriodo(2, 'Online'),
];

const createMockProps = (overrides = {}) => ({
  periodosList: mockPeriodosList,
  handleRemoverPeriodo: jest.fn(),
  onUpdatePeriodo: jest.fn(),
  editingKey: null,
  isEditing: jest.fn(() => false),
  edit: jest.fn(),
  cancelEdit: jest.fn(),
  saveEdit: jest.fn(() => ({ success: true })),
  calcularIntervaloClassificacao: jest.fn(() => '1º ao 5º'),
  verificarConflitoTempoReal: jest.fn(() => false),
  ...overrides,
});

describe('AgendaTabela', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização e estrutura básica', () => {
    it('deve renderizar tabela com dados, colunas e estrutura correta', () => {
      const mockProps = createMockProps();
      const { container } = renderWithProviders(<AgendaTabela {...mockProps} />);
      
      // Verificar renderização de dados
      expect(screen.getByText('Cargo 1')).toBeInTheDocument();
      expect(screen.getByText('Cargo 2')).toBeInTheDocument();
      expect(screen.getByText('2024-01-16')).toBeInTheDocument();
      expect(screen.getByText('2024-01-17')).toBeInTheDocument();
      
      // Verificar colunas
      expect(screen.getByText('Cargo')).toBeInTheDocument();
      expect(screen.getByText('Classificação')).toBeInTheDocument();
      expect(screen.getByText('Data da Escolha')).toBeInTheDocument();
      expect(screen.getByText('Sessão')).toBeInTheDocument();
      expect(screen.getByText('Horário')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
      
      // Verificar estrutura da tabela
      expect(container.querySelector('.ant-table')).toBeInTheDocument();
      expect(container.querySelector('.ant-table-thead')).toBeInTheDocument();
      expect(container.querySelector('.ant-table-tbody')).toBeInTheDocument();
      expect(container.querySelector('.ant-pagination')).not.toBeInTheDocument();
      
      // Verificar rowKey e classes CSS
      const rows = container.querySelectorAll('[data-row-key]');
      expect(rows[0]).toHaveAttribute('data-row-key', '1');
      expect(rows[1]).toHaveAttribute('data-row-key', '2');
      expect(rows[0]).toHaveClass('table-row-light');
      expect(rows[1]).toHaveClass('table-row-dark');
    });

    it('não deve renderizar nada quando a lista está vazia', () => {
      const { container } = renderWithProviders(
        <AgendaTabela {...createMockProps({ periodosList: [] })} />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Modo de visualização e ações básicas', () => {
    it('deve mostrar botões de editar/excluir e dados corretos quando não está editando', () => {
      const mockProps = createMockProps();
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      // Verificar botões de ação
      const editButtons = screen.getAllByTestId('ModeEditOutlineOutlinedIcon');
      const deleteButtons = screen.getAllByLabelText('delete');
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
      
      // Verificar dados renderizados
      expect(screen.getByText('Sessão 1')).toBeInTheDocument();
      expect(screen.getByText('Sessão 2')).toBeInTheDocument();
      expect(screen.getByText('9:00 às 11:00')).toBeInTheDocument();
      expect(screen.getByText('10:00 às 12:00')).toBeInTheDocument();
      expect(screen.getAllByText('1º ao 5º')).toHaveLength(2);
      expect(screen.getByText('(2 candidatos)')).toBeInTheDocument();
      expect(screen.getByText('(4 candidatos)')).toBeInTheDocument();
      
      // Verificar chamadas de função
      expect(mockProps.calcularIntervaloClassificacao).toHaveBeenCalledTimes(4);
    });

    it('deve chamar funções corretas ao clicar nos botões', () => {
      const mockProps = createMockProps();
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      // Testar botão editar
      fireEvent.click(screen.getAllByTestId('ModeEditOutlineOutlinedIcon')[0]);
      expect(mockProps.edit).toHaveBeenCalledWith(mockPeriodosList[0]);
      
      // Testar botão excluir
      fireEvent.click(screen.getAllByLabelText('delete')[0]);
      expect(mockProps.handleRemoverPeriodo).toHaveBeenCalledWith(1);
    });
  });

  describe('Modo de edição', () => {
    const createEditingProps = (overrides = {}) => createMockProps({
      editingKey: 1,
      isEditing: jest.fn((record) => record.id === 1),
      ...overrides,
    });

    it('deve mostrar campos de edição e botões salvar/cancelar quando está editando', () => {
      const mockProps = createEditingProps();
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      // Verificar botões de salvar/cancelar
      expect(screen.getByLabelText('check')).toBeInTheDocument();
      expect(screen.getByLabelText('close')).toBeInTheDocument();
      
      // Verificar campos de edição
      const timePickers = screen.getAllByTestId('time-picker');
      expect(timePickers).toHaveLength(2);
      
      const classificacaoInput = screen.getByDisplayValue('2');
      expect(classificacaoInput).toHaveAttribute('type', 'number');
      expect(classificacaoInput).toHaveAttribute('min', '1');
    });

    it('deve chamar cancelEdit ao clicar no botão cancelar', () => {
      const mockProps = createEditingProps();
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      fireEvent.click(screen.getByLabelText('close'));
      expect(mockProps.cancelEdit).toHaveBeenCalled();
    });

    it('deve mostrar diferentes campos baseado no tipo de escolha', () => {
      const mockProps = createEditingProps({
        editingKey: 2,
        isEditing: jest.fn((record) => record.id === 2),
      });
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      expect(screen.getByText('Online')).toBeInTheDocument();
    });
  });

  describe('Funcionalidades de salvar e validação', () => {
    const createEditingProps = (saveEditResult = { success: true }) => createMockProps({
      editingKey: 1,
      isEditing: jest.fn((record) => record.id === 1),
      saveEdit: jest.fn(() => saveEditResult),
    });

    it('deve salvar com sucesso quando saveEdit retorna success true', () => {
      const successProps = createEditingProps({ success: true });
      renderWithProviders(<AgendaTabela {...successProps} />);
      fireEvent.click(screen.getAllByLabelText('check')[0]);
      expect(successProps.saveEdit).toHaveBeenCalled();
      expect(message.error).not.toHaveBeenCalled();
    });

    it('deve mostrar erro quando saveEdit retorna success false', () => {
      const errorProps = createMockProps({
        editingKey: 1,
        isEditing: jest.fn((record) => record.id === 1),
        saveEdit: jest.fn(() => ({ success: false, message: 'Erro de validação' })),
      });
      renderWithProviders(<AgendaTabela {...errorProps} />);
      fireEvent.click(screen.getAllByLabelText('check')[0]);
      expect(message.error).toHaveBeenCalledWith('Erro de validação');
    });

    it('deve mostrar erro genérico quando saveEdit retorna success false sem mensagem', () => {
      const genericErrorProps = createMockProps({
        editingKey: 1,
        isEditing: jest.fn((record) => record.id === 1),
        saveEdit: jest.fn(() => ({ success: false })),
      });
      renderWithProviders(<AgendaTabela {...genericErrorProps} />);
      fireEvent.click(screen.getAllByLabelText('check')[0]);
      expect(message.error).toHaveBeenCalledWith('Erro ao salvar período.');
    });

    it('deve mostrar mensagem de conflito quando há conflito de horário', () => {
      const mockProps = createMockProps({
        editingKey: 1,
        isEditing: jest.fn((record) => record.id === 1),
        verificarConflitoTempoReal: jest.fn(() => true),
      });
      renderWithProviders(<AgendaTabela {...mockProps} />);
      
      expect(screen.getByText('Horário já existe')).toBeInTheDocument();
      expect(mockProps.verificarConflitoTempoReal).toHaveBeenCalled();
    });
  });
});