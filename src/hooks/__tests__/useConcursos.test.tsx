import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useConcursos } from '../useConcursos';

jest.mock('../../services', () => ({
  API: {
    Concursos: {
      getConcursos: jest.fn(() => ({ response: Promise.resolve({ results: [{ value: 'c1', label: 'Concurso 1' }] }) })),
    },
  },
}));

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useConcursos', () => {
  it('retorna concursosData e concursosOptionsIsLoading', async () => {
    const { result } = renderHook(() => useConcursos(), { wrapper });

    expect(result.current.concursosOptionsIsLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.concursosOptionsIsLoading).toBe(false);
    });

    expect(Array.isArray(result.current.concursosData)).toBe(false);
  });
}); 