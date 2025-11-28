jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    post: jest.fn(),
  }
}));

import { appAxiosAdminUsuarios } from '../../../axios';
import { postNovaSenha, URL } from '../novaSenha/index';
import type { INovaSenhaRequest, INovaSenhaResponse } from '../novaSenha/INovaSenha';

describe('Nova Senha Service', () => {
  const mockAxios = appAxiosAdminUsuarios as jest.Mocked<typeof appAxiosAdminUsuarios>;

  const mockNovaSenhaRequest: INovaSenhaRequest = {
    uid: 'user-uuid-123',
    token: 'reset-token-abc',
    nova_senha: 'NovaSenha@123',
    confirmar_senha: 'NovaSenha@123',
  };

  const mockNovaSenhaResponse: INovaSenhaResponse = {
    success: true,
    message: 'Senha alterada com sucesso',
    timestamp: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('retorna URL correta para criar nova senha', () => {
      expect(URL.novaSenha()).toBe('/api/v1/criar-nova-senha/');
    });
  });

  describe('postNovaSenha', () => {
    it('faz POST e retorna os dados de criação de nova senha', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockNovaSenhaResponse });

      const { response, abort } = postNovaSenha(mockNovaSenhaRequest);

      await expect(response).resolves.toEqual(mockNovaSenhaResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.novaSenha(),
        mockNovaSenhaRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST com axiosRequestConfig adicional', async () => {
      const axiosConfig = { headers: { 'X-Custom': 'value' } };
      mockAxios.post.mockResolvedValueOnce({ data: mockNovaSenhaResponse });

      const { response } = postNovaSenha(mockNovaSenhaRequest, axiosConfig);

      await expect(response).resolves.toEqual(mockNovaSenhaResponse);
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.novaSenha(),
        mockNovaSenhaRequest,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          headers: { 'X-Custom': 'value' },
        })
      );
    });

    it('expõe função abort', () => {
      mockAxios.post.mockResolvedValueOnce({ data: mockNovaSenhaResponse });

      const { abort } = postNovaSenha(mockNovaSenhaRequest);
      expect(typeof abort).toBe('function');
    });
  });
});

