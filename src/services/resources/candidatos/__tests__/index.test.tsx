jest.mock('../../../axios', () => ({
  appAxiosCandidatos: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosCandidatos } from '../../../axios';
import {
  getCandidatos,
  getCandidatosHabilitados,
  patchCandidatosHabilitadosConvocados,
  patchCandidatosHabilitadosDesconvocados,
  postBuscarPorUuids,
  URL,
} from '../index';
import type { PaginatedResponse } from '../../../../types/IListRequest';
import type {
  ICandidato,
  IBuscarPorUuidsPayload,
  IBuscarPorUuidsResponse,
} from '../ICandidatos';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

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
        nome: 'João Silva',
        convocado_por: 'Sistema',
        nome_candidato: 'João Silva',
        classificacao_geral: 1,
        classificacao_especial: 1,
        classificacao_nna: 1,
      },
      {
        nome: 'Maria Santos',
        convocado_por: 'Sistema',
        nome_candidato: 'Maria Santos',
        classificacao_geral: 2,
        classificacao_especial: 2,
        classificacao_nna: 2,
      },
      {
        nome: 'Pedro Oliveira',
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
    it('retorna URLs corretas para todas as rotas', () => {
      expect(URL.getCandidatos()).toBe('/api/v1/candidatos/');
      expect(URL.getCandidatosHabilitados()).toBe('/api/v1/habilitados/');
      expect(URL.patchCandidatosHabilitadosConvocados()).toBe(
        '/api/v1/habilitados/convocar/'
      );
      expect(URL.patchCandidatosHabilitadosDesconvocados()).toBe(
        '/api/v1/habilitados/desconvocar/'
      );
      expect(URL.postBuscarPorUuids()).toBe(
        '/api/v1/habilitados/buscar-por-uuids/'
      );
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

  describe('getCandidatosHabilitados', () => {
    const params = {
      geral: 10,
      pcd: 5,
      nna: 3,
      concurso_uuid: 'concurso-123',
    };

    it('faz GET com parâmetros corretos', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });

      const { response } = getCandidatosHabilitados(params);

      await expect(response).resolves.toEqual(mockCandidatosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCandidatosHabilitados(),
        expect.objectContaining({
          params: expect.objectContaining({
            geral: 10,
            pcd: 5,
            nna: 3,
            concurso_uuid: 'concurso-123',
          }),
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('faz GET sem concurso_uuid quando não fornecido', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });
      const paramsSemConcurso = {
        geral: 10,
        pcd: 5,
        nna: 3,
      };

      const { response } = getCandidatosHabilitados(paramsSemConcurso);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCandidatosHabilitados(),
        expect.objectContaining({
          params: expect.not.objectContaining({
            concurso_uuid: expect.anything(),
          }),
        })
      );
    });

    it('mescla configurações adicionais do axios', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });
      const config = { timeout: 5000 };

      const { response } = getCandidatosHabilitados(params, config);
      await response;

      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getCandidatosHabilitados(),
        expect.objectContaining({
          timeout: 5000,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockCandidatosData });

      const { abort } = getCandidatosHabilitados(params);
      expect(typeof abort).toBe('function');
    });

    it('propaga erros da requisição', async () => {
      const error = new Error('Network error');
      mockAxios.get.mockRejectedValueOnce(error);

      const { response } = getCandidatosHabilitados(params);
      await expect(response).rejects.toThrow('Network error');
    });
  });

  describe('patchCandidatosHabilitadosConvocados', () => {
    const payload = {
      concurso_uuid: 'concurso-123',
      processo_uuid: 'processo-456',
      candidatos: ['candidato-1', 'candidato-2'],
      foi_convocado: true,
    };
    const mockResponse = { success: true };

    it('faz PATCH com payload correto', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { response } = patchCandidatosHabilitadosConvocados(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosConvocados(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const config = { signal: customSignal };

      const { response } = patchCandidatosHabilitadosConvocados(payload, config);
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosConvocados(),
        payload,
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('usa signal padrão quando axiosRequestConfig não tem signal', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 5000 };

      const { response, abort } = patchCandidatosHabilitadosConvocados(
        payload,
        config
      );
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosConvocados(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('expõe função abort', () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = patchCandidatosHabilitadosConvocados(payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('patchCandidatosHabilitadosDesconvocados', () => {
    const payload = {
      codigo_cargo: '123',
      processo_uuid: 'processo-456',
    };
    const mockResponse = { success: true };

    it('faz PATCH com payload correto', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { response } = patchCandidatosHabilitadosDesconvocados(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosDesconvocados(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const config = { signal: customSignal };

      const { response } = patchCandidatosHabilitadosDesconvocados(
        payload,
        config
      );
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosDesconvocados(),
        payload,
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('usa signal padrão quando axiosRequestConfig não tem signal', async () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 5000 };

      const { response, abort } = patchCandidatosHabilitadosDesconvocados(
        payload,
        config
      );
      await response;

      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchCandidatosHabilitadosDesconvocados(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('expõe função abort', () => {
      mockAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = patchCandidatosHabilitadosDesconvocados(payload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('postBuscarPorUuids', () => {
    const payload: IBuscarPorUuidsPayload = {
      uuids: ['uuid-1', 'uuid-2', 'uuid-3'],
    };
    const mockResponse: IBuscarPorUuidsResponse = {
      results: mockCandidatosData.results,
      total: 3,
      uuids_enviados: 3,
      uuids_encontrados: 3,
    };

    it('faz POST com payload correto', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postBuscarPorUuids(payload);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postBuscarPorUuids(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('usa signal do axiosRequestConfig quando fornecido', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const customSignal = new AbortController().signal;
      const config = { signal: customSignal };

      const { response } = postBuscarPorUuids(payload, config);
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postBuscarPorUuids(),
        payload,
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('usa signal padrão quando axiosRequestConfig não tem signal', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });
      const config = { timeout: 5000 };

      const { response, abort } = postBuscarPorUuids(payload, config);
      await response;

      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postBuscarPorUuids(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = postBuscarPorUuids(payload);
      expect(typeof abort).toBe('function');
    });

    it('propaga erros da requisição', async () => {
      const error = new Error('Network error');
      mockAxios.post.mockRejectedValueOnce(error);

      const { response } = postBuscarPorUuids(payload);
      await expect(response).rejects.toThrow('Network error');
    });
  });

  describe('AbortController', () => {
    it('expõe uma função abort em todas as funções', () => {
      mockAxios.get.mockResolvedValue({ data: mockCandidatosData });
      mockAxios.patch.mockResolvedValue({ data: {} });
      mockAxios.post.mockResolvedValue({ data: {} });

      const { abort: abort1 } = getCandidatos();
      const { abort: abort2 } = getCandidatosHabilitados({
        geral: 10,
        pcd: 5,
        nna: 3,
      });
      const { abort: abort3 } = patchCandidatosHabilitadosConvocados({
        concurso_uuid: 'c',
        processo_uuid: 'p',
        candidatos: [],
        foi_convocado: true,
      });
      const { abort: abort4 } = patchCandidatosHabilitadosDesconvocados({
        codigo_cargo: '1',
        processo_uuid: 'p',
      });
      const { abort: abort5 } = postBuscarPorUuids({ uuids: [] });

      expect(typeof abort1).toBe('function');
      expect(typeof abort2).toBe('function');
      expect(typeof abort3).toBe('function');
      expect(typeof abort4).toBe('function');
      expect(typeof abort5).toBe('function');
    });
  });
});
