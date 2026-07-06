const mockFormValues: Record<string, { horaInicio: string; horaFim: string; classificacao: number }> = {
  '1': { horaInicio: '10:00', horaFim: '11:00', classificacao: 30 },
  '2': { horaInicio: '11:00', horaFim: '12:00', classificacao: 10 },
};

jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    getValues: jest.fn((path?: string) => {
      if (!path) return mockFormValues;
      const [formKey, field] = path.split('.');
      return mockFormValues[formKey]?.[field as keyof (typeof mockFormValues)[string]];
    }),
    reset: jest.fn(),
    watch: jest.fn(() => mockFormValues),
  }),
  Controller: ({ render, defaultValue, name }: any) =>
    render({
      field: {
        value: defaultValue ?? mockFormValues[name.split('.')[0]]?.[name.split('.')[1]],
        onChange: jest.fn(),
      },
    }),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
  },
}));

import '../testHelpers/useAgendaMocks';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { message } from 'antd';
import AgendaTabela from '../components/AgendaTabela';
import { renderWithProviders } from '../../../../test-utils';
import {
  MENSAGEM_LIMITE_REDISTRIBUICAO,
  type PeriodoItem,
} from '../hooks/useAgenda';

const mockCargos = [
  {
    uuid: 'cargo-uuid-1',
    nome: 'Professor',
    vagas: 10,
    totalCandidatos: 40,
  },
];

const criarPeriodo = (overrides: Partial<PeriodoItem> = {}): PeriodoItem => ({
  id: 1,
  cargo: 'Professor',
  cargoUuid: 'cargo-uuid-1',
  classificacao: 30,
  dataEscolha: '15/01/2024',
  sessao: 'Sessão 1',
  horario: '10:00 às 11:00',
  horaInicio: '10:00',
  horaFim: '11:00',
  isRetardatario: false,
  tipoEscolha: 'PRESENCIAL',
  modalidade: 'PRESENCIAL',
  ...overrides,
});

const mockPeriodos: PeriodoItem[] = [
  criarPeriodo({ id: 1 }),
  criarPeriodo({
    id: 2,
    classificacao: 10,
    sessao: 'Sessão 2',
    horario: '11:00 às 12:00',
    horaInicio: '11:00',
    horaFim: '12:00',
  }),
];

const criarProps = (overrides: Record<string, unknown> = {}) => ({
  cargosAdicionados: mockCargos,
  periodosList: mockPeriodos,
  handleAgendarClick: jest.fn(),
  handleRemoverPeriodo: jest.fn(),
  editingKey: null,
  isEditing: () => false,
  edit: jest.fn(),
  cancelEdit: jest.fn(),
  saveEdit: jest.fn(() => ({ success: true })),
  calcularIntervaloClassificacao: jest.fn(() => '1ª até 30ª'),
  verificarConflitoTempoReal: jest.fn(() => false),
  validarRedistribuicaoClassificacao: jest.fn(() => ({ valid: true })),
  cargoParaExpandir: 'Professor',
  limparExpansao: jest.fn(),
  ...overrides,
});

describe('AgendaTabela - CriarEditarConvocacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormValues['1'] = { horaInicio: '10:00', horaFim: '11:00', classificacao: 30 };
    mockFormValues['2'] = { horaInicio: '11:00', horaFim: '12:00', classificacao: 10 };
  });

  it('deve renderizar cargos e expandir agendamentos do cargo', async () => {
    renderWithProviders(<AgendaTabela {...criarProps()} />);

    expect(screen.getByText('Professor')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    });
  });

  it('deve exibir erro inline quando redistribuição ultrapassa 30 nas outras agendas', async () => {
    const validarRedistribuicaoClassificacao = jest.fn(() => ({
      valid: false,
      message: MENSAGEM_LIMITE_REDISTRIBUICAO,
    }));

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          validarRedistribuicaoClassificacao,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(MENSAGEM_LIMITE_REDISTRIBUICAO)).toBeInTheDocument();
    });

    expect(validarRedistribuicaoClassificacao).toHaveBeenCalled();
  });

  it('deve exibir erro inline quando intervalo de horário não é de 1 hora', async () => {
    mockFormValues['1'] = { horaInicio: '10:00', horaFim: '12:00', classificacao: 30 };

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [
            criarPeriodo({
              id: 1,
              horaInicio: '10:00',
              horaFim: '12:00',
              horario: '10:00 às 12:00',
            }),
          ],
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Intervalo permitido: somente 1h.')).toBeInTheDocument();
    });
  });

  it('não deve exibir toast global para erro de redistribuição ao salvar', async () => {
    const saveEdit = jest.fn(() => ({
      success: false,
      message: MENSAGEM_LIMITE_REDISTRIBUICAO,
    }));

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          saveEdit,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('check')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('check'));

    expect(saveEdit).toHaveBeenCalled();
    expect(message.error).not.toHaveBeenCalled();
  });

  it('não deve exibir toast global para erro de intervalo de horário ao salvar', async () => {
    mockFormValues['1'] = { horaInicio: '10:00', horaFim: '12:00', classificacao: 30 };

    const saveEdit = jest.fn(() => ({
      success: false,
      message: 'Intervalo permitido: somente 1h.',
    }));

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [
            criarPeriodo({
              id: 1,
              horaInicio: '10:00',
              horaFim: '12:00',
              horario: '10:00 às 12:00',
            }),
          ],
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          saveEdit,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('check')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('check'));

    expect(saveEdit).toHaveBeenCalled();
    expect(message.error).not.toHaveBeenCalled();
  });
});
