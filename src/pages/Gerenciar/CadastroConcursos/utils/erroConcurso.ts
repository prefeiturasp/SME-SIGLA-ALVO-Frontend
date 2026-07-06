// Utilitarios para inspecionar erros da API de concursos no frontend.

// Extrai a lista de mensagens de erro de um campo especifico do corpo de
// resposta de erro do backend (formato de ValidationError do DRF:
// { "<campo>": ["mensagem", ...] }).
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

// Retorna a mensagem de "numero de processo duplicado" quando o erro do
// backend for desse tipo; caso contrario, undefined.
export const obterMensagemNumeroProcessoDuplicado = (
  error: unknown
): string | undefined => {
  return extrairMensagensDoCampo(error, "numero_processo")?.[0];
};

// Indica se o erro do backend e o de numero de processo duplicado (que ja
// e exibido inline no formulario, dispensando notificacao generica).
export const ehErroNumeroProcessoDuplicado = (error: unknown): boolean => {
  return obterMensagemNumeroProcessoDuplicado(error) !== undefined;
};
