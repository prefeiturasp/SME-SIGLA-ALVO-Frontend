export type ReclassificacaoHistorico = {
  desclassificado_de: string;
  nova_classificacao?: string;
  mandado_judicial?: boolean;
};

/**
 * Retorna, para a categoria informada, o registro de histórico mais
 * recente entre os que a envolvem — seja como origem da
 * desclassificação (`desclassificado_de`), seja como destino de uma
 * reversão por mandado judicial (`nova_classificacao` com
 * `mandado_judicial=true`, que inverte esses campos).
 *
 * Assume que `reclassificacoes` já vem ordenado do mais recente para
 * o mais antigo (ver `listar_por_concurso_candidato_ordenado` no
 * backend).
 */
export const obterEventoMaisRecentePorCategoria = (
  reclassificacoes: ReclassificacaoHistorico[],
  categoria: string
): ReclassificacaoHistorico | undefined =>
  reclassificacoes.find(
    (rec) =>
      rec.desclassificado_de === categoria ||
      (rec.nova_classificacao === categoria && Boolean(rec.mandado_judicial))
  );

/**
 * Indica se a categoria tem uma desclassificação ativa (ainda não
 * revertida por mandado judicial) — ou seja, se o evento mais recente
 * que a envolve é, ele próprio, uma desclassificação dessa categoria.
 */
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

/**
 * Retorna, para a lista de categorias informada, os eventos de
 * desclassificação ainda ativos (reversíveis por mandado judicial) —
 * um por categoria, no máximo.
 */
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
