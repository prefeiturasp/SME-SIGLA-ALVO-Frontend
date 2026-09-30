import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { IHistoricoCandidatosItem } from "../../../../services/resources/convocacao/IConvocacao";
import { API } from "../../../../services";
import {
  mapearHistoricoCandidatos,
  useHistoricoCandidatos,
} from "../useHistoricoCandidatos";
import { usePostHistoricoCandidatos } from "../usePostHistoricoCandidatos";

jest.mock("../../../../services", () => ({
  API: {
    Convocacao: {
      postHistoricoCandidatos: jest.fn(),
    },
  },
}));

const contagem = { total: 10, geral: 6, pcd: 2, nna: 2 };

const itemApi: IHistoricoCandidatosItem = {
  descricao: "Convocação A",
  data_convocacao: "2025-03-10",
  candidatos: contagem,
  escolha: contagem,
  "nao-escolha": contagem,
  reconvocacao: contagem,
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe("mapearHistoricoCandidatos", () => {
  it("mapeia itens da API para linhas da tabela", () => {
    const linhas = mapearHistoricoCandidatos([itemApi]);

    expect(linhas).toHaveLength(1);
    expect(linhas[0]).toMatchObject({
      descricao: "Convocação A",
      data: "10/03/2025",
      convocados: contagem,
      escolhas: contagem,
      naoEscolhas: contagem,
      reconvocacao: contagem,
    });
    expect(linhas[0].key).toContain("Convocação A");
  });
});

describe("usePostHistoricoCandidatos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não dispara request quando a lista de uuids está vazia", () => {
    const { result } = renderHook(() => usePostHistoricoCandidatos([]), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(API.Convocacao.postHistoricoCandidatos).not.toHaveBeenCalled();
  });

  it("busca histórico ordenando e filtrando uuids", async () => {
    (API.Convocacao.postHistoricoCandidatos as jest.Mock).mockReturnValue({
      response: Promise.resolve([itemApi]),
      abort: jest.fn(),
    });

    const { result } = renderHook(
      () => usePostHistoricoCandidatos(["uuid-b", "", "uuid-a"]),
      { wrapper: createWrapper() },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(API.Convocacao.postHistoricoCandidatos).toHaveBeenCalledWith(
      { processos_uuids: ["uuid-a", "uuid-b"] },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(result.current.data).toEqual([itemApi]);
  });
});

describe("useHistoricoCandidatos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retorna linhas mapeadas quando a API responde", async () => {
    (API.Convocacao.postHistoricoCandidatos as jest.Mock).mockReturnValue({
      response: Promise.resolve([itemApi]),
      abort: jest.fn(),
    });

    const { result } = renderHook(() => useHistoricoCandidatos(["uuid-1"]), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.carregando).toBe(false);
    });

    expect(result.current.linhas).toHaveLength(1);
    expect(result.current.linhas[0].descricao).toBe("Convocação A");
    expect(result.current.erro).toBeNull();
  });

  it("retorna lista vazia quando não há dados", async () => {
    const { result } = renderHook(() => useHistoricoCandidatos([]), {
      wrapper: createWrapper(),
    });

    expect(result.current.linhas).toEqual([]);
    expect(result.current.carregando).toBe(false);
  });
});
