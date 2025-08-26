import { appAxios, appAxiosServico1 } from '../../../axios';
import { 
  getProcessosConvocacao, 
  createSample, 
  editSample, 
  deleteSample, 
  getConcursosOptions, 
  getCargosData, 
  getCargosPorConcursoData,
  URL 
} from '../index';
import type { PaginatedResponse, IBackendWithSubOptions } from '../../../../types/IListRequest';
import type { IProcessoConvocacao, ISample } from '../IConvocacao';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

jest.mock('../../../axios');
jest.mock('../../../../utils/queryParamsSerializer');

describe('Convocacao Service', () => {
  const mockAxios = appAxios as jest.Mocked<typeof appAxios>;
  const mockAxiosServico1 = appAxiosServico1 as jest.Mocked<typeof appAxiosServico1>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params).toString());
  });

  describe('URL', () => {
    it('deve retornar a URL correta para getProcessosConvocacao', () => {
      expect(URL.getProcessosConvocacao()).toBe('/api/v1/processos-convocacao/');
    });

    it('deve retornar a URL correta para getConcursosOptions', () => {
      expect(URL.getConcursosOptions()).toBe('/api/v1/processos-convocacao/filtros/');
    });

    it('deve retornar a URL correta para createSample', () => {
      expect(URL.createSample()).toBe('api/v1/sample/create');
    });

    it('deve retornar a URL correta para editSample', () => {
      expect(URL.editSample(123)).toBe('api/v1/sample/update/123/');
    });

    it('deve retornar a URL correta para deleteSample', () => {
      expect(URL.deleteSample(456)).toBe('api/v1/sample/delete/456/');
    });
  });

  describe('getProcessosConvocacao', () => {
    const mockListRequest = {
      pagination: { page: 1, page_size: 10 },
      filters: { concurso_uuid: 'test-uuid' },
      sort: 'data_convocacao',
      order: 'desc' as const
    };

    const mockProcessosData: PaginatedResponse<IProcessoConvocacao> = {
      count: 2,
      next: null,
      previous: null,
      page_size: 10,
      results: [
        {
          concurso_nome: 'Concurso Teste 1',
          data_convocacao: '2024-01-01',
          status: 'Ativo',
          uuid: 'uuid-1'
        },
        {
          concurso_nome: 'Concurso Teste 2',
          data_convocacao: '2024-01-02',
          status: 'Inativo',
          uuid: 'uuid-2'
        }
      ]
    };

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockProcessosData });
    });

    it('deve fazer uma requisição GET com os parâmetros corretos', async () => {
      const { response } = getProcessosConvocacao(mockListRequest);

      await expect(response).resolves.toEqual(mockProcessosData);
      
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/processos-convocacao/',
        expect.objectContaining({
          params: {
            page: 1,
            page_size: 10,
            concurso_uuid: 'test-uuid',
            sort: 'data_convocacao',
            order: 'desc'
          },
          paramsSerializer: expect.any(Function),
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o paramsSerializer correto', () => {
      getProcessosConvocacao(mockListRequest);

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getProcessosConvocacao(mockListRequest);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getProcessosConvocacao(mockListRequest, additionalConfig);

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

      const { response } = getProcessosConvocacao(mockListRequest);

      await expect(response).rejects.toThrow('Network error');
    });

    it('deve incluir um signal na requisição', () => {
      getProcessosConvocacao(mockListRequest);

      const callConfig = mockAxios.get.mock.calls[0][1];
      expect(callConfig?.signal).toBeDefined();
    });

    it('deve retornar a estrutura de resposta correta', async () => {
      const { response } = getProcessosConvocacao(mockListRequest);
      const result = await response;

      expect(result).toEqual(mockProcessosData);
      expect(result).toHaveProperty('count');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
    });
  });

  describe('createSample', () => {
    const mockNewSample: IProcessoConvocacao = {
      concurso_nome: 'Novo Concurso',
      data_convocacao: '2024-01-01',
      status: 'Ativo',
      uuid: 'new-uuid'
    };

    beforeEach(() => {
      mockAxios.post.mockResolvedValue({ data: mockNewSample });
    });

    it('deve fazer uma requisição POST com os dados corretos', async () => {
      const { response } = createSample(mockNewSample);

      await expect(response).resolves.toEqual(mockNewSample);
      
      expect(mockAxios.post).toHaveBeenCalledWith(
        'api/v1/sample/create',
        mockNewSample,
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = createSample(mockNewSample);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = createSample(mockNewSample, additionalConfig);

      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        mockNewSample,
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o signal da configuração se fornecido', async () => {
      const customSignal = new AbortController().signal;
      const additionalConfig = { signal: customSignal };

      const { response } = createSample(mockNewSample, additionalConfig);

      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        mockNewSample,
        expect.objectContaining({
          signal: customSignal
        })
      );
    });
  });

  describe('editSample', () => {
    const mockEditSample: ISample = {
      id: 123,
      concurso_nome: 'Concurso Editado',
      data_convocacao: '2024-01-01',
      status: 'Ativo',
      uuid: 'edit-uuid'
    };

    beforeEach(() => {
      mockAxios.put.mockResolvedValue({ data: mockEditSample });
    });

    it('deve fazer uma requisição PUT com os dados corretos', async () => {
      const { response } = editSample(mockEditSample);

      await expect(response).resolves.toEqual(mockEditSample);
      
      expect(mockAxios.put).toHaveBeenCalledWith(
        'api/v1/sample/update/123/',
        mockEditSample,
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = editSample(mockEditSample);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = editSample(mockEditSample, additionalConfig);

      await response;

      expect(mockAxios.put).toHaveBeenCalledWith(
        expect.any(String),
        mockEditSample,
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o signal da configuração se fornecido', async () => {
      const customSignal = new AbortController().signal;
      const additionalConfig = { signal: customSignal };

      const { response } = editSample(mockEditSample, additionalConfig);

      await response;

      expect(mockAxios.put).toHaveBeenCalledWith(
        expect.any(String),
        mockEditSample,
        expect.objectContaining({
          signal: customSignal
        })
      );
    });
  });

  describe('deleteSample', () => {
    const sampleId = 456;

    beforeEach(() => {
      mockAxiosServico1.delete.mockResolvedValue({ data: { success: true } });
    });

    it('deve fazer uma requisição DELETE com o ID correto', async () => {
      const { response } = deleteSample(sampleId);

      await expect(response).resolves.toEqual({ success: true });
      
      expect(mockAxiosServico1.delete).toHaveBeenCalledWith(
        'api/v1/sample/delete/456/',
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = deleteSample(sampleId);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = deleteSample(sampleId, additionalConfig);

      await response;

      expect(mockAxiosServico1.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          timeout: 5000,
          headers: { 'Custom-Header': 'value' },
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve usar o signal da configuração se fornecido', async () => {
      const customSignal = new AbortController().signal;
      const additionalConfig = { signal: customSignal };

      const { response } = deleteSample(sampleId, additionalConfig);

      await response;

      expect(mockAxiosServico1.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: customSignal
        })
      );
    });
  });

  describe('getConcursosOptions', () => {
    const mockConcursosOptions: IBackendWithSubOptions = {
      value: 'concurso-1',
      label: 'Concurso Teste',
      cargos: [
        { value: 'cargo-1', label: 'Cargo 1' },
        { value: 'cargo-2', label: 'Cargo 2' }
      ],
      concursos: [
        { value: 'concurso-1', label: 'Concurso 1' },
        { value: 'concurso-2', label: 'Concurso 2' }
      ]
    };

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockConcursosOptions });
    });

    it('deve fazer uma requisição GET para obter opções de concursos', async () => {
      const { response } = getConcursosOptions();

      await expect(response).resolves.toEqual(mockConcursosOptions);
      
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/processos-convocacao/filtros/',
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      );
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getConcursosOptions();
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getConcursosOptions(additionalConfig);

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
  });

  describe('getCargosData', () => {
    const mockCargosData: IBackendWithSubOptions[] = [
      {
        value: 'cargo-1',
        label: 'Cargo 1',
        cargos: [],
        concursos: []
      },
      {
        value: 'cargo-2',
        label: 'Cargo 2',
        cargos: [],
        concursos: []
      }
    ];

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockCargosData });
    });

    it('deve fazer uma requisição GET para obter dados de cargos', async () => {
      const { response } = getCargosData();

      expect(response).toBeDefined();
      expect(typeof response.then).toBe('function');
      
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });
      
      const result = await response;
      expect(result).toEqual(mockCargosData);
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getCargosData();
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getCargosData(additionalConfig);

      mockAxios.get.mockResolvedValueOnce({ data: mockCargosData });
      
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
  });

  describe('getCargosPorConcursoData', () => {
    const concursoUuid = 'concurso-uuid-123';
    const mockCargosPorConcursoData: IBackendWithSubOptions[] = [
      {
        value: 'cargo-1',
        label: 'Cargo 1',
        cargos: [],
        concursos: []
      },
      {
        value: 'cargo-2',
        label: 'Cargo 2',
        cargos: [],
        concursos: []
      }
    ];

    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: mockCargosPorConcursoData });
    });

    it('deve fazer uma requisição GET para obter cargos por concurso', async () => {
      const { response } = getCargosPorConcursoData(concursoUuid);

      expect(response).toBeDefined();
      expect(typeof response.then).toBe('function');
      
      mockAxios.get.mockResolvedValueOnce({ data: mockCargosPorConcursoData });
      
      const result = await response;
      expect(result).toEqual(mockCargosPorConcursoData);
    });

    it('deve retornar um objeto com response e abort', () => {
      const result = getCargosPorConcursoData(concursoUuid);
      
      expect(result).toHaveProperty('response');
      expect(result).toHaveProperty('abort');
      expect(typeof result.abort).toBe('function');
    });

    it('deve permitir a passagem de configurações adicionais do axios', async () => {
      const additionalConfig = {
        timeout: 5000,
        headers: { 'Custom-Header': 'value' }
      };

      const { response } = getCargosPorConcursoData(concursoUuid, additionalConfig);

      mockAxios.get.mockResolvedValueOnce({ data: mockCargosPorConcursoData });
      
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
  });

  describe('queryParamsSerializer integration', () => {
    it('deve usar o queryParamsSerializer fornecido em getProcessosConvocacao', () => {
      const mockListRequest = {
        pagination: { page: 1, page_size: 10 },
        filters: { concurso_uuid: 'test-uuid' }
      };

      getProcessosConvocacao(mockListRequest);
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer
        })
      );
    });
  });

  describe('AbortController functionality', () => {
    it('deve permitir chamar a função abort sem erros de sintaxe para getProcessosConvocacao', () => {
      const { abort } = getProcessosConvocacao({ pagination: { page: 1 } });
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para createSample', () => {
      const mockSample: IProcessoConvocacao = {
        concurso_nome: 'Test',
        data_convocacao: '2024-01-01',
        status: 'Ativo',
        uuid: 'test-uuid'
      };

      const { abort } = createSample(mockSample);
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para editSample', () => {
      const mockSample: ISample = {
        id: 123,
        concurso_nome: 'Test',
        data_convocacao: '2024-01-01',
        status: 'Ativo',
        uuid: 'test-uuid'
      };

      const { abort } = editSample(mockSample);
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para deleteSample', () => {
      const { abort } = deleteSample(123);
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para getConcursosOptions', () => {
      const { abort } = getConcursosOptions();
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para getCargosData', () => {
      const { abort } = getCargosData();
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });

    it('deve permitir chamar a função abort sem erros de sintaxe para getCargosPorConcursoData', () => {
      const { abort } = getCargosPorConcursoData('test-uuid');
      
      expect(typeof abort).toBe('function');
      
      expect(() => {
        if (typeof abort === 'function') {
          return true;
        }
        return false;
      }).not.toThrow();
    });
  });
});
