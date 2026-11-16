export interface IRelatorioPayload {
  // Estrutura genérica; ajuste quando os campos forem definidos
  [key: string]: unknown;
}

export type FormatoRelatorio = "pdf" | "csv" | "xlsx" | "docx" | "doc" | "xls" | "html" | string | undefined;

export type RelatorioLinha = {
  key: string;
  tipo: string;
};

export type PersonalizacaoModalProps = {
  open: boolean;
  onCancel: () => void;
  selectedRelatorio: RelatorioLinha | null;
  processoNome: string;
  processoUuid: string;
};

