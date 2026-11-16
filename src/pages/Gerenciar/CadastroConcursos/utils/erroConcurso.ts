const extrairMensagensDoCampo = (
  error: unknown,
  campo: string
): string[] | undefined => {
  const dados = (
    error as { response?: { data?: Record<string, unknown> } }
  )?.response?.data;
  const mensagens = dados?.[campo];

  if (Array.isArray(mensagens) && typeof mensagens[0] === "string") {
    return mensagens as string[];
  }
  return undefined;
};

export const obterMensagemNumeroProcessoDuplicado = (
  error: unknown
): string | undefined => {
  return extrairMensagensDoCampo(error, "numero_processo")?.[0];
};

export const ehErroNumeroProcessoDuplicado = (error: unknown): boolean => {
  return obterMensagemNumeroProcessoDuplicado(error) !== undefined;
};
