import { renderHook, act } from '@testing-library/react';
import { useGetVagasPorProcessoECargo } from '../useGetVagasPorProcessoECargo';

const mockUseQuery = jest.fn();
const mockUseListRequest = jest.fn();
const mockGetVagasEscolas = jest.fn();
const mockRefetch = jest.fn();

jest.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock('../../../../../hooks/useListRequest', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseListRequest(...args),
}));

jest.mock('../../../../../services', () => ({
  API: {
    Escolhas: {
      getVagasEscolas: (...args: unknown[]) => mockGetVagasEscolas(...args),
    },
  },
}));

describe('useGetVagasPorProcessoECargo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseListRequest.mockReturnValue({
      listRequest: { pagination: { page: 1, page_size: 10 } },
    });
    mockRefetch.mockResolvedValue(undefined);
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      refetch: mockRefetch,
    });
  });

  it('configura useQuery com queryKey, enabled e retry corretos', () => {
    renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', true));

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['getVagasPorProcessoECargo', 'proc-1', 'C001'],
        enabled: true,
        retry: 0,
      })
    );
  });

  it('executa queryFn e chama API com payload/listRequest/signal', async () => {
    renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', true));
    const callArg = mockUseQuery.mock.calls[0][0];

    mockGetVagasEscolas.mockReturnValueOnce({ response: Promise.resolve({ total_vagas: 7 }) });
    await callArg.queryFn({ signal: 'mock-signal' });

    expect(mockGetVagasEscolas).toHaveBeenCalledWith(
      { processo_uuid: 'proc-1', cargo_codigo: 'C001' },
      { pagination: { page: 1, page_size: 10 } },
      { signal: 'mock-signal' }
    );
  });

  it('retorna totalVagas de vagasData quando existir', () => {
    mockUseQuery.mockReturnValueOnce({
      data: { total_vagas: 12 },
      isLoading: false,
      refetch: mockRefetch,
    });

    const { result } = renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', true));
    expect(result.current.totalVagas).toBe(12);
    expect(result.current.vagasIsLoading).toBe(false);
  });

  it('retorna totalVagas = 0 quando vagasData não existir', () => {
    const { result } = renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', true));
    expect(result.current.totalVagas).toBe(0);
  });

  it('buscarVagas chama refetch quando processoUuid e cargoCodigo existem', () => {
    const { result } = renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', true));
    act(() => {
      result.current.buscarVagas();
    });
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('buscarVagas não chama refetch quando faltar processoUuid ou cargoCodigo', () => {
    const { result: noProcess } = renderHook(() => useGetVagasPorProcessoECargo(undefined, 'C001', true));
    act(() => {
      noProcess.current.buscarVagas();
    });

    const { result: noCargo } = renderHook(() => useGetVagasPorProcessoECargo('proc-1', undefined, true));
    act(() => {
      noCargo.current.buscarVagas();
    });

    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('mantém enabled false quando flag enabled for false', () => {
    renderHook(() => useGetVagasPorProcessoECargo('proc-1', 'C001', false));
    expect(mockUseQuery).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });
});
