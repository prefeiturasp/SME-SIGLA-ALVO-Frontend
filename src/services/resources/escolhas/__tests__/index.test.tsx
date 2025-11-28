import {
  getVagasEscolas,
  postBuscarEscolhasPorCandidatos,
  patchVagasEscolasUtilizadas,
  getDREs,
  getEscolas,
  postInclusaoVagasEscolas,
  postEscolha,
  URL,
} from '../index';
import { appAxiosEscolhas } from '../../../axios';
import type {
  IEscolhasFiltro,
  IDREsResponse,
  IEscolasResponse,
} from '../IEscolhas';
import type { IListRequest } from '../../../../types/IListRequest';
import type { IVagasResponse } from '../convocacao/IConvocacao';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

// Mock do axios
jest.mock('../../../axios', () => ({
  appAxiosEscolhas: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

// Mock do queryParamsSerializer
jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

const mockAxios = appAxiosEscolhas as jest.Mocked<typeof appAxiosEscolhas>;
const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<
  typeof queryParamsSerializer
>;

describe('Escolhas Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation(
      (params) => new URLSearchParams(params as any).toString()
    );
  });

  describe('URL', () => {
    it('deve retornar URLs corretas para todas as rotas', () => {
      expect(URL.getVagasEscolas()).toBe('/api/v1/vagas-escolas/');
      expect(URL.patchVagasEscolasUtilizadas()).toBe(
        '/api/v1/vagas-escolas/utilizadas/'
      );
      expect(URL.getDREs()).toBe('/api/v1/dres/');
      expect(URL.getEscolas()).toBe('/api/v1/escolas/');
      expect(URL.postBuscarEscolhasPorCandidatos()).toBe(
        '/api/v1/escolhas/busca/'
      );
      expect(URL.postEscolhas()).toBe('/api/v1/escolhas/');
      expect(URL.postInclusaoVagasEscolas()).toBe(
        '/api/v1/vagas-escolas/inclusao/'
      );
    });
  });

  describe('getVagasEscolas', () => {
    const mockVagasData: IVagasResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          uuid: 'uuid-1',
          escola_uuid: 'escola-1',
          vagas_precarias: 5,
          vagas_definitivas: 10,
        },
      ],
    };

    const filtro: IEscolhasFiltro = {
      processo_uuid: 'proc-123',
      cargo_codigo: '123',
    };

    const listRequest: IListRequest = {
      pagination: { page: 1, page_size: 10 },
      filters: { search: 'test' },
    };

    it('deve fazer requisição GET com parâmetros corretos', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });

      const { response } = getVagasEscolas(filtro, listRequest);

      await expect(response).resolves.toEqual(mockVagasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getVagasEscolas(),
        expect.objectContaining({
          params: expect.objectContaining({
            processo_uuid: 'proc-123',
            cargo_codigo: '123',
            page: 1,
            page_size: 10,
            search: 'test',
          }),
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve aceitar configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });
      const config = { timeout: 5000 };

      const { response } = getVagasEscolas(filtro, listRequest, config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getVagasEscolas(),
        expect.objectContaining({
          timeout: 5000,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockVagasData });

      const { abort } = getVagasEscolas(filtro, listRequest);
      expect(typeof abort).toBe('function');
    });

    it('deve propagar erros da requisição', async () => {
      const error = new Error('Network error');
      mockAxios.get.mockRejectedValueOnce(error);

      const { response } = getVagasEscolas(filtro, listRequest);
      await expect(response).rejects.toThrow('Network error');
    });
  });

  describe('postBuscarEscolhasPorCandidatos', () => {
    const candidatoUuids = ['uuid-1', 'uuid-2'];
    const mockResponse = {
      results: [
        {
          uuid: 'escolha-1',
          candidato_uuid: 'uuid-1',
          situacao: 'escolha',
        },
      ],
    };

    it('deve fazer requisição POST com candidato_uuid', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postBuscarEscolhasPorCandidatos(candidatoUuids);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postBuscarEscolhasPorCandidatos(),
        { candidato_uuid: candidatoUuids },
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve usar signal do axiosRequestConfig se fornecido', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const config = { signal: customSignal };

      const { response } = postBuscarEscolhasPorCandidatos(
        candidatoUuids,
        config
      );
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postBuscarEscolhasPorCandidatos(),
        { candidato_uuid: candidatoUuids },
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = postBuscarEscolhasPorCandidatos(candidatoUuids);
      expect(typeof abort).toBe('function');
    });
  });

  describe('patchVagasEscolasUtilizadas', () => {
    const payload = [
      {
        uuid: 'uuid-1',
        foi_utilizada: true,
        vagas_precarias_utilizadas: 2,
        vagas_definitivas_utilizadas: 5,
      },
      {
        uuid: 'uuid-2',
        foi_utilizada: false,
      },
    ];
    const mockResponse = { success: true };

    it('deve fazer requisição PATCH com payload correto', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { response } = patchVagasEscolasUtilizadas(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchVagasEscolasUtilizadas(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve aceitar configurações adicionais do axios', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 3000 };

      const { response } = patchVagasEscolasUtilizadas(payload, config);
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchVagasEscolasUtilizadas(),
        payload,
        expect.objectContaining({
          timeout: 3000,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = patchVagasEscolasUtilizadas(payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('getDREs', () => {
    const mockDREsData: IDREsResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          uuid: 'dre-1',
          codigo: '01',
          nome: 'DRE 1',
        },
      ],
    };

    it('deve fazer requisição GET com page_size padrão de 100', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDREsData });

      const { response } = getDREs();

      await expect(response).resolves.toEqual(mockDREsData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getDREs(),
        expect.objectContaining({
          params: expect.objectContaining({
            page_size: 100,
          }),
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve aceitar parâmetros adicionais', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDREsData });
      const params = { page_size: 50 };

      const { response } = getDREs(params);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getDREs(),
        expect.objectContaining({
          params: expect.objectContaining({
            page_size: 50,
          }),
        })
      );
    });

    it('deve aceitar configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDREsData });
      const config = { timeout: 5000 };

      const { response } = getDREs({}, config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getDREs(),
        expect.objectContaining({
          timeout: 5000,
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockDREsData });

      const { abort } = getDREs();
      expect(typeof abort).toBe('function');
    });
  });

  describe('getEscolas', () => {
    const mockEscolasData: IEscolasResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          uuid: 'escola-1',
          codigo_eol: '123456',
          dre: {
            nome: 'DRE 1',
            uuid: 'dre-1',
            codigo: '01',
          },
          nome_oficial: 'Escola Teste',
          vagas_definitivas: 10,
          vagas_precarias: 5,
          tipo_ue: 'EMEF',
        },
      ],
    };

    const params = {
      dre__codigo: '01',
      nome: 'Escola',
      page_size: 20,
    };

    it('deve fazer requisição GET com parâmetros corretos', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockEscolasData });

      const { response } = getEscolas(params);

      await expect(response).resolves.toEqual(mockEscolasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getEscolas(),
        expect.objectContaining({
          params: expect.objectContaining({
            dre__codigo: '01',
            nome: 'Escola',
            page_size: 20,
          }),
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve aceitar configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockEscolasData });
      const config = { timeout: 5000 };

      const { response } = getEscolas(params, config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getEscolas(),
        expect.objectContaining({
          timeout: 5000,
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockEscolasData });

      const { abort } = getEscolas(params);
      expect(typeof abort).toBe('function');
    });
  });

  describe('postInclusaoVagasEscolas', () => {
    const payload = {
      processo_uuid: 'proc-123',
      vagas: [
        {
          escola_uuid: 'escola-1',
          vagas_precarias: 2,
          vagas_definitivas: 5,
        },
      ],
    };
    const mockResponse = { success: true };

    it('deve fazer requisição POST com payload correto', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postInclusaoVagasEscolas(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postInclusaoVagasEscolas(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve aceitar configurações adicionais do axios', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 3000 };

      const { response } = postInclusaoVagasEscolas(payload, config);
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postInclusaoVagasEscolas(),
        payload,
        expect.objectContaining({
          timeout: 3000,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve expor função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = postInclusaoVagasEscolas(payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('postEscolha', () => {
    const payload = {
      candidato_uuid: 'candidato-123',
      situacao: 'escolha' as const,
      vaga_escola_uuid: 'vaga-123',
      tipo_vaga: 'definitiva' as const,
      e_retardatario: false,
    };
    const mockResponse = { uuid: 'escolha-123', success: true };

    it('deve fazer requisição POST com payload correto', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postEscolha(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postEscolhas(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve usar signal do axiosRequestConfig se fornecido', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const config = { signal: customSignal };

      const { response } = postEscolha(payload, config);
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postEscolhas(),
        payload,
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('deve usar signal padrão quando axiosRequestConfig não tem signal', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 5000 };

      const { response, abort } = postEscolha(payload, config);
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postEscolhas(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('deve expor função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = postEscolha(payload);
      expect(typeof abort).toBe('function');
    });
  });
});

