import {
  ehErroNumeroProcessoDuplicado,
  obterMensagemNumeroProcessoDuplicado,
} from "../erroConcurso";

const erroComCampo = (data: Record<string, unknown>) => ({
  response: { data },
});

describe("obterMensagemNumeroProcessoDuplicado", () => {
  it("retorna a primeira mensagem quando numero_processo tem strings", () => {
    const erro = erroComCampo({
      numero_processo: [
        "Este número de processo já está cadastrado.",
        "Outra mensagem.",
      ],
    });

    expect(obterMensagemNumeroProcessoDuplicado(erro)).toBe(
      "Este número de processo já está cadastrado."
    );
  });

  it("retorna undefined quando o campo numero_processo está ausente", () => {
    const erro = erroComCampo({ nome: ["obrigatório"] });

    expect(obterMensagemNumeroProcessoDuplicado(erro)).toBeUndefined();
  });

  it("retorna undefined quando não há response.data", () => {
    expect(obterMensagemNumeroProcessoDuplicado({})).toBeUndefined();
  });

  it("retorna undefined quando o erro é null", () => {
    expect(obterMensagemNumeroProcessoDuplicado(null)).toBeUndefined();
  });

  it("retorna undefined quando o campo não é array de strings", () => {
    const erro = erroComCampo({ numero_processo: [123] });

    expect(obterMensagemNumeroProcessoDuplicado(erro)).toBeUndefined();
  });

  it("retorna undefined quando o campo é array vazio", () => {
    const erro = erroComCampo({ numero_processo: [] });

    expect(obterMensagemNumeroProcessoDuplicado(erro)).toBeUndefined();
  });
});

describe("ehErroNumeroProcessoDuplicado", () => {
  it("retorna true quando há mensagem de numero_processo", () => {
    const erro = erroComCampo({ numero_processo: ["duplicado"] });

    expect(ehErroNumeroProcessoDuplicado(erro)).toBe(true);
  });

  it("retorna false quando não há mensagem de numero_processo", () => {
    const erro = erroComCampo({ nome: ["obrigatório"] });

    expect(ehErroNumeroProcessoDuplicado(erro)).toBe(false);
  });

  it("retorna false para erro arbitrário", () => {
    expect(ehErroNumeroProcessoDuplicado(new Error("boom"))).toBe(false);
  });
});
