jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    post: jest.fn(),
  }
}));

import { appAxiosAdminUsuarios } from '../../../axios';
import { postEsqueceuSenha, URL } from '../esqueceuSenha/index';
import type { IEsqueceuSenhaRequest, IEsqueceuSenhaResponse } from '../esqueceuSenha/IEsqueceuSenha';

describe('Esqueceu Senha Service', () => {
  const mockAxios = appAxiosAdminUsuarios as jest.Mocked<typeof appAxiosAdminUsuarios>;

  const mockEsqueceuSenhaRequest: IEsqueceuSenhaRequest = {
    rf: '1234567',
  };

  const mockEsqueceuSenhaResponse: IEsqueceuSenhaResponse = {
    success: true,
    message: 'Email enviado com sucesso',
    email: 'usuario@teste.com',
    usuario: 'Usuario Teste',
    timestamp: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('retorna URL correta para esqueci minha senha', () => {
      expect(URL.esqueceuSenha()).toBe('/api/v1/esqueci-minha-senha/');
    });
  });

  describe('postEsqueceuSenha', () => {
    it('faz POST e retorna os dados de recuperação de senha', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockEsqueceuSenhaResponse });

      const { response, abort } = postEsqueceuSenha(mockEsqueceuSenhaRequest);

      await expect(response).resolves.toEqual(mockEsqueceuSenhaResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.esqueceuSenha(),
        mockEsqueceuSenhaRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.post.mockResolvedValueOnce({ data: mockEsqueceuSenhaResponse });

      const { response } = postEsqueceuSenha(mockEsqueceuSenhaRequest, axiosConfig);

      await expect(response).resolves.toEqual(mockEsqueceuSenhaResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.esqueceuSenha(),
        mockEsqueceuSenhaRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockEsqueceuSenhaResponse });

      const { abort } = postEsqueceuSenha(mockEsqueceuSenhaRequest);
      expect(typeof abort).toBe('function');
    });
  });
});

