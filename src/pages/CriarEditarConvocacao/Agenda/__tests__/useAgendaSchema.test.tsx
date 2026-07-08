import dayjs from 'dayjs';
import useAgendaSchema, { type IAgendaFields } from '../hooks/useAgendaSchema';

const criarDadosPresencialValidos = (): IAgendaFields => ({
  tipoEscolha: 'PRESENCIAL',
  cargoAgenda: 'Professor',
  escolhaEm: dayjs().add(1, 'day'),
  nomeacaoEm: dayjs().add(2, 'day'),
  quantidadeClassificados: 20,
  sessao: 2,
  horaInicio: dayjs().hour(10).minute(0).second(0).millisecond(0),
  horaFim: dayjs().hour(11).minute(0).second(0).millisecond(0),
});

describe('useAgendaSchema - CriarEditarConvocacao', () => {
  let schema: ReturnType<typeof useAgendaSchema>;

  beforeEach(() => {
    schema = useAgendaSchema();
  });

  describe('validações básicas', () => {
    it('deve validar campos obrigatórios e tipos de escolha', async () => {
      await expect(schema.validateAt('tipoEscolha', { tipoEscolha: undefined })).rejects.toThrow(
        'Campo obrigatório'
      );
      await expect(schema.validateAt('tipoEscolha', { tipoEscolha: 'INVALIDO' })).rejects.toThrow(
        'Tipo de Escolha deve ser Presencial ou Online'
      );
      await expect(schema.validateAt('tipoEscolha', { tipoEscolha: 'ONLINE' })).resolves.toBe('ONLINE');

      await expect(schema.validateAt('cargoAgenda', { cargoAgenda: '' })).rejects.toThrow('campo obrigatório');
      await expect(schema.validateAt('cargoAgenda', { cargoAgenda: 'Professor' })).resolves.toBe('Professor');
    });
  });

  describe('validações de escolhaEm', () => {
    it('deve validar datas presenciais', async () => {
      await expect(
        schema.validateAt('escolhaEm', { escolhaEm: dayjs().subtract(1, 'day'), tipoEscolha: 'PRESENCIAL' })
      ).rejects.toThrow('Data de escolha deve ser futura ou hoje');

      await expect(
        schema.validateAt('escolhaEm', { escolhaEm: dayjs().add(1, 'day'), tipoEscolha: 'PRESENCIAL' })
      ).resolves.toBeDefined();
    });

    it('deve validar range de datas online', async () => {
      const rangeValido = [dayjs().add(1, 'day'), dayjs().add(2, 'day')];
      await expect(
        schema.validateAt('escolhaEm', { escolhaEm: rangeValido, tipoEscolha: 'ONLINE' })
      ).resolves.toBeDefined();

      await expect(
        schema.validateAt('escolhaEm', { escolhaEm: [dayjs().add(1, 'day')], tipoEscolha: 'ONLINE' })
      ).rejects.toThrow();

      await expect(
        schema.validateAt('escolhaEm', {
          escolhaEm: [dayjs().subtract(1, 'day'), dayjs()],
          tipoEscolha: 'ONLINE',
        })
      ).rejects.toThrow('Data de escolha deve ser futura ou hoje');

      await expect(
        schema.validateAt('escolhaEm', {
          escolhaEm: [dayjs().add(3, 'day'), dayjs().add(1, 'day')],
          tipoEscolha: 'ONLINE',
        })
      ).rejects.toThrow('Data de início deve ser anterior ou igual à data de fim');
    });
  });

  describe('validações de nomeacaoEm', () => {
    it('deve validar relação com escolhaEm', async () => {
      await expect(schema.validateAt('nomeacaoEm', { nomeacaoEm: null })).rejects.toThrow(
        'Data de Nomeação é obrigatória'
      );
      await expect(
        schema.validateAt('nomeacaoEm', { nomeacaoEm: dayjs().subtract(1, 'day') })
      ).rejects.toThrow('Data de nomeação deve ser futura ou hoje');

      const escolhaEm = dayjs().add(1, 'day');
      await expect(
        schema.validateAt('nomeacaoEm', {
          escolhaEm,
          nomeacaoEm: dayjs().add(2, 'day'),
          tipoEscolha: 'PRESENCIAL',
        })
      ).resolves.toBeDefined();

      const escolhaOnline = [dayjs().add(1, 'day'), dayjs().add(2, 'day')];
      await expect(
        schema.validateAt('nomeacaoEm', {
          escolhaEm: escolhaOnline,
          nomeacaoEm: dayjs().add(3, 'day'),
          tipoEscolha: 'ONLINE',
        })
      ).resolves.toBeDefined();

      await expect(
        schema.validateAt('nomeacaoEm', {
          escolhaEm,
          nomeacaoEm: dayjs(),
          tipoEscolha: 'PRESENCIAL',
        })
      ).rejects.toThrow('Data de nomeação deve ser posterior ou igual à data de escolha');
    });
  });

  describe('validações com retardatário e limite de candidatos', () => {
    it('deve ignorar quantidade e sessão quando retardatário', async () => {
      const schemaRetardatario = useAgendaSchema(undefined, () => true);

      await expect(
        schemaRetardatario.validateAt('quantidadeClassificados', { quantidadeClassificados: null })
      ).resolves.toBeNull();
      await expect(schemaRetardatario.validateAt('sessao', { sessao: null })).resolves.toBeNull();
    });

    it('deve validar limite máximo de candidatos disponíveis', async () => {
      const schemaComLimite = useAgendaSchema(() => 5);
      const schemaSemCandidatos = useAgendaSchema(() => 0);

      await expect(
        schemaComLimite.validateAt('quantidadeClassificados', { quantidadeClassificados: 10 })
      ).rejects.toThrow('Quantidade superior a 5 candidatos disponíveis');

      await expect(
        schemaComLimite.validateAt('quantidadeClassificados', { quantidadeClassificados: 3 })
      ).resolves.toBe(3);

      await expect(
        schemaSemCandidatos.validate({
          ...criarDadosPresencialValidos(),
          quantidadeClassificados: 1,
        })
      ).rejects.toThrow('Quantidade de Candidatos excedida');
    });

    it('deve validar horário do retardatário', async () => {
      const schemaRetardatario = useAgendaSchema(undefined, () => true, () => false);

      await expect(
        schemaRetardatario.validateAt('horaInicio', {
          horaInicio: dayjs().hour(10).minute(0),
          tipoEscolha: 'PRESENCIAL',
        })
      ).rejects.toThrow('O horário do retardatário deve ser depois de todas as outras agendas');
    });
  });

  describe('validações de sessão e horários', () => {
    it('deve validar sessão obrigatória e inteira', async () => {
      await expect(schema.validateAt('sessao', { sessao: null })).rejects.toThrow('Sessão é obrigatória');
      await expect(schema.validateAt('sessao', { sessao: 1.5 })).rejects.toThrow(
        'Sessão deve ser um número inteiro'
      );
    });

    it('deve ignorar regra de sessão para online', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          tipoEscolha: 'ONLINE',
          escolhaEm: [dayjs().add(1, 'day'), dayjs().add(2, 'day')],
          quantidadeClassificados: 100,
          sessao: 1,
          horaInicio: null,
          horaFim: null,
        })
      ).resolves.toBeDefined();
    });

    it('deve cobrir validações de sessão presencial com quantidade nula', async () => {
      await expect(
        schema.validateAt('sessao', {
          sessao: 1,
          quantidadeClassificados: null,
          tipoEscolha: 'PRESENCIAL',
        })
      ).resolves.toBe(1);

      await expect(
        schema.validateAt('sessao', {
          sessao: null,
          quantidadeClassificados: 10,
          tipoEscolha: 'PRESENCIAL',
        })
      ).rejects.toThrow('Sessão é obrigatória');

      await expect(
        schema.validateAt('sessao', {
          sessao: 0,
          quantidadeClassificados: 10,
          tipoEscolha: 'PRESENCIAL',
        })
      ).rejects.toThrow('Sessão deve ser maior que 0');
    });

    it('deve aceitar horário de retardatário quando validação externa retorna true', async () => {
      const schemaRetardatario = useAgendaSchema(undefined, () => true, () => true);

      await expect(
        schemaRetardatario.validateAt('horaInicio', {
          horaInicio: dayjs().hour(10).minute(0),
          tipoEscolha: 'PRESENCIAL',
        })
      ).resolves.toBeDefined();
    });

    it('deve validar hora fim posterior à hora início', async () => {
      const horaInicio = dayjs().hour(11).minute(0);
      const horaFim = dayjs().hour(10).minute(0);

      await expect(
        schema.validateAt('horaFim', { horaInicio, horaFim, tipoEscolha: 'PRESENCIAL' })
      ).rejects.toThrow('Hora de fim deve ser posterior à hora de início');
    });

    it('não deve exigir horários para online', async () => {
      await expect(
        schema.validateAt('horaInicio', { horaInicio: null, tipoEscolha: 'ONLINE' })
      ).resolves.toBeNull();
      await expect(
        schema.validateAt('horaFim', { horaFim: null, tipoEscolha: 'ONLINE' })
      ).resolves.toBeNull();
    });
  });

  describe('limite de candidatos por sessão', () => {
    it('deve aceitar quantidade e sessões compatíveis com o limite de 30', async () => {
      await expect(schema.validate(criarDadosPresencialValidos())).resolves.toBeDefined();
    });

    it('deve rejeitar quando candidatos por sessão ultrapassam 30', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          quantidadeClassificados: 100,
          sessao: 2,
        })
      ).rejects.toThrow(/Limite de 30 candidatos por sessão/);
    });

    it('deve sugerir quantidade mínima de sessões necessárias', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          quantidadeClassificados: 100,
          sessao: 2,
        })
      ).rejects.toThrow(/Sugestão: 4 sessão\(ões\)/);
    });
  });

  describe('intervalo de horário', () => {
    it('deve aceitar intervalo exatamente de 1 hora', async () => {
      await expect(schema.validate(criarDadosPresencialValidos())).resolves.toBeDefined();
    });

    it('deve rejeitar intervalo diferente de 1 hora', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          horaInicio: dayjs().hour(10).minute(0).second(0).millisecond(0),
          horaFim: dayjs().hour(12).minute(0).second(0).millisecond(0),
        })
      ).rejects.toThrow('Intervalo permitido: somente 1h');
    });

    it('deve rejeitar horário de início fora da janela 10h-17h', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          horaInicio: dayjs().hour(9).minute(0).second(0).millisecond(0),
          horaFim: dayjs().hour(10).minute(0).second(0).millisecond(0),
        })
      ).rejects.toThrow(/Horário deve estar entre 10:00 e 17:00/);
    });

    it('deve rejeitar horário de fim fora da janela 10h-17h', async () => {
      await expect(
        schema.validate({
          ...criarDadosPresencialValidos(),
          horaInicio: dayjs().hour(16).minute(0).second(0).millisecond(0),
          horaFim: dayjs().hour(18).minute(0).second(0).millisecond(0),
        })
      ).rejects.toThrow(/Horário deve estar entre 10:00 e 17:00/);
    });
  });
});
