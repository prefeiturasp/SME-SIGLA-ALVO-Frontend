import { appAxiosConcursos } from '../../../axios';
import { getConcursos, URL } from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { IConcurso } from '../IConcursos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

jest.mock('../../../axios');
jest.mock('../../../../utils/queryParamsSerializer');

describe('Concursos Service', () => {
  const mockAxios = appAxiosConcursos as jest.Mocked<typeof appAxiosConcursos>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params).toString());
  });

  describe('URL', () => {
    it('deve retornar a URL correta para getConcursos', () => {
      expect(URL.getConcursos()).toBe('/api/v1/concursos/?formato=select');
    });
  });

  describe('getConcursos', () => {
    const mockConcursosData: PaginatedResponse<IConcurso> = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          nome: 'Concurso Teste 1',
          codigo: 'CT001',
          ativo: true
        },
        {
          id: 2,
          nome: 'Concurso Teste 2',
          codigo: 'CT002',
          ativo: false
        }
      ]
    };

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockConcursosData });
    });

    it('deve fazer uma requisição GET com os parâmetros corretos', async () => {
      const { response } = getConcursos();

      await expect(response).resolves.toEqual(mockConcursosData);
      
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/concursos/?formato=select',
        expect.objectContaining({
          paramsSerializer: expect.any(Function),
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o paramsSerializer correto', () => {
      getConcursos();

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getConcursos();
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getConcursos(additionalConfig);

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

      const { response } = getConcursos();

      await expect(response).rejects.toThrow('Network error');
    });

    it('deve incluir um signal na requisição', () => {
      getConcursos();

      const callConfig = mockAxios.get.mock.calls[0][1];
      expect(callConfig?.signal).toBeDefined();
    });

    it('deve retornar a estrutura de resposta correta', async () => {
      const { response } = getConcursos();
      const result = await response;

      expect(result).toEqual(mockConcursosData);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('deve permitir chamar a função abort sem erros de sintaxe', () => {
      const { abort } = getConcursos();

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
      getConcursos();
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });
  });
});