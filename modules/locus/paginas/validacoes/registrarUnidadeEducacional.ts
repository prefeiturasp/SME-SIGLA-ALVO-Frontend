import { z } from "zod";

export const MENSAGENS_VALIDACAO = {
  campoObrigatorio: "Campo obrigatório",
  codigoLotacaoIncorreto: "Código de lotação incorreto",
} as const;

export const codigoLotacaoSchema = z
  .string()
  .trim()
  .min(1, { message: MENSAGENS_VALIDACAO.campoObrigatorio });

export const componenteCurricularSchema = z
  .string({
    required_error: MENSAGENS_VALIDACAO.campoObrigatorio,
    invalid_type_error: MENSAGENS_VALIDACAO.campoObrigatorio,
  })
  .trim()
  .min(1, { message: MENSAGENS_VALIDACAO.campoObrigatorio });

export type ResultadoValidacao =
  | { ok: true }
  | { ok: false; mensagem: string };

export function validarCodigoLotacaoObrigatorio(
  codigo: string,
): ResultadoValidacao & { codigo?: string } {
  const resultado = codigoLotacaoSchema.safeParse(codigo);

  if (!resultado.success) {
    return {
      ok: false,
      mensagem:
        resultado.error.issues[0]?.message ??
        MENSAGENS_VALIDACAO.campoObrigatorio,
    };
  }

  return { ok: true, codigo: resultado.data };
}

export function validarComponenteCurricular(
  componente?: string,
): ResultadoValidacao {
  const resultado = componenteCurricularSchema.safeParse(componente);

  if (!resultado.success) {
    return {
      ok: false,
      mensagem:
        resultado.error.issues[0]?.message ??
        MENSAGENS_VALIDACAO.campoObrigatorio,
    };
  }

  return { ok: true };
}

export interface ErrosFormularioRegistro {
  erroCodigoLotacao?: string;
  erroMotivoNaoContabilizacao?: string;
  erroComponenteCurricular?: string;
}

export interface DadosValidacaoRegistro {
  codigoLotacao: string;
  lotacaoConsultada: boolean;
  contabilizarUE: boolean;
  motivoNaoContabilizacao?: string;
  possuiComponenteCurricular: boolean;
}

export function validarFormularioRegistro(
  dados: DadosValidacaoRegistro,
): ErrosFormularioRegistro & { ok: boolean } {
  const erros: ErrosFormularioRegistro = {};

  if (!dados.codigoLotacao.trim() || !dados.lotacaoConsultada) {
    erros.erroCodigoLotacao = MENSAGENS_VALIDACAO.campoObrigatorio;
  }

  if (!dados.contabilizarUE && !dados.motivoNaoContabilizacao?.trim()) {
    erros.erroMotivoNaoContabilizacao = MENSAGENS_VALIDACAO.campoObrigatorio;
  }

  if (!dados.possuiComponenteCurricular) {
    erros.erroComponenteCurricular = MENSAGENS_VALIDACAO.campoObrigatorio;
  }

  return {
    ok: Object.keys(erros).length === 0,
    ...erros,
  };
}
