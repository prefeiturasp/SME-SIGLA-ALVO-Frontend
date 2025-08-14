import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useProcessosConvocacao } from "./useProcessosConvocacao";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe("useProcessosConvocacao", () => {
  it("deve funcionar com contexto de QueryClient", async () => {
    const { result } = renderHook(() => useProcessosConvocacao(), { wrapper });

    await waitFor(() => {
      expect(result.current.processosConvocacaoData).toBeDefined();
    });
  });
});
