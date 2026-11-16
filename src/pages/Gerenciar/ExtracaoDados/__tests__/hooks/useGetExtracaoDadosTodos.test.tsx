import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetExtracaoDadosTodos } from "../../hooks/useGetExtracaoDadosTodos";
import { extracaoDadosTodosMock } from "../../testFixtures/extracaoDadosFixtures";

jest.mock("../../../../../services", () => ({
  API: {
    Relatorios: {
      getExtracaoDadosTodos: jest.fn(),
    },
  },
}));

import { API } from "../../../../../services";

const mockGetExtracaoDadosTodos = API.Relatorios.getExtracaoDadosTodos as jest.Mock;

const setupWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper };
};

describe("useGetExtracaoDadosTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("busca e retorna os dados consolidados", async () => {
    mockGetExtracaoDadosTodos.mockReturnValue({
      response: Promise.resolve(extracaoDadosTodosMock),
      abort: jest.fn(),
    });

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useGetExtracaoDadosTodos(), { wrapper });

    await waitFor(() => {
      expect(result.current.extracaoDadosTodosIsLoading).toBe(false);
    });

    expect(result.current.extracaoDadosTodos).toEqual(extracaoDadosTodosMock);
    expect(mockGetExtracaoDadosTodos).toHaveBeenCalled();
  });
});
