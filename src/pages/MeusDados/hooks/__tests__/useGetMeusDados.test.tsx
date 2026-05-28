import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../services/resources/usuarios', () => ({
  getMeusDados: jest.fn(),
}));

import { useGetMeusDados } from '../useGetMeusDados';
import { getMeusDados } from '../../../../services/resources/usuarios';

const mockGetMeusDados = getMeusDados as jest.MockedFunction<typeof getMeusDados>;

const setupWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper };
};

describe('useGetMeusDados', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama getMeusDados e retorna os dados em caso de sucesso', async () => {
    const mockData = {
      nome_completo: 'João da Silva',
      rf: '1234567',
      email: 'joao@example.com',
      perfil_acesso: ['Administrador'],
    };

    mockGetMeusDados.mockReturnValue({
      response: Promise.resolve(mockData),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useGetMeusDados(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(mockGetMeusDados).toHaveBeenCalled();
  });

  it('retorna erro quando getMeusDados rejeita', async () => {
    const mockError = new Error('Falha de rede');
    mockGetMeusDados.mockReturnValue({
      response: Promise.reject(mockError),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useGetMeusDados(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });
});
