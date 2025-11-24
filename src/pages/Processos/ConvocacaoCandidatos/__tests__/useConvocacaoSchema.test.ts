import useConvocacaoSchema from '../useConvocacaoSchema';

describe('useConvocacaoSchema', () => {
  it('valida quando nenhum campo é informado', async () => {
    const schema = useConvocacaoSchema();
    await expect(schema.validate({})).resolves.toBeTruthy();
  });

  it('valida quando apenas data_convocacao_inicio é informada com data válida', async () => {
    const schema = useConvocacaoSchema();
    await expect(
      schema.validate({ data_convocacao_inicio: '2025-03-10' })
    ).resolves.toBeTruthy();
  });

  it('valida quando fim é maior ou igual ao início', async () => {
    const schema = useConvocacaoSchema();
    await expect(
      schema.validate({ data_convocacao_inicio: '2025-03-10', data_convocacao_fim: '2025-03-10' })
    ).resolves.toBeTruthy();
    await expect(
      schema.validate({ data_convocacao_inicio: '2025-03-10', data_convocacao_fim: '2025-03-11' })
    ).resolves.toBeTruthy();
  });

  it('falha quando data_convocacao_inicio é inválida', async () => {
    const schema = useConvocacaoSchema();
    await expect(
      schema.validate({ data_convocacao_inicio: 'data-invalida' })
    ).rejects.toMatchObject({ errors: expect.arrayContaining(['Data inicial inválida']) });
  });

  it('falha quando data_convocacao_fim é menor que data_convocacao_inicio', async () => {
    const schema = useConvocacaoSchema();
    await expect(
      schema.validate({ data_convocacao_inicio: '2025-03-10', data_convocacao_fim: '2025-03-09' })
    ).rejects.toMatchObject({ errors: expect.arrayContaining(['Data final deve ser maior ou igual à inicial']) });
  });

  it('valida quando apenas data_convocacao_fim é informada e início ausente', async () => {
    const schema = useConvocacaoSchema();
    await expect(
      schema.validate({ data_convocacao_fim: '2025-03-11' })
    ).resolves.toBeTruthy();
  });
}); 