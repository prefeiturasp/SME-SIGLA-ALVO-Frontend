export type ReclassificacaoHistorico = {
  desclassificado_de: string;
  nova_classificacao?: string;
  mandado_judicial?: boolean;
};

export type TagReclassificacaoTipo = "desclassificado" | "reclassificado";


export const obterTagReclassificacao = (
  reclassificacoes: ReclassificacaoHistorico[]
): TagReclassificacaoTipo | null => {
  if (!reclassificacoes.length) return null;

  const maisRecente = reclassificacoes[0];
  return maisRecente.mandado_judicial ? "reclassificado" : "desclassificado";
};


export const obterEventoMaisRecentePorCategoria = (
  reclassificacoes: ReclassificacaoHistorico[],
  categoria: string
): ReclassificacaoHistorico | undefined =>
  reclassificacoes.find(
    (rec) =>
      rec.desclassificado_de === categoria ||
      (rec.nova_classificacao === categoria && Boolean(rec.mandado_judicial))
  );


export const possuiDesclassificacaoAtiva = (
  reclassificacoes: ReclassificacaoHistorico[],
  categoria: string
): boolean => {
  const maisRecente = obterEventoMaisRecentePorCategoria(
    reclassificacoes,
    categoria
  );
  return (
    !!maisRecente &&
    maisRecente.desclassificado_de === categoria &&
    !maisRecente.mandado_judicial
  );
};


export const obterReclassificacoesReversiveis = (
  reclassificacoes: ReclassificacaoHistorico[],
  categorias: string[]
): ReclassificacaoHistorico[] =>
  categorias
    .map((categoria) =>
      obterEventoMaisRecentePorCategoria(reclassificacoes, categoria)
    )
    .filter(
      (evento): evento is ReclassificacaoHistorico =>
        !!evento && !evento.mandado_judicial
    );
