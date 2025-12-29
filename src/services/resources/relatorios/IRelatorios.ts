export interface IRelatorioPayload {
  // Estrutura genérica; ajuste quando os campos forem definidos
  [key: string]: unknown;
}

export type FormatoRelatorio = "pdf" | "csv" | "xlsx" | string | undefined;


