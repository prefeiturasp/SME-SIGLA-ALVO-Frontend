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
  Controller: ({ render, defaultValue, name }: any) => {
    const [formKey, field] = name.split('.');
    const atualizarValor = (valor: unknown) => {
      if (!mockFormValues[formKey]) {
        mockFormValues[formKey] = { horaInicio: '', horaFim: '', classificacao: 1 };
      }
      mockFormValues[formKey][field as keyof (typeof mockFormValues)[string]] = valor as never;
    };

    return render({
      field: {
        value: mockFormValues[formKey]?.[field as keyof (typeof mockFormValues)[string]] ?? defaultValue,
        onChange: jest.fn(atualizarValor),
      },
    });
  },
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    error: jest.fn(),
  },
  TimePicker: ({ onChange, value, ...props }: any) => (
    <input
      data-testid="time-picker"
      value={value ? value.format('HH:mm') : ''}
      onChange={(event) => {
        const dayjsLib = require('dayjs');
        onChange(event.target.value ? dayjsLib(event.target.value, 'HH:mm') : null);
      }}
      {...props}
    />
  ),
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

  it('deve exibir mensagem quando não há cargos selecionados', () => {
    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          cargosAdicionados: [],
          cargoParaExpandir: null,
        })}
      />
    );

    expect(
      screen.getByText(/Nenhum cargo foi selecionado no step anterior/)
    ).toBeInTheDocument();
  });

  it('deve chamar handleAgendarClick ao clicar em Agendar', () => {
    const handleAgendarClick = jest.fn();

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          handleAgendarClick,
          cargoParaExpandir: null,
        })}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /agendar/i }));
    expect(handleAgendarClick).toHaveBeenCalledWith('cargo-uuid-1');
  });

  it('deve expandir linha pelo ícone quando iniciada recolhida', async () => {
    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          cargoParaExpandir: null,
        })}
      />
    );

    expect(screen.queryByText('Agendamentos')).not.toBeInTheDocument();

    const expandIcons = document.querySelectorAll('.anticon-down');
    fireEvent.click(expandIcons[0]);

    await waitFor(() => {
      expect(screen.getByText('Agendamentos')).toBeInTheDocument();
    });
  });

  it('deve exibir mensagem quando cargo não possui agendas', async () => {
    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [],
          cargoParaExpandir: 'Professor',
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Nenhuma agenda adicionada para este cargo.')).toBeInTheDocument();
    });
  });

  it('deve renderizar modalidades, ações e total de candidatos online', async () => {
    const handleRemoverPeriodo = jest.fn();
    const edit = jest.fn();
    const cancelEdit = jest.fn();

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [
            criarPeriodo({
              id: 1,
              tipoEscolha: 'ONLINE',
              modalidade: 'ONLINE',
              horario: 'Online',
              classificacao: 15,
            }),
            criarPeriodo({
              id: 2,
              tipoEscolha: 'PRESENCIAL',
              modalidade: 'Presencial',
              isRetardatario: true,
              sessao: 'Retardatário',
              classificacao: 3,
            }),
          ],
          handleRemoverPeriodo,
          edit,
          cancelEdit,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Online')).toBeInTheDocument();
      expect(screen.getByText('Presencial')).toBeInTheDocument();
      expect(screen.getByText('Total de 15 candidatos adicionados')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText('edit')[0]);
    expect(edit).toHaveBeenCalled();

    fireEvent.click(screen.getAllByLabelText('delete')[0]);
    expect(handleRemoverPeriodo).toHaveBeenCalledWith(1);
  });

  it('deve exibir conflito de horário e toast para erro genérico ao salvar', async () => {
    const saveEdit = jest.fn(() => ({
      success: false,
      message: 'Erro inesperado ao salvar',
    }));

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [criarPeriodo({ id: 1 })],
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          verificarConflitoTempoReal: jest.fn(() => true),
          saveEdit,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Horário já existe')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('check'));
    expect(message.error).toHaveBeenCalledWith('Erro inesperado ao salvar');
  });

  it('deve cancelar edição ao clicar no botão de cancelar', async () => {
    const cancelEdit = jest.fn();

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [criarPeriodo({ id: 1, classificacao: 20 })],
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          cancelEdit,
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('close')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText('close'));
    expect(cancelEdit).toHaveBeenCalled();
  });

  it('deve ordenar colunas e exibir horários no modo leitura', async () => {
    const { container } = renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [
            criarPeriodo({
              id: 1,
              modalidade: 'ONLINE',
              tipoEscolha: 'ONLINE',
              horario: 'Online',
            }),
            criarPeriodo({
              id: 2,
              isRetardatario: true,
              sessao: 'Retardatário',
              numeroSessao: undefined,
            }),
            criarPeriodo({
              id: 3,
              modalidade: 'HIBRIDO' as any,
              tipoEscolha: 'PRESENCIAL',
            }),
          ],
          cargoParaExpandir: 'Professor',
        })}
      />
    );

    const sorters = container.querySelectorAll('.ant-table-column-sorters');
    sorters.forEach((sorter) => fireEvent.click(sorter));

    await waitFor(() => {
      expect(screen.getAllByText('10:00 às 11:00').length).toBeGreaterThan(0);
      expect(screen.getByText('HIBRIDO')).toBeInTheDocument();
    });
  });

  it('deve recolher linha expandida e editar horários', async () => {
    mockFormValues['1'] = { horaInicio: '10:00', horaFim: '11:00', classificacao: 5 };

    renderWithProviders(
      <AgendaTabela
        {...criarProps({
          periodosList: [criarPeriodo({ id: 1, classificacao: 5 })],
          editingKey: 1,
          isEditing: (record: PeriodoItem) => record.id === 1,
          cargoParaExpandir: 'Professor',
        })}
      />
    );

    await waitFor(() => {
      expect(screen.getAllByTestId('time-picker').length).toBeGreaterThan(0);
    });

    const timePickers = screen.getAllByTestId('time-picker');
    fireEvent.change(timePickers[0], { target: { value: '' } });
    fireEvent.change(timePickers[1], { target: { value: '12:00' } });

    const expandIcons = document.querySelectorAll('.anticon-down');
    fireEvent.click(expandIcons[0]);
  });
});
