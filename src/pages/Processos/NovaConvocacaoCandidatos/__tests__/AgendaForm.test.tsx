import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import AgendaForm from '../components/Agenda/AgendaForm';
import { renderWithProviders } from '../../../../test-utils';

// Mock do dayjs
jest.mock('dayjs', () => {
  const mockDayjs = jest.fn((date?: any, format?: string) => {
    const mockInstance = {
      format: jest.fn((fmt?: string) => {
        if (fmt === 'HH:mm' && date) return date;
        return date || '';
      }),
      isValid: jest.fn(() => true),
      valueOf: jest.fn(() => Date.now()),
      hour: jest.fn((h?: number) => h !== undefined ? mockInstance : 0),
      minute: jest.fn((m?: number) => m !== undefined ? mockInstance : 0),
      second: jest.fn((s?: number) => s !== undefined ? mockInstance : 0),
      millisecond: jest.fn((ms?: number) => ms !== undefined ? mockInstance : 0),
      year: jest.fn((y?: number) => y !== undefined ? mockInstance : 2024),
      month: jest.fn((m?: number) => m !== undefined ? mockInstance : 0),
      date: jest.fn((d?: number) => d !== undefined ? mockInstance : 1),
      day: jest.fn((d?: number) => d !== undefined ? mockInstance : 1),
      startOf: jest.fn(() => mockInstance),
      endOf: jest.fn(() => mockInstance),
      add: jest.fn(() => mockInstance),
      subtract: jest.fn(() => mockInstance),
      isSame: jest.fn(() => false),
      isBefore: jest.fn(() => false),
      isAfter: jest.fn(() => false),
      isBetween: jest.fn(() => false),
      diff: jest.fn(() => 0),
      toDate: jest.fn(() => new Date()),
      toISOString: jest.fn(() => '2024-01-01T00:00:00.000Z'),
      unix: jest.fn(() => 1704067200),
      valueOf: jest.fn(() => Date.now()),
    };
    return mockInstance;
  });
  
  mockDayjs.extend = jest.fn();
  mockDayjs.locale = jest.fn();
  mockDayjs.tz = jest.fn();
  mockDayjs.utc = jest.fn();
  mockDayjs.unix = jest.fn();
  mockDayjs.max = jest.fn();
  mockDayjs.min = jest.fn();
  
  return mockDayjs;
});

// Mock dos componentes Ant Design
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  DatePicker: ({ onChange, value, ...props }: any) => (
    <input
      {...props}
      data-testid="date-picker"
      value={value ? value.format('DD/MM/YYYY') : ''}
      onChange={(e) => {
        const mockDayjs = require('dayjs');
        const date = mockDayjs(e.target.value, 'DD/MM/YYYY');
        onChange(date);
      }}
    />
  ),
  RangePicker: ({ onChange, value, ...props }: any) => (
    <input
      {...props}
      data-testid="range-picker"
      value={value ? value.map((d: any) => d.format('DD/MM/YYYY')).join(' - ') : ''}
      onChange={(e) => {
        const mockDayjs = require('dayjs');
        const dates = e.target.value.split(' - ').map((d: string) => mockDayjs(d, 'DD/MM/YYYY'));
        onChange(dates);
      }}
    />
  ),
  TimePicker: ({ onChange, value, ...props }: any) => (
    <input
      {...props}
      data-testid="time-picker"
      value={value ? value.format('HH:mm') : ''}
      onChange={(e) => {
        const mockDayjs = require('dayjs');
        const time = mockDayjs(e.target.value, 'HH:mm');
        onChange(time);
      }}
    />
  ),
}));

const mockCargosDisponiveis = [
  { label: 'Professor', value: 'professor' },
  { label: 'Coordenador', value: 'coordenador' },
];

// Componente wrapper para usar useForm
const TestWrapper: React.FC<{ 
  formErrors?: any;
  isRetardatario?: boolean;
  setIsRetardatario?: jest.Mock;
  getErrorMessage?: jest.Mock;
  isAgendaComplete?: jest.Mock;
  handleAdicionarPeriodo?: jest.Mock;
  tipoEscolha?: string;
}> = ({ 
  formErrors = {},
  isRetardatario = false,
  setIsRetardatario = jest.fn(),
  getErrorMessage = jest.fn((error) => error.message || 'Erro'),
  isAgendaComplete = jest.fn(() => true),
  handleAdicionarPeriodo = jest.fn(),
  tipoEscolha = 'Presencial'
}) => {
  const { control } = useForm();
  
  return (
    <AgendaForm
      control={control}
      formErrors={formErrors}
      cargosDisponiveis={mockCargosDisponiveis}
      isRetardatario={isRetardatario}
      setIsRetardatario={setIsRetardatario}
      getErrorMessage={getErrorMessage}
      isAgendaComplete={isAgendaComplete}
      handleAdicionarPeriodo={handleAdicionarPeriodo}
      tipoEscolha={tipoEscolha}
    />
  );
};

