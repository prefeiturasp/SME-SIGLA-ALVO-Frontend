import {
  consultarLotacao,
  excluirUnidade,
  lerDetalheEstatico,
  lerStatusSimuladoListagem,
  registrar,
  reiniciarModulosSalvos,
  salvarModulos,
  URL,
} from "../index";
import {
  dadosLotacaoConsultaSchema,
  detalheUnidadeSchema,
  LotacaoNaoEncontradaError,
  respostaRegistrarUnidadeSchema,
  UnidadeNaoEncontradaError,
} from "../tipos";
import {
  linhasUnidades,
  TOTAL_REGISTROS,
} from "@locus/paginas/GestaoUnidadesEducacionais/dados/dadosEstaticos";
import {
  historicoExemplo,
  professoresAfastadosPorComponente,
  professoresLotadosPorComponente,
} from "@locus/paginas/DetalheUnidadeEducacional/dados/dadosEstaticos";

describe("URL Registrar UE", () => {
  it("monta as rotas de consulta e registro", () => {
    expect(URL.consultarLotacao("123")).toBe(
      "/api/v1/unidades-educacionais/lotacao/123/",
    );
    expect(URL.registrar()).toBe("/api/v1/unidades-educacionais/");
  });
});

describe("dados estaticos da Gestao de UEs", () => {
  it("expoe a listagem e o total usados pela tela", () => {
    expect(linhasUnidades).toHaveLength(10);
    expect(TOTAL_REGISTROS).toBe(5985);
  });
});

describe("lerStatusSimuladoListagem", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("devolve comDados quando a URL nao traz o parametro status", () => {
    expect(lerStatusSimuladoListagem()).toBe("comDados");
  });

  it("devolve semCadastro quando status=1", () => {
    window.history.replaceState({}, "", "/?status=1");

    expect(lerStatusSimuladoListagem()).toBe("semCadastro");
  });

  it("devolve semResultado quando status=2", () => {
    window.history.replaceState({}, "", "/?status=2");

    expect(lerStatusSimuladoListagem()).toBe("semResultado");
  });

  it("devolve comDados para valores de status desconhecidos", () => {
    window.history.replaceState({}, "", "/?status=99");

    expect(lerStatusSimuladoListagem()).toBe("comDados");
  });

  it("ignora o status quando convive com outros parametros", () => {
    window.history.replaceState({}, "", "/?erro=1&status=2&pagina=3");

    expect(lerStatusSimuladoListagem()).toBe("semResultado");
  });
});

describe("consultarLotacao (padrao Alvo)", () => {
  it("retorna { response, abort } com dados mockados", async () => {
    const { response, abort } = consultarLotacao("123");
    const dados = await response;

    expect(typeof abort).toBe("function");
    expect(() => dadosLotacaoConsultaSchema.parse(dados)).not.toThrow();
    expect(dados).toEqual({
      codigoLotacao: "123",
      tipoUnidade: "EMEF",
      dre: "itaquera",
      nome: "EMEF Prof. Maria da Silva",
    });
  });

  it("rejeita codigo inexistente com LotacaoNaoEncontradaError", async () => {
    const { response } = consultarLotacao("999");
    await expect(response).rejects.toBeInstanceOf(LotacaoNaoEncontradaError);
  });
});

describe("registrar (padrao Alvo)", () => {
  const payloadValido = {
    codigoLotacao: "123",
    tipoUnidade: "EMEF",
    dre: "itaquera",
    nome: "EMEF Prof. Maria da Silva",
    escolaMunicipalizada: false,
    ensinoFundamentalI: false,
    ejaModular: false,
    saoPauloIntegral: false,
    contabilizarUE: true,
    componentes: [{ componente: "Arte", quantidadeModulos: 10 }],
  };

  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  it("retorna { response, abort } apos validar payload", async () => {
    const { response, abort } = registrar(payloadValido);
    const dados = await response;

    expect(typeof abort).toBe("function");
    expect(() => respostaRegistrarUnidadeSchema.parse(dados)).not.toThrow();
    expect(dados.sucesso).toBe(true);
  });

  it("rejeita quando a URL tem ?erro=1 (demo do toast de erro)", async () => {
    window.history.replaceState({}, "", "/?erro=1");

    const { response } = registrar(payloadValido);
    await expect(response).rejects.toThrow("Erro simulado no registro da UE");
  });
});

describe("detalhe da unidade educacional", () => {
  beforeEach(() => reiniciarModulosSalvos());

  it("le um detalhe valido pelo codigo de lotacao", () => {
    const detalhe = lerDetalheEstatico("091488");

    expect(() => detalheUnidadeSchema.parse(detalhe)).not.toThrow();
    expect(detalhe?.nome).toBe("Cidade Tiradentes");
    expect(detalhe?.componentes).toHaveLength(22);
  });

  it("devolve undefined para codigo inexistente", () => {
    expect(lerDetalheEstatico("999999")).toBeUndefined();
  });

  it("persiste os modulos salvos e recalcula as vagas", async () => {
    const arteAntes = lerDetalheEstatico("091488")?.componentes.find(
      (c) => c.id === "arte",
    );
    expect(arteAntes).toMatchObject({ modulo: 3, saldoVagas: -2 });

    await salvarModulos({
      codigoLotacao: "091488",
      alteracoes: [{ componenteId: "arte", modulo: 6 }],
    }).response;

    const arteDepois = lerDetalheEstatico("091488")?.componentes.find(
      (c) => c.id === "arte",
    );
    expect(arteDepois).toMatchObject({ modulo: 6, saldoVagas: 1 });
  });

  it("nao aplica os modulos salvos quando lido sem edicoes (versao historica)", async () => {
    await salvarModulos({
      codigoLotacao: "091488",
      alteracoes: [{ componenteId: "arte", modulo: 6 }],
    }).response;

    const versao = lerDetalheEstatico("091488", { comEdicoesSalvas: false });

    expect(versao?.componentes.find((c) => c.id === "arte")?.modulo).toBe(3);
  });

  it("recusa payload de salvamento sem alteracoes", () => {
    expect(() =>
      salvarModulos({ codigoLotacao: "091488", alteracoes: [] }),
    ).toThrow();
  });

  it("exclui uma unidade existente e rejeita uma inexistente", async () => {
    const { response, abort } = excluirUnidade("091488");
    expect(typeof abort).toBe("function");
    await expect(response).resolves.toMatchObject({ sucesso: true });

    await expect(excluirUnidade("999999").response).rejects.toBeInstanceOf(
      UnidadeNaoEncontradaError,
    );
  });

  it("expoe professores lotados, afastados e o historico estaticos", () => {
    expect(professoresLotadosPorComponente.arte?.[0]).toMatchObject({
      nome: "João da Silva",
    });
    expect(professoresAfastadosPorComponente.biologia).toHaveLength(2);
    expect(historicoExemplo).toHaveLength(3);
  });
});
