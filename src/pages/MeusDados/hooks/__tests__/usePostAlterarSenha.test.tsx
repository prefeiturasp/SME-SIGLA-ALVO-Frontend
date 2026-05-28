import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock('../../../../services/resources/usuarios', () => ({
  postAlterarSenha: jest.fn(),
}));

import { useAlterarSenha } from '../usePostAlterarSenha';
import { postAlterarSenha } from '../../../../services/resources/usuarios';

const mockPostAlterarSenha = postAlterarSenha as jest.MockedFunction<typeof postAlterarSenha>;

const setupWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper };
};

describe('useAlterarSenha', () => {
  const payload = {
    senha_atual: 'AtualSenha1!',
    nova_senha: 'NovaSenha1!',
    confirmacao_nova_senha: 'NovaSenha1!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('chama postAlterarSenha com payload e resolve em sucesso', async () => {
    mockPostAlterarSenha.mockReturnValue({
      response: Promise.resolve({ detail: 'Senha alterada' }),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarSenha(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPostAlterarSenha).toHaveBeenCalledWith(payload);
    expect(result.current.data).toEqual({ detail: 'Senha alterada' });
  });

  it('expõe erro quando a API rejeita', async () => {
    const mockError = new Error('Senha atual incorreta.');
    mockPostAlterarSenha.mockReturnValue({
      response: Promise.reject(mockError),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarSenha(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(mockError);
  });
});
