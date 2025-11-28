import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useLayoutDownload } from '../useLayoutDownload';

// Mock do API.ImportacaoDados.getLayoutDownload
const mockGetLayoutDownload = jest.fn();
jest.mock('../../services', () => ({
  API: {
    ImportacaoDados: {
      getLayoutDownload: (...args: any[]) => mockGetLayoutDownload(...args),
    },
  },
}));

// Helper para criar wrapper com QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe('useLayoutDownload', () => {
  let mockCreateObjectURL: jest.Mock;
  let mockRevokeObjectURL: jest.Mock;
  let mockClick: jest.Mock;
  let mockRemove: jest.Mock;
  let mockAppendChild: jest.Mock;
  let createElementSpy: jest.SpyInstance;
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Salva a implementação original antes de criar o spy
    originalCreateElement = document.createElement.bind(document);
    
    // Mock do URL
    mockCreateObjectURL = jest.fn(() => 'blob:http://localhost/test');
    mockRevokeObjectURL = jest.fn();
    
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
      writable: true,
      configurable: true,
    });

    // Mock do anchor element
    mockClick = jest.fn();
    mockRemove = jest.fn();
    mockAppendChild = jest.fn();

    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        Object.defineProperty(element, 'click', { value: mockClick, writable: true, configurable: true });
        Object.defineProperty(element, 'remove', { value: mockRemove, writable: true, configurable: true });
      }
      return element;
    });

    jest.spyOn(document.body, 'appendChild').mockImplementation((node: Node) => {
      mockAppendChild(node);
      return node;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Retorno do hook', () => {
    it('deve retornar handleBaixarArquivo e isDownloading', () => {
      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('handleBaixarArquivo');
      expect(result.current).toHaveProperty('isDownloading');
      expect(typeof result.current.handleBaixarArquivo).toBe('function');
      expect(typeof result.current.isDownloading).toBe('boolean');
    });

    it('deve inicializar isDownloading como false', () => {
      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isDownloading).toBe(false);
    });
  });

  describe('handleBaixarArquivo', () => {
    it('deve baixar arquivo com sucesso', async () => {
      const mockBlob = new Blob(['conteudo'], { type: 'text/csv' });
      mockGetLayoutDownload.mockResolvedValue({
        response: Promise.resolve(mockBlob),
      });

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('vagas');
      });

      await waitFor(() => {
        expect(mockGetLayoutDownload).toHaveBeenCalledWith({ tipo: 'vagas' });
      });

      expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
      expect(mockAppendChild).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRemove).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test');
    });

    it('deve criar link de download com nome correto', async () => {
      const mockBlob = new Blob(['conteudo'], { type: 'text/csv' });
      mockGetLayoutDownload.mockResolvedValue({
        response: Promise.resolve(mockBlob),
      });

      const anchors: HTMLAnchorElement[] = [];
      createElementSpy.mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          Object.defineProperty(element, 'click', { value: mockClick, writable: true, configurable: true });
          Object.defineProperty(element, 'remove', { value: mockRemove, writable: true, configurable: true });
          anchors.push(element as HTMLAnchorElement);
        }
        return element;
      });

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('habilitados');
      });

      await waitFor(() => {
        expect(anchors.length).toBeGreaterThan(0);
      });

      const lastAnchor = anchors[anchors.length - 1];
      expect(lastAnchor.download).toBe('layout_habilitados.csv');
      expect(lastAnchor.href).toBe('blob:http://localhost/test');
    });

    it('não deve fazer download quando response é null', async () => {
      mockGetLayoutDownload.mockResolvedValue({
        response: Promise.resolve(null),
      });

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('vagas');
      });

      await waitFor(() => {
        expect(mockGetLayoutDownload).toHaveBeenCalled();
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('não deve fazer download quando response é undefined', async () => {
      mockGetLayoutDownload.mockResolvedValue({
        response: Promise.resolve(undefined),
      });

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('vagas');
      });

      await waitFor(() => {
        expect(mockGetLayoutDownload).toHaveBeenCalled();
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();
    });

    it('deve tratar erro ao baixar arquivo', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Erro ao baixar');
      
      mockGetLayoutDownload.mockRejectedValue(error);

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('vagas');
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Falha ao salvar arquivo:', error);
      });

      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      expect(mockClick).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('onError da mutation', () => {
    it('deve chamar console.error quando mutation falha', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('Erro na mutation');
      
      mockGetLayoutDownload.mockRejectedValue(error);

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('vagas');
      });

      await waitFor(() => {
        const errorCalls = consoleErrorSpy.mock.calls.filter(
          call => call[0] === 'Erro ao baixar layout:' || call[0] === 'Falha ao salvar arquivo:'
        );
        expect(errorCalls.length).toBeGreaterThan(0);
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('mutationFn', () => {
    it('deve chamar getLayoutDownload com tipo correto', async () => {
      const mockBlob = new Blob(['conteudo'], { type: 'text/csv' });
      mockGetLayoutDownload.mockResolvedValue({
        response: Promise.resolve(mockBlob),
      });

      const { result } = renderHook(() => useLayoutDownload(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.handleBaixarArquivo('teste');
      });

      await waitFor(() => {
        expect(mockGetLayoutDownload).toHaveBeenCalledWith({ tipo: 'teste' });
      });
    });
  });
});
