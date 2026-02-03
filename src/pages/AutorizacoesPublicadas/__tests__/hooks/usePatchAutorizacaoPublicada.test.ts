import { usePatchAutorizacaoPublicada } from "../../hooks/usePatchAutorizacaoPublicada";

jest.mock("../../../../services", () => {
  return {
    API: {
      Cargos: {
        patchAutorizacaoPublicada: jest.fn(),
      },
    },
  };
});

const { API } = require("../../../../services");

describe("hooks/usePatchAutorizacaoPublicada (async)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sucesso", async () => {
    (API.Cargos.patchAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.resolve({ uuid: "x1" }),
      abort: () => {},
    });
    const res = await usePatchAutorizacaoPublicada("x1", { a: 1 });
    expect((res as any).uuid).toBe("x1");
  });

  it("erro", async () => {
    (API.Cargos.patchAutorizacaoPublicada as jest.Mock).mockReturnValue({
      response: Promise.reject(new Error("fail")),
      abort: () => {},
    });
    const res = await usePatchAutorizacaoPublicada("x1", { a: 1 });
    expect((res as any).message).toBeDefined();
  });
});

