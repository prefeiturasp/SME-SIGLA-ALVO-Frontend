import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProcessosConvocacao } from '../hooks/useProcessosConvocacao';

// Mock services API
jest.mock('../../../../services', () => ({
  API: {
    Convocacao: {
      getConcursosOptions: jest.fn(() => ({ response: Promise.resolve({ concursos: [], cargos: [] }) })),
      getProcessosConvocacao: jest.fn(() => ({ response: Promise.resolve({ results: [{ id: 1 }], count: 1 }) })),
    },
  },
}));

// Mock useListRequest and expose its internals for assertions
jest.mock('../../../../hooks/useListRequest', () => {
  const setListRequest = jest.fn();
  const onAntTableChange = jest.fn();
  const listRequest = { pagination: { page: 1, page_size: 10 } };

  const removeUndefinedFields = (obj: Record<string, any>) => {
    const result: Record<string, any> = {};
    Object.keys(obj || {}).forEach((k) => {
      const v = (obj as any)[k];
      if (v !== undefined && v !== '') result[k] = v;
    });
    return result;
  };

  return {
    __esModule: true,
    default: () => ({ listRequest, setListRequest, onAntTableChange }),
    removeUndefinedFields,
    __mock: { setListRequest, onAntTableChange, listRequest },
  };
});

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

describe('useProcessosConvocacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('executa queries e expõe dados e estados de loading', async () => {
    const { result } = renderHook(() => useProcessosConvocacao(), { wrapper });

    await waitFor(() => {
      expect(result.current.concursosOptionsIsLoading).toBe(false);
      expect(result.current.processosConvocacaoIsLoading).toBe(false);
    });

    expect(result.current.concursosOptions).toBeDefined();
    expect(result.current.processosConvocacaoData?.results?.length).toBe(1);
  });

  it('handleSub atualiza listRequest com page 1 e filters sem undefined', async () => {
    const { result } = renderHook(() => useProcessosConvocacao(), { wrapper });
    const { __mock } = require('../../../../hooks/useListRequest');

    // dados com valor definido e undefined
    const payload = { data_convocacao_inicio: '', data_convocacao_fim: '2025-03-10' } as any;

    await result.current.handleSub(payload);

    expect(__mock.setListRequest).toHaveBeenCalled();
    const updater = __mock.setListRequest.mock.calls[0][0];
    const prev = { pagination: { page: 2, page_size: 10 } };
    const next = updater(prev);

    expect(next.page).toBe(1);
    expect(next.filters).toEqual({ data_convocacao_fim: '2025-03-10' });
  });

  it('handleReset reseta form e chama handleSub com valores padrões', async () => {
    const { result } = renderHook(() => useProcessosConvocacao(), { wrapper });
    const { __mock } = require('../../../../hooks/useListRequest');

    await result.current.handleReset();

    expect(__mock.setListRequest).toHaveBeenCalled();
    const updater = __mock.setListRequest.mock.calls[0][0];
    const prev = { pagination: { page: 2, page_size: 10 } };
    const next = updater(prev);

    expect(next.page).toBe(1);
    expect(next.filters).toEqual({});
  });
}); 