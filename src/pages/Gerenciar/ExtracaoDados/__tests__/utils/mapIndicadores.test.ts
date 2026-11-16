import {
  INDICADOR_DETALHADO_VAZIO,
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

    it("mapeia corretamente os indicadores consolidados com breakdown", () => {
      expect(mapExtracaoDadosTodosToIndicadores(extracaoDadosTodosMock)).toEqual({
        modoComparativo: false,
        habilitados: 1000,
        listaEspecifica: 1000,
        listaGeral: 800,
        listaPcd: 100,
        listaNna: 100,
        convocados: { total: 500, geral: 400, pcd: 50, nna: 50 },
        escolhasRealizadas: { total: 300, geral: 240, pcd: 30, nna: 30 },
        naoConvocados: { total: 500, geral: 400, pcd: 50, nna: 50 },
        reconvocacoes: { total: 50, geral: 40, pcd: 5, nna: 5 },
        semEscolha: { total: 150, geral: 120, pcd: 15, nna: 15 },
        pendentesEscolha: { total: 0, geral: 0, pcd: 0, nna: 0 },
        autorizacoes: 25,
      });
    });
  });

  describe("mapExtracaoDadosToIndicadores", () => {
    it("retorna indicadores vazios sem dados ou ano", () => {
      expect(mapExtracaoDadosToIndicadores(undefined, ["2024"])).toEqual(
        INDICADORES_VAZIOS
      );
      expect(mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, [])).toEqual(
        INDICADORES_VAZIOS
      );
    });

    it("mapeia corretamente os indicadores filtrados por um ano", () => {
      expect(mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, ["2024"])).toEqual({
        modoComparativo: false,
        habilitados: 200,
        listaEspecifica: 200,
        listaGeral: 150,
        listaPcd: 30,
        listaNna: 20,
        convocados: { total: 80, geral: 60, pcd: 10, nna: 10 },
        escolhasRealizadas: { total: 60, geral: 45, pcd: 8, nna: 7 },
        naoConvocados: { total: 120, geral: 90, pcd: 20, nna: 10 },
        reconvocacoes: { total: 10, geral: 8, pcd: 1, nna: 1 },
        semEscolha: { total: 20, geral: 15, pcd: 3, nna: 2 },
        pendentesEscolha: { total: 0, geral: 0, pcd: 0, nna: 0 },
        autorizacoes: 8,
      });
    });

    it("retorna zero para ano inexistente nos dados", () => {
      const indicadores = mapExtracaoDadosToIndicadores(extracaoDadosFiltradoMock, [
        "2023",
      ]);

      expect(indicadores.convocados).toEqual(INDICADOR_DETALHADO_VAZIO);
      expect(indicadores.escolhasRealizadas).toEqual(INDICADOR_DETALHADO_VAZIO);
      expect(indicadores.pendentesEscolha).toEqual(INDICADOR_DETALHADO_VAZIO);
      expect(indicadores.habilitados).toBe(200);
    });

    it("usa pendentes da API quando disponível", () => {
      const dados = {
        ...extracaoDadosFiltradoMock,
        pendentes: {
          "2024": { total: 30, geral: 20, pcd: 5, nna: 5 },
        },
      };

      expect(mapExtracaoDadosToIndicadores(dados, ["2024"]).pendentesEscolha).toEqual({
        total: 30,
        geral: 20,
        pcd: 5,
        nna: 5,
      });
    });

    it("calcula pendentes pela fórmula quando a API não envia", () => {
      const dados = {
        ...extracaoDadosFiltradoMock,
        pendentes: undefined,
        candidatos: {
          ...extracaoDadosFiltradoMock.candidatos,
          "2024": {
            convocados: { total: 100, geral: 70, pcd: 20, nna: 10 },
            "nao-convocados": { total: 120, geral: 90, pcd: 20, nna: 10 },
          },
        },
        escolhas: {
          ...extracaoDadosFiltradoMock.escolhas,
          "2024": {
            escolha: { total: 40, geral: 30, pcd: 5, nna: 5 },
            reconvocacao: { total: 10, geral: 5, pcd: 3, nna: 2 },
            "nao-escolha": { total: 20, geral: 10, pcd: 5, nna: 5 },
            dres: [],
          },
        },
      };

      // 100 - 40 - 20 - 10 = 30
      expect(mapExtracaoDadosToIndicadores(dados, ["2024"]).pendentesEscolha).toEqual({
        total: 30,
        geral: 25,
        pcd: 7,
        nna: 0,
      });
    });

    it("nunca retorna pendentes negativos (clamp em 0)", () => {
      const dados = {
        ...extracaoDadosFiltradoMock,
        pendentes: undefined,
        candidatos: {
          ...extracaoDadosFiltradoMock.candidatos,
          "2024": {
            convocados: { total: 10, geral: 10, pcd: 0, nna: 0 },
            "nao-convocados": { total: 5, geral: 5, pcd: 0, nna: 0 },
          },
        },
        escolhas: {
          ...extracaoDadosFiltradoMock.escolhas,
          "2024": {
            escolha: { total: 40, geral: 40, pcd: 0, nna: 0 },
            reconvocacao: { total: 10, geral: 10, pcd: 0, nna: 0 },
            "nao-escolha": { total: 20, geral: 20, pcd: 0, nna: 0 },
            dres: [],
          },
        },
      };

      expect(mapExtracaoDadosToIndicadores(dados, ["2024"]).pendentesEscolha).toEqual(
        INDICADOR_DETALHADO_VAZIO
      );
    });
  });
});
