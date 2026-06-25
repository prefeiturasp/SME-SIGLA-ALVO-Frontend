import React from "react";
import { render, screen } from "@testing-library/react";
import ConteudoExtracaoPdf from "../../components/ConteudoExtracaoPdf";
import {
  extracaoDadosComparativoMock,
  extracaoDadosTodosMock,
} from "../../testFixtures/extracaoDadosFixtures";
import { mapExtracaoDadosTodosToIndicadores } from "../../utils/mapIndicadores";
import { mapExtracaoDadosToIndicadoresComparativo } from "../../utils/mapIndicadoresComparativo";
import {
  mapDresComparativoPorDre,
  mapDresParaGraficoComparativo,
  mapDresParaTabelaComparativo,
  mapDresTodosParaGraficoEscolhas,
  mapDresTodosParaGraficoVagas,
  mapDresTodosParaTabela,
} from "../../utils/mapGraficosDre";
import {
  mapCargosParaAutorizacoesPublicadas,
  mapConcursoFiltradoParaAutorizacoesPublicadas,
  mapDresConcursosParaRelatoriosDetalhados,
  mapDresParaRelatoriosDetalhados,
} from "../../utils/mapRelatoriosDetalhados";

jest.mock("../../components/GraficoBarrasDre", () => {
  const { createMockGraficoBarrasDre } = jest.requireActual("../../testHelpers/testMocks");

  return {
    __esModule: true,
    default: createMockGraficoBarrasDre(),
  };
});

jest.mock("../../components/GraficoBarrasDreComparativo", () => {
  const { createMockGraficoBarrasDreComparativo } = jest.requireActual(
    "../../testHelpers/testMocks"
  );

  return {
    __esModule: true,
    default: createMockGraficoBarrasDreComparativo(),
  };
});

const concursosOptions = [{ value: "uuid-concurso-1", label: "Concurso Teste 1" }];

const propsSimples = () => ({
  indicadores: mapExtracaoDadosTodosToIndicadores(extracaoDadosTodosMock),
  graficoEscolhasDre: mapDresTodosParaGraficoEscolhas(extracaoDadosTodosMock),
  graficoVagasDre: mapDresTodosParaGraficoVagas(extracaoDadosTodosMock),
  tabelaVagasDre: mapDresTodosParaTabela(extracaoDadosTodosMock),
  relatoriosDetalhados: mapDresConcursosParaRelatoriosDetalhados(
    extracaoDadosTodosMock,
    concursosOptions
  ),
  autorizacoesPublicadas: mapCargosParaAutorizacoesPublicadas(
    extracaoDadosTodosMock.concurso?.cargos
  ),
  dataGeracao: "23/06/2026",
});

const propsComparativo = () => {
  const anos = ["2024", "2025"];
  const indicadoresComparativo = mapExtracaoDadosToIndicadoresComparativo(
    extracaoDadosComparativoMock,
    anos
  )!;
  const dresComparativo = mapDresComparativoPorDre(extracaoDadosComparativoMock, anos);

  return {
    isComparativo: true as const,
    indicadoresComparativo,
    anoAntigo: "2024",
    anoRecente: "2025",
    dresComparativo,
    graficoEscolhasComparativo: mapDresParaGraficoComparativo(dresComparativo, "escolhas"),
    graficoVagasComparativo: mapDresParaGraficoComparativo(dresComparativo, "vagas"),
    tabelaVagasDreComparativo: mapDresParaTabelaComparativo(dresComparativo),
    relatoriosDetalhados: mapDresParaRelatoriosDetalhados(
      extracaoDadosComparativoMock,
      anos,
      "uuid-concurso-1",
      concursosOptions
    ),
    autorizacoesPublicadas: mapConcursoFiltradoParaAutorizacoesPublicadas(
      extracaoDadosComparativoMock.concurso,
      anos
    ),
    dataGeracao: "23/06/2026",
  };
};

describe("ConteudoExtracaoPdf", () => {
  it("não exibe a linha 'Filtro aplicado' no formato simples", () => {
    render(<ConteudoExtracaoPdf {...propsSimples()} />);

    expect(screen.getByRole("heading", { name: "Extração de dados" })).toBeInTheDocument();
    expect(screen.getByText("Gerado em 23/06/2026")).toBeInTheDocument();
    expect(screen.queryByText(/Filtro aplicado/i)).not.toBeInTheDocument();
  });

  it("renderiza as seções do formato simples (sem filtros nos relatórios)", () => {
    render(<ConteudoExtracaoPdf {...propsSimples()} />);

    expect(screen.getByText("Indicadores")).toBeInTheDocument();
    expect(screen.getByTestId("grafico-Escolhas por DRE")).toBeInTheDocument();
    expect(screen.getByTestId("grafico-Total de vagas ofertadas por DRE")).toBeInTheDocument();
    expect(screen.getByText("Relatórios detalhados")).toBeInTheDocument();
    expect(screen.getByText("Autorizações Publicadas")).toBeInTheDocument();
    // mostrarFiltros={false}: nenhum botão de filtro deve aparecer.
    expect(screen.queryByRole("button", { name: /filtrar/i })).not.toBeInTheDocument();
  });

  it("renderiza o formato comparativo com gráficos empilhados e sem filtro", () => {
    render(<ConteudoExtracaoPdf {...propsComparativo()} />);

    expect(screen.queryByText(/Filtro aplicado/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/Acompanhe os indicadores nos anos 2025 e 2024\./)
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("grafico-comparativo-Escolhas por DRE")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("grafico-comparativo-Total de vagas ofertadas por DRE")
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /filtrar/i })).not.toBeInTheDocument();
  });
});
