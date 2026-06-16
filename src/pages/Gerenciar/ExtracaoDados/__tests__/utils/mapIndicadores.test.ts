import {
  INDICADORES_VAZIOS,
  mapExtracaoDadosToIndicadores,
  mapExtracaoDadosTodosToIndicadores,
} from "../../utils/mapIndicadores";
import {
  extracaoDadosFiltradoMock,
  extracaoDadosTodosMock,
} from "../../testFixtures/extracaoDadosFixtures";

describe("mapIndicadores", () => {
  describe("mapExtracaoDadosTodosToIndicadores", () => {
    it("retorna indicadores vazios quando não há dados", () => {
      expect(mapExtracaoDadosTodosToIndicadores(undefined)).toEqual(INDICADORES_VAZIOS);
    });

    it("mapeia corretamente os indicadores consolidados", () => {
      expect(mapExtracaoDadosTodosToIndicadores(extracaoDadosTodosMock)).toEqual({
        habilitados: 1000,
        listaEspecifica: 1000,
        listaGeral: 800,
        listaPcd: 100,
        listaNna: 100,
        convocados: 500,
        escolhasRealizadas: 300,
        naoConvocados: 500,
        reconvocacoes: 50,
        semEscolha: 150,
        autorizacoes: 25,
      });
    });
  });

  describe("mapExtracaoDadosToIndicadores", () => {
    it("retorna indicadores vazios sem dados ou ano", () => {
      expect(mapExtracaoDadosToIndicadores(undefined, "2024")).toEqual(INDICADORES_VAZIOS);
      expect(mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, "")).toEqual(
        INDICADORES_VAZIOS
      );
    });

    it("mapeia corretamente os indicadores filtrados por ano", () => {
      expect(mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, "2024")).toEqual({
        habilitados: 200,
        listaEspecifica: 200,
        listaGeral: 150,
        listaPcd: 30,
        listaNna: 20,
        convocados: 80,
        escolhasRealizadas: 60,
        naoConvocados: 120,
        reconvocacoes: 10,
        semEscolha: 20,
        autorizacoes: 8,
      });
    });

    it("retorna zero para ano inexistente nos dados", () => {
      const indicadores = mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, "2023");

      expect(indicadores.convocados).toBe(0);
      expect(indicadores.escolhasRealizadas).toBe(0);
      expect(indicadores.autorizacoes).toBe(8);
      expect(indicadores.habilitados).toBe(200);
    });
  });
});
