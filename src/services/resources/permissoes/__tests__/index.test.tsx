import type { IUsuarioPermissoes, IUsuarioPermissoesRequest } from '../IPermissoes';

// Mock do axios
const mockGet = jest.fn();
const mockPatch = jest.fn();
const mockPut = jest.fn();
jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    get: mockGet,
    patch: mockPatch,
    put: mockPut,
  },
}));

// Mock do queryParamsSerializer
const mockQueryParamsSerializer = jest.fn();
jest.mock('../../../../utils/queryParamsSerializer', () => mockQueryParamsSerializer);

// Importar após os mocks
const {
  URL,
  getPermissoesPorUsuarioEModel,
  getUsuariosComGrupos,
  patchUsuario,
  getGruposDisponiveis,
  putGerenciarUsuariosGrupo,
} = require('../index');

describe('Permissões Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('deve retornar URL correta para getPermissoesPorUsuarioEModel', () => {
      expect(URL.getPermissoesPorUsuarioEModel()).toBe('/api/v1/usuarios/permissoes/');
    });

    it('deve retornar URLs corretas para endpoints de grupos', () => {
      expect(URL.usuariosComGrupos()).toBe('/api/v1/usuarios/grupos/');
      expect(URL.gruposDisponiveis()).toBe('/api/v1/grupos/');
      expect(URL.gerenciarUsuariosGrupo()).toBe('/api/v1/grupos/usuarios/');
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

  describe('funções de gerenciamento de grupos', () => {
    it('getUsuariosComGrupos faz GET com params e retorna dados', async () => {
      const payload = { results: [{ username: 'user1' }] };
      mockGet.mockResolvedValueOnce({ data: payload });

      const { response, abort } = getUsuariosComGrupos({ usuario: 'user1' });
      await expect(response).resolves.toEqual(payload);
      expect(mockGet).toHaveBeenCalledWith(
        URL.usuariosComGrupos(),
        expect.objectContaining({
          params: { usuario: 'user1' },
          paramsSerializer: mockQueryParamsSerializer,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('patchUsuario faz PATCH e respeita config adicional', async () => {
      const req = { usuario: 'u1', is_active: true };
      const res = { ok: true };
      mockPatch.mockResolvedValueOnce({ data: res });

      const { response, abort } = patchUsuario(req, { timeout: 2500 });
      await expect(response).resolves.toEqual(res);
      expect(mockPatch).toHaveBeenCalledWith(
        URL.usuariosComGrupos(),
        req,
        expect.objectContaining({
          timeout: 2500,
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('getGruposDisponiveis faz GET simples', async () => {
      const res = [{ id: 1, nome: 'Gestores' }];
      mockGet.mockResolvedValueOnce({ data: res });

      const { response } = getGruposDisponiveis();
      await expect(response).resolves.toEqual(res);
      expect(mockGet).toHaveBeenCalledWith(
        URL.gruposDisponiveis(),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });

    it('putGerenciarUsuariosGrupo faz PUT com payload', async () => {
      const req = { grupo_uuid: 'g1', usuarios_uuids: ['u1', 'u2'] };
      const res = { success: true };
      mockPut.mockResolvedValueOnce({ data: res });

      const { response } = putGerenciarUsuariosGrupo(req);
      await expect(response).resolves.toEqual(res);
      expect(mockPut).toHaveBeenCalledWith(
        URL.gerenciarUsuariosGrupo(),
        req,
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
    });
  });
});

