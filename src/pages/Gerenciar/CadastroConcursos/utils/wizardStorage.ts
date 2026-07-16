import dayjs from "dayjs";
import type { IConcursoFormFields } from "../hooks/useConcursoForm";
import type { IPublicacoesResultadosFormFields } from "../hooks/usePublicacoesResultadosForm";
import type { IVigenciaFormFields } from "../hooks/useVigenciaForm";

/** Chaves do sessionStorage usadas pelo wizard de cadastro de concurso. */
export const CHAVE_PASSO_1 = "concurso-wizard-passo-1";
export const CHAVE_PASSO_2 = "concurso-wizard-passo-2";
export const CHAVE_PASSO_3 = "concurso-wizard-passo-3";

const lerJson = <T>(chave: string): T | null => {
  const bruto = sessionStorage.getItem(chave);
  if (!bruto) return null;
  try {
    return JSON.parse(bruto) as T;
  } catch {
    return null;
  }
};

/**
 * Lê o passo 1 (identificação) do sessionStorage. Sem datas — retorna direto.
 */
export const lerPasso1 = (): IConcursoFormFields | null =>
  lerJson<IConcursoFormFields>(CHAVE_PASSO_1);

/**
 * Lê o passo 2 (publicações/resultados) reidratando as datas serializadas
 * (JSON as guarda como string ISO) de volta para instâncias Dayjs.
 */
export const lerPasso2 = (): IPublicacoesResultadosFormFields | null => {
  const dados = lerJson<
    Omit<
      IPublicacoesResultadosFormFields,
      "data_autorizacao" | "classificacao_final" | "data_abertura"
    > & {
      data_autorizacao: string | null;
      classificacao_final: string | null;
      data_abertura: string | null;
    }
  >(CHAVE_PASSO_2);
  if (!dados) return null;

  return {
    ...dados,
    data_autorizacao: dados.data_autorizacao
      ? dayjs(dados.data_autorizacao)
      : (undefined as never),
    classificacao_final: dados.classificacao_final
      ? dayjs(dados.classificacao_final)
      : (undefined as never),
    data_abertura: dados.data_abertura
      ? dayjs(dados.data_abertura)
      : (undefined as never),
  };
};

/**
 * Lê o passo 3 (vigência) reidratando as datas e o intervalo de vigência
 * de volta para instâncias Dayjs.
 */
export const lerPasso3 = (): IVigenciaFormFields | null => {
  const dados = lerJson<{
    data_homologacao: string | null;
    data_prorrogacao: string | null;
    vigencia: [string, string] | null;
  }>(CHAVE_PASSO_3);
  if (!dados) return null;

  return {
    data_homologacao: dados.data_homologacao
      ? dayjs(dados.data_homologacao)
      : (undefined as never),
    data_prorrogacao: dados.data_prorrogacao
      ? dayjs(dados.data_prorrogacao)
      : null,
    vigencia: (dados.vigencia
      ? [dayjs(dados.vigencia[0]), dayjs(dados.vigencia[1])]
      : undefined) as IVigenciaFormFields["vigencia"],
  };
};

/** Remove todos os passos do wizard do sessionStorage. */
export const limparWizard = (): void => {
  sessionStorage.removeItem(CHAVE_PASSO_1);
  sessionStorage.removeItem(CHAVE_PASSO_2);
  sessionStorage.removeItem(CHAVE_PASSO_3);
};
