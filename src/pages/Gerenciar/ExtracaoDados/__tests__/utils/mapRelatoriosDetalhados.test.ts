import {
  mapCargosParaAutorizacoesPublicadas,
  mapConcursoFiltradoParaAutorizacoesPublicadas,
  mapDresConcursosParaRelatoriosDetalhados,
  mapDresParaRelatoriosDetalhados,
} from "../../utils/mapRelatoriosDetalhados";
import {
  concursosOptionsMock,
  extracaoDadosComparativoMock,
  extracaoDadosFiltradoMock,
  extracaoDadosTodosMock,
} from "../../testFixtures/extracaoDadosFixtures";

describe("mapRelatoriosDetalhados", () => {
  it("retorna lista vazia quando não há dres_concursos", () => {
    expect(
      mapDresConcursosParaRelatoriosDetalhados(
        { ...extracaoDadosTodosMock, escolhas: { ...extracaoDadosTodosMock.escolhas, dres_concursos: undefined } },
        concursosOptionsMock
      )
    ).toEqual([]);
  });

  it("mapeia relatórios detalhados com dados de cargo e concurso", () => {
    const resultado = mapDresConcursosParaRelatoriosDetalhados(
      extracaoDadosTodosMock,
      concursosOptionsMock
    );

    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toMatchObject({
      concursoUuid: "uuid-concurso-1",
      concurso: "Concurso Teste 1",
      cargo: "Professor",
      codigoCargo: 101,
      dre: "Butantã",
      dreOriginal: "Diretoria Regional de Educação Butantã",
      escolhas: 10,
      naoEscolhas: 10,
    });
    expect(resultado[1]).toMatchObject({
      cargo: "Coordenador",
      naoEscolhas: 10,
    });
  });

  it("usa uuid do concurso quando não encontra label nas opções", () => {
    const resultado = mapDresConcursosParaRelatoriosDetalhados(extracaoDadosTodosMock, []);

    expect(resultado[0].concurso).toBe("uuid-concurso-1");
  });

  it("mapeia relatórios detalhados filtrados por concurso", () => {
    const resultado = mapDresParaRelatoriosDetalhados(
      extracaoDadosFiltradoMock,
      "2024",
      "uuid-concurso-1",
      concursosOptionsMock
    );

    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toMatchObject({
      concursoUuid: "uuid-concurso-1",
      concurso: "Concurso Teste 1",
      cargo: "Professor",
      codigoCargo: 101,
      dre: "Butantã",
      escolhas: 25,
      naoEscolhas: 15,
    });
    expect(resultado[1]).toMatchObject({
      cargo: "Coordenador",
    });
  });

  it("não inclui campos de autorização nos itens de relatórios detalhados", () => {
    const resultado = mapDresConcursosParaRelatoriosDetalhados(
      extracaoDadosTodosMock,
      concursosOptionsMock
    );

    expect(resultado[0]).not.toHaveProperty("autorizacoes");
    expect(resultado[0]).not.toHaveProperty("data_autorizacao");
  });

  it("retorna lista vazia quando não há dres_concursos para o concurso", () => {
    expect(
      mapDresParaRelatoriosDetalhados(extracaoDadosFiltradoMock, "2024", "uuid-inexistente", [])
    ).toEqual([]);
  });
});

describe("mapCargosParaAutorizacoesPublicadas", () => {
  it("retorna lista vazia quando cargos é undefined", () => {
    expect(mapCargosParaAutorizacoesPublicadas(undefined)).toEqual([]);
  });

  it("mapeia cargos para autorizações publicadas formatando a data", () => {
    const resultado = mapCargosParaAutorizacoesPublicadas(
      extracaoDadosTodosMock.concurso.cargos
    );

    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toEqual({
      key: "cargo-1",
      cargo: "Professor",
      quantidade: 5,
      data_autorizacao: "15/06/2025",
    });
    expect(resultado[1]).toEqual({
      key: "cargo-2",
      cargo: "Coordenador",
      quantidade: 3,
      data_autorizacao: "20/07/2025",
    });
  });
});

describe("mapConcursoFiltradoParaAutorizacoesPublicadas", () => {
  it("usa os cargos do bloco do ano selecionado (um ano)", () => {
    const resultado = mapConcursoFiltradoParaAutorizacoesPublicadas(
      extracaoDadosFiltradoMock.concurso,
      ["2024"]
    );

    expect(resultado).toEqual([
      {
        key: "2024-cargo-1",
        cargo: "Professor",
        quantidade: 5,
        data_autorizacao: "10/08/2024",
      },
      {
        key: "2024-cargo-2",
        cargo: "Coordenador",
        quantidade: 3,
        data_autorizacao: "15/09/2024",
      },
    ]);
  });

  it("gera uma linha por cargo de cada ano (comparativo), sem agregar", () => {
    const resultado = mapConcursoFiltradoParaAutorizacoesPublicadas(
      extracaoDadosComparativoMock.concurso,
      ["2024", "2025"]
    );

    expect(resultado).toEqual([
      {
        key: "2024-cargo-1",
        cargo: "Professor",
        quantidade: 5,
        data_autorizacao: "10/08/2024",
      },
      {
        key: "2025-cargo-1",
        cargo: "Professor",
        quantidade: 6,
        data_autorizacao: "10/08/2025",
      },
    ]);
  });

  it("cai para os cargos da raiz quando não há blocos por ano", () => {
    const resultado = mapConcursoFiltradoParaAutorizacoesPublicadas(
      extracaoDadosTodosMock.concurso,
      ["2025"]
    );

    expect(resultado).toEqual([
      {
        key: "cargo-1",
        cargo: "Professor",
        quantidade: 5,
        data_autorizacao: "15/06/2025",
      },
      {
        key: "cargo-2",
        cargo: "Coordenador",
        quantidade: 3,
        data_autorizacao: "20/07/2025",
      },
    ]);
  });

  it("retorna lista vazia quando não há concurso", () => {
    expect(mapConcursoFiltradoParaAutorizacoesPublicadas(undefined, ["2024"])).toEqual([]);
  });
});
