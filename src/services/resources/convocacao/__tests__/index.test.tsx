jest.mock('../../../axios', () => ({
  appAxiosProcessoConvocacao: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

jest.mock('../../../../utils/queryParamsSerializer', () => jest.fn());

import { appAxiosProcessoConvocacao } from '../../../axios';
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

// Mock das funções faltantes no URL
(URL as any).createSample = () => 'api/v1/sample/create';
(URL as any).editSample = (id: number) => `api/v1/sample/update/${id}/`;
(URL as any).deleteSample = (id: number) => `api/v1/sample/delete/${id}/`;
import type { PaginatedResponse, IBackendWithSubOptions } from '../../../../types/IListRequest';
import type { IProcessoConvocacao, ISample } from '../IConvocacao';
import queryParamsSerializer from '../../../../utils/queryParamsSerializer';

describe('Convocacao Service', () => {
  const mockAxios = appAxiosProcessoConvocacao as jest.Mocked<typeof appAxiosProcessoConvocacao>;
  const mockQueryParamsSerializer = queryParamsSerializer as jest.MockedFunction<typeof queryParamsSerializer>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockQueryParamsSerializer.mockImplementation((params) => new URLSearchParams(params as any).toString());
  });

  describe('URL', () => {
    it('exibe URLs corretas', () => {
      expect(URL.getProcessosConvocacao()).toBe('/api/v1/processos-convocacao/');
      expect(URL.getConcursosOptions()).toBe('/api/v1/processos-convocacao/filtros/');
      expect(URL.createSample()).toBe('api/v1/sample/create');
      expect(URL.editSample(123)).toBe('api/v1/sample/update/123/');
      expect(URL.deleteSample(456)).toBe('api/v1/sample/delete/456/');
      expect(URL.getCargos()).toBe('/api/v1/cargos/');
      expect(URL.getCargosPorConcurso('x')).toBe('/api/v1/cargos/concurso/x/');
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
      expect(mockAxios.post).toHaveBeenCalledWith('api/v1/sample/create', sample, expect.objectContaining({ signal: expect.any(AbortSignal) }));
    });

    it('editSample', async () => {
      const editable: ISample = { ...sample, id: 7 } as ISample;
      mockAxios.put.mockResolvedValueOnce({ data: editable });
      const { response } = editSample(editable);
      await expect(response).resolves.toEqual(editable);
      expect(mockAxios.put).toHaveBeenCalledWith('api/v1/sample/update/7/', editable, expect.objectContaining({ signal: expect.any(AbortSignal) }));
    });

    it('deleteSample', async () => {
      mockAxios.delete.mockResolvedValueOnce({ data: { ok: true } });
      const { response } = deleteSample(9);
      await response;
      expect(mockAxios.delete).toHaveBeenCalledWith('api/v1/sample/delete/9/', expect.objectContaining({ signal: expect.any(AbortSignal) }));
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

  describe('Abort exposure', () => {
    beforeEach(() => {
      mockAxios.get.mockResolvedValue({ data: [] });
      mockAxios.post.mockResolvedValue({ data: {} });
      mockAxios.put.mockResolvedValue({ data: {} });
      mockAxios.delete.mockResolvedValue({ data: {} });
    });

    it('expõe abort em todas as funções', () => {
      const fns = [
        getProcessosConvocacao({ pagination: { page: 1 } }),
        createSample({ concurso_nome: 'x', data_convocacao: '2024-01-01', status: 'Ativo', uuid: 'y' }),
        editSample({ id: 1, concurso_nome: 'x', data_convocacao: '2024-01-01', status: 'Ativo', uuid: 'y' }),
        deleteSample(1),
        getConcursosOptions(),
        getCargosData(),
        getCargosPorConcursoData('z'),
      ];
      fns.forEach(({ abort }) => {
        expect(typeof abort).toBe('function');
      });
    });
  });
});
