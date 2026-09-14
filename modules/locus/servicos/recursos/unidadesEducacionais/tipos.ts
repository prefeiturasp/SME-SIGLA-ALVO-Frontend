import { z } from "zod";

export const situacaoVagasSchema = z.enum([
  "disponivel",
  "excedente",
  "completo",
]);
export type SituacaoVagas = z.infer<typeof situacaoVagasSchema>;

export const unidadeEducacionalSchema = z.object({
  codigoLotacao: z.string(),
  tipo: z.string(),
  nome: z.string(),
  dre: z.string(),
  modulo: z.number().int().nonnegative(),
  lotacao: z.number().int().nonnegative(),
  afastados: z.number().int().nonnegative(),
  saldoVagas: z.number().int(),
});
export type UnidadeEducacional = z.infer<typeof unidadeEducacionalSchema>;

export const estatisticaPainelSchema = z.object({
  chave: z.string(),
  valor: z.number(),
  rotulo: z.string(),
  legenda: z.string(),
});
export type EstatisticaPainel = z.infer<typeof estatisticaPainelSchema>;

export const painelComponenteSchema = z.object({
  componente: z.string(),
  estatisticas: z.array(estatisticaPainelSchema),
});
export type PainelComponente = z.infer<typeof painelComponenteSchema>;

export const opcaoSelecaoSchema = z.object({
  value: z.string(),
  label: z.string(),
});
export type OpcaoSelecao = z.infer<typeof opcaoSelecaoSchema>;

export const respostaListagemSchema = z.object({
  itens: z.array(unidadeEducacionalSchema),
  total: z.number().int().nonnegative(),
  pagina: z.number().int().positive(),
  tamanhoPagina: z.number().int().positive(),
});
export type RespostaListagem = z.infer<typeof respostaListagemSchema>;

export interface FiltrosUnidades {
  componente?: string;
  cargo?: string;
  estruturaHierarquica?: string;
  codigoLotacao?: string;
  tipoUnidade?: string;
  dre?: string;
  nomeUnidade?: string;
  escolasMunicipalizadas?: string;
  anoMunicipalizacao?: string;
  ensinoFundamentalI?: string;
  ejaModular?: string;
  saoPauloIntegral?: string;
  unidadeContabilizada?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

export function situacaoDoSaldo(saldo: number): SituacaoVagas {
  if (saldo > 0) return "disponivel";
  if (saldo < 0) return "excedente";
  return "completo";
}

export const dadosLotacaoConsultaSchema = z.object({
  codigoLotacao: z.string(),
  tipoUnidade: z.string(),
  dre: z.string(),
  nome: z.string(),
});
export type DadosLotacaoConsulta = z.infer<typeof dadosLotacaoConsultaSchema>;

export const componenteRegistrarSchema = z.object({
  componente: z.string(),
  quantidadeModulos: z.number().int().nonnegative(),
});
export type ComponenteRegistrar = z.infer<typeof componenteRegistrarSchema>;

export const payloadRegistrarUnidadeSchema = z.object({
  codigoLotacao: z.string().min(1),
  tipoUnidade: z.string().min(1),
  dre: z.string().min(1),
  nome: z.string().min(1),
  anoMunicipalizacao: z.string().optional(),
  escolaMunicipalizada: z.boolean(),
  ensinoFundamentalI: z.boolean(),
  ejaModular: z.boolean(),
  saoPauloIntegral: z.boolean(),
  contabilizarUE: z.boolean(),
  motivoNaoContabilizacao: z.string().optional(),
  componentes: z.array(componenteRegistrarSchema),
});
export type PayloadRegistrarUnidade = z.infer<
  typeof payloadRegistrarUnidadeSchema
>;

export const respostaRegistrarUnidadeSchema = z.object({
  sucesso: z.boolean(),
  mensagem: z.string().optional(),
});
export type RespostaRegistrarUnidade = z.infer<
  typeof respostaRegistrarUnidadeSchema
>;

export class LotacaoNaoEncontradaError extends Error {
  readonly codigo = "LOTACAO_NAO_ENCONTRADA" as const;

