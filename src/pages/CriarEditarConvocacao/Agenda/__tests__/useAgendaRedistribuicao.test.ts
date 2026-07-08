import '../testHelpers/useAgendaMocks';
import {
  MENSAGEM_LIMITE_REDISTRIBUICAO,
  MAX_CANDIDATOS_POR_AGENDA,
  ordenarSessoesPresenciais,
  simularRedistribuicaoClassificacao,
  type PeriodoItem,
} from '../hooks/useAgenda';

const criarPeriodo = (overrides: Partial<PeriodoItem> = {}): PeriodoItem => ({
  id: 1,
  cargo: 'Professor',
  classificacao: 10,
  dataEscolha: '15/01/2024',
  sessao: 'Sessão 1',
  horario: '10:00 às 11:00',
  tipoEscolha: 'PRESENCIAL',
  isRetardatario: false,
  ...overrides,
});

describe('ordenarSessoesPresenciais', () => {
  it('deve ordenar sessões presenciais por data e horário', () => {
    const periodos = [
      criarPeriodo({ id: 2, dataEscolha: '16/01/2024', horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 1, dataEscolha: '15/01/2024', horario: '11:00 às 12:00' }),
      criarPeriodo({ id: 3, dataEscolha: '15/01/2024', horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 4, cargo: 'Professor', tipoEscolha: 'ONLINE', horario: 'Online' }),
      criarPeriodo({ id: 5, isRetardatario: true, horario: '12:00 às 13:00' }),
    ];

    const ordenados = ordenarSessoesPresenciais(periodos, 'Professor');

    expect(ordenados.map((periodo) => periodo.id)).toEqual([3, 1, 2]);
  });
});

describe('simularRedistribuicaoClassificacao', () => {
  it('deve permitir redistribuição quando agendas seguintes absorvem o excedente', () => {
    const sessoes = [
      criarPeriodo({ id: 1, classificacao: 19, horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 2, classificacao: 1, horario: '11:00 às 12:00' }),
    ];

    const resultado = simularRedistribuicaoClassificacao(sessoes, 0, 6);

    expect(resultado).toEqual({ valid: true, carryRestante: 0 });
  });

  it('deve impedir redistribuição quando agendas seguintes ultrapassariam 30 candidatos', () => {
    const sessoes = [
      criarPeriodo({ id: 1, classificacao: 30, horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 2, classificacao: 10, horario: '11:00 às 12:00' }),
    ];

    const resultado = simularRedistribuicaoClassificacao(sessoes, 0, 5);

    expect(resultado.valid).toBe(false);
    expect(resultado.carryRestante).toBeGreaterThan(0);
  });

  it('deve impedir redistribuição quando não há candidatos suficientes nas agendas seguintes', () => {
    const sessoes = [
      criarPeriodo({ id: 1, classificacao: 10, horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 2, classificacao: 5, horario: '11:00 às 12:00' }),
    ];

    const resultado = simularRedistribuicaoClassificacao(sessoes, 0, 20);

    expect(resultado.valid).toBe(false);
    expect(resultado.carryRestante).toBeLessThan(0);
  });

  it('deve permitir aumento quando agendas seguintes possuem candidatos para remover', () => {
    const sessoes = [
      criarPeriodo({ id: 1, classificacao: 20, horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 2, classificacao: 10, horario: '11:00 às 12:00' }),
    ];

    const resultado = simularRedistribuicaoClassificacao(sessoes, 0, 25);

    expect(resultado).toEqual({ valid: true, carryRestante: 0 });
  });

  it('deve distribuir excedente apenas nas agendas subsequentes', () => {
    const sessoes = [
      criarPeriodo({ id: 1, classificacao: 10, horario: '10:00 às 11:00' }),
      criarPeriodo({ id: 2, classificacao: 10, horario: '11:00 às 12:00' }),
      criarPeriodo({ id: 3, classificacao: 10, horario: '12:00 às 13:00' }),
    ];

    const resultado = simularRedistribuicaoClassificacao(sessoes, 1, 5);

    expect(resultado).toEqual({ valid: true, carryRestante: 0 });
  });

  it('deve rejeitar classificação menor que 1', () => {
    const sessoes = [criarPeriodo({ id: 1, classificacao: 10 })];

    expect(simularRedistribuicaoClassificacao(sessoes, 0, 0)).toEqual({
      valid: false,
      carryRestante: 0,
    });
  });
});

describe('MENSAGEM_LIMITE_REDISTRIBUICAO', () => {
  it('deve conter mensagem sobre limite de 30 candidatos', () => {
    expect(MENSAGEM_LIMITE_REDISTRIBUICAO).toContain('30');
    expect(MENSAGEM_LIMITE_REDISTRIBUICAO).toContain('outras agendas');
  });

  it('deve usar o mesmo limite exportado pela constante', () => {
    expect(MAX_CANDIDATOS_POR_AGENDA).toBe(30);
  });
});
