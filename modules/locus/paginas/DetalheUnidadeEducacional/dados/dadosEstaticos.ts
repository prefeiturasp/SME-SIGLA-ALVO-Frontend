import { linhasUnidades } from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";
import { LEGENDAS_ESTATISTICA } from "@locus/servicos/recursos/unidadesEducacionais/textos";
import type {
  ComponenteCurricularDetalhe,
  DetalheUnidade,
  EstatisticaPainel,
  ProfessorAfastado,
  ProfessorLotado,
  RegistroHistorico,
} from "@locus/servicos/recursos/unidadesEducacionais/tipos";

interface ComponenteBase {
  componente: string;
  grupo: ComponenteCurricularDetalhe["grupo"];
  modulo: number;
  lotacao: number;
  afastados: number;
  vacancias: number;
}

/** Afastados e vacancias liberam a vaga que o professor ocupava, entao somam. */
export function calcularSaldoVagas({
  modulo,
  lotacao,
  afastados,
  vacancias,
}: Pick<
  ComponenteBase,
  "modulo" | "lotacao" | "afastados" | "vacancias"
>): number {
  return modulo - lotacao + afastados + vacancias;
}

function identificador(componente: string): string {
  return componente
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const COMPONENTES_BASE: ComponenteBase[] = [
  { componente: "Arte", grupo: "baseComum", modulo: 3, lotacao: 5, afastados: 0, vacancias: 0 },
  { componente: "Biologia", grupo: "baseComum", modulo: 6, lotacao: 6, afastados: 2, vacancias: 0 },
  { componente: "Ciências", grupo: "baseComum", modulo: 5, lotacao: 3, afastados: 0, vacancias: 1 },
  { componente: "Educação Física", grupo: "baseComum", modulo: 4, lotacao: 6, afastados: 1, vacancias: 0 },
  { componente: "Filosofia", grupo: "baseComum", modulo: 5, lotacao: 5, afastados: 1, vacancias: 0 },
  { componente: "Física", grupo: "baseComum", modulo: 4, lotacao: 4, afastados: 0, vacancias: 0 },
  { componente: "Geografia", grupo: "baseComum", modulo: 5, lotacao: 4, afastados: 1, vacancias: 0 },
  { componente: "História", grupo: "baseComum", modulo: 5, lotacao: 6, afastados: 1, vacancias: 0 },
  { componente: "Matemática", grupo: "baseComum", modulo: 6, lotacao: 5, afastados: 1, vacancias: 0 },
  { componente: "Português", grupo: "baseComum", modulo: 5, lotacao: 6, afastados: 2, vacancias: 0 },
  { componente: "Química", grupo: "baseComum", modulo: 5, lotacao: 7, afastados: 2, vacancias: 0 },
  { componente: "Sociologia", grupo: "baseComum", modulo: 5, lotacao: 6, afastados: 0, vacancias: 0 },
  { componente: "Ensino Religioso", grupo: "baseComum", modulo: 2, lotacao: 2, afastados: 0, vacancias: 0 },
  { componente: "Informática", grupo: "baseComum", modulo: 3, lotacao: 2, afastados: 0, vacancias: 0 },
  { componente: "Projeto de Vida", grupo: "baseComum", modulo: 3, lotacao: 3, afastados: 1, vacancias: 0 },
  { componente: "Leitura", grupo: "baseComum", modulo: 2, lotacao: 3, afastados: 0, vacancias: 0 },
  { componente: "Robótica", grupo: "baseComum", modulo: 2, lotacao: 1, afastados: 0, vacancias: 0 },
  { componente: "Tecnologias", grupo: "baseComum", modulo: 3, lotacao: 3, afastados: 0, vacancias: 1 },
  { componente: "Empreendedorismo", grupo: "baseComum", modulo: 2, lotacao: 2, afastados: 0, vacancias: 0 },
  { componente: "Espanhol", grupo: "linguagensAdicionais", modulo: 2, lotacao: 6, afastados: 2, vacancias: 0 },
  { componente: "Inglês", grupo: "linguagensAdicionais", modulo: 4, lotacao: 8, afastados: 2, vacancias: 1 },
  { componente: "Libras", grupo: "linguagensAdicionais", modulo: 2, lotacao: 6, afastados: 2, vacancias: 0 },
];

export const componentesDetalhe: ComponenteCurricularDetalhe[] =
  COMPONENTES_BASE.map((base) => ({
    id: identificador(base.componente),
    ...base,
    saldoVagas: calcularSaldoVagas(base),
  }));

export const TOTAL_COMPONENTES = componentesDetalhe.length;

function montarEstatisticas(
  modulo: number,
  lotacao: number,
  afastados: number,
  saldoVagas: number,
): EstatisticaPainel[] {
  return [
    {
      chave: "modulos",
      valor: modulo,
      rotulo: "Módulos",
      legenda: LEGENDAS_ESTATISTICA.modulos,
    },
    {
      chave: "lotacao",
      valor: lotacao,
      rotulo: "Lotação",
      legenda: LEGENDAS_ESTATISTICA.lotacao,
    },
    {
      chave: "afastados",
      valor: afastados,
      rotulo: "Afastados",
      legenda: LEGENDAS_ESTATISTICA.afastados,
    },
    {
      chave: "vagas",
      valor: saldoVagas,
      rotulo: "Vagas",
      legenda: LEGENDAS_ESTATISTICA.vagas,
    },
  ];
}

/** Estatisticas saem da linha da listagem, para as duas telas nao divergirem. */
export const detalhesPorCodigo: Record<string, DetalheUnidade> =
  Object.fromEntries(
    linhasUnidades.map((unidade) => [
      unidade.codigoLotacao,
      {
        codigoLotacao: unidade.codigoLotacao,
        tipo: unidade.tipo,
        nome: unidade.nome,
        dre: unidade.dre,
        estatisticas: montarEstatisticas(
          unidade.modulo,
          unidade.lotacao,
          unidade.afastados,
          unidade.saldoVagas,
        ),
        componentes: componentesDetalhe,
      },
    ]),
  );

export const professoresLotadosPorComponente: Record<string, ProfessorLotado[]> =
  {
    arte: [
      { nome: "João da Silva", rf: "123.456.7", tipoVaga: "definitivo" },
      { nome: "Maria Souza", rf: "123.456.7", tipoVaga: "precario" },
      { nome: "Ana Beatriz Lima", rf: "123.456.7", tipoVaga: "definitivo" },
      { nome: "Carlos Eduardo Rocha", rf: "123.456.7", tipoVaga: "precario" },
      { nome: "Fernanda Alves", rf: "123.456.7", tipoVaga: "definitivo" },
    ],
    biologia: [
      { nome: "Paulo Henrique Dias", rf: "123.456.7", tipoVaga: "definitivo" },
      { nome: "Marta Ribeiro", rf: "123.456.7", tipoVaga: "definitivo" },
      { nome: "Juliana Prado", rf: "123.456.7", tipoVaga: "precario" },
      { nome: "Rafael Nogueira", rf: "123.456.7", tipoVaga: "definitivo" },
      { nome: "Camila Ferraz", rf: "123.456.7", tipoVaga: "precario" },
      { nome: "Bruno Tavares", rf: "123.456.7", tipoVaga: "definitivo" },
    ],
  };

export const professoresAfastadosPorComponente: Record<
  string,
  ProfessorAfastado[]
> = {
  biologia: [
    {
      nome: "Paulo Henrique Dias",
      rf: "123.456.7",
      tipoAfastamento: "licencaMedica",
    },
    {
      nome: "Marta Ribeiro",
      rf: "123.456.7",
      tipoAfastamento: "afastamentoEstudo",
    },
  ],
  portugues: [
    {
      nome: "Renata Coelho",
      rf: "123.456.7",
      tipoAfastamento: "licencaMedica",
    },
    {
      nome: "Sergio Matos",
      rf: "123.456.7",
      tipoAfastamento: "afastamentoEstudo",
    },
  ],
};

export const professoresLotadosPadrao: ProfessorLotado[] = [
  { nome: "João da Silva", rf: "123.456.7", tipoVaga: "definitivo" },
  { nome: "Maria Souza", rf: "123.456.7", tipoVaga: "precario" },
];

export const professoresAfastadosPadrao: ProfessorAfastado[] = [
  {
    nome: "Paulo Henrique Dias",
    rf: "123.456.7",
    tipoAfastamento: "licencaMedica",
  },
];

export const historicoExemplo: RegistroHistorico[] = [
  {
    id: "h1",
    acao: "Alteração de módulo de biologia",
    responsavel: "Maria Cecília Guimarães",
    data: "2026-08-07T12:02:00",
  },
  {
    id: "h2",
    acao: "Alteração de módulo de português",
    responsavel: "Maria Cecília Guimarães",
    data: "2026-08-07T11:58:00",
  },
  {
    id: "h3",
    acao: "Alteração de vacâncias de biologia",
    responsavel: "Maria Cecília Guimarães",
    data: "2026-08-07T11:57:00",
  },
];
