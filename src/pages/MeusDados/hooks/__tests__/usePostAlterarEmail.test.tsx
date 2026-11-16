import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';

jest.mock('../../../../services/resources/usuarios', () => ({
  postAlterarEmail: jest.fn(),
}));

import { useAlterarEmail } from '../usePostAlterarEmail';
import { postAlterarEmail } from '../../../../services/resources/usuarios';

const mockPostAlterarEmail = postAlterarEmail as jest.MockedFunction<typeof postAlterarEmail>;

const mockNotification = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

jest.spyOn(App, 'useApp').mockReturnValue({
  message: {} as any,
  notification: mockNotification as any,
  modal: {} as any,
});

const setupWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { wrapper, invalidateSpy };
};

describe('useAlterarEmail', () => {
  const payload = { novo_email: 'novo@email.com' };

  beforeEach(() => {
    jest.clearAllMocks();
    Object.values(mockNotification).forEach((fn) => fn.mockClear());
  });

  it('chama postAlterarEmail, invalida queries e exibe notificação de sucesso', async () => {
    mockPostAlterarEmail.mockReturnValue({
      response: Promise.resolve({ detail: 'E-mail alterado' }),
      abort: jest.fn(),
    } as any);

    const { wrapper, invalidateSpy } = setupWrapper();
    const { result } = renderHook(() => useAlterarEmail(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPostAlterarEmail).toHaveBeenCalledWith(payload);
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['meus-dados'] });
    expect(mockNotification.success).toHaveBeenCalledWith({
      message: 'E-mail Alterado',
      description: 'O e-mail foi alterado com sucesso!',
      placement: 'top',
      duration: 3.5,
    });
  });

  it('exibe notificação de erro com mensagem do campo novo_email quando disponível', async () => {
    const mockError = {
      response: { data: { novo_email: ['Este e-mail já está em uso.'] } },
    };
    mockPostAlterarEmail.mockReturnValue({
      response: Promise.reject(mockError),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarEmail(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockNotification.error).toHaveBeenCalledWith({
      message: 'Erro ao alterar e-mail',
      description: 'Este e-mail já está em uso.',
      placement: 'top',
      duration: 3.5,
    });
  });

  it('exibe notificação de erro com detail quando não há erro de campo', async () => {
    const mockError = {
      response: { data: { detail: 'Erro do servidor.' } },
    };
    mockPostAlterarEmail.mockReturnValue({
      response: Promise.reject(mockError),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarEmail(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockNotification.error).toHaveBeenCalledWith({
      message: 'Erro ao alterar e-mail',
      description: 'Erro do servidor.',
      placement: 'top',
      duration: 3.5,
    });
  });

  it('exibe mensagem padrão quando o erro não traz dados específicos', async () => {
    mockPostAlterarEmail.mockReturnValue({
      response: Promise.reject({}),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarEmail(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockNotification.error).toHaveBeenCalledWith({
      message: 'Erro ao alterar e-mail',
      description: 'Erro ao alterar o e-mail. Tente novamente.',
      placement: 'top',
      duration: 3.5,
    });
  });

  it('ignora novo_email no payload quando o array está vazio', async () => {
    const mockError = {
      response: { data: { novo_email: [], detail: 'Detalhe fallback.' } },
    };
    mockPostAlterarEmail.mockReturnValue({
      response: Promise.reject(mockError),
      abort: jest.fn(),
    } as any);

    const { wrapper } = setupWrapper();
    const { result } = renderHook(() => useAlterarEmail(), { wrapper });

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mockNotification.error).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'Detalhe fallback.' }),
    );
  });
});
