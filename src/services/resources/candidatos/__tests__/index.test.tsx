import { appAxiosCandidatos } from '../../../axios';
import { getCandidatos, URL } from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { ICandidato } from '../ICandidatos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

jest.mock('../../../axios');
jest.mock('../../../../utils/queryParamsSerializer');

describe('Candidatos Service', () => {
  const mockAxios = appAxiosCandidatos as jest.Mocked<typeof appAxiosCandidatos>;
  const mockParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  const mockCandidatosData: PaginatedResponse<ICandidato> = {
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
      expect(URL.getCandidatos()).toBe('/api/v1/candidatos/');
    });
  });

  describe('getCandidatos', () => {
    it('faz GET e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });

      const { response } = getCandidatos();

      await expect(response).resolves.toEqual(mockCandidatosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('mescla configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });
      const config = { timeout: 5000, headers: { 'X-Test': '1' } };

      const { response } = getCandidatos(config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          timeout: 5000,
          headers: { 'X-Test': '1' },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('propaga erros da requisição', async () => {
      const error = new Error('Network error');
      mockAxios.get.mockRejectedValueOnce(error);

      const { response } = getCandidatos();
      await expect(response).rejects.toThrow('Network error');
    });
  });

  describe('AbortController', () => {
    it('expõe uma função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });
      
      const { abort } = getCandidatos();
      expect(typeof abort).toBe('function');
      expect(() => {
        if (typeof abort === 'function') return true;
        return false;
      }).not.toThrow();
    });
  });
});
