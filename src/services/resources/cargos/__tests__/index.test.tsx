jest.mock('../../../axios', () => ({
  appAxiosConcursos: {
    get: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosConcursos } from '../../../axios';
import { getCargosAutorizacoesPublicadas, URL } from '../index';
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
});
