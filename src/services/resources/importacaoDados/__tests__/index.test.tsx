jest.mock('../../../axios', () => ({
  appAxiosImportaArquivos: {
    get: jest.fn(),
    post: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosImportaArquivos } from '../../../axios';
import {
  getLayout,
  getLayoutDownload,
  getImportacaoArquivosHabilitados,
  postImportacaoArquivosHabilitados,
  getErrosHabilitados,
  getErrosHabilitadosDownload,
  getUltimasImportacoesArquivosVagas,
  postImportacaoArquivosVagas,
  getErrosVagas,
  getErrosVagasDownload,
  URL,
} from '../index';
import type { PaginatedResponse, IListRequest } from '../../../../types/IListRequest';
import type {
  IGetLayout,
  IImportacaoFundacao,
  IUltimasImportacoesVagas,
  IErroImportacaoResposta,
} from '../IImportacaoArquivos';
import type { IImportacaoVagasPayload } from '../../../../pages/Processos/ImportacaoDados/Vagas/hooks/types';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('ImportacaoDados Service', () => {
  const mockAxios = appAxiosImportaArquivos as jest.Mocked<typeof appAxiosImportaArquivos>;
  const mockParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  const mockLayoutData: PaginatedResponse<IGetLayout> = {
    count: 1,
    next: null,
    previous: null,
    page_size: 10,
    results: [
      {
        atualizado_em: '2024-01-01T00:00:00Z',
        estrutura: [
          {
            key: 'campo1',
            ordem: 1,
            campo: 'Campo 1',
            tipoDado: 'string',
            tamanho: 50,
            regrasValidacao: 'obrigatório',
          },
        ],
      },
    ],
  };

  const mockImportacaoFundacao: IImportacaoFundacao = {
    uuid: 'importacao-uuid-123',
    arquivo: 'arquivo.csv',
    concurso: 'concurso-uuid-123',
  };

  const mockUltimasImportacoesVagas: PaginatedResponse<IUltimasImportacoesVagas> = {
    count: 1,
    next: null,
    previous: null,
    page_size: 10,
    results: [
      {
        uuid: 'importacao-uuid-123',
        nome_arquivo: 'vagas.csv',
        processo_nome: 'Processo Teste',
        criado_em: '2024-01-01T00:00:00Z',
        status: 'Concluído',
        erros: null,
      },
    ],
  };

  const mockErrosData: PaginatedResponse<IErroImportacaoResposta> = {
    count: 1,
    next: null,
    previous: null,
    page_size: 10,
    results: [
      {
        mensagem: 'Erro na linha 5',
        erros: 'Campo obrigatório não preenchido',
        concurso_uuid: 'concurso-uuid-123',
        processo_uuid: 'processo-uuid-123',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('retorna URLs corretas para todas as rotas', () => {
      expect(URL.getLayout()).toBe('/api/v1/layouts/');
      expect(URL.getLayoutDownload()).toBe('/api/v1/layouts/download/');
      expect(URL.getImportacaoArquivos()).toBe('/api/v1/importacao-arquivo/');
      expect(URL.postImportacaoArquivosHabilitados()).toBe('/api/v1/importacao-arquivo/habilitados/');
      expect(URL.getImportacaoArquivosHabilitados()).toBe('/api/v1/importacao-arquivo/habilitados/');
      expect(URL.getErrosHabilitados()).toBe('/api/v1/importacao-arquivo/habilitados/erros/');
      expect(URL.getErrosHabilitadosDownload()).toBe('/api/v1/importacao-arquivo/habilitados/erros/download/');
      expect(URL.getUltimasImportacoesArquivosVagas()).toBe('/api/v1/importacao-arquivo/vagas/');
      expect(URL.postImportacaoArquivosVagas()).toBe('/api/v1/importacao-arquivo/vagas/');
      expect(URL.getErrosVagas()).toBe('/api/v1/importacao-arquivo/vagas/erros/');
      expect(URL.getErrosVagasDownload()).toBe('/api/v1/importacao-arquivo/vagas/erros/download/');
    });
  });

  describe('getLayout', () => {
    it('faz GET sem parâmetros e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockLayoutData });

      const { response, abort } = getLayout();

      await expect(response).resolves.toEqual(mockLayoutData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getLayout(),
        expect.objectContaining({
          params: undefined,
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com parâmetros', async () => {
      const params = { tipo: 'habilitados' };
      mockAxios.get.mockResolvedValueOnce({ data: mockLayoutData });

      const { response } = getLayout(params);

      await expect(response).resolves.toEqual(mockLayoutData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getLayout(),
        expect.objectContaining({
          params: { tipo: 'habilitados' },
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockLayoutData });

      const { response } = getLayout(undefined, axiosConfig);

      await expect(response).resolves.toEqual(mockLayoutData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getLayout(),
        expect.objectContaining({
          headers: { 'X-Custom': 'value' },
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  describe('getLayoutDownload', () => {
    it('faz GET e retorna Blob', async () => {
      const mockBlob = new Blob(['layout'], { type: 'text/csv' });
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response, abort } = getLayoutDownload();

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getLayoutDownload(),
        expect.objectContaining({
          params: undefined,
          paramsSerializer: queryParamsSerializer,
          responseType: 'blob',
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com parâmetros e retorna Blob', async () => {
      const mockBlob = new Blob(['layout'], { type: 'text/csv' });
      const params = { tipo: 'vagas' };
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response } = getLayoutDownload(params);

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getLayoutDownload(),
        expect.objectContaining({
          params: { tipo: 'vagas' },
          responseType: 'blob',
        })
      );
    });
  });

  describe('getImportacaoArquivosHabilitados', () => {
    it('faz GET sem parâmetros e retorna os dados', async () => {
      const mockData: PaginatedResponse<IImportacaoFundacao> = {
        count: 1,
        next: null,
        previous: null,
        page_size: 10,
        results: [mockImportacaoFundacao],
      };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      const { response, abort } = getImportacaoArquivosHabilitados();

      await expect(response).resolves.toEqual(mockData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getImportacaoArquivosHabilitados(),
        expect.objectContaining({
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com parâmetros', async () => {
      const mockData: PaginatedResponse<IImportacaoFundacao> = {
        count: 1,
        next: null,
        previous: null,
        page_size: 10,
        results: [mockImportacaoFundacao],
      };
      const params = { concurso_uuid: 'concurso-123' };
      mockAxios.get.mockResolvedValueOnce({ data: mockData });

      const { response } = getImportacaoArquivosHabilitados(params);

      await expect(response).resolves.toEqual(mockData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getImportacaoArquivosHabilitados(),
        expect.objectContaining({
          concurso_uuid: 'concurso-123',
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  describe('postImportacaoArquivosHabilitados', () => {
    const mockFile = new File(['conteudo'], 'arquivo.csv', { type: 'text/csv' });

    it('faz POST com cargo e retorna os dados', async () => {
      const payload = {
        cargo: 'cargo-123',
        arquivo: mockFile,
        tipo: 'habilitados',
        concurso_uuid: 'concurso-uuid-123',
        concurso_nome: 'Concurso Teste',
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response, abort } = postImportacaoArquivosHabilitados(payload);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosHabilitados(),
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST sem cargo e retorna os dados', async () => {
      const payload = {
        arquivo: mockFile,
        tipo: 'habilitados',
        concurso_uuid: 'concurso-uuid-123',
        concurso_nome: 'Concurso Teste',
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response } = postImportacaoArquivosHabilitados(payload);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosHabilitados(),
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });

    it('usa signal customizado quando fornecido em axiosRequestConfig', async () => {
      const customSignal = new AbortController().signal;
      const axiosConfig = { signal: customSignal };
      const payload = {
        arquivo: mockFile,
        tipo: 'habilitados',
        concurso_uuid: 'concurso-uuid-123',
        concurso_nome: 'Concurso Teste',
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response } = postImportacaoArquivosHabilitados(payload, axiosConfig);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosHabilitados(),
        expect.any(FormData),
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('usa signal padrão quando axiosRequestConfig não tem signal', async () => {
      const axiosConfig = { timeout: 5000 };
      const payload = {
        arquivo: mockFile,
        tipo: 'habilitados',
        concurso_uuid: 'concurso-uuid-123',
        concurso_nome: 'Concurso Teste',
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response } = postImportacaoArquivosHabilitados(payload, axiosConfig);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosHabilitados(),
        expect.any(FormData),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          timeout: 5000,
        })
      );
    });
  });

  describe('getErrosHabilitados', () => {
    it('faz GET com importacao_uuid e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockErrosData });

      const { response, abort } = getErrosHabilitados('importacao-uuid-123');

      await expect(response).resolves.toEqual(mockErrosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosHabilitados(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123' },
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com importacao_uuid e parâmetros adicionais', async () => {
      const params = { page: 1, page_size: 20 };
      mockAxios.get.mockResolvedValueOnce({ data: mockErrosData });

      const { response } = getErrosHabilitados('importacao-uuid-123', params);

      await expect(response).resolves.toEqual(mockErrosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosHabilitados(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123', page: 1, page_size: 20 },
        })
      );
    });
  });

  describe('getErrosHabilitadosDownload', () => {
    it('faz GET e retorna Blob', async () => {
      const mockBlob = new Blob(['erros'], { type: 'text/csv' });
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response, abort } = getErrosHabilitadosDownload('importacao-uuid-123');

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosHabilitadosDownload(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123' },
          paramsSerializer: queryParamsSerializer,
          responseType: 'blob',
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com parâmetros adicionais e retorna Blob', async () => {
      const mockBlob = new Blob(['erros'], { type: 'text/csv' });
      const params = { formato: 'xlsx' };
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response } = getErrosHabilitadosDownload('importacao-uuid-123', params);

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosHabilitadosDownload(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123', formato: 'xlsx' },
          responseType: 'blob',
        })
      );
    });
  });

  describe('getUltimasImportacoesArquivosVagas', () => {
    it('faz GET com listRequest e retorna os dados', async () => {
      const listRequest: IListRequest<unknown> = {
        pagination: { page: 1, page_size: 10 },
        filters: { status: 'Concluído' },
      };
      mockAxios.get.mockResolvedValueOnce({ data: mockUltimasImportacoesVagas });

      const { response, abort } = getUltimasImportacoesArquivosVagas(listRequest);

      await expect(response).resolves.toEqual(mockUltimasImportacoesVagas);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getUltimasImportacoesArquivosVagas(),
        expect.objectContaining({
          params: { page: 1, page_size: 10, filters: { status: 'Concluído' } },
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const listRequest: IListRequest<unknown> = {
        pagination: { page: 1 },
      };
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockUltimasImportacoesVagas });

      const { response } = getUltimasImportacoesArquivosVagas(listRequest, axiosConfig);

      await expect(response).resolves.toEqual(mockUltimasImportacoesVagas);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getUltimasImportacoesArquivosVagas(),
        expect.objectContaining({
          headers: { 'X-Custom': 'value' },
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  describe('postImportacaoArquivosVagas', () => {
    const mockFile = new File(['conteudo'], 'vagas.csv', { type: 'text/csv' });

    it('faz POST e retorna os dados', async () => {
      const payload: IImportacaoVagasPayload = {
        processo_nome: 'Processo Teste',
        processo_uuid: 'processo-uuid-123',
        arquivo: mockFile,
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response, abort } = postImportacaoArquivosVagas(payload);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosVagas(),
        payload,
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('usa signal customizado quando fornecido em axiosRequestConfig', async () => {
      const customSignal = new AbortController().signal;
      const axiosConfig = { signal: customSignal };
      const payload: IImportacaoVagasPayload = {
        arquivo: mockFile,
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response } = postImportacaoArquivosVagas(payload, axiosConfig);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosVagas(),
        payload,
        expect.objectContaining({
          signal: customSignal,
        })
      );
    });

    it('usa signal padrão quando axiosRequestConfig não tem signal', async () => {
      const axiosConfig = { timeout: 5000 };
      const payload: IImportacaoVagasPayload = {
        arquivo: mockFile,
      };
      mockAxios.post.mockResolvedValueOnce({ data: mockImportacaoFundacao });

      const { response } = postImportacaoArquivosVagas(payload, axiosConfig);

      await expect(response).resolves.toEqual(mockImportacaoFundacao);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postImportacaoArquivosVagas(),
        payload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          timeout: 5000,
        })
      );
    });
  });

  describe('getErrosVagas', () => {
    it('faz GET com importacao_uuid e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockErrosData });

      const { response, abort } = getErrosVagas('importacao-uuid-123');

      await expect(response).resolves.toEqual(mockErrosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosVagas(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123' },
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com importacao_uuid e parâmetros adicionais', async () => {
      const params = { page: 1, page_size: 20 };
      mockAxios.get.mockResolvedValueOnce({ data: mockErrosData });

      const { response } = getErrosVagas('importacao-uuid-123', params);

      await expect(response).resolves.toEqual(mockErrosData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosVagas(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123', page: 1, page_size: 20 },
        })
      );
    });
  });

  describe('getErrosVagasDownload', () => {
    it('faz GET e retorna Blob', async () => {
      const mockBlob = new Blob(['erros vagas'], { type: 'text/csv' });
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response, abort } = getErrosVagasDownload('importacao-uuid-123');

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosVagasDownload(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123' },
          paramsSerializer: queryParamsSerializer,
          responseType: 'blob',
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com parâmetros adicionais e retorna Blob', async () => {
      const mockBlob = new Blob(['erros vagas'], { type: 'text/csv' });
      const params = { formato: 'xlsx' };
      mockAxios.get.mockResolvedValueOnce({ data: mockBlob });

      const { response } = getErrosVagasDownload('importacao-uuid-123', params);

      await expect(response).resolves.toEqual(mockBlob);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getErrosVagasDownload(),
        expect.objectContaining({
          params: { importacao_uuid: 'importacao-uuid-123', formato: 'xlsx' },
          responseType: 'blob',
        })
      );
    });
  });
});

