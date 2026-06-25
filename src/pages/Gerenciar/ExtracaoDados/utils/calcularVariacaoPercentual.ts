export const calcularVariacaoPercentual = (
  valorAntigo: number,
  valorRecente: number
): number => {
  if (valorAntigo === 0 || valorAntigo === valorRecente) {
    return 0;
  }

  return Math.round(((valorRecente - valorAntigo) / valorAntigo) * 1000) / 10;
};
