import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostConcurso } from "../usePostConcurso";
import { usePatchConcurso } from "../usePatchConcurso";

const mockPostConcurso = jest.fn();
const mockPatchConcurso = jest.fn();
const mockNotification = { success: jest.fn(), error: jest.fn() };

jest.mock("../../../../../services", () => ({
  API: {
    Concursos: {
      postConcurso: (...args: unknown[]) => mockPostConcurso(...args),
      patchConcurso: (...args: unknown[]) => mockPatchConcurso(...args),
    },
  },
}));

jest.mock("antd", () => ({
  App: { useApp: () => ({ notification: mockNotification }) },
}));

const payload = {
  nome: "Concurso 2026",
  cargos_ids: ["11111111-1111-1111-1111-111111111111"],
  numero_processo: "6016202200779764",
  banca_responsavel: "FGV",
  status: "ATIVO" as const,
};

const criarWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = jest.spyOn(queryClient, "invalidateQueries");
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
};

const erroDuplicado = {
  response: {
    data: { numero_processo: ["Este número de processo já está cadastrado."] },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("usePostConcurso", () => {
  it("chama postConcurso com o payload, invalida cache e notifica sucesso", async () => {
    mockPostConcurso.mockReturnValue({ response: Promise.resolve({}) });
    const { wrapper, invalidateSpy } = criarWrapper();

    const { result } = renderHook(() => usePostConcurso(), { wrapper });
    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPostConcurso).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["listarConcursos"],
    });
    expect(mockNotification.success).toHaveBeenCalled();
  });

  it("notifica erro genérico no onError", async () => {
    mockPostConcurso.mockReturnValue({
      response: Promise.reject(new Error("500")),
    });
    const { wrapper } = criarWrapper();

    const { result } = renderHook(() => usePostConcurso(), { wrapper });
    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotification.error).toHaveBeenCalled();
  });

  it("não notifica erro quando o número de processo é duplicado", async () => {
    mockPostConcurso.mockReturnValue({
      response: Promise.reject(erroDuplicado),
    });
    const { wrapper } = criarWrapper();

    const { result } = renderHook(() => usePostConcurso(), { wrapper });
    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotification.error).not.toHaveBeenCalled();
  });
});

describe("usePatchConcurso", () => {
  const uuid = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

  it("chama patchConcurso com uuid/payload, invalida caches e notifica sucesso", async () => {
    mockPatchConcurso.mockReturnValue({ response: Promise.resolve({}) });
    const { wrapper, invalidateSpy } = criarWrapper();

    const { result } = renderHook(() => usePatchConcurso(), { wrapper });
    result.current.mutate({ uuid, payload });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockPatchConcurso).toHaveBeenCalledWith(uuid, payload);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["listarConcursos"],
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["getConcursoByUuid", uuid],
    });
    expect(mockNotification.success).toHaveBeenCalled();
  });

  it("notifica erro genérico no onError", async () => {
    mockPatchConcurso.mockReturnValue({
      response: Promise.reject(new Error("500")),
    });
    const { wrapper } = criarWrapper();

    const { result } = renderHook(() => usePatchConcurso(), { wrapper });
    result.current.mutate({ uuid, payload });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotification.error).toHaveBeenCalled();
  });

  it("não notifica erro quando o número de processo é duplicado", async () => {
    mockPatchConcurso.mockReturnValue({
      response: Promise.reject(erroDuplicado),
    });
    const { wrapper } = criarWrapper();

    const { result } = renderHook(() => usePatchConcurso(), { wrapper });
    result.current.mutate({ uuid, payload });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotification.error).not.toHaveBeenCalled();
  });
});
