import type { IUsuarioPermissoes, IUsuarioPermissoesRequest } from '../IPermissoes';

// Mock do axios
const mockGet = jest.fn();
jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    get: mockGet,
  },
}));

// Mock do queryParamsSerializer
const mockQueryParamsSerializer = jest.fn();
jest.mock('../../../../utils/queryParamsSerializer', () => mockQueryParamsSerializer);

// Importar após os mocks
const { URL, getPermissoesPorUsuarioEModel } = require('../index');

describe('Permissões Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('deve retornar URL correta para getPermissoesPorUsuarioEModel', () => {
      expect(URL.getPermissoesPorUsuarioEModel()).toBe('/api/v1/usuarios/permissoes/');
    });
  });

  describe('getPermissoesPorUsuarioEModel', () => {
    const mockParams: IUsuarioPermissoesRequest = {
      usuario: 'user123',
      model: 'processo',
    };

    const mockResponse: IUsuarioPermissoes = {
      usuario: 'user123',
      permissoes: [
        {
          id: 1,
          codename: 'view_processo',
          name: 'Can view processo',
          app_label: 'processos',
          model: 'processo',
        },
        {
          id: 2,
          codename: 'add_processo',
          name: 'Can add processo',
          app_label: 'processos',
          model: 'processo',
        },
      ],
    };

    it('deve fazer requisição GET com params corretos', async () => {
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const { response } = getPermissoesPorUsuarioEModel(mockParams);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/usuarios/permissoes/',
        expect.objectContaining({
          params: mockParams,
          paramsSerializer: mockQueryParamsSerializer,
        })
      );

      const result = await response;
      expect(result).toEqual(mockResponse);
    });

    it('deve fazer requisição GET sem model no params', async () => {
      const paramsWithoutModel: IUsuarioPermissoesRequest = {
        usuario: 'user456',
      };

      const mockResponseWithoutModel: IUsuarioPermissoes = {
        usuario: 'user456',
        permissoes: [],
      };

      mockGet.mockResolvedValueOnce({ data: mockResponseWithoutModel });

      const { response } = getPermissoesPorUsuarioEModel(paramsWithoutModel);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/usuarios/permissoes/',
        expect.objectContaining({
          params: paramsWithoutModel,
        })
      );

      const result = await response;
      expect(result).toEqual(mockResponseWithoutModel);
    });

    it('deve incluir axiosRequestConfig quando fornecido', async () => {
      const customConfig = {
        headers: { 'X-Custom-Header': 'test' },
        timeout: 5000,
      };

      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const { response } = getPermissoesPorUsuarioEModel(mockParams, customConfig);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/usuarios/permissoes/',
        expect.objectContaining({
          params: mockParams,
          paramsSerializer: mockQueryParamsSerializer,
          headers: customConfig.headers,
          timeout: customConfig.timeout,
        })
      );

      const result = await response;
      expect(result).toEqual(mockResponse);
    });

    it('deve incluir signal do AbortController', async () => {
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      getPermissoesPorUsuarioEModel(mockParams);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/usuarios/permissoes/',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('deve retornar função abort', () => {
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const { abort } = getPermissoesPorUsuarioEModel(mockParams);

      expect(typeof abort).toBe('function');
    });

    it('deve retornar response como Promise', () => {
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      const { response } = getPermissoesPorUsuarioEModel(mockParams);

      expect(response).toBeInstanceOf(Promise);
    });

    it('deve chamar paramsSerializer', async () => {
      mockGet.mockResolvedValueOnce({ data: mockResponse });

      getPermissoesPorUsuarioEModel(mockParams);

      expect(mockGet).toHaveBeenCalledWith(
        '/api/v1/usuarios/permissoes/',
        expect.objectContaining({
          paramsSerializer: mockQueryParamsSerializer,
        })
      );
    });

    it('deve retornar dados do response.data', async () => {
      const customResponse: IUsuarioPermissoes = {
        usuario: 'admin',
        permissoes: [
          {
            id: 10,
            codename: 'delete_all',
            name: 'Can delete all',
            app_label: 'admin',
            model: 'all',
          },
        ],
      };

      mockGet.mockResolvedValueOnce({ data: customResponse });

      const { response } = getPermissoesPorUsuarioEModel({ usuario: 'admin' });
      const result = await response;

      expect(result).toEqual(customResponse);
      expect(result.usuario).toBe('admin');
      expect(result.permissoes).toHaveLength(1);
      expect(result.permissoes[0].codename).toBe('delete_all');
    });

    it('deve tratar múltiplas permissões', async () => {
      const multiplePermissions: IUsuarioPermissoes = {
        usuario: 'user789',
        permissoes: [
          { id: 1, codename: 'view', name: 'View', app_label: 'app1', model: 'model1' },
          { id: 2, codename: 'add', name: 'Add', app_label: 'app2', model: 'model2' },
          { id: 3, codename: 'change', name: 'Change', app_label: 'app3', model: 'model3' },
          { id: 4, codename: 'delete', name: 'Delete', app_label: 'app4', model: 'model4' },
        ],
      };

      mockGet.mockResolvedValueOnce({ data: multiplePermissions });

      const { response } = getPermissoesPorUsuarioEModel({ usuario: 'user789', model: 'test' });
      const result = await response;

      expect(result.permissoes).toHaveLength(4);
    });
  });
});

