import type { OpcaoSelecao } from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import {
  opcoesComponenteCurricular,
  opcoesFiltros,
} from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";

export const opcoesRegistrarUnidadeEducacional = {
  tipoUnidade: opcoesFiltros.tipoUnidade,
  dre: opcoesFiltros.dre,
  anoMunicipalizacao: opcoesFiltros.anoMunicipalizacao,
  componenteCurricular: opcoesComponenteCurricular,
} as const;

export interface CaracteristicasPadrao {
  escolaMunicipalizada: boolean;
  ensinoFundamentalI: boolean;
  ejaModular: boolean;
  saoPauloIntegral: boolean;
  contabilizarUE: boolean;
}

export const caracteristicasPadrao: CaracteristicasPadrao = {
  escolaMunicipalizada: false,
  ensinoFundamentalI: false,
  ejaModular: false,
  saoPauloIntegral: false,
  contabilizarUE: true,
};

export interface DadosLotacaoConsultaMock {
  tipoUnidade: string;
  dre: string;
  nome: string;
}

export const lotacoesConsultaExemplo: Record<
  string,
  DadosLotacaoConsultaMock
> = {
  "123": {
    tipoUnidade: "EMEF",
    dre: "itaquera",
    nome: "EMEF Prof. Maria da Silva",
  },
  "456": {
    tipoUnidade: "EMEI",
    dre: "butanta",
    nome: "EMEI Jardim das Flores",
  },
  "789": {
    tipoUnidade: "CEI",
    dre: "sao-miguel",
    nome: "CEI Vila Nova",
  },
};

export type { OpcaoSelecao };
