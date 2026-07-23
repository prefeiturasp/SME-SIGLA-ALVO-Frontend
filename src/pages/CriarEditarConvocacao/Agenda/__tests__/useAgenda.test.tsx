import { renderHook, act, waitFor } from '@testing-library/react';
import dayjs from 'dayjs';
import {
  useAgenda,
  MENSAGEM_LIMITE_REDISTRIBUICAO,
  type PeriodoItem,
  type CargoAdicionado,
} from '../hooks/useAgenda';

const mockWatch = jest.fn();
const mockSetValue = jest.fn();
const mockReset = jest.fn();
const mockTrigger = jest.fn();
const mockMutateAsyncPost = jest.fn();
const mockMutateAsyncDelete = jest.fn();
const mockNotificationError = jest.fn();
const mockGetCargosProcesso = jest.fn();

let mockProcessoConvocacaoData: Record<string, unknown> | undefined;
let mockAgendasData: Record<string, unknown> | undefined;
let mockAgendasIsLoading = false;

const defaultWatchValues = {
  tipoEscolha: '',
  cargoAgenda: '',
  escolhaEm: null,
  nomeacaoEm: null,
  quantidadeClassificados: null,
  sessao: null,
  horaInicio: null,
  horaFim: null,
};

const mockUseForm = {
  control: {},
  handleSubmit: jest.fn((fn) => fn),
  reset: mockReset,
  watch: mockWatch,
  setValue: mockSetValue,
  trigger: mockTrigger,
  formState: { errors: {} as Record<string, unknown> },
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ uuid: 'test-uuid' }),
}));

jest.mock('../../SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID.tsx', () => ({
  useGetProcessosConvocacaoPorUUID: () => ({
    processoConvocacaoData: mockProcessoConvocacaoData,
    processoConvocacaoIsLoading: false,
  }),
}));

jest.mock('../../SelecaoCargos/hooks/useGetConcursosPorUuid.tsx', () => ({
  useGetConcursoByUuid: () => ({
    concursoData: undefined,
    concursoIsLoading: false,
  }),
}));

jest.mock('../hooks/usePostAgenda', () => ({
  usePostAgenda: () => ({ mutateAsync: mockMutateAsyncPost }),
}));

jest.mock('../hooks/useDeleteAgenda', () => ({
  useDeleteAgenda: () => ({ mutateAsync: mockMutateAsyncDelete }),
}));

jest.mock('../hooks/useGetAgendas', () => ({
  useGetAgendas: () => ({
    agendasData: mockAgendasData,
    agendasIsLoading: mockAgendasIsLoading,
  }),
}));

jest.mock('../../../../services/resources/convocacao', () => ({
  getCargosProcesso: (...args: unknown[]) => mockGetCargosProcesso(...args),
}));

jest.mock('../hooks/useAgendaSchema', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(() => jest.fn()),
}));

