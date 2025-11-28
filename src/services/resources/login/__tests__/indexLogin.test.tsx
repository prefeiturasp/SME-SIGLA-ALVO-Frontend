jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    post: jest.fn(),
  }
}));

import { appAxiosAdminUsuarios } from '../../../axios';
import { postLogin, URL } from '../index';
import type { ILoginRequest, ILoginResponse } from '../ILogin';

describe('Login Service', () => {
  const mockAxios = appAxiosAdminUsuarios as jest.Mocked<typeof appAxiosAdminUsuarios>;

  const mockLoginRequest: ILoginRequest = {
    usuario: 'usuario_teste',
    senha: 'senha123',
  };

  const mockLoginResponse: ILoginResponse = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
    codigoRf: '1234567',
    usuario: {
      id: 'user-uuid-123',
      nome: 'Usuário Teste',
      email: 'usuario@teste.com',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('retorna URL correta para login', () => {
      expect(URL.login()).toBe('/api/v1/login/');
    });
  });

  describe('postLogin', () => {
    it('faz POST e retorna os dados de autenticação', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockLoginResponse });

      const { response, abort } = postLogin(mockLoginRequest);

      await expect(response).resolves.toEqual(mockLoginResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.login(),
        mockLoginRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.post.mockResolvedValueOnce({ data: mockLoginResponse });

      const { response } = postLogin(mockLoginRequest, axiosConfig);

      await expect(response).resolves.toEqual(mockLoginResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.login(),
        mockLoginRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockLoginResponse });

      const { abort } = postLogin(mockLoginRequest);
      expect(typeof abort).toBe('function');
    });
  });
});

