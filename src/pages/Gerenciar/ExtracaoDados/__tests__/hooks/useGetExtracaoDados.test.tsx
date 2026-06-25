import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetExtracaoDados } from "../../hooks/useGetExtracaoDados";
import { extracaoDadosFiltradoMock } from "../../testFixtures/extracaoDadosFixtures";

jest.mock("../../../../../services", () => ({
  API: {
    Relatorios: {
      getExtracaoDados: jest.fn(),
    },
  },
}));

import { API } from "../../../../../services";

const mockGetExtracaoDados = API.Relatorios.getExtracaoDados as jest.Mock;

const setupWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper };
};

describe("useGetExtracaoDados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("não busca dados quando enabled é false", async () => {
    const { wrapper } = setupWrapper();
    const { result } = renderHook(
      () => useGetExtracaoDados("uuid-concurso-1", ["2024"], false),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.extracaoDadosIsLoading).toBe(false);
    });

    expect(mockGetExtracaoDados).not.toHaveBeenCalled();
    expect(result.current.extracaoDados).toBeUndefined();
  });

  it("busca dados filtrados quando enabled é true", async () => {
    mockGetExtracaoDados.mockReturnValue({
      response: Promise.resolve(extracaoDadosFiltradoMock),
      abort: jest.fn(),
    });

    const { wrapper } = setupWrapper();
    const { result } = renderHook(
      () => useGetExtracaoDados("uuid-concurso-1", ["2024"], true),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.extracaoDadosIsLoading).toBe(false);
    });

    expect(mockGetExtracaoDados).toHaveBeenCalledWith(
      { concurso_uuid: "uuid-concurso-1", ano: ["2024"] },
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(result.current.extracaoDados).toEqual(extracaoDadosFiltradoMock);
  });
});
