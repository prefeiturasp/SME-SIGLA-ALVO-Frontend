import type {
  EstatisticaPainel,
  OpcaoSelecao,
  UnidadeEducacional,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";
import { LEGENDAS_ESTATISTICA } from "@locus/servicos/recursos/unidadesEducacionais/textos";


export const TOTAL_REGISTROS = 5985;
export const TAMANHO_PAGINA = 10;

export const opcoesComponenteCurricular: OpcaoSelecao[] = [
  "Arte",
  "Biologia",
  "Ciências",
  "Educação Física",
  "Espanhol",
  "Filosofia",
  "Física",
  "Geografia",
  "História",
  "Inglês",
  "Libras",
  "Matemática",
  "Português",
  "Química",
  "Sociologia",
].map((nome) => ({ value: nome, label: nome }));

export const estatisticasPainel: EstatisticaPainel[] = [
  {
    chave: "modulos",
    valor: 105,
    rotulo: "Módulos",
    legenda: LEGENDAS_ESTATISTICA.modulos,
  },
  {
    chave: "lotacao",
    valor: 108,
    rotulo: "Lotação",
    legenda: LEGENDAS_ESTATISTICA.lotacao,
  },
  {
    chave: "afastados",
    valor: 152,
    rotulo: "Afastados",
    legenda: LEGENDAS_ESTATISTICA.afastados,
  },
  {
    chave: "vagas",
    valor: 54,
    rotulo: "Vagas",
    legenda: LEGENDAS_ESTATISTICA.vagas,
  },
  {
    chave: "unidades",
    valor: 596,
    rotulo: "Unidades Educacionais",
    legenda: "Quantidade total de unidades educacionais",
  },
  {
    chave: "turmas",
    valor: 16,
    rotulo: "Turmas ativas",
    legenda: "Quantidade de turmas ativas no EOL.",
  },
];

export const opcoesFiltros = {
  cargo: [
    { value: "pei", label: "Professor de Ensino Fundamental II e Médio" },
    { value: "pef1", label: "Professor de Ensino Fundamental I" },
  ] satisfies OpcaoSelecao[],
  tipoUnidade: [
    { value: "EMEF", label: "EMEF" },
    { value: "EMEI", label: "EMEI" },
    { value: "CEI", label: "CEI" },
    { value: "CECI", label: "CECI" },
    { value: "CIEJA", label: "CIEJA" },
    { value: "EMEBS", label: "EMEBS" },
  ] satisfies OpcaoSelecao[],
  dre: [
    { value: "itaquera", label: "Itaquera" },
    { value: "butanta", label: "Butantã" },
    { value: "sao-miguel", label: "São Miguel" },
    { value: "capela-do-socorro", label: "Capela do Socorro" },
    { value: "pirituba-jaragua", label: "Pirituba / Jaraguá" },
    { value: "sao-mateus", label: "São Mateus" },
    { value: "jacana-tremembe", label: "Jaçanã / Tremembé" },
  ] satisfies OpcaoSelecao[],
  anoMunicipalizacao: Array.from({ length: 10 }, (_, i) => {
    const ano = String(2015 + i);
    return { value: ano, label: ano };
  }) satisfies OpcaoSelecao[],
  simNaoTodos: [
    { value: "todos", label: "Todos" },
    { value: "sim", label: "Sim" },
    { value: "nao", label: "Não" },
  ] satisfies OpcaoSelecao[],
};

export const linhasUnidades: UnidadeEducacional[] = [
  {
    codigoLotacao: "091488",
    tipo: "CECI",
    nome: "Cidade Tiradentes",
    dre: "Itaquera",
    modulo: 105,
    lotacao: 108,
    afastados: 8,
    saldoVagas: 5,
  },
  {
    codigoLotacao: "091977",
    tipo: "CECI",
    nome: "Dom Paulo Evaristo Arns",
    dre: "São Miguel",
    modulo: 27,
    lotacao: 33,
    afastados: 2,
    saldoVagas: -4,
  },
  {
    codigoLotacao: "093855",
    tipo: "CECI",
    nome: "Dom Paulo Evaristo Arns",
    dre: "Capela do Socorro",
    modulo: 35,
    lotacao: 35,
    afastados: 0,
    saldoVagas: 0,
  },
  {
    codigoLotacao: "094159",
    tipo: "CEI",
    nome: "Chácara Santa Maria",
    dre: "Pirituba / Jaraguá",
    modulo: 113,
    lotacao: 106,
    afastados: 1,
    saldoVagas: 8,
  },
  {
    codigoLotacao: "090747",
    tipo: "CIEJA",
    nome: "Jardim das Carmélias",
    dre: "Butantã",
    modulo: 37,
    lotacao: 30,
    afastados: 0,
    saldoVagas: 7,
  },
  {
    codigoLotacao: "091975",
    tipo: "EMEBS",
    nome: "Jardim Elba",
    dre: "Butantã",
    modulo: 4,
    lotacao: 12,
    afastados: 0,
    saldoVagas: -8,
  },
  {
    codigoLotacao: "090077",
    tipo: "EMEF",
    nome: "Maria Aparecida de Souza",
    dre: "São Mateus",
    modulo: 74,
    lotacao: 80,
    afastados: 0,
    saldoVagas: -6,
  },
  {
    codigoLotacao: "093703",
    tipo: "EMEF",
    nome: "Milton Santos",
    dre: "Jaçanã / Tremembé",
    modulo: 30,
    lotacao: 21,
    afastados: 0,
    saldoVagas: 9,
  },
  {
    codigoLotacao: "095213",
    tipo: "EMEF",
    nome: "Maria Paula de Souza",
    dre: "Butantã",
    modulo: 15,
    lotacao: 15,
    afastados: 0,
    saldoVagas: 0,
  },
  {
    codigoLotacao: "096514",
    tipo: "EMEF",
    nome: "Matheus Pacheco",
    dre: "São Miguel",
    modulo: 22,
    lotacao: 17,
    afastados: 2,
    saldoVagas: 9,
  },
];
