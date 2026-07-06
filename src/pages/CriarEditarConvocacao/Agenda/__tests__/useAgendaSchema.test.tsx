import dayjs from 'dayjs';
import useAgendaSchema from '../hooks/useAgendaSchema';

const criarDadosPresencialValidos = () => ({
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
