import { usePostAutorizacaoPublicada } from "../../hooks/usePostAutorizacaoPublicada";

jest.mock("../../../../services", () => {
  return {
    API: {
      Cargos: {
        postAutorizacaoPublicada: jest.fn(),
      },
    },
  };
});

const { API } = require("../../../../services");

describe("hooks/usePostAutorizacaoPublicada (async)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sucesso", async () => {
    (API.Cargos.postAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.resolve({ ok: true }),
      abort: () => {},
    });
    const res = await usePostAutorizacaoPublicada({ any: "payload" });
    expect((res as any).ok).toBe(true);
  });

  it("erro", async () => {
    (API.Cargos.postAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.reject(new Error("fail")),
      abort: () => {},
    });
    const res = await usePostAutorizacaoPublicada({ any: "payload" });
    expect((res as any).message).toBeDefined();
  });
});

