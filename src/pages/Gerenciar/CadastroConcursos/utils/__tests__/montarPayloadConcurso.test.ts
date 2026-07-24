import dayjs from "dayjs";
import {
  detalheParaPasso1,
  detalheParaPasso2,
  detalheParaPasso3,
  formatarDataApi,
  montarPayloadPasso1,
  montarPayloadPasso2,
  montarPayloadPasso3,
  montarPayloadStatus,
  montarPayloadVigenciaLiberada,
} from "../montarPayloadConcurso";
import type { IConcursoDetalhe } from "../../../../../services/resources/concursos/IConcursos";

describe("formatarDataApi", () => {
  it("formata Dayjs para YYYY-MM-DD", () => {
    expect(formatarDataApi(dayjs("2026-07-01"))).toBe("2026-07-01");
  });

  it("retorna null quando a data e ausente", () => {
    expect(formatarDataApi(null)).toBeNull();
    expect(formatarDataApi(undefined)).toBeNull();
  });
});

describe("detalheParaPasso2 / detalheParaPasso3", () => {
  const detalhe: IConcursoDetalhe = {
    uuid: "u1",
    nome: "Concurso",
    cargos: [],
    numero_processo: "123",
    codigo: null,
    banca_responsavel: "FGV",
    status: "ATIVO",
    situacao: "COMPLETO",
    data_autorizacao: "2026-01-10",
    data_abertura: "2026-02-15",
    classificacao_final: "2026-06-30",
    link_edital: "https://exemplo.gov.br/edital.pdf",
    habilitados_geral: 100,
    habilitados_nna: 20,
    habilitados_pcd: 5,
    retificacoes: "Ret.",
    data_homologacao: "2026-07-01",
    data_prorrogacao: "2028-07-01",
    vigencia_inicio: "2026-07-01",
    vigencia_fim: "2028-07-01",
  };

  it("reidrata os campos de identificação do passo 1", () => {
    const p1 = detalheParaPasso1({
      ...detalhe,
      cargos: [
        { uuid: "c1", nome: "Professor", codigo: 10 },
        { uuid: "c2", nome: "Diretor", codigo: 20 },
      ],
    });
    expect(p1).toEqual({
      cargos_ids: ["c1", "c2"],
      nome: "Concurso",
      numero_processo: "123",
      banca_responsavel: "FGV",
      status: "ATIVO",
    });
  });

  it("reidrata as datas do passo 2 para Dayjs", () => {
    const p2 = detalheParaPasso2(detalhe);
    expect(dayjs.isDayjs(p2.data_autorizacao)).toBe(true);
    expect(p2.data_autorizacao?.format("YYYY-MM-DD")).toBe("2026-01-10");
    expect(p2.habilitados_geral).toBe(100);
    expect(p2.link_edital).toBe("https://exemplo.gov.br/edital.pdf");
  });

  it("reidrata a vigencia do passo 3 como intervalo de Dayjs", () => {
    const p3 = detalheParaPasso3(detalhe);
    expect(dayjs.isDayjs(p3.data_homologacao)).toBe(true);
    expect(Array.isArray(p3.vigencia)).toBe(true);
    expect(p3.vigencia?.[0].format("YYYY-MM-DD")).toBe("2026-07-01");
    expect(p3.vigencia?.[1].format("YYYY-MM-DD")).toBe("2028-07-01");
  });

  it("deixa vigencia indefinida quando faltam datas", () => {
    const p3 = detalheParaPasso3({
      ...detalhe,
      vigencia_inicio: null,
      vigencia_fim: null,
      data_prorrogacao: null,
    });
    expect(p3.vigencia).toBeUndefined();
    expect(p3.data_prorrogacao).toBeNull();
  });
});

describe("payloads parciais (PATCH por passo na edição)", () => {
  it("montarPayloadPasso1 recorta só os campos de identificação", () => {
    const payload = montarPayloadPasso1({
      nome: "Concurso 2026",
      cargos_ids: ["c1"],
      numero_processo: "123",
      banca_responsavel: "FGV",
      status: "INATIVO",
    });
    expect(payload).toEqual({
      nome: "Concurso 2026",
      cargos_ids: ["c1"],
      numero_processo: "123",
      banca_responsavel: "FGV",
      status: "INATIVO",
    });
  });

  it("montarPayloadPasso2 converte datas e recorta publicações", () => {
    const payload = montarPayloadPasso2({
      data_autorizacao: dayjs("2026-01-10"),
      classificacao_final: dayjs("2026-06-30"),
      data_abertura: dayjs("2026-02-15"),
      link_edital: "https://exemplo.gov.br/edital.pdf",
      habilitados_geral: 100,
      habilitados_nna: 20,
      habilitados_pcd: 5,
      retificacoes: "Ret.",
    });
    expect(payload).toEqual({
      data_autorizacao: "2026-01-10",
      data_abertura: "2026-02-15",
      classificacao_final: "2026-06-30",
      link_edital: "https://exemplo.gov.br/edital.pdf",
      habilitados_geral: 100,
      habilitados_nna: 20,
      habilitados_pcd: 5,
      retificacoes: "Ret.",
    });
  });

  it("montarPayloadPasso3 desmembra a vigência", () => {
    const payload = montarPayloadPasso3({
      data_homologacao: dayjs("2026-07-01"),
      data_prorrogacao: dayjs("2028-07-01"),
      vigencia: [dayjs("2026-07-01"), dayjs("2028-07-01")],
    });
    expect(payload).toEqual({
      data_homologacao: "2026-07-01",
      data_prorrogacao: "2028-07-01",
      vigencia_inicio: "2026-07-01",
      vigencia_fim: "2028-07-01",
    });
  });

  it("montarPayloadPasso3 trata vigência ausente como null", () => {
    const payload = montarPayloadPasso3({
      data_homologacao: undefined as never,
      vigencia: undefined as never,
    });
    expect(payload.vigencia_inicio).toBeNull();
    expect(payload.vigencia_fim).toBeNull();
    expect(payload.data_homologacao).toBeNull();
  });
});

describe("payloads do modo EM_ANDAMENTO (campos liberados)", () => {
  it("montarPayloadStatus envia apenas o status", () => {
    const payload = montarPayloadStatus({
      nome: "Concurso",
      cargos_ids: ["c1"],
      numero_processo: "123",
      banca_responsavel: "FGV",
      status: "INATIVO",
    });
    expect(payload).toEqual({ status: "INATIVO" });
  });

  it("montarPayloadVigenciaLiberada envia só prorrogação e vigência", () => {
    const payload = montarPayloadVigenciaLiberada({
      data_homologacao: dayjs("2026-07-01"),
      data_prorrogacao: dayjs("2028-07-01"),
      vigencia: [dayjs("2026-07-01"), dayjs("2028-07-01")],
    });
    expect(payload).toEqual({
      data_prorrogacao: "2028-07-01",
      vigencia_inicio: "2026-07-01",
      vigencia_fim: "2028-07-01",
    });

    expect("data_homologacao" in payload).toBe(false);
    expect("situacao" in payload).toBe(false);
  });

  it("montarPayloadVigenciaLiberada trata vigência ausente como null", () => {
    const payload = montarPayloadVigenciaLiberada({
      data_homologacao: undefined as never,
      data_prorrogacao: null,
      vigencia: undefined as never,
    });
    expect(payload.data_prorrogacao).toBeNull();
    expect(payload.vigencia_inicio).toBeNull();
    expect(payload.vigencia_fim).toBeNull();
  });
});