jest.mock('react-hook-form', () => ({
  useForm: () => mockUseForm,
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');
  return {
    ...actual,
    App: {
      ...actual.App,
      useApp: () => ({
        notification: { error: mockNotificationError, success: jest.fn() },
      }),
    },
  };
});

const cargoBase: CargoAdicionado = {
  uuid: 'cargo-uuid-1',
  nome: 'Professor',
  cargo_codigo: 'C001',
  vagas: 10,
  geral: 8,
  pcd: 1,
  nna: 1,
  totalCandidatos: 40,
  candidatos_uuids: ['cand-1', 'cand-2'],
};

const criarPeriodo = (overrides: Partial<PeriodoItem> = {}): PeriodoItem => ({
  id: 1,
  cargo: 'Professor',
  cargoUuid: 'cargo-uuid-1',
  classificacao: 10,
  dataEscolha: '15/01/2024',
  dataEscolhaOriginal: dayjs('2024-01-15'),
  sessao: 'Sessão 1',
  horario: '10:00 às 11:00',
  horaInicio: '10:00',
  horaFim: '11:00',
  horaInicioOriginal: dayjs('2000-01-01 10:00'),
  horaFimOriginal: dayjs('2000-01-01 11:00'),
  isRetardatario: false,
  tipoEscolha: 'PRESENCIAL',
  modalidade: 'PRESENCIAL',
  numeroSessao: 1,
  ...overrides,
});

const carregarCargosPadrao = () => {
  mockProcessoConvocacaoData = { concurso_uuid: 'concurso-1', concurso_nome: 'Concurso' };
  mockGetCargosProcesso.mockReturnValue({
    response: Promise.resolve([
      {
        cargo_uuid: cargoBase.uuid,
        cargo_nome: cargoBase.nome,
        cargo_codigo: cargoBase.cargo_codigo,
        vagas: cargoBase.vagas,
        candidatos_geral: cargoBase.geral,
        candidatos_pcd: cargoBase.pcd,
        candidatos_nna: cargoBase.nna,
        total_candidatos: cargoBase.totalCandidatos,
        candidatos_uuids: cargoBase.candidatos_uuids,
      },
    ]),
  });
};

const aguardarCargos = async (result: { current: ReturnType<typeof useAgenda> }) => {
  await waitFor(() => {
    expect(result.current.cargosAdicionados).toHaveLength(1);
  });
};

describe('useAgenda - CriarEditarConvocacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockProcessoConvocacaoData = undefined;
    mockAgendasData = undefined;
    mockAgendasIsLoading = false;
    mockUseForm.formState.errors = {};
    mockWatch.mockReturnValue(defaultWatchValues);
    mockGetCargosProcesso.mockReturnValue({
      response: Promise.resolve([]),
    });
  });

  it('deve inicializar estados e formatar mensagens de erro', () => {
    const { result } = renderHook(() => useAgenda());

    expect(result.current.periodosList).toEqual([]);
    expect(result.current.editingKey).toBeNull();
    expect(result.current.getErrorMessage('texto')).toBe('texto');
    expect(result.current.getErrorMessage({ message: 'objeto' })).toBe('objeto');
    expect(result.current.getErrorMessage({ type: 'required' })).toBe('campo obrigatório');
    expect(result.current.getErrorMessage({ type: 'typeError' })).toBe('campo obrigatório');
    expect(result.current.getErrorMessage({})).toBe('campo obrigatório');
    expect(result.current.temPeriodosAgenda()).toBe(false);
    expect(result.current.isAgendaComplete()).toBe(false);
    expect(result.current.isBotaoAdicionarHabilitado()).toBe(false);
  });

  it('deve calcular intervalos e validar horários', () => {
    const { result } = renderHook(() => useAgenda());

    expect(result.current.calcularIntervaloClassificacao({ isRetardatario: true } as PeriodoItem)).toBe('-');

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, classificacao: 3 }),
        criarPeriodo({
          id: 2,
          classificacao: 1,
          sessao: 'Sessão 2',
          horario: '11:00 às 12:00',
          numeroSessao: 2,
        }),
      ]);
    });

    expect(result.current.calcularIntervaloClassificacao(criarPeriodo({ id: 1, classificacao: 3 }))).toBe('1ª até 3ª');
    expect(result.current.calcularIntervaloClassificacao(criarPeriodo({ id: 2, classificacao: 1 }))).toBe('4ª');

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1 }),
        criarPeriodo({
          id: 2,
          horario: '10:00 às 11:00',
          horaInicio: '10:00',
          horaFim: '11:00',
        }),
        criarPeriodo({ id: 3, horario: 'Online', tipoEscolha: 'ONLINE' }),
        criarPeriodo({ id: 4, horario: 'Horário inválido' }),
      ]);
    });

    expect(result.current.verificarConflitoTempoReal(1, undefined, undefined)).toBe(false);
    expect(result.current.verificarConflitoTempoReal(1, 10, 11)).toBe(false);
    expect(result.current.verificarConflitoTempoReal(1, '10:00', '11:00')).toBe(true);
    expect(result.current.verificarHorarioExistente(999, '10:00', '11:00')).toBe(false);
  });

  it('deve validar redistribuição de classificação', () => {
    const { result } = renderHook(() => useAgenda());

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, classificacao: 30 }),
        criarPeriodo({ id: 2, classificacao: 10, horario: '11:00 às 12:00', numeroSessao: 2 }),
      ]);
    });

    expect(result.current.validarRedistribuicaoClassificacao(1, criarPeriodo(), 5).valid).toBe(false);
    expect(result.current.validarRedistribuicaoClassificacao(1, criarPeriodo(), 31).message).toContain('30');
    expect(
      result.current.validarRedistribuicaoClassificacao(1, criarPeriodo({ isRetardatario: true }), 10).valid
    ).toBe(true);
    expect(result.current.validarRedistribuicaoClassificacao(1, criarPeriodo(), Number.NaN).valid).toBe(false);
    expect(result.current.validarRedistribuicaoClassificacao(999, criarPeriodo(), 10).valid).toBe(true);
  });

  it('deve gerenciar edição e salvar períodos', () => {
    const { result } = renderHook(() => useAgenda());

    act(() => {
      result.current.setPeriodosList([criarPeriodo()]);
      result.current.edit(criarPeriodo());
    });
    expect(result.current.isEditing(criarPeriodo())).toBe(true);

    act(() => result.current.cancelEdit());
    expect(result.current.editingKey).toBeNull();

    act(() => {
      result.current.setPeriodosList([criarPeriodo()]);
      result.current.edit(criarPeriodo());
    });

    expect(result.current.saveEdit(1, criarPeriodo(), { classificacao: 5 }).success).toBe(false);

    const intervaloInvalido = result.current.saveEdit(1, criarPeriodo(), {
      classificacao: 5,
      horaInicio: '10:00',
      horaFim: '12:00',
    });
    expect(intervaloInvalido.message).toBe('Intervalo permitido: somente 1h.');

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, classificacao: 30 }),
        criarPeriodo({ id: 2, classificacao: 10, horario: '11:00 às 12:00', numeroSessao: 2 }),
      ]);
    });

    expect(
      result.current.saveEdit(1, criarPeriodo(), {
        classificacao: 5,
        horaInicio: '10:00',
        horaFim: '11:00',
      }).message
    ).toBe(MENSAGEM_LIMITE_REDISTRIBUICAO);

    act(() => {
      result.current.setPeriodosList([criarPeriodo({ id: 1, classificacao: 10 })]);
    });

    expect(
      result.current.saveEdit(1, criarPeriodo({ id: 1, classificacao: 10 }), {
        classificacao: 10,
        horaInicio: '10:00',
        horaFim: '11:00',
      }).success
    ).toBe(true);

    act(() => {
      result.current.setPeriodosList([criarPeriodo({ id: 10, tipoEscolha: 'ONLINE', horario: 'Online' })]);
      result.current.edit({ id: 10 } as PeriodoItem);
    });

    expect(
      result.current.saveEdit(10, criarPeriodo({ id: 10, tipoEscolha: 'ONLINE' }), { classificacao: 5 }).success
    ).toBe(true);

    expect(result.current.saveEdit(1, criarPeriodo(), {})).toEqual({
      success: false,
      message: 'Classificação é obrigatória.',
    });
  });

  it('deve atualizar períodos com balanceamento e remover com reordenação', async () => {
    const { result } = renderHook(() => useAgenda());

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, classificacao: 10 }),
        criarPeriodo({
          id: 2,
          classificacao: 10,
          sessao: 'Sessão 2',
          horario: '11:00 às 12:00',
          numeroSessao: 2,
        }),
      ]);
      result.current.handleUpdatePeriodo(1, { classificacao: 5 });
    });

    expect(result.current.periodosList[0].classificacao).toBe(5);
    expect(result.current.periodosList[1].classificacao).toBe(15);

    act(() => {
      result.current.handleUpdatePeriodo(1, { horario: '10:00 às 11:00' });
      result.current.handleUpdatePeriodo(999, { classificacao: 1 });
    });

    mockMutateAsyncDelete.mockResolvedValue(undefined);

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, uuid: 'agenda-uuid-1' }),
        criarPeriodo({
          id: 2,
          uuid: 'agenda-uuid-2',
          sessao: 'Sessão 2',
          numeroSessao: 2,
          tipoEscolha: 'ONLINE',
          horario: 'Online',
        }),
        criarPeriodo({
          id: 3,
          isRetardatario: true,
          sessao: 'Retardatário',
          horario: '12:00 às 13:00',
        }),
      ]);
    });

    await act(async () => {
      await result.current.handleRemoverPeriodo(1);
    });

    expect(mockMutateAsyncDelete).toHaveBeenCalledWith('agenda-uuid-1');
    expect(result.current.periodosList).toHaveLength(2);
  });

  it('deve abrir agenda, validar completude e adicionar períodos presenciais e online', async () => {
    carregarCargosPadrao();
    const { result, rerender } = renderHook(() => useAgenda());
    await aguardarCargos(result);

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
    });

    expect(result.current.agendaAberto?.cargoUuid).toBe(cargoBase.uuid);

    mockWatch.mockReturnValue({
      tipoEscolha: 'ONLINE',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: [dayjs('2024-01-01'), dayjs('2024-01-02')],
      nomeacaoEm: dayjs('2024-01-03'),
      quantidadeClassificados: 5,
      sessao: 1,
      horaInicio: null,
      horaFim: null,
    });
    rerender();

    expect(result.current.isAgendaComplete()).toBe(true);
    expect(result.current.isBotaoAdicionarHabilitado()).toBe(true);

    act(() => {
      result.current.handleAdicionarPeriodo();
    });

    expect(result.current.periodosList[0].tipoEscolha).toBe('ONLINE');
    expect(result.current.cargoParaExpandir).toBe('Professor');

    act(() => result.current.limparExpansao());
    expect(result.current.cargoParaExpandir).toBeNull();

    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: 6,
      sessao: 2,
      horaInicio: dayjs('2000-01-01 10:00'),
      horaFim: dayjs('2000-01-01 11:00'),
    });
    rerender();

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
      result.current.handleAdicionarPeriodo();
    });

    expect(result.current.periodosList.length).toBeGreaterThanOrEqual(3);
    expect(result.current.temPeriodosAgenda()).toBe(true);

    act(() => {
      result.current.handleFecharAgenda();
      result.current.handleReset();
    });

    expect(result.current.agendaAberto).toBeNull();
    expect(mockReset).toHaveBeenCalled();
  });

  it('deve adicionar retardatário e bloquear quando há erros de formulário', async () => {
    carregarCargosPadrao();
    const { result, rerender } = renderHook(() => useAgenda());
    await aguardarCargos(result);

    mockUseForm.formState.errors = { tipoEscolha: { message: 'erro' } };
    rerender();

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
      result.current.handleAdicionarPeriodo();
    });

    expect(result.current.periodosList).toHaveLength(0);
    expect(result.current.isBotaoAdicionarHabilitado()).toBe(false);

    mockUseForm.formState.errors = {};
    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: null,
      sessao: null,
      horaInicio: dayjs('2000-01-01 14:00'),
      horaFim: dayjs('2000-01-01 15:00'),
    });
    rerender();

    act(() => {
      result.current.setIsRetardatario(true);
    });

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
      result.current.handleAdicionarPeriodo();
    });

    const retardatario = result.current.periodosList.find((periodo) => periodo.isRetardatario);
    expect(retardatario?.isRetardatario).toBe(true);
    expect(retardatario?.sessao).toBe('Retardatário');
  });

  it('deve validar quantidade e completude para presencial', async () => {
    carregarCargosPadrao();
    mockAgendasData = { candidatos_faltantes_uuids: ['cand-3', 'cand-4'] };
    const { result, rerender } = renderHook(() => useAgenda());
    await aguardarCargos(result);

    act(() => result.current.handleAgendarCargo(cargoBase.uuid));

    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: 50,
      sessao: 1,
      horaInicio: dayjs('2000-01-01 10:00'),
      horaFim: dayjs('2000-01-01 11:00'),
    });
    rerender();

    expect(result.current.isBotaoAdicionarHabilitado()).toBe(false);

    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: 2,
      sessao: 1,
      horaInicio: dayjs('2000-01-01 10:00'),
      horaFim: dayjs('2000-01-01 11:00'),
    });
    rerender();

    expect(result.current.isAgendaComplete()).toBeTruthy();
  });

  it('deve salvar agendas no backend e tratar erros', async () => {
    carregarCargosPadrao();
    mockMutateAsyncPost.mockResolvedValue([{ uuid: 'nova-agenda-1' }]);

    const { result } = renderHook(() => useAgenda());
    await aguardarCargos(result);

    act(() => {
      result.current.setPeriodosList([criarPeriodo({ uuid: undefined })]);
    });

    await act(async () => {
      expect(await result.current.salvarAgendasNoBackend()).toBe(true);
    });

    expect(mockMutateAsyncPost).toHaveBeenCalled();
    expect(result.current.periodosList[0].uuid).toBe('nova-agenda-1');

    act(() => {
      result.current.setPeriodosList([criarPeriodo({ uuid: 'existente-1' })]);
    });
    await act(async () => {
      expect(await result.current.salvarAgendasNoBackend()).toBe(true);
    });
    expect(mockMutateAsyncPost).toHaveBeenCalledTimes(1);

    mockMutateAsyncPost.mockRejectedValue(new Error('falha'));
    act(() => {
      result.current.setPeriodosList([criarPeriodo({ uuid: undefined, id: 99 })]);
    });
    await act(async () => {
      expect(await result.current.salvarAgendasNoBackend()).toBe(false);
    });
    expect(mockNotificationError).toHaveBeenCalled();
  });

  it('deve carregar cargos, sincronizar agendas e limpar agenda aberta', async () => {
    carregarCargosPadrao();
    mockAgendasData = {
      results: [
        {
          uuid: 'agenda-api-1',
          processo_convocacao_uuid: 'test-uuid',
          processo_convocacao_nome: 'Processo',
          cargo_uuid: cargoBase.uuid,
          cargo_nome: cargoBase.nome,
          data_escolha: '2024-01-15',
          modalidade: 'Online',
          classificacao: 10,
          sessao: 'Sessão 1',
          criado_em: '2024-01-01',
          atualizado_em: '2024-01-01',
        },
        {
          uuid: 'agenda-api-2',
          processo_convocacao_uuid: 'test-uuid',
          processo_convocacao_nome: 'Processo',
          cargo_uuid: cargoBase.uuid,
          cargo_nome: cargoBase.nome,
          data_escolha: '2024-01-16',
          modalidade: 'Presencial',
          escolha_em: '2024-01-16',
          hora_convocacao_inicio: '10:00:00',
          hora_convocacao_fim: '11:00:00',
          classificacao: 5,
          sessao: 'Sessão 2',
          criado_em: '2024-01-01',
          atualizado_em: '2024-01-01',
        },
      ],
      candidatos_uuids_restantes: ['cand-9'],
    };

    const { result, rerender } = renderHook(() => useAgenda());

    await waitFor(() => {
      expect(result.current.cargosAdicionados).toHaveLength(1);
      expect(result.current.periodosList.length).toBe(2);
      expect(result.current.candidatosFaltantesCount).toBe(1);
    });

    act(() => result.current.handleAgendarCargo(cargoBase.uuid));
    expect(result.current.agendaAberto).not.toBeNull();

    mockAgendasIsLoading = true;
    rerender();
    await waitFor(() => expect(result.current.agendasLoading).toBe(true));

    mockGetCargosProcesso.mockReturnValue({
      response: Promise.resolve([]),
    });
    mockProcessoConvocacaoData = { concurso_uuid: 'concurso-2', concurso_nome: 'Outro' };

    const { result: resultSemCargos } = renderHook(() => useAgenda());
    await waitFor(() => {
      expect(resultSemCargos.current.cargosAdicionados).toEqual([]);
    });

    mockGetCargosProcesso.mockReturnValue({
      response: Promise.reject({ response: { status: 500 }, message: 'erro' }),
    });
    mockProcessoConvocacaoData = { concurso_uuid: 'concurso-3', concurso_nome: 'Erro' };

    const { result: resultErro } = renderHook(() => useAgenda());
    await waitFor(() => {
      expect(mockNotificationError).toHaveBeenCalled();
    });

    mockGetCargosProcesso.mockReturnValue({
      response: Promise.reject({ response: { status: 404 }, message: 'não encontrado' }),
    });
    mockProcessoConvocacaoData = { concurso_uuid: 'concurso-4', concurso_nome: '404' };

    const { result: result404 } = renderHook(() => useAgenda());
    await waitFor(() => {
      expect(result404.current.cargosAdicionados).toEqual([]);
    });
  });

  it('deve executar submit da agenda', async () => {
    const { result } = renderHook(() => useAgenda());
    const dados = {
      tipoEscolha: 'ONLINE',
      cargoAgenda: 'cargo-1',
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: 1,
      sessao: 1,
      horaInicio: null,
      horaFim: null,
    };

    await act(async () => {
      await result.current.handleSubmit(dados);
    });
  });

  it('deve cobrir cenários adicionais de redistribuição, remoção e salvamento', async () => {
    carregarCargosPadrao();
    mockAgendasData = { candidatos_faltantes_uuids: ['cand-3'] };
    const { result, rerender } = renderHook(() => useAgenda());
    await aguardarCargos(result);

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1, classificacao: 5 }),
        criarPeriodo({ id: 2, classificacao: 5, horario: '11:00 às 12:00', numeroSessao: 2 }),
      ]);
    });

    expect(
      result.current.validarRedistribuicaoClassificacao(1, criarPeriodo(), 20).message
    ).toContain('Não há candidatos suficientes');

    act(() => {
      result.current.setPeriodosList([criarPeriodo({ id: 1 })]);
      result.current.edit(criarPeriodo({ id: 1 }));
    });

    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 1 }),
        criarPeriodo({
          id: 2,
          horario: '11:00 às 12:00',
          horaInicio: '11:00',
          horaFim: '12:00',
        }),
      ]);
    });

    act(() => {
      expect(
        result.current.saveEdit(1, criarPeriodo({ id: 1 }), {
          classificacao: 5,
          horaInicio: '11:00',
          horaFim: '12:00',
        }).success
      ).toBe(true);
    });

    expect(result.current.periodosList.find((p) => p.id === 1)?.horaInicio).toBe('11:00');
    expect(result.current.periodosList.find((p) => p.id === 2)?.horaInicio).toBe('12:00');
    expect(result.current.periodosList.find((p) => p.id === 2)?.horaFim).toBe('13:00');

    mockMutateAsyncDelete.mockRejectedValue(new Error('delete falhou'));
    act(() => {
      result.current.setPeriodosList([criarPeriodo({ id: 1, uuid: 'uuid-delete-erro' })]);
    });

    await act(async () => {
      await result.current.handleRemoverPeriodo(1);
    });
    expect(result.current.periodosList).toHaveLength(1);

    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: 4,
      sessao: 2,
      horaInicio: dayjs('2000-01-01 10:00'),
      horaFim: dayjs('2000-01-01 11:00'),
    });
    rerender();

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
      result.current.handleAdicionarPeriodo();
    });
    expect(result.current.periodosList.length).toBeGreaterThan(2);

    mockWatch.mockReturnValue({
      tipoEscolha: 'PRESENCIAL',
      cargoAgenda: cargoBase.uuid,
      escolhaEm: dayjs('2024-01-01'),
      nomeacaoEm: dayjs('2024-01-02'),
      quantidadeClassificados: null,
      sessao: null,
      horaInicio: dayjs('2000-01-01 16:00'),
      horaFim: dayjs('2000-01-01 17:00'),
    });
    rerender();

    act(() => {
      result.current.setIsRetardatario(true);
      result.current.setPeriodosList([
        criarPeriodo({ id: 10, horaFim: '15:00', horario: '14:00 às 15:00' }),
      ]);
    });

    act(() => {
      result.current.handleAgendarCargo(cargoBase.uuid);
      result.current.handleAdicionarPeriodo();
    });

    const novoRetardatario = result.current.periodosList.find((p) => p.isRetardatario);
    expect(novoRetardatario?.classificacao).toBe(1);

    mockMutateAsyncPost.mockResolvedValue([
      { uuid: 'retorno-1' },
      { uuid: 'retorno-2' },
    ]);
    act(() => {
      result.current.setPeriodosList([
        criarPeriodo({ id: 20, uuid: 'existente' }),
        criarPeriodo({ id: 21, uuid: undefined, horario: '12:00 às 13:00', numeroSessao: 2 }),
      ]);
    });
    await act(async () => {
      await result.current.salvarAgendasNoBackend();
    });
    expect(mockMutateAsyncPost).toHaveBeenCalled();
  });
});
