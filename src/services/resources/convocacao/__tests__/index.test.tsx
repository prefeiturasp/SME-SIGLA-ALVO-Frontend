jest.mock('../../../axios', () => ({
  appAxiosProcessoConvocacao: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosProcessoConvocacao } from '../../../axios';
import {
  getProcessosConvocacao,
  getProcessoConvocacaoPorUUID,
  postProcessoConvocacao,
  patchProcessoConvocacao,
  getProcessoConvocacaoById,
  createSample,
  editSample,
  deleteSample,
  getConcursosOptions,
  getProcessosConvocacaoOptions,
  getCargosData,
  getCargosPorConcursoData,
  getCargosProcesso,
  postCargosProcesso,
  patchCargoProcesso,
  deleteCargoProcesso,
  URL,
} from '../index';
import type {
  PaginatedResponse,
  IBackendWithSubOptions,
} from '../../../../types/IListRequest';
import type {
  IProcessoConvocacao,
  ISample,
  IPostProcessoConvocacaoPayload,
  IProcessoConvocacaoResumo,
  ICargoProcesso,
} from '../IConvocacao';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('Convocacao Service', () => {
  const mockAxios = appAxiosProcessoConvocacao as jest.Mocked<typeof appAxiosProcessoConvocacao>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('exibe URLs corretas para todas as rotas', () => {
      expect(URL.getProcessosConvocacao()).toBe('/api/v1/processos-convocacao/');
      expect(URL.getProcessoConvocacaoPorUUID('uuid-123')).toBe(
        '/api/v1/processos-convocacao/uuid-123/'
      );
      expect(URL.getConcursosOptions()).toBe(
        '/api/v1/processos-convocacao/filtros/'
      );
      expect(URL.postProcessoConvocacao()).toBe(
        '/api/v1/processos-convocacao/'
      );
      expect(URL.patchProcessoConvocacao('uuid-123')).toBe(
        '/api/v1/processos-convocacao/uuid-123/'
      );
      expect(URL.getProcessoConvocacaoById('uuid-123')).toBe(
        '/api/v1/processos-convocacao/uuid-123/'
      );
      expect(URL.getProcessosConvocacaoOptions()).toBe(
        '/api/v1/processos-convocacao/?formato=select'
      );
      expect(URL.getCargos()).toBe('/api/v1/cargos/');
      expect(URL.getCargosPorConcurso('uuid-123')).toBe(
        '/api/v1/cargos/concurso/uuid-123/'
      );
      expect(URL.getCargosProcesso('proc-uuid')).toBe(
        '/api/v1/processos-convocacao/proc-uuid/cargos/'
      );
      expect(URL.postCargosProcesso('proc-uuid')).toBe(
        '/api/v1/processos-convocacao/proc-uuid/cargos/'
      );
      expect(URL.patchCargoProcesso('proc-uuid', 'cargo-uuid')).toBe(
        '/api/v1/processos-convocacao/proc-uuid/cargos/cargo-uuid/'
      );
      expect(URL.deleteCargoProcesso('proc-uuid', 'cargo-uuid')).toBe(
        '/api/v1/processos-convocacao/proc-uuid/cargos/cargo-uuid/'
      );
      expect(URL.createSample()).toBe('/api/v1/samples/');
      expect(URL.editSample(123)).toBe('/api/v1/samples/123/');
      expect(URL.deleteSample(456)).toBe('/api/v1/samples/456/');
    });
  });

  describe('GET processos', () => {
    const listReq = { pagination: { page: 1, page_size: 10 }, filters: { concurso_uuid: 'uuid' } } as const;
    const data: PaginatedResponse<IProcessoConvocacao> = {
      count: 1, next: null, previous: null, page_size: 10,
      results: [{ concurso_nome: 'Concurso', data_convocacao: '2024-01-01', status: 'Ativo', uuid: 'u1' }],
    };

    it('sucesso e paramsSerializer', async () => {
      mockAxios.get.mockResolvedValueOnce({ data });
      const { response } = getProcessosConvocacao(listReq);
      await expect(response).resolves.toEqual(data);
      expect(mockAxios.get).toHaveBeenCalledWith(
        '/api/v1/processos-convocacao/',
        expect.objectContaining({ params: expect.any(Object), paramsSerializer: queryParamsSerializer, signal: expect.any(AbortSignal) }),
      );
    });

    it('merge de config adicional', async () => {
      mockAxios.get.mockResolvedValueOnce({ data });
      const { response } = getProcessosConvocacao(listReq, { timeout: 5000 });
      await response;
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ timeout: 5000, signal: expect.any(AbortSignal) }),
      );
    });

    it('erro é propagado', async () => {
      const err = new Error('Network');
      mockAxios.get.mockRejectedValueOnce(err);
      const { response } = getProcessosConvocacao(listReq);
      await expect(response).rejects.toThrow('Network');
    });
  });

  describe('CRUD sample', () => {
    const sample: IProcessoConvocacao = { concurso_nome: 'X', data_convocacao: '2024-01-01', status: 'Ativo', uuid: 'id' };

    it('createSample', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: sample });
      const { response } = createSample(sample);
      await expect(response).resolves.toEqual(sample);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.createSample(),
        sample,
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('editSample', async () => {
      const editable: ISample = { ...sample, id: 7 } as ISample;
      mockAxios.put.mockResolvedValueOnce({ data: editable });
      const { response } = editSample(editable);
      await expect(response).resolves.toEqual(editable);
      expect(mockAxios.put).toHaveBeenCalledWith(
        URL.editSample(7),
        editable,
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('deleteSample', async () => {
      mockAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
      const { response } = deleteSample(9);
      await response;
      expect(mockAxios.delete).toHaveBeenCalledWith(
        URL.deleteSample(9),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });
  });

  describe('Concursos/Cargos', () => {
    const options: IBackendWithSubOptions = { value: 'v', label: 'l', cargos: [], concursos: [] };
    const list: IBackendWithSubOptions[] = [options];

    it('getConcursosOptions', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: options });
      const { response } = getConcursosOptions();
      await expect(response).resolves.toEqual(options);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/v1/processos-convocacao/filtros/', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    });

    it('getCargosData', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: list });
      const { response } = getCargosData();
      await expect(response).resolves.toEqual(list);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/v1/cargos/', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    });

    it('getCargosPorConcursoData', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: list });
      const { response } = getCargosPorConcursoData('uuid');
      await expect(response).resolves.toEqual(list);
      expect(mockAxios.get).toHaveBeenCalledWith('/api/v1/cargos/concurso/uuid/', expect.objectContaining({ signal: expect.any(AbortSignal) }));
    });
  });

  describe('getProcessoConvocacaoPorUUID', () => {
    const uuid = 'uuid-123';
    const mockData: IProcessoConvocacao = {
      concurso_nome: 'Concurso Teste',
      concurso_uuid: 'concurso-uuid',
      criado_em: '2024-01-01',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-01',
      descricao: 'Descrição',
      numero_convocados: 10,
      quantidade_cargos: 5,
      status: 'Ativo',
      tipo_escolha: 'Tipo',
      uuid: 'uuid-123',
    };

    it('faz GET com UUID correto', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockData });
      const { response } = getProcessoConvocacaoPorUUID(uuid);

      await expect(response).resolves.toEqual(mockData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getProcessoConvocacaoPorUUID(uuid),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('aceita configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockData });
      const { response } = getProcessoConvocacaoPorUUID(uuid, { timeout: 5000 });
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ timeout: 5000 }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockData });
      const { abort } = getProcessoConvocacaoPorUUID(uuid);
      expect(typeof abort).toBe('function');
    });
  });

  describe('postProcessoConvocacao', () => {
    const payload: IPostProcessoConvocacaoPayload = {
      concurso_nome: 'Concurso Teste',
      concurso_uuid: 'concurso-uuid',
      tipo_escolha: 'Tipo',
      descricao: 'Descrição',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-01',
    };
    const mockResponse: IProcessoConvocacao = {
      ...payload,
      criado_em: '2024-01-01',
      numero_convocados: 0,
      quantidade_cargos: 0,
      status: 'Ativo',
      uuid: 'uuid-123',
    };

    it('faz POST com payload correto', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const { response } = postProcessoConvocacao(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postProcessoConvocacao(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const { response } = postProcessoConvocacao(payload, { signal: customSignal });
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: customSignal }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = postProcessoConvocacao(payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('patchProcessoConvocacao', () => {
    const uuid = 'uuid-123';
    const payload: Partial<IPostProcessoConvocacaoPayload> = {
      descricao: 'Nova descrição',
    };
    const mockResponse: IProcessoConvocacao = {
      concurso_nome: 'Concurso',
      concurso_uuid: 'concurso-uuid',
      criado_em: '2024-01-01',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-01',
      descricao: 'Nova descrição',
      numero_convocados: 0,
      quantidade_cargos: 0,
      status: 'Ativo',
      tipo_escolha: 'Tipo',
      uuid: 'uuid-123',
    };

    it('faz PATCH com payload correto', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const { response } = patchProcessoConvocacao(uuid, payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchProcessoConvocacao(uuid),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const { response } = patchProcessoConvocacao(uuid, payload, { signal: customSignal });
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: customSignal }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = patchProcessoConvocacao(uuid, payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('getProcessoConvocacaoById', () => {
    const uuid = 'uuid-123';
    const mockResponse: IProcessoConvocacaoResumo = {
      uuid: 'uuid-123',
      concurso_uuid: 'concurso-uuid',
      concurso_nome: 'Concurso Teste',
      descricao: 'Descrição',
      tipo_escolha: 'Tipo',
      status: 'Ativo',
      data_convocacao: '2024-01-01',
      data_corte_vagas: '2024-01-01',
      criado_em: '2024-01-01',
      atualizado_em: '2024-01-01',
      numero_convocacao: '001',
    };

    it('faz GET com UUID correto', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockResponse });
      const { response } = getProcessoConvocacaoById(uuid);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getProcessoConvocacaoById(uuid),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const { response } = getProcessoConvocacaoById(uuid, { signal: customSignal });
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: customSignal }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = getProcessoConvocacaoById(uuid);
      expect(typeof abort).toBe('function');
    });
  });

  describe('getProcessosConvocacaoOptions', () => {
    const mockOptions: IBackendWithSubOptions = {
      value: 'value',
      label: 'label',
      cargos: [],
      concursos: [],
    };

    it('faz GET e retorna options', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockOptions });
      const { response } = getProcessosConvocacaoOptions();

      await expect(response).resolves.toEqual(mockOptions);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getProcessosConvocacaoOptions(),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('aceita configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockOptions });
      const { response } = getProcessosConvocacaoOptions({ timeout: 5000 });
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ timeout: 5000 }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockOptions });
      const { abort } = getProcessosConvocacaoOptions();
      expect(typeof abort).toBe('function');
    });
  });

  describe('getCargosProcesso', () => {
    const processoUuid = 'proc-uuid';
    const mockCargos = [
      {
        uuid: 'cargo-uuid',
        nome: 'Cargo Teste',
        cargo_uuid: 'cargo-uuid',
        codigo_cargo: '123',
        vagas: 10,
        geral: 5,
        pcd: 3,
        nna: 2,
        total_candidatos: 10,
      },
    ];

    it('faz GET e retorna cargos', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargos });
      const { response } = getCargosProcesso(processoUuid);

      await expect(response).resolves.toEqual(mockCargos);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCargosProcesso(processoUuid),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('aceita configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargos });
      const { response } = getCargosProcesso(processoUuid, { timeout: 5000 });
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ timeout: 5000 }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCargos });
      const { abort } = getCargosProcesso(processoUuid);
      expect(typeof abort).toBe('function');
    });
  });

  describe('postCargosProcesso', () => {
    const processoUuid = 'proc-uuid';
    const payload: ICargoProcesso[] = [
      {
        nome: 'Cargo Teste',
        cargo_uuid: 'cargo-uuid',
        codigo_cargo: '123',
        vagas: 10,
        geral: 5,
        pcd: 3,
        nna: 2,
        total_candidatos: 10,
      },
    ];
    const mockResponse = { success: true };

    it('faz POST com payload correto', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const { response } = postCargosProcesso(processoUuid, payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postCargosProcesso(processoUuid),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('aceita configurações adicionais do axios', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const { response } = postCargosProcesso(processoUuid, payload, { timeout: 5000 });
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.objectContaining({ timeout: 5000 }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = postCargosProcesso(processoUuid, payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('patchCargoProcesso', () => {
    const processoUuid = 'proc-uuid';
    const cargoUuid = 'cargo-uuid';
    const payload: Partial<ICargoProcesso> = {
      vagas: 15,
    };
    const mockResponse = { success: true };

    it('faz PATCH com payload correto', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const { response } = patchCargoProcesso(processoUuid, cargoUuid, payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCargoProcesso(processoUuid, cargoUuid),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const { response } = patchCargoProcesso(processoUuid, cargoUuid, payload, { signal: customSignal });
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ signal: customSignal }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = patchCargoProcesso(processoUuid, cargoUuid, payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('deleteCargoProcesso', () => {
    const processoUuid = 'proc-uuid';
    const cargoUuid = 'cargo-uuid';
    const mockResponse = { success: true };

    it('faz DELETE com UUIDs corretos', async () => {
      mockAxios.delete.mockResolvedValueOnce({ data: mockResponse });
      const { response } = deleteCargoProcesso(processoUuid, cargoUuid);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.delete).toHaveBeenCalledWith(
        URL.deleteCargoProcesso(processoUuid, cargoUuid),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.delete.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const { response } = deleteCargoProcesso(processoUuid, cargoUuid, { signal: customSignal });
      await response;

      expect(mockAxios.delete).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: customSignal }),
      );
    });

    it('expõe função abort', () => {
      mockAxios.delete.mockResolvedValueOnce({ data: mockResponse });
      const { abort } = deleteCargoProcesso(processoUuid, cargoUuid);
      expect(typeof abort).toBe('function');
    });
  });

  describe('Abort exposure', () => {
    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: [] });
      mockAxios.post.mockResolvedValue({ data: {} });
      mockAxios.put.mockResolvedValue({ data: {} });
      mockAxios.patch.mockResolvedValue({ data: {} });
      mockAxios.delete.mockResolvedValue({ data: {} });
    });

    it('expõe abort em todas as funções', () => {
      const fns = [
        getProcessosConvocacao({ pagination: { page: 1 } }),
        getProcessoConvocacaoPorUUID('uuid'),
        postProcessoConvocacao({
          concurso_nome: 'x',
          concurso_uuid: 'y',
          tipo_escolha: 'tipo',
          descricao: 'desc',
          data_convocacao: '2024-01-01',
          data_corte_vagas: '2024-01-01',
        }),
        patchProcessoConvocacao('uuid', { descricao: 'desc' }),
        getProcessoConvocacaoById('uuid'),
        createSample({
          concurso_nome: 'x',
          data_convocacao: '2024-01-01',
          status: 'Ativo',
          uuid: 'y',
          concurso_uuid: 'z',
          criado_em: '2024-01-01',
          data_corte_vagas: '2024-01-01',
          descricao: 'desc',
          numero_convocados: 0,
          quantidade_cargos: 0,
          tipo_escolha: 'tipo',
        }),
        editSample({
          id: 1,
          concurso_nome: 'x',
          data_convocacao: '2024-01-01',
          status: 'Ativo',
          uuid: 'y',
          concurso_uuid: 'z',
          criado_em: '2024-01-01',
          data_corte_vagas: '2024-01-01',
          descricao: 'desc',
          numero_convocados: 0,
          quantidade_cargos: 0,
          tipo_escolha: 'tipo',
        }),
        deleteSample(1),
        getConcursosOptions(),
        getProcessosConvocacaoOptions(),
        getCargosData(),
        getCargosPorConcursoData('z'),
        getCargosProcesso('proc-uuid'),
        postCargosProcesso('proc-uuid', []),
        patchCargoProcesso('proc-uuid', 'cargo-uuid', {}),
        deleteCargoProcesso('proc-uuid', 'cargo-uuid'),
      ];
      fns.forEach(({ abort }) => {
        expect(typeof abort).toBe('function');
      });
    });
  });
});
