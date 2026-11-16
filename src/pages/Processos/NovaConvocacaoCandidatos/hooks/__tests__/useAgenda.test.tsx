import { renderHook, act } from '@testing-library/react';
import { useAgenda } from '../useAgenda';
import dayjs from 'dayjs';

jest.mock('../../useAgendaSchema', () => ({
  __esModule: true,
  default: () => ({
    validate: jest.fn().mockResolvedValue({}),
    validateSync: jest.fn().mockReturnValue({})
  })
}));

const mockWatch = jest.fn();
const mockUseForm = {
  control: {},
  handleSubmit: jest.fn((fn) => fn),
  reset: jest.fn(),
  watch: mockWatch,
  setValue: jest.fn(),
  formState: { errors: {} }
};

jest.mock('react-hook-form', () => ({
  useForm: () => mockUseForm
}));

jest.mock('@hookform/resolvers/yup', () => ({
  yupResolver: jest.fn(() => jest.fn())
}));

describe('useAgenda', () => {
  const cargosDisponiveis = [
    { value: '1', label: 'Professor' },
    { value: '2', label: 'Coordenador' }
  ];

  const createPeriodo = (overrides = {}) => ({
    id: 1,
    cargo: 'Professor',
    classificacao: 5,
    dataEscolha: '01/01/2024',
    dataEscolhaOriginal: dayjs('2024-01-01'),
    sessao: 'Sessão 1',
    isRetardatario: false,
    numeroSessao: 1,
    horario: '09:00 às 11:00',
    horaInicioOriginal: dayjs('09:00', 'HH:mm'),
    horaInicio: dayjs('09:00', 'HH:mm'),
    horaFim: dayjs('11:00', 'HH:mm'),
    tipoEscolha: 'Presencial',
    ...overrides
  });

  const defaultWatchValues = {
    tipoEscolha: '',
    cargoAgenda: '',
    escolhaEm: null,
    nomeacaoEm: null,
    quantidadeClassificados: null,
    sessao: null,
    horaInicio: null,
    horaFim: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForm.formState.errors = {};
    mockWatch.mockReturnValue(defaultWatchValues);
  });

  describe('Estados e funções básicas', () => {
    it('deve inicializar estados e gerenciar mensagens de erro', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      expect(result.current.isRetardatario).toBe(false);
      expect(result.current.periodosList).toEqual([]);
      expect(result.current.contadorSessao).toBe(1);
      expect(result.current.editingKey).toBe(null);
      
      act(() => {
        result.current.setIsRetardatario(true);
        result.current.setPeriodosList([createPeriodo()]);
      });
      
      expect(result.current.isRetardatario).toBe(true);
      expect(result.current.periodosList).toHaveLength(1);
      
      expect(result.current.getErrorMessage('Erro teste')).toBe('Erro teste');
      expect(result.current.getErrorMessage({ message: 'Erro objeto' })).toBe('Erro objeto');
      expect(result.current.getErrorMessage({})).toBe('Erro de validação');
    });
  });

  describe('handleUpdatePeriodo', () => {
    it('deve atualizar períodos e ajustar classificações', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      act(() => {
        result.current.setPeriodosList([createPeriodo()]);
        result.current.handleUpdatePeriodo(1, { classificacao: 5 });
      });
      expect(result.current.periodosList[0].classificacao).toBe(5);
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1, classificacao: 5 }),
          createPeriodo({ id: 2, classificacao: 3, sessao: 'Sessão 2', numeroSessao: 2 })
        ]);
        result.current.handleUpdatePeriodo(1, { classificacao: 3 });
      });
      expect(result.current.periodosList[0].classificacao).toBe(3);
      expect(result.current.periodosList[1].classificacao).toBe(5);
      
      const periodosIniciais = [createPeriodo()];
      act(() => {
        result.current.setPeriodosList(periodosIniciais);
        result.current.handleUpdatePeriodo(999, { classificacao: 3 });
      });
      expect(result.current.periodosList).toEqual(periodosIniciais);
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1, classificacao: 3 }),
          createPeriodo({ id: 2, classificacao: 5, sessao: 'Sessão 2', numeroSessao: 2 })
        ]);
        result.current.handleUpdatePeriodo(1, { classificacao: 5 });
      });
      expect(result.current.periodosList[0].classificacao).toBe(5);
      expect(result.current.periodosList[1].classificacao).toBe(3);
    });
  });

  describe('handleRemoverPeriodo', () => {
    it('deve remover períodos e reordenar sessões corretamente', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1 }),
          createPeriodo({ id: 2, sessao: 'Sessão 2', numeroSessao: 2 })
        ]);
        result.current.handleRemoverPeriodo(1);
      });
      expect(result.current.periodosList).toHaveLength(1);
      expect(result.current.periodosList[0].numeroSessao).toBe(1);
      expect(result.current.periodosList[0].sessao).toBe('Sessão 1');
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1 }),
          createPeriodo({ 
            id: 2, 
            classificacao: 0, 
            sessao: 'Retardatário', 
            isRetardatario: true, 
            numeroSessao: null 
          })
        ]);
        result.current.handleRemoverPeriodo(2);
      });
      expect(result.current.periodosList).toHaveLength(1);
      expect(result.current.periodosList[0].isRetardatario).toBe(false);
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1, tipoEscolha: 'Online', horario: 'Online', horaInicioOriginal: null, horaInicio: null, horaFim: null }),
          createPeriodo({ id: 2, tipoEscolha: 'Online', horario: 'Online', horaInicioOriginal: null, horaInicio: null, horaFim: null, sessao: 'Sessão 2', numeroSessao: 2 }),
          createPeriodo({ id: 3, tipoEscolha: 'Online', horario: 'Online', horaInicioOriginal: null, horaInicio: null, horaFim: null, sessao: 'Sessão 3', numeroSessao: 3 })
        ]);
        result.current.handleRemoverPeriodo(2);
      });
      expect(result.current.periodosList).toHaveLength(2);
      expect(result.current.periodosList[0].numeroSessao).toBe(1);
      expect(result.current.periodosList[1].numeroSessao).toBe(2);
    });
  });

  describe('calcularIntervaloClassificacao', () => {
    it('deve calcular intervalos de classificação corretamente', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      expect(result.current.calcularIntervaloClassificacao({ isRetardatario: true })).toBe('-');
      
      act(() => {
        result.current.setPeriodosList([createPeriodo()]);
      });
      expect(result.current.calcularIntervaloClassificacao(createPeriodo())).toBe('1ª até 5ª');
      
      expect(result.current.calcularIntervaloClassificacao(createPeriodo({ classificacao: 1 }))).toBe('1ª');
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1, classificacao: 3 }),
          createPeriodo({ id: 2, classificacao: 2, sessao: 'Sessão 2', numeroSessao: 2 })
        ]);
      });
      expect(result.current.calcularIntervaloClassificacao(createPeriodo({ 
        id: 2, 
        classificacao: 2, 
        sessao: 'Sessão 2' 
      }))).toBe('4ª até 5ª');
      
      expect(result.current.calcularIntervaloClassificacao(createPeriodo({ classificacao: 0 }))).toBe('1ª até 0ª');
      
      act(() => {
        result.current.setPeriodosList([]);
      });
      expect(result.current.calcularIntervaloClassificacao(createPeriodo({ classificacao: 3 }))).toBe('1ª até 3ª');
    });
  });

  describe('verificarHorarioExistente e verificarConflitoTempoReal', () => {
    it('deve verificar conflitos de horário corretamente', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      expect(result.current.verificarHorarioExistente(999, '09:00', '11:00')).toBe(false);
      
      act(() => {
        result.current.setPeriodosList([createPeriodo({ horario: 'Online', tipoEscolha: 'Online' })]);
      });
      expect(result.current.verificarHorarioExistente(1, '09:00', '11:00')).toBe(false);
      
      act(() => {
        result.current.setPeriodosList([
          createPeriodo({ id: 1 }),
          createPeriodo({ 
            id: 2, 
            horario: '10:00 às 12:00',
            horaInicioOriginal: dayjs('10:00', 'HH:mm'),
            horaInicio: dayjs('10:00', 'HH:mm'),
            horaFim: dayjs('12:00', 'HH:mm')
          })
        ]);
      });
      expect(result.current.verificarHorarioExistente(1, '10:00', '12:00')).toBe(true);
      
      act(() => {
        result.current.setPeriodosList([createPeriodo()]);
      });
      expect(result.current.verificarHorarioExistente(1, '14:00', '16:00')).toBe(false);
      
      act(() => {
        result.current.setPeriodosList([createPeriodo({ horario: 'Horário inválido' })]);
      });
      expect(result.current.verificarHorarioExistente(1, '09:00', '11:00')).toBe(false);
      
      expect(result.current.verificarConflitoTempoReal(1, undefined, undefined)).toBe(false);
      expect(result.current.verificarConflitoTempoReal(1, 123, 456)).toBe(false);
      
      jest.spyOn(result.current, 'verificarHorarioExistente').mockReturnValue(false);
      expect(result.current.verificarConflitoTempoReal(1, '09:00', '11:00')).toBe(false);
    });
  });

  describe('Funções de edição', () => {
    it('deve gerenciar edição e validação corretamente', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      act(() => {
        result.current.edit({ id: 1 });
      });
      expect(result.current.editingKey).toBe(1);
      expect(result.current.isEditing({ id: 1 })).toBe(true);
      expect(result.current.isEditing({ id: 2 })).toBe(false);
      
      act(() => {
        result.current.cancelEdit();
      });
      expect(result.current.editingKey).toBe(null);
      
      act(() => {
        result.current.setPeriodosList([createPeriodo({ tipoEscolha: 'Online' })]);
        result.current.edit({ id: 1 });
      });
      const resultadoOnline = result.current.saveEdit(1, { tipoEscolha: 'Online' }, { classificacao: 3 });
      expect(resultadoOnline.success).toBe(true);
      
      expect(result.current.saveEdit(1, { tipoEscolha: 'Presencial' }, {}).success).toBe(false);
      expect(result.current.saveEdit(1, { tipoEscolha: 'Online' }, { classificacao: null }).success).toBe(false);
      expect(result.current.saveEdit(1, { tipoEscolha: 'Online' }, { classificacao: 0 }).success).toBe(false);
      
      act(() => {
        result.current.setPeriodosList([createPeriodo()]);
      });
      const resultadoPresencial = result.current.saveEdit(1, { tipoEscolha: 'Presencial' }, { 
        classificacao: 3,
        horaInicio: '10:00',
        horaFim: '12:00'
      });
      expect(resultadoPresencial.success).toBe(true);
      
      const resultadoNaoEncontrado = result.current.saveEdit(999, { tipoEscolha: 'Online' }, { classificacao: 3 });
      expect(resultadoNaoEncontrado.success).toBe(true);
    });
  });

  describe('handleReset e handleSubmit', () => {
    it('deve resetar formulário e executar submit', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      act(() => {
        result.current.handleReset();
      });
      expect(mockUseForm.reset).toHaveBeenCalledWith(defaultWatchValues);
      
      mockUseForm.handleSubmit.mockImplementation((fn) => fn);
      result.current.handleSubmit();
      expect(mockUseForm.handleSubmit).toHaveBeenCalled();
    });
  });

  describe('isAgendaComplete', () => {
    it('deve verificar completude da agenda corretamente', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      mockWatch.mockReturnValue(defaultWatchValues);
      expect(result.current.isAgendaComplete()).toBe('');
      
      mockWatch.mockReturnValue({
        tipoEscolha: 'Presencial',
        cargoAgenda: '1',
        escolhaEm: dayjs().add(1, 'day'),
        nomeacaoEm: dayjs().add(2, 'day'),
        quantidadeClassificados: 5,
        sessao: 1,
        horaInicio: null,
        horaFim: null
      });
      expect(result.current.isAgendaComplete()).toBe('');
      
      const camposVazios = [
        { cargoAgenda: '1', escolhaEm: dayjs().add(1, 'day'), nomeacaoEm: dayjs().add(2, 'day'), quantidadeClassificados: 5, sessao: 1, horaInicio: dayjs('09:00', 'HH:mm'), horaFim: dayjs('11:00', 'HH:mm') },
        { tipoEscolha: 'Presencial', escolhaEm: dayjs().add(1, 'day'), nomeacaoEm: dayjs().add(2, 'day'), quantidadeClassificados: 5, sessao: 1, horaInicio: dayjs('09:00', 'HH:mm'), horaFim: dayjs('11:00', 'HH:mm') },
        { tipoEscolha: 'Presencial', cargoAgenda: '1', nomeacaoEm: dayjs().add(2, 'day'), quantidadeClassificados: 5, sessao: 1, horaInicio: dayjs('09:00', 'HH:mm'), horaFim: dayjs('11:00', 'HH:mm') }
      ];
      
      camposVazios.forEach(campos => {
        mockWatch.mockReturnValue(campos);
        expect(result.current.isAgendaComplete()).toBe('');
      });
    });
  });

  describe('handleAdicionarPeriodo', () => {
    it('deve adicionar períodos em diferentes cenários', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      mockUseForm.formState.errors = {};
      
      mockWatch.mockReturnValue({
        tipoEscolha: 'Online',
        cargoAgenda: '1',
        escolhaEm: [dayjs('2024-01-01'), dayjs('2024-01-02')],
        nomeacaoEm: dayjs('2024-01-03'),
        quantidadeClassificados: 5,
        sessao: 1,
        horaInicio: null,
        horaFim: null
      });
      
      act(() => {
        result.current.handleAdicionarPeriodo();
      });
      expect(result.current.periodosList).toHaveLength(1);
      expect(result.current.periodosList[0].classificacao).toBe(1);
      
      mockWatch.mockReturnValue({
        tipoEscolha: 'Presencial',
        cargoAgenda: '1',
        escolhaEm: dayjs('2024-01-01'),
        nomeacaoEm: dayjs('2024-01-02'),
        quantidadeClassificados: 5,
        sessao: 1,
        horaInicio: dayjs('09:00', 'HH:mm'),
        horaFim: dayjs('11:00', 'HH:mm')
      });
      
      act(() => {
        result.current.handleAdicionarPeriodo();
      });
      expect(result.current.periodosList).toHaveLength(2);
      expect(result.current.periodosList[1].classificacao).toBe(5);
      
      
      act(() => {
        result.current.setIsRetardatario(true);
      });
      
      mockWatch.mockReturnValue({
        tipoEscolha: 'Online',
        cargoAgenda: '1',
        escolhaEm: [dayjs('2024-01-01'), dayjs('2024-01-02')],
        nomeacaoEm: dayjs('2024-01-03'),
        quantidadeClassificados: 5,
        sessao: 1,
        horaInicio: null,
        horaFim: null
      });
      
      act(() => {
        result.current.handleAdicionarPeriodo();
      });
      expect(result.current.periodosList).toHaveLength(3);
      expect(result.current.periodosList[2].isRetardatario).toBe(true);
      expect(result.current.periodosList[2].sessao).toBe('Retardatário');
 
      mockWatch.mockReturnValue({
        tipoEscolha: 'Online',
        cargoAgenda: '1',
        escolhaEm: [dayjs('2024-01-01'), dayjs('2024-01-02')],
        nomeacaoEm: dayjs('2024-01-03'),
        quantidadeClassificados: 7,
        sessao: 3,
        horaInicio: null,
        horaFim: null
      });
      
      act(() => {
        result.current.handleAdicionarPeriodo();
      });
      expect(result.current.periodosList).toHaveLength(4);
      expect(result.current.periodosList[3].classificacao).toBe(5);
    });
  });

  describe('Cenários específicos para cobertura', () => {
    it('deve processar diferentes cenários de sobreposição de horários', () => {
      const { result } = renderHook(() => useAgenda(cargosDisponiveis));
      
      act(() => {
        result.current.setPeriodosList([createPeriodo()]);
      });
      
      expect(result.current.verificarHorarioExistente(1, '08:00', '10:00')).toBe(false);

      expect(result.current.verificarHorarioExistente(1, '10:00', '12:00')).toBe(false);

      expect(result.current.verificarHorarioExistente(1, '09:30', '10:30')).toBe(false);

      expect(result.current.verificarHorarioExistente(1, '08:00', '12:00')).toBe(false);
    });
  });

});