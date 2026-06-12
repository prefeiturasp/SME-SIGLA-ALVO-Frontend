import {
  formatarNomeDre,
  formatarNomeDreParaTabela,
  mapDresParaGraficoEscolhas,
  mapDresParaGraficoVagas,
  mapDresParaTabela,
  mapDresTodosParaGraficoEscolhas,
  mapDresTodosParaGraficoVagas,
  mapDresTodosParaTabela,
} from "../../utils/mapGraficosDre";
import {
  extracaoDadosFiltradoMock,
  extracaoDadosTodosMock,
} from "../../testFixtures/extracaoDadosFixtures";

describe("mapGraficosDre", () => {
  describe("formatarNomeDre", () => {
    it("abrevia o nome da diretoria regional", () => {
      expect(formatarNomeDre("Diretoria Regional de Educação Butantã")).toBe("DRE Butantã");
    });
  });

  describe("formatarNomeDreParaTabela", () => {
    it("remove o prefixo DRE para exibição na tabela", () => {
      expect(formatarNomeDreParaTabela("Diretoria Regional de Educação Butantã")).toBe("Butantã");
    });
  });

  describe("mapeamentos consolidados", () => {
    it("mapeia gráficos e tabela a partir dos dados totais", () => {
      expect(mapDresTodosParaGraficoEscolhas(extracaoDadosTodosMock)).toEqual([
        { nome: "DRE Butantã", valor: 50 },
        { nome: "DRE Centro", valor: 30 },
      ]);

      expect(mapDresTodosParaGraficoVagas(extracaoDadosTodosMock)).toEqual([
        { nome: "DRE Butantã", valor: 100 },
        { nome: "DRE Centro", valor: 80 },
      ]);

      expect(mapDresTodosParaTabela(extracaoDadosTodosMock)).toEqual([
        {
          key: "Butantã",
          nome: "Butantã",
          escolhas: 50,
          vagas: 100,
          percentualPreenchimento: 50,
        },
        {
          key: "Centro",
          nome: "Centro",
          escolhas: 30,
          vagas: 80,
          percentualPreenchimento: 38,
        },
      ]);
    });

    it("retorna listas vazias sem dados", () => {
      expect(mapDresTodosParaGraficoEscolhas(undefined)).toEqual([]);
      expect(mapDresTodosParaTabela(undefined)).toEqual([]);
    });
  });

  describe("mapeamentos filtrados por ano", () => {
    it("mapeia gráficos e tabela a partir dos dados do ano", () => {
      expect(mapDresParaGraficoEscolhas(extracaoDadosFiltradoMock, "2024")).toEqual([
        { nome: "DRE Butantã", valor: 25 },
      ]);

      expect(mapDresParaGraficoVagas(extracaoDadosFiltradoMock, "2024")).toEqual([
        { nome: "DRE Butantã", valor: 40 },
      ]);

      expect(mapDresParaTabela(extracaoDadosFiltradoMock, "2024")).toEqual([
        {
          key: "Butantã",
          nome: "Butantã",
          escolhas: 25,
          vagas: 40,
          percentualPreenchimento: 63,
        },
      ]);
    });

    it("calcula percentual zero quando não há vagas", () => {
      const data = {
        ...extracaoDadosFiltradoMock,
        escolhas: {
          "2024": {
            escolha: 0,
            reconvocacao: 0,
            "nao-escolha": 0,
            dres: [{ nome: "DRE Teste", escolhas: 10, vagas: 0 }],
          },
        },
      };

      expect(mapDresParaTabela(data, "2024")[0].percentualPreenchimento).toBe(0);
    });
  });
});
