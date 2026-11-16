import { useDeleteAutorizacaoPublicada } from "../../hooks/useDeleteAutorizacaoPublicada";

jest.mock("../../../../../services", () => {
  return {
    API: {
      Cargos: {
        deleteAutorizacaoPublicada: jest.fn(),
      },
    },
  };
});

const { API } = require("../../../../../services");

describe("hooks/useDeleteAutorizacaoPublicada (async)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sucesso", async () => {
    (API.Cargos.deleteAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.resolve({ ok: true }),
      abort: () => {},
    });
    const res = await useDeleteAutorizacaoPublicada("x1");
    expect((res as any).ok).toBe(true);
  });

  it("erro", async () => {
    (API.Cargos.deleteAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.reject(new Error("fail")),
      abort: () => {},
    });
    const res = await useDeleteAutorizacaoPublicada("x1");
    expect((res as any).message).toBeDefined();
  });
});

