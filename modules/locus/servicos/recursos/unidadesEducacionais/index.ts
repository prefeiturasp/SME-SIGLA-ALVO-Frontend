import type { AxiosRequestConfig } from "axios";
import { detalhesPorCodigo } from "@locus/paginas/DetalheUnidadeEducacional/dados/dadosEstaticos";
import { lotacoesConsultaExemplo } from "@locus/paginas/RegistrarUnidadeEducacional/dados/dadosEstaticos";
import {
  dadosLotacaoConsultaSchema,
  LotacaoNaoEncontradaError,
  payloadRegistrarUnidadeSchema,
  respostaRegistrarUnidadeSchema,
  detalheUnidadeSchema,
  payloadSalvarModulosSchema,
  respostaOperacaoSchema,
  UnidadeNaoEncontradaError,
  type DadosLotacaoConsulta,
  type DetalheUnidade,
  type PayloadSalvarModulos,
  type RespostaOperacao,
  type PayloadRegistrarUnidade,
  type RespostaRegistrarUnidade,
} from "./tipos";

export * from "./tipos";


export const URL = {
  consultarLotacao: (codigo: string) =>
    `/api/v1/unidades-educacionais/lotacao/${encodeURIComponent(codigo)}/`,
  registrar: () => `/api/v1/unidades-educacionais/`,
  detalhe: (codigo: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/`,
  excluir: (codigo: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/`,
  salvarModulos: (codigo: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/modulos/`,
  professoresLotados: (codigo: string, componenteId: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/componentes/${encodeURIComponent(componenteId)}/lotados/`,
  professoresAfastados: (codigo: string, componenteId: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/componentes/${encodeURIComponent(componenteId)}/afastados/`,
  historico: (codigo: string) =>
    `/api/v1/unidades-educacionais/${encodeURIComponent(codigo)}/historico/`,
};

function deveSimularErroRegistro(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("erro") === "1";
}

export type StatusListagemUnidades =
  | "comDados"
  | "semCadastro"
  | "semResultado";

export function lerStatusSimuladoListagem(): StatusListagemUnidades {
  if (typeof window === "undefined") return "comDados";

  const status = new URLSearchParams(window.location.search).get("status");
  if (status === "1") return "semCadastro";
  if (status === "2") return "semResultado";
  return "comDados";
}

export function deveSimularUnidadeIndisponivel(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("status") === "3";
}


const modulosSalvos = new Map<string, Map<string, number>>();

function aplicarModulosSalvos(detalhe: DetalheUnidade): DetalheUnidade {
  const salvos = modulosSalvos.get(detalhe.codigoLotacao);
  if (!salvos || salvos.size === 0) return detalhe;

  return {
    ...detalhe,
    componentes: detalhe.componentes.map((componente) => {
      const modulo = salvos.get(componente.id);
      if (modulo === undefined) return componente;

      const diferenca = modulo - componente.modulo;
      return {
        ...componente,
        modulo,
        saldoVagas: componente.saldoVagas + diferenca,
      };
    }),
  };
}

export interface OpcoesLeituraDetalhe {

  comEdicoesSalvas?: boolean;
}

export function lerDetalheEstatico(
  codigo: string,
  { comEdicoesSalvas = true }: OpcoesLeituraDetalhe = {},
): DetalheUnidade | undefined {
  const encontrado = detalhesPorCodigo[codigo];
  if (!encontrado) return undefined;

  return detalheUnidadeSchema.parse(
    comEdicoesSalvas ? aplicarModulosSalvos(encontrado) : encontrado,
  );
}

export const salvarModulos = (
  payload: PayloadSalvarModulos,
  _axiosRequestConfig?: AxiosRequestConfig,
) => {
  const { abort } = new AbortController();
  payloadSalvarModulosSchema.parse(payload);

  const response: Promise<RespostaOperacao> = Promise.resolve().then(() => {
    const salvos =
      modulosSalvos.get(payload.codigoLotacao) ?? new Map<string, number>();

    payload.alteracoes.forEach(({ componenteId, modulo }) => {
      salvos.set(componenteId, modulo);
    });
    modulosSalvos.set(payload.codigoLotacao, salvos);

    return respostaOperacaoSchema.parse({
      sucesso: true,
      mensagem: "As alterações foram salvas.",
    });
  });

  return { response, abort };
};

export const excluirUnidade = (
  codigo: string,
  _axiosRequestConfig?: AxiosRequestConfig,
) => {
  const { abort } = new AbortController();

  const response: Promise<RespostaOperacao> = Promise.resolve().then(() => {
    if (!detalhesPorCodigo[codigo]) {
      throw new UnidadeNaoEncontradaError();
    }

    return respostaOperacaoSchema.parse({
      sucesso: true,
      mensagem: "A unidade educacional foi excluída.",
    });
  });

  return { response, abort };
};


export function reiniciarModulosSalvos(): void {
  modulosSalvos.clear();
}

export const consultarLotacao = (
  codigo: string,
  _axiosRequestConfig?: AxiosRequestConfig,
) => {
  const { abort } = new AbortController();
  const codigoNormalizado = codigo.trim();

  const response: Promise<DadosLotacaoConsulta> = Promise.resolve().then(() => {
    const encontrado = lotacoesConsultaExemplo[codigoNormalizado];

    if (!encontrado) {
      throw new LotacaoNaoEncontradaError();
    }

    return dadosLotacaoConsultaSchema.parse({
      codigoLotacao: codigoNormalizado,
      ...encontrado,
    });
  });

  return { response, abort };
};

export const registrar = (
  payload: PayloadRegistrarUnidade,
  _axiosRequestConfig?: AxiosRequestConfig,
) => {
  const { abort } = new AbortController();
  payloadRegistrarUnidadeSchema.parse(payload);

  const response: Promise<RespostaRegistrarUnidade> = deveSimularErroRegistro()
    ? Promise.reject(new Error("Erro simulado no registro da UE"))
    : Promise.resolve(
        respostaRegistrarUnidadeSchema.parse({
          sucesso: true,
          mensagem: "A unidade educacional foi registrada.",
        }),
      );

  return { response, abort };
};