  constructor(mensagem = "Código de lotação incorreto") {
    super(mensagem);
    this.name = "LotacaoNaoEncontradaError";
  }
}

/* ======= Detalhe da unidade educacional ======= */

export const grupoComponenteSchema = z.enum([
  "baseComum",
  "linguagensAdicionais",
]);
export type GrupoComponente = z.infer<typeof grupoComponenteSchema>;

export const ROTULO_GRUPO_COMPONENTE: Record<GrupoComponente, string> = {
  baseComum: "Base comum",
  linguagensAdicionais: "Linguagens adicionais",
};

/** Ordem de exibicao dos grupos na tabela de componentes. */
export const ORDEM_GRUPOS: GrupoComponente[] = [
  "baseComum",
  "linguagensAdicionais",
];

export const componenteCurricularDetalheSchema = z.object({
  id: z.string(),
  componente: z.string(),
  grupo: grupoComponenteSchema,
  modulo: z.number().int().nonnegative(),
  lotacao: z.number().int().nonnegative(),
  afastados: z.number().int().nonnegative(),
  vacancias: z.number().int().nonnegative(),
  saldoVagas: z.number().int(),
});
export type ComponenteCurricularDetalhe = z.infer<
  typeof componenteCurricularDetalheSchema
>;

export const tipoVagaSchema = z.enum(["definitivo", "precario"]);
export type TipoVaga = z.infer<typeof tipoVagaSchema>;

export const ROTULO_TIPO_VAGA: Record<TipoVaga, string> = {
  definitivo: "Definitivo",
  precario: "Precário",
};

export const professorLotadoSchema = z.object({
  rf: z.string(),
  nome: z.string(),
  tipoVaga: tipoVagaSchema,
});
export type ProfessorLotado = z.infer<typeof professorLotadoSchema>;

export const tipoAfastamentoSchema = z.enum([
  "licencaMedica",
  "afastamentoEstudo",
]);
export type TipoAfastamento = z.infer<typeof tipoAfastamentoSchema>;

export const ROTULO_TIPO_AFASTAMENTO: Record<TipoAfastamento, string> = {
  licencaMedica: "Licença médica",
  afastamentoEstudo: "Afastamento para estudo",
};

export const professorAfastadoSchema = z.object({
  rf: z.string(),
  nome: z.string(),
  tipoAfastamento: tipoAfastamentoSchema,
});
export type ProfessorAfastado = z.infer<typeof professorAfastadoSchema>;

export const registroHistoricoSchema = z.object({
  id: z.string(),
  acao: z.string(),
  responsavel: z.string(),
  /** ISO 8601; formatado na view. */
  data: z.string(),
});
export type RegistroHistorico = z.infer<typeof registroHistoricoSchema>;

export const detalheUnidadeSchema = z.object({
  codigoLotacao: z.string(),
  tipo: z.string(),
  nome: z.string(),
  dre: z.string(),
  estatisticas: z.array(estatisticaPainelSchema),
  componentes: z.array(componenteCurricularDetalheSchema),
});
export type DetalheUnidade = z.infer<typeof detalheUnidadeSchema>;

export const alteracaoModuloSchema = z.object({
  componenteId: z.string(),
  modulo: z.number().int().nonnegative(),
});
export type AlteracaoModulo = z.infer<typeof alteracaoModuloSchema>;

export const payloadSalvarModulosSchema = z.object({
  codigoLotacao: z.string().min(1),
  alteracoes: z.array(alteracaoModuloSchema).min(1),
});
export type PayloadSalvarModulos = z.infer<typeof payloadSalvarModulosSchema>;

export const respostaOperacaoSchema = z.object({
  sucesso: z.boolean(),
  mensagem: z.string().optional(),
});
export type RespostaOperacao = z.infer<typeof respostaOperacaoSchema>;

export class UnidadeNaoEncontradaError extends Error {
  readonly codigo = "UNIDADE_NAO_ENCONTRADA" as const;

  constructor(mensagem = "Unidade educacional não encontrada") {
    super(mensagem);
    this.name = "UnidadeNaoEncontradaError";
  }
}
