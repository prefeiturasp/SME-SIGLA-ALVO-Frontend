jest.mock('../../../axios', () => ({
  appAxiosConcursos: {
    get: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosConcursos } from '../../../axios';
import { getCargos, URL } from '../index';
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
    results: [
      {
        label: 'Cargo 1',
        value: 'cargo-uuid-1',
        cargos: [
          { label: 'Subcargo 1.1', value: 'subcargo-uuid-1.1' },
          { label: 'Subcargo 1.2', value: 'subcargo-uuid-1.2' },
        ],
      },
      {
        label: 'Cargo 2',
        value: 'cargo-uuid-2',
        cargos: [
          { label: 'Subcargo 2.1', value: 'subcargo-uuid-2.1' },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('retorna URL correta para getCargos', () => {
      expect(URL.getCargos()).toBe('/api/v1/cargos/?formato=select');
    });
  });

  describe('getCargos', () => {
    it('faz GET sem parâmetros e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });

      const { response, abort } = getCargos();

      await expect(response).resolves.toEqual(mockCargosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCargos(),
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

      const { response } = getCargos(axiosConfig);

      await expect(response).resolves.toEqual(mockCargosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCargos(),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });

      const { abort } = getCargos();
      expect(typeof abort).toBe('function');
    });
  });
});

