export const STATUS_IMPORTACAO_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  PROCESSANDO: "Processando",
  CONCLUIDO: "Concluído",
  ERRO: "Erro",
};

export const formatarStatusImportacao = (
  status?: string | null,
): string => (status ? STATUS_IMPORTACAO_LABEL[status] ?? status : "-");
