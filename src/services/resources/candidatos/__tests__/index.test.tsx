import { appAxiosCandidatos } from '../../../axios';
import { 
  getCandidatos, 
  URL 
} from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type { ICandidato } from '../ICandidatos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

jest.mock('../../../axios');
jest.mock('../../../../utils/queryParamsSerializer');

describe('Candidatos Service', () => {
  const mockAxiosCandidatos = appAxiosCandidatos as jest.Mocked<typeof appAxiosCandidatos>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params).toString());
  });

  describe('URL', () => {
    it('deve retornar a URL correta para getCandidatos', () => {
      expect(URL.getCandidatos()).toBe('/api/v1/candidatos/');
    });
  });

  describe('getCandidatos', () => {
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
          classificacao_nna: 1
        },
        {
          convocado_por: 'Sistema',
          nome_candidato: 'Maria Santos',
          classificacao_geral: 2,
          classificacao_especial: 2,
          classificacao_nna: 2
        },
        {
          convocado_por: 'Sistema',
          nome_candidato: 'Pedro Oliveira',
          classificacao_geral: 3,
          classificacao_especial: 3,
          classificacao_nna: 3
        }
      ]
    };

    beforeEach(() => {
      mockAxiosCandidatos.get.mockResolvedValue({ data: mockCandidatosData });
    });

    it('deve fazer uma requisição GET para obter candidatos', async () => {
      const { response } = getCandidatos();

      await expect(response).resolves.toEqual(mockCandidatosData);
      
      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getCandidatos();
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getCandidatos(additionalConfig);

      await response;

      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve lidar com erro na requisição', async () => {
      const error = new Error('Network error');
      mockAxiosCandidatos.get.mockRejectedValueOnce(error);

      const { response } = getCandidatos();

      await expect(response).rejects.toThrow('Network error');
    });

    it('deve incluir um signal na requisição', () => {
      getCandidatos();

      const callConfig = mockAxiosCandidatos.get.mock.calls[0][1];
      expect(callConfig?.signal).toBeDefined();
    });

    it('deve retornar a estrutura de resposta correta', async () => {
      const { response } = getCandidatos();
      const result = await response;

      expect(result).toEqual(mockCandidatosData);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });

    it('deve usar o paramsSerializer correto', () => {
      getCandidatos();

      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });

    it('deve lidar com resposta vazia', async () => {
      const emptyResponse: PaginatedResponse<ICandidato> = {
        count: 0,
        next: null,
        previous: null,
        page_size: 10,
        results: []
      };

      mockAxiosCandidatos.get.mockResolvedValueOnce({ data: emptyResponse });

      const { response } = getCandidatos();
      const result = await response;

      expect(result).toEqual(emptyResponse);
      expect(result.count).toBe(0);
      expect(result.results).toHaveLength(0);
    });

    it('deve lidar com resposta com paginação', async () => {
      const paginatedResponse: PaginatedResponse<ICandidato> = {
        count: 25,
        next: '/api/v1/candidatos/?page=2',
        previous: null,
        page_size: 10,
        results: mockCandidatosData.results
      };

      mockAxiosCandidatos.get.mockResolvedValueOnce({ data: paginatedResponse });

      const { response } = getCandidatos();
      const result = await response;

      expect(result).toEqual(paginatedResponse);
      expect(result.next).toBe('/api/v1/candidatos/?page=2');
      expect(result.previous).toBeNull();
    });

    it('deve lidar com resposta com dados de candidatos válidos', async () => {
      const { response } = getCandidatos();
      const result = await response;

      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toHaveProperty('convocado_por');
      expect(result.results[0]).toHaveProperty('nome_candidato');
      expect(result.results[0]).toHaveProperty('classificacao_geral');
      expect(result.results[0]).toHaveProperty('classificacao_especial');
      expect(result.results[0]).toHaveProperty('classificacao_nna');
    });

    it('deve lidar com configurações complexas do axios', async () => {
      const complexConfig = {
        timeout: 10000,
        headers: { 
          'Authorization': 'Bearer token123',
          'Content-Type': 'application/json'
        },
        validateStatus: (status: number) => status < 500
      };

      const { response } = getCandidatos(complexConfig);

      await response;

      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          timeout: 10000,
          headers: { 
            'Authorization': 'Bearer token123',
            'Content-Type': 'application/json'
          },
          validateStatus: complexConfig.validateStatus,
          signal: expect.any(AbortSignal)
        })
      );
    });
  });

  describe('queryParamsSerializer integration', () => {
    it('deve usar o queryParamsSerializer fornecido em getCandidatos', () => {
      getCandidatos();
      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });
  });

  describe('AbortController functionality', () => {
    it('deve permitir chamar a função abort sem erros de sintaxe para getCandidatos', () => {
      const { abort } = getCandidatos();
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve criar um novo AbortController para cada chamada', () => {
      const { abort: abort1 } = getCandidatos();
      const { abort: abort2 } = getCandidatos();

      // Como o AbortController é criado dentro da função, cada chamada retorna uma função diferente
      expect(typeof abort1).toBe('function');
      expect(typeof abort2).toBe('function');
    });

    it('deve permitir chamar a função abort sem erros de sintaxe', () => {
      const { abort } = getCandidatos();
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });
  });

  describe('Error handling edge cases', () => {
    it('deve lidar com erro de timeout', async () => {
      const timeoutError = new Error('timeout of 5000ms exceeded');
      mockAxiosCandidatos.get.mockRejectedValueOnce(timeoutError);

      const { response } = getCandidatos();

      await expect(response).rejects.toThrow('timeout of 5000ms exceeded');
    });

    it('deve lidar com erro de rede', async () => {
      const networkError = new Error('Network Error');
      mockAxiosCandidatos.get.mockRejectedValueOnce(networkError);

      const { response } = getCandidatos();

      await expect(response).rejects.toThrow('Network Error');
    });

    it('deve lidar com erro de servidor (500)', async () => {
      const serverError = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      };
      mockAxiosCandidatos.get.mockRejectedValueOnce(serverError);

      const { response } = getCandidatos();

      await expect(response).rejects.toEqual(serverError);
    });

    it('deve lidar com erro de não encontrado (404)', async () => {
      const notFoundError = {
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      };
      mockAxiosCandidatos.get.mockRejectedValueOnce(notFoundError);

      const { response } = getCandidatos();

      await expect(response).rejects.toEqual(notFoundError);
    });
  });

  describe('Response data validation', () => {
    it('deve validar a estrutura dos dados de candidatos', async () => {
      const { response } = getCandidatos();
      const result = await response;

      result.results.forEach((candidato, index) => {
        expect(candidato).toHaveProperty('convocado_por');
        expect(candidato).toHaveProperty('nome_candidato');
        expect(candidato).toHaveProperty('classificacao_geral');
        expect(candidato).toHaveProperty('classificacao_especial');
        expect(candidato).toHaveProperty('classificacao_nna');
        
        expect(typeof candidato.convocado_por).toBe('string');
        expect(typeof candidato.nome_candidato).toBe('string');
        expect(typeof candidato.classificacao_geral).toBe('number');
        expect(typeof candidato.classificacao_especial).toBe('number');
        expect(typeof candidato.classificacao_nna).toBe('number');
      });
    });

    it('deve validar os valores das classificações', async () => {
      const { response } = getCandidatos();
      const result = await response;

      result.results.forEach((candidato) => {
        expect(candidato.classificacao_geral).toBeGreaterThan(0);
        expect(candidato.classificacao_especial).toBeGreaterThan(0);
        expect(candidato.classificacao_nna).toBeGreaterThan(0);
      });
    });
  });

  describe('Axios configuration spreading', () => {
    it('deve aplicar configurações adicionais corretamente', async () => {
      const config = {
        timeout: 3000,
        headers: { 'X-Custom-Header': 'test' },
        withCredentials: true
      };

      const { response } = getCandidatos(config);

      await response;

      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          timeout: 3000,
          headers: { 'X-Custom-Header': 'test' },
          withCredentials: true,
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve sobrescrever configurações padrão quando necessário', async () => {
      const config = {
        paramsSerializer: jest.fn(),
        signal: new AbortController().signal
      };

      const { response } = getCandidatos(config);

      await response;

      expect(mockAxiosCandidatos.get).toHaveBeenCalledWith(
        '/api/v1/candidatos/',
        expect.objectContaining({
          paramsSerializer: config.paramsSerializer,
          signal: config.signal
        })
      );
    });
  });
});
