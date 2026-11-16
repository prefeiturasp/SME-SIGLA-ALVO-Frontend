export const formatValorNumerico = (value: number) => value.toLocaleString("pt-BR");

export const formatValorComparativo = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }

  return formatValorNumerico(Math.abs(value));
};

export const formatValorPercentual = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }

  const formatted = value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  if (value > 0) {
    return `+${formatted}%`;
  }

  return `${formatted}%`;
};

export const formatVariacaoTooltipGrafico = (value: number | null): string => {
  if (value === null) {
    return "N/A";
  }

  const formatted = Math.abs(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  if (value > 0) {
    return `+ ${formatted}%`;
  }

  if (value < 0) {
    return `- ${formatted}%`;
  }

  return "0,0%";
};
