const CHAVE_ROTA = "/gerenciar/concursos";

export interface IEstadoNavegacaoConcurso {
  /** Sinaliza que algum passo da edicao/cadastro foi salvo na sessao. */
  houveAlteracao?: boolean;
}

/**
 * Le o flag ``houveAlteracao`` do ``location.state`` da navegacao.
 *
 * Args:
 *   state: O ``location.state`` recebido pela tela de destino.
 *
 * Returns:
 *   ``true`` se algum passo foi salvo na sessao, senao ``false``.
 */
export const leHouveAlteracao = (state: unknown): boolean => {
  return Boolean((state as IEstadoNavegacaoConcurso | null)?.houveAlteracao);
};

/**
 * Monta as opcoes de navegacao propagando o flag ``houveAlteracao``.
 *
 * Args:
 *   houveAlteracao: Se algum passo ja foi salvo (recebido ou feito agora).
 *
 * Returns:
 *   Objeto ``{ state }`` para o ``navigate`` do React Router.
 */
export const opcoesNavegacaoConcurso = (
  houveAlteracao: boolean
): { state: IEstadoNavegacaoConcurso } => ({
  state: { houveAlteracao },
});

export const ROTA_LISTAGEM_CONCURSOS = CHAVE_ROTA;
