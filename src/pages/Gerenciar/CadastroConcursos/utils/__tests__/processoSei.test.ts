import { apenasDigitos } from "../processoSei";

describe("apenasDigitos", () => {
  it("remove letras e mantém apenas os dígitos", () => {
    expect(apenasDigitos("abc123def456")).toBe("123456");
  });

  it("remove símbolos, espaços e pontuação", () => {
    expect(apenasDigitos("6016.2022/00779764 - 7")).toBe("60162022007797647");
  });

  it("mantém intacta uma string já numérica", () => {
    expect(apenasDigitos("6016202200779764")).toBe("6016202200779764");
  });

  it("retorna string vazia para entrada sem dígitos", () => {
    expect(apenasDigitos("abc-/.")).toBe("");
  });

  it("retorna string vazia para entrada vazia", () => {
    expect(apenasDigitos("")).toBe("");
  });
});
