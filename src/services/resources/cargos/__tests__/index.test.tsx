jest.mock('../../../axios', () => ({
  appAxiosConcursos: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosConcursos } from '../../../axios';
import {
  getCargosAutorizacoesPublicadas,
  getAutorizacoesPublicadasPorCargo,
  postAutorizacaoPublicada,
  patchAutorizacaoPublicada,
  deleteAutorizacaoPublicada,
  URL
} from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { ICargos } from '../ICargos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('Cargos Service', () => {
  const mockAxios = appAxiosConcursos as jest.Mocked<typeof appAxiosConcursos>;
  const mockParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  const mockCargosData: PaginatedResponse<ICargos> = {
    count: 2,
    next: null,
    previous: null,
    page_size: 10,
    results: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('retorna URL correta para getCargosAutorizacoesPublicadas', () => {
      expect(URL.getCargosAutorizacoesPublicadas()).toBe('/api/v1/cargos/autorizacoes-publicadas/');
    });

    it('retorna URL correta para endpoints de autorizações publicadas', () => {
      expect(URL.getAutorizacoesPublicadasPorCargo('cargo-1')).toBe('/api/v1/autorizacoes-publicadas/?cargo__uuid=cargo-1');
      expect(URL.postAutorizacaoPublicada()).toBe('/api/v1/autorizacoes-publicadas/');
      expect(URL.patchAutorizacaoPublicada('aut-1')).toBe('/api/v1/autorizacoes-publicadas/aut-1/');
      expect(URL.deleteAutorizacaoPublicada('aut-1')).toBe('/api/v1/autorizacoes-publicadas/aut-1/');
    });
  });

  describe('getCargosAutorizacoesPublicadas', () => {
    it('faz GET sem parâmetros e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });

      const { response, abort } = getCargosAutorizacoesPublicadas();

      await expect(response).resolves.toEqual(mockCargosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCargosAutorizacoesPublicadas(),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });

      const { response } = getCargosAutorizacoesPublicadas(axiosConfig);

      await expect(response).resolves.toEqual(mockCargosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCargosAutorizacoesPublicadas(),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });

      const { abort } = getCargosAutorizacoesPublicadas();
      expect(typeof abort).toBe('function');
    });
  });

  describe('autorizacoes publicadas CRUD', () => {
    it('getAutorizacoesPublicadasPorCargo faz GET por cargo', async () => {
      const data = { count: 1, results: [{ uuid: 'aut-1' }] };
      mockAxios.get.mockResolvedValueOnce({ data });

      const { response, abort } = getAutorizacoesPublicadasPorCargo('cargo-1');
      await expect(response).resolves.toEqual(data);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAutorizacoesPublicadasPorCargo('cargo-1'),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(typeof abort).toBe('function');
    });

    it('postAutorizacaoPublicada faz POST com payload', async () => {
      const payload = { cargo_uuid: 'cargo-1', quantidade: 2 };
      const data = { uuid: 'aut-2' };
      mockAxios.post.mockResolvedValueOnce({ data });

      const { response } = postAutorizacaoPublicada(payload, { timeout: 2000 });
      await expect(response).resolves.toEqual(data);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postAutorizacaoPublicada(),
        payload,
        expect.objectContaining({
          timeout: 2000,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('patchAutorizacaoPublicada faz PATCH com uuid', async () => {
      const payload = { quantidade: 3 };
      const data = { uuid: 'aut-1', quantidade: 3 };
      mockAxios.patch.mockResolvedValueOnce({ data });

      const { response } = patchAutorizacaoPublicada('aut-1', payload);
      await expect(response).resolves.toEqual(data);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchAutorizacaoPublicada('aut-1'),
        payload,
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('deleteAutorizacaoPublicada faz DELETE com uuid', async () => {
      const data = { success: true };
      mockAxios.delete.mockResolvedValueOnce({ data });

      const { response } = deleteAutorizacaoPublicada('aut-1');
      await expect(response).resolves.toEqual(data);
      expect(mockAxios.delete).toHaveBeenCalledWith(
        URL.deleteAutorizacaoPublicada('aut-1'),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });
  });
});