describe('AgendaForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar todos os campos do formulário', () => {
      renderWithProviders(<TestWrapper />);
      
      expect(screen.getByText('Modalidade da Escolha')).toBeInTheDocument();
      expect(screen.getByText('Cargo')).toBeInTheDocument();
      expect(screen.getByText('Escolha em')).toBeInTheDocument();
      expect(screen.getByText('Nomeação em')).toBeInTheDocument();
      expect(screen.getByText('Classificação')).toBeInTheDocument();
      expect(screen.getByText('Sessão')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Agenda')).toBeInTheDocument();
    });

    it('deve renderizar campos de horário para tipo Presencial', () => {
      renderWithProviders(<TestWrapper />);
      
      expect(screen.getByText('Hora da convocação')).toBeInTheDocument();
      expect(screen.getByText('Retardatário')).toBeInTheDocument();
    });

  });

  describe('Interações do usuário', () => {
    it('deve chamar setIsRetardatario ao clicar no checkbox', () => {
      const mockSetIsRetardatario = jest.fn();
      renderWithProviders(<TestWrapper setIsRetardatario={mockSetIsRetardatario} />);
      
      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      
      expect(mockSetIsRetardatario).toHaveBeenCalledWith(true);
    });

    it('deve chamar handleAdicionarPeriodo ao clicar no botão', () => {
      const mockHandleAdicionarPeriodo = jest.fn();
      renderWithProviders(<TestWrapper handleAdicionarPeriodo={mockHandleAdicionarPeriodo} />);
      
      const button = screen.getByText('Adicionar Agenda');
      fireEvent.click(button);
      
      expect(mockHandleAdicionarPeriodo).toHaveBeenCalled();
    });

    it('deve desabilitar botão quando agenda não está completa', () => {
      const mockIsAgendaComplete = jest.fn(() => false);
      renderWithProviders(<TestWrapper isAgendaComplete={mockIsAgendaComplete} />);
      
      const button = screen.getByRole('button', { name: /adicionar agenda/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Exibição de erros', () => {
    it('deve exibir erro para tipoEscolha', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ tipoEscolha: { message: 'Tipo obrigatório' } }} />
      );
      
      expect(screen.getByText('Tipo obrigatório')).toBeInTheDocument();
    });

    it('deve exibir erro para cargoAgenda', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ cargoAgenda: { message: 'Cargo obrigatório' } }} />
      );
      
      expect(screen.getByText('Cargo obrigatório')).toBeInTheDocument();
    });

    it('deve exibir erro para escolhaEm', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ escolhaEm: { message: 'Data obrigatória' } }} />
      );
      
      expect(screen.getByText('Data obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro para nomeacaoEm', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ nomeacaoEm: { message: 'Data obrigatória' } }} />
      );
      
      expect(screen.getByText('Data obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro para quantidadeClassificados', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ quantidadeClassificados: { message: 'Quantidade obrigatória' } }} />
      );
      
      expect(screen.getByText('Quantidade obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro para sessao', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ sessao: { message: 'Sessão obrigatória' } }} />
      );
      
      expect(screen.getByText('Sessão obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro para horaInicio', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ horaInicio: { message: 'Hora início obrigatória' } }} />
      );
      
      expect(screen.getByText('Hora início obrigatória')).toBeInTheDocument();
    });

    it('deve exibir erro para horaFim', () => {
      renderWithProviders(
        <TestWrapper formErrors={{ horaFim: { message: 'Hora fim obrigatória' } }} />
      );
      
      expect(screen.getByText('Hora fim obrigatória')).toBeInTheDocument();
    });
  });

  describe('Estados do componente', () => {
    it('deve mostrar checkbox marcado quando isRetardatario é true', () => {
      renderWithProviders(<TestWrapper isRetardatario={true} />);
      
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('deve renderizar DatePicker para tipo Presencial', () => {
      renderWithProviders(<TestWrapper />);
      
      const datePickers = screen.getAllByTestId('date-picker');
      expect(datePickers).toHaveLength(2);
    });

    it('deve renderizar TimePickers para tipo Presencial', () => {
      renderWithProviders(<TestWrapper />);
      
      const timePickers = screen.getAllByTestId('time-picker');
      expect(timePickers).toHaveLength(2);
    });
  });
});
