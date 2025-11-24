jest.mock('../../../axios', () => ({
  appAxiosEscolhas: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosEscolhas } from '../../../axios';
import { getVagasEscolas, URL } from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { IVagasResponse } from '../../../resources/convocacao/IConvocacao';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('Escolhas Service', () => {
  const mockAxios = appAxiosEscolhas as jest.Mocked<typeof appAxiosEscolhas>;
  const mockParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  const mockVagasData: IVagasResponse = {
    count: 3,
    next: null,
    previous: null,
    page_size: 10,
    results: [
      {
        convocado_por: 'Sistema',
        nome_candidato: 'João Silva',
        classificacao_geral: 1,
        classificacao_especial: 1,
        classificacao_nna: 1,
      },
      {
        convocado_por: 'Sistema',
        nome_candidato: 'Maria Santos',
        classificacao_geral: 2,
        classificacao_especial: 2,
        classificacao_nna: 2,
      },
      {
        convocado_por: 'Sistema',
        nome_candidato: 'Pedro Oliveira',
        classificacao_geral: 3,
        classificacao_especial: 3,
        classificacao_nna: 3,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('retorna a URL correta', () => {
      expect(URL.getVagasEscolas()).toBe('/api/v1/vagas-escolas/');
    });
  });

  describe('getVagasEscolas', () => {
    it('faz GET e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });
      const params = { cargo: 'cargo1', concurso: 'conc1' };
      const listRequest = { pagination: { page: 1, page_size: 10 }, filters: {} };

      const { response } = getVagasEscolas(params, listRequest);

      await expect(response).resolves.toEqual(mockVagasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/vagas-escolas/',
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('mescla configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });
      const params = { cargo: 'cargo1', concurso: 'conc1' };
      const listRequest = { pagination: { page: 1, page_size: 10 }, filters: {} };
      const config = { timeout: 5000, headers: { 'X-Test': '1' } };

      const { response } = getVagasEscolas(params, listRequest, config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/vagas-escolas/',
        expect.objectContaining({
          timeout: 5000,
          headers: { 'X-Test': '1' },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('propaga erros da requisição', async () => {
      const error = new Error('Network error');
      const params = { cargo: 'cargo1', concurso: 'conc1' };
      const listRequest = { pagination: { page: 1, page_size: 10 }, filters: {} };
      mockAxios.get.mockRejectedValueOnce(error);

      const { response } = getVagasEscolas(params, listRequest);
      await expect(response).rejects.toThrow('Network error');
    });
  });

  describe('AbortController', () => {
    it('expõe uma função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });
      const params = { cargo: 'cargo1', concurso: 'conc1' };
      const listRequest = { pagination: { page: 1, page_size: 10 }, filters: {} };
      
      const { abort } = getVagasEscolas(params, listRequest);
      expect(typeof abort).toBe('function');
      expect(() => {
        if (typeof abort === 'function') return true;
        return false;
      }).not.toThrow();
    });
  });
});
