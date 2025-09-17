import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCandidatos } from '../useCandidatos';


jest.mock('../../services', () => ({
  API: {
    Candidatos: {
      getCandidatos: jest.fn(() => ({ response: Promise.resolve({ results: [] }) })),
    },
  },
}));

const setupWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper };
};

describe('useCandidatos', () => {
  beforeEach(() => {
    const { API } = require('../../services');
    (API.Candidatos.getCandidatos as jest.Mock).mockClear();
  });

  it('não busca quando disabled (buscarCandidatos=false)', async () => {
    const { API } = require('../../services');
    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useCandidatos(false), { wrapper });

    expect(result.current.candidatosIsLoading).toBe(false);
    expect(API.Candidatos.getCandidatos).not.toHaveBeenCalled();
  });

  it('busca quando enabled (buscarCandidatos=true)', async () => {
    const { API } = require('../../services');
    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useCandidatos(true), { wrapper });

    expect(result.current.candidatosIsLoading).toBe(true);
    await waitFor(() => {
      expect(result.current.candidatosIsLoading).toBe(false);
    });
    expect(API.Candidatos.getCandidatos).toHaveBeenCalled();
  });
});
