import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

jest.mock('../../../../services/resources/usuarios', () => ({
  getMeusDados: jest.fn(),
  postAlterarSenha: jest.fn(),
}));

import { getMeusDados, postAlterarSenha } from '../../../../services/resources/usuarios';
import { useGetMeusDados } from '../useGetMeusDados';
import { useAlterarSenha } from '../useAlterarSenha';

const mockGetMeusDados = getMeusDados as jest.MockedFunction<typeof getMeusDados>;
const mockPostAlterarSenha = postAlterarSenha as jest.MockedFunction<typeof postAlterarSenha>;

const createWrapper = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetMeusDados', () => {
  it('retorna dados quando a requisição é bem-sucedida', async () => {
    const dados = { rf: '123', nome_completo: 'João', email: 'j@sp.gov.br', perfil_acesso: [] };
    mockGetMeusDados.mockReturnValue({ response: Promise.resolve(dados), abort: jest.fn() });

    const { result } = renderHook(() => useGetMeusDados(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(dados);
  });

  it('entra em estado de erro quando a requisição falha', async () => {
    mockGetMeusDados.mockReturnValue({
      response: Promise.reject(new Error('Network Error')),
      abort: jest.fn(),
    });

    const { result } = renderHook(() => useGetMeusDados(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useAlterarSenha', () => {
  it('expõe a função mutate e isPending', () => {
    mockPostAlterarSenha.mockReturnValue({ response: Promise.resolve({ detail: 'ok' }), abort: jest.fn() });

    const { result } = renderHook(() => useAlterarSenha(), { wrapper: createWrapper() });

    expect(typeof result.current.mutate).toBe('function');
    expect(result.current.isPending).toBe(false);
  });

  it('executa a mutação e retorna sucesso', async () => {
    const payload = { senha_atual: 'a', nova_senha: 'b', confirmacao_nova_senha: 'b' };
    mockPostAlterarSenha.mockReturnValue({ response: Promise.resolve({ detail: 'Senha alterada com sucesso' }), abort: jest.fn() });

    const { result } = renderHook(() => useAlterarSenha(), { wrapper: createWrapper() });

    result.current.mutate(payload);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ detail: 'Senha alterada com sucesso' });
  });
});
