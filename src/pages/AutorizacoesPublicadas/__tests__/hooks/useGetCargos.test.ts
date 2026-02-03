import { useGetCargosAutorizacoesPublicadas, useGetAutorizacoesPublicadasPorCargo } from "../../hooks/useGetCargos";

jest.mock("../../../../services", () => {
  return {
    API: {
      Cargos: {
        getCargosAutorizacoesPublicadas: jest.fn(),
        getAutorizacoesPublicadasPorCargo: jest.fn(),
      },
    },
  };
});

const { API } = require("../../../../services");

describe("hooks/useGetCargos* (async functions)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("useGetCargosAutorizacoesPublicadas - sucesso", async () => {
    (API.Cargos.getCargosAutorizacoesPublicadas as jest.Mock).mockReturnValue({
      response: Promise.resolve([{ uuid: "1" }]),
      abort: () => {},
    });
    const data = await useGetCargosAutorizacoesPublicadas();
    expect(Array.isArray(data as any)).toBe(true);
  });

  it("useGetCargosAutorizacoesPublicadas - erro", async () => {
    (API.Cargos.getCargosAutorizacoesPublicadas as jest.Mock).mockReturnValue({
      response: Promise.reject(new Error("fail")),
      abort: () => {},
    });
    const data = await useGetCargosAutorizacoesPublicadas();
    expect((data as any).message).toBeDefined();
  });

  it("useGetAutorizacoesPublicadasPorCargo - sucesso", async () => {
    (API.Cargos.getAutorizacoesPublicadasPorCargo as jest.Mock).mockReturnValue({
      response: Promise.resolve({ results: [{ uuid: "a1" }] }),
      abort: () => {},
    });
    const data = await useGetAutorizacoesPublicadasPorCargo("cargo-1");
    expect((data as any).results).toBeDefined();
  });

  it("useGetAutorizacoesPublicadasPorCargo - erro", async () => {
    (API.Cargos.getAutorizacoesPublicadasPorCargo as jest.Mock).mockReturnValue({
      response: Promise.reject(new Error("fail")),
      abort: () => {},
    });
    const data = await useGetAutorizacoesPublicadasPorCargo("cargo-1");
    expect((data as any).message).toBeDefined();
  });
});

