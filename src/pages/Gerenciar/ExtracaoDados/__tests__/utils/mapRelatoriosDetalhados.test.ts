import { mapDresConcursosParaRelatoriosDetalhados } from "../../utils/mapRelatoriosDetalhados";
import {
  concursosOptionsMock,
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
      autorizacoes: 5,
      data_autorizacao: "15/06/2025",
    });
    expect(resultado[1]).toMatchObject({
      cargo: "Coordenador",
      naoEscolhas: 10,
      autorizacoes: 3,
      data_autorizacao: "20/07/2025",
    });
  });

  it("usa uuid do concurso quando não encontra label nas opções", () => {
    const resultado = mapDresConcursosParaRelatoriosDetalhados(extracaoDadosTodosMock, []);

    expect(resultado[0].concurso).toBe("uuid-concurso-1");
  });
});
