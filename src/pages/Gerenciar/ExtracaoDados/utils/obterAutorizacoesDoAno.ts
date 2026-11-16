import type {
  IExtracaoDadosConcursoCargo,
  IExtracaoDadosConcursoFiltrado,
} from "../../../../services/resources/relatorios/IExtracaoDados";

type CargoAutorizacao = Pick<IExtracaoDadosConcursoCargo, "autorizacoes" | "data_autorizacao">;

const somarAutorizacoesCargos = (cargos?: CargoAutorizacao[]) =>
  cargos?.reduce((total, cargo) => total + (Number(cargo.autorizacoes) || 0), 0) ?? 0;

const somarAutorizacoesCargosPorAno = (
  cargos: CargoAutorizacao[] | undefined,
  ano: string
) =>
  cargos
    ?.filter((cargo) => cargo.data_autorizacao?.slice(0, 4) === ano)
    .reduce((total, cargo) => total + (Number(cargo.autorizacoes) || 0), 0) ?? 0;

const isBlocoConcursoAno = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const obterAutorizacoesDoBlocoAno = (bloco: unknown): number => {
  if (!isBlocoConcursoAno(bloco)) {
    return 0;
  }

  const somaCargos = somarAutorizacoesCargos(
    bloco.cargos as CargoAutorizacao[] | undefined
  );

  if ("autorizacoes-publicadas" in bloco) {
    const publicadas = Number(bloco["autorizacoes-publicadas"]);
    if (!Number.isNaN(publicadas) && publicadas > 0) {
      return publicadas;
    }
  }

  return somaCargos;
};

export const obterAutorizacoesDoAno = (
  concurso: IExtracaoDadosConcursoFiltrado | undefined,
  ano: string,
  options: { permitirFallbackRaiz?: boolean } = {}
): number => {
  const { permitirFallbackRaiz = false } = options;
  const anoChave = String(ano);
  const valorDoAno = obterAutorizacoesDoBlocoAno(concurso?.[anoChave]);

  if (valorDoAno > 0 || isBlocoConcursoAno(concurso?.[anoChave])) {
    return valorDoAno;
  }

  const valorPorCargosRaiz = somarAutorizacoesCargosPorAno(concurso?.cargos, anoChave);
  if (valorPorCargosRaiz > 0) {
    return valorPorCargosRaiz;
  }

  if (permitirFallbackRaiz) {
    return Number(concurso?.["autorizacoes-publicadas"]) || 0;
  }

  return 0;
};
