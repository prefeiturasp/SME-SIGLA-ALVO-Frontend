/**
 * Mapeamento das chaves de status de importação de arquivo para seus
 * rótulos legíveis (espelha CHOICES_STATUS_IMPORTACAO_ARQUIVO do backend).
 */
export const STATUS_IMPORTACAO_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  PROCESSANDO: "Processando",
  CONCLUIDO: "Concluído",
  ERRO: "Erro",
};

/**
 * Retorna o rótulo legível de um status de importação. Se a chave for
 * desconhecida, devolve o próprio valor; se vazio, devolve "-".
 */
export const formatarStatusImportacao = (
  status?: string | null,
): string => (status ? STATUS_IMPORTACAO_LABEL[status] ?? status : "-");
