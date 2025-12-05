jest.mock('../../../axios', () => ({
  appAxiosAgenda: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosAgenda } from '../../../axios';
import {
  getAgendas,
  getAgendaByUuid,
  postAgenda,
  patchAgenda,
  putAgenda,
  deleteAgenda,
  URL,
} from '../index';
import type { PaginatedResponse, IListRequest } from '../../../../types/IListRequest';
import type { IAgenda, IAgendaCreate, IAgendaFilters } from '../IAgenda';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('Agenda Service', () => {
  const mockAxios = appAxiosAgenda as jest.Mocked<typeof appAxiosAgenda>;
  const mockParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  const mockAgendaData: IAgenda = {
    uuid: 'uuid-123',
    processo_convocacao_uuid: 'proc-uuid-123',
    processo_convocacao_nome: 'Processo Teste',
    cargo_uuid: 'cargo-uuid-123',
    cargo_nome: 'Cargo Teste',
    data_escolha: '2024-01-15',
    modalidade: 'Presencial',
    escolha_em: '2024-01-15T10:00:00Z',
    nomeacao_em: null,
    classificacao: 1,
    sessao: 'Sessão 1',
    retardatario: false,
    hora_convocacao_inicio: '09:00',
    hora_convocacao_fim: '10:00',
    criado_em: '2024-01-01T00:00:00Z',
    atualizado_em: '2024-01-01T00:00:00Z',
  };

  const mockAgendasData: PaginatedResponse<IAgenda> = {
    count: 2,
    next: null,
    previous: null,
    page_size: 10,
    results: [
      mockAgendaData,
      {
        ...mockAgendaData,
        uuid: 'uuid-456',
        classificacao: 2,
      },
    ],
  };

  const mockAgendaCreate: IAgendaCreate = {
    processo_convocacao_uuid: 'proc-uuid-123',
    processo_convocacao_nome: 'Processo Teste',
    cargo_uuid: 'cargo-uuid-123',
    cargo_nome: 'Cargo Teste',
    data_escolha: '2024-01-15',
    modalidade: 'Presencial',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('retorna URLs corretas para todas as rotas', () => {
      expect(URL.getAgendas()).toBe('/api/v1/agendas/');
      expect(URL.getAgendaByUuid('uuid-123')).toBe('/api/v1/agendas/uuid-123/');
      expect(URL.postAgenda()).toBe('/api/v1/agendas/');
      expect(URL.patchAgenda('uuid-123')).toBe('/api/v1/agendas/uuid-123/');
      expect(URL.putAgenda('uuid-123')).toBe('/api/v1/agendas/uuid-123/');
      expect(URL.deleteAgenda('uuid-123')).toBe('/api/v1/agendas/uuid-123/');
    });
  });

  describe('getAgendas', () => {
    it('faz GET sem parâmetros e retorna os dados', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendasData });

      const { response, abort } = getAgendas();

      await expect(response).resolves.toEqual(mockAgendasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAgendas(),
        expect.objectContaining({
          params: {},
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com paginação e filtros', async () => {
      const listRequest: IListRequest<IAgendaFilters> = {
        pagination: { page: 1, page_size: 20 },
        filters: {
          processo_convocacao_uuid: 'proc-uuid-123',
          cargo_uuid: 'cargo-uuid-123',
          search: 'teste',
        },
        sort: 'data_escolha',
        order: 'asc',
      };

      mockAxios.get.mockResolvedValueOnce({ data: mockAgendasData });

      const { response } = getAgendas(listRequest);

      await expect(response).resolves.toEqual(mockAgendasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAgendas(),
        expect.objectContaining({
          params: {
            page: 1,
            page_size: 20,
            processo_convocacao_uuid: 'proc-uuid-123',
            cargo_uuid: 'cargo-uuid-123',
            search: 'teste',
            sort: 'data_escolha',
            order: 'asc',
          },
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendasData });

      const { response } = getAgendas(undefined, axiosConfig);

      await expect(response).resolves.toEqual(mockAgendasData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAgendas(),
        expect.objectContaining({
          params: {},
          paramsSerializer: queryParamsSerializer,
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendasData });

      const { abort } = getAgendas();
      expect(typeof abort).toBe('function');
    });
  });

  describe('getAgendaByUuid', () => {
    it('faz GET e retorna os dados da agenda', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendaData });

      const { response, abort } = getAgendaByUuid('uuid-123');

      await expect(response).resolves.toEqual(mockAgendaData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAgendaByUuid('uuid-123'),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendaData });

      const { response } = getAgendaByUuid('uuid-123', axiosConfig);

      await expect(response).resolves.toEqual(mockAgendaData);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.getAgendaByUuid('uuid-123'),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockAgendaData });

      const { abort } = getAgendaByUuid('uuid-123');
      expect(typeof abort).toBe('function');
    });
  });

  describe('postAgenda', () => {
    it('faz POST com objeto único e retorna os dados', async () => {
      const mockResponse = [mockAgendaData];
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response, abort } = postAgenda(mockAgendaCreate);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postAgenda(),
        [mockAgendaCreate],
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST com array de agendas e retorna os dados', async () => {
      const agendasArray: IAgendaCreate[] = [mockAgendaCreate, { ...mockAgendaCreate, cargo_nome: 'Cargo 2' }];
      const mockResponse = [mockAgendaData, { ...mockAgendaData, uuid: 'uuid-456' }];
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postAgenda(agendasArray);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postAgenda(),
        agendasArray,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('faz POST com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      const mockResponse = [mockAgendaData];
      mockAxios.post.mockResolvedValueOnce({ data: mockResponse });

      const { response } = postAgenda(mockAgendaCreate, axiosConfig);

      await expect(response).resolves.toEqual(mockResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.postAgenda(),
        [mockAgendaCreate],
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: [mockAgendaData] });

      const { abort } = postAgenda(mockAgendaCreate);
      expect(typeof abort).toBe('function');
    });
  });

  describe('patchAgenda', () => {
    it('faz PATCH e retorna os dados atualizados', async () => {
      const partialPayload: Partial<IAgendaCreate> = { modalidade: 'Online' };
      const updatedAgenda = { ...mockAgendaData, modalidade: 'Online' };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedAgenda });

      const { response, abort } = patchAgenda('uuid-123', partialPayload);

      await expect(response).resolves.toEqual(updatedAgenda);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchAgenda('uuid-123'),
        partialPayload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz PATCH com axiosRequestConfig adicional', async () => {
      const partialPayload: Partial<IAgendaCreate> = { modalidade: 'Online' };
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      const updatedAgenda = { ...mockAgendaData, modalidade: 'Online' };
      mockAxios.patch.mockResolvedValueOnce({ data: updatedAgenda });

      const { response } = patchAgenda('uuid-123', partialPayload, axiosConfig);

      await expect(response).resolves.toEqual(updatedAgenda);
      expect(mockAxios.patch).toHaveBeenCalledWith(
        URL.patchAgenda('uuid-123'),
        partialPayload,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      const partialPayload: Partial<IAgendaCreate> = { modalidade: 'Online' };
      mockAxios.patch.mockResolvedValueOnce({ data: mockAgendaData });

      const { abort } = patchAgenda('uuid-123', partialPayload);
      expect(typeof abort).toBe('function');
    });
  });

  describe('putAgenda', () => {
    it('faz PUT e retorna os dados atualizados', async () => {
      const updatedAgenda = { ...mockAgendaData, modalidade: 'Online' };
      mockAxios.put.mockResolvedValueOnce({ data: updatedAgenda });

      const { response, abort } = putAgenda('uuid-123', mockAgendaCreate);

      await expect(response).resolves.toEqual(updatedAgenda);
      expect(mockAxios.put).toHaveBeenCalledWith(
        URL.putAgenda('uuid-123'),
        mockAgendaCreate,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz PUT com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      const updatedAgenda = { ...mockAgendaData, modalidade: 'Online' };
      mockAxios.put.mockResolvedValueOnce({ data: updatedAgenda });

      const { response } = putAgenda('uuid-123', mockAgendaCreate, axiosConfig);

      await expect(response).resolves.toEqual(updatedAgenda);
      expect(mockAxios.put).toHaveBeenCalledWith(
        URL.putAgenda('uuid-123'),
        mockAgendaCreate,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.put.mockResolvedValueOnce({ data: mockAgendaData });

      const { abort } = putAgenda('uuid-123', mockAgendaCreate);
      expect(typeof abort).toBe('function');
    });
  });

  describe('deleteAgenda', () => {
    it('faz DELETE e retorna os dados', async () => {
      const deleteResponse = { success: true };
      mockAxios.delete.mockResolvedValueOnce({ data: deleteResponse });

      const { response, abort } = deleteAgenda('uuid-123');

      await expect(response).resolves.toEqual(deleteResponse);
      expect(mockAxios.delete).toHaveBeenCalledWith(
        URL.deleteAgenda('uuid-123'),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz DELETE com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      const deleteResponse = { success: true };
      mockAxios.delete.mockResolvedValueOnce({ data: deleteResponse });

      const { response } = deleteAgenda('uuid-123', axiosConfig);

      await expect(response).resolves.toEqual(deleteResponse);
      expect(mockAxios.delete).toHaveBeenCalledWith(
        URL.deleteAgenda('uuid-123'),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.delete.mockResolvedValueOnce({ data: { success: true } });

      const { abort } = deleteAgenda('uuid-123');
      expect(typeof abort).toBe('function');
    });
  });
});

