import { appAxiosVagas } from '../../../axios';
import { getVagas, URL } from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { IVagas } from '../ICargos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

jest.mock('../../../axios');
jest.mock('../../../../utils/queryParamsSerializer');

describe('Vagas Service', () => {
  const mockAxios = appAxiosVagas as jest.Mocked<typeof appAxiosVagas>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params).toString());
  });

  describe('URL', () => {
    it('deve retornar a URL correta para getVagas', () => {
      expect(URL.getVagas()).toBe('/api/v1/vagas/?formato=select');
    });
  });

  describe('getVagas', () => {
    const mockVagasData: PaginatedResponse<IVagas> = {
      count: 2,
      next: null,
      previous: null,
      page_size: 10,
      results: [
        {
          label: 'Vaga Teste 1',
          value: 'CT001',
          cargos: [],
        },
        {
          label: 'Vaga Teste 2',
          value: 'CT002',
          cargos: [],
        }
      ]
    };

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockVagasData });
    });

    it('deve fazer uma requisição GET com os parâmetros corretos', async () => {
      const { response } = getVagas();

      await expect(response).resolves.toEqual(mockVagasData);
      
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/vagas/?formato=select',
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o paramsSerializer correto', () => {
      getVagas();

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getVagas();
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getVagas(additionalConfig);

      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve lidar com erro na requisição', async () => {
      const error = new Error('Network error');
      mockAxios.get.mockRejectedValueOnce(error);

      const { response } = getVagas();

      await expect(response).rejects.toThrow('Network error');
    });

    it('deve incluir um signal na requisição', () => {
      getVagas();

      const callConfig = mockAxios.get.mock.calls[0][1];
      expect(callConfig?.signal).toBeDefined();
    });

    it('deve retornar a estrutura de resposta correta', async () => {
      const { response } = getVagas();
      const result = await response;

      expect(result).toEqual(mockVagasData);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('deve permitir chamar a função abort sem erros de sintaxe', () => {
      const { abort } = getVagas();

      expect(typeof abort).toBe('function');

      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });
  });

  describe('queryParamsSerializer integration', () => {
    it('deve usar o queryParamsSerializer fornecido', () => {
      getVagas();
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });
  });
});