jest.mock('../../../axios', () => ({
  appAxiosAdminUsuarios: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { appAxiosAdminUsuarios } from '../../../axios';
import { getMeusDados, postAlterarSenha, URL } from '../index';
import type { IMeusDadosResponse, IAlterarSenhaRequest } from '../IUsuarios';

describe('Usuarios Service', () => {
  const mockAxios = appAxiosAdminUsuarios as jest.Mocked<typeof appAxiosAdminUsuarios>;

  const mockMeusDados: IMeusDadosResponse = {
    rf: '1234567',
    nome_completo: 'João da Silva',
    email: 'joao@prefeitura.sp.gov.br',
    perfil_acesso: ['Gestor', 'Analista'],
  };

  const mockAlterarSenhaPayload: IAlterarSenhaRequest = {
    senha_atual: 'SenhaAtual1!',
    nova_senha: 'NovaSenha1!',
    confirmacao_nova_senha: 'NovaSenha1!',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL', () => {
    it('retorna URL correta para meus-dados', () => {
      expect(URL.meusDados()).toBe('/api/v1/meus-dados/');
    });

    it('retorna URL correta para alterar-senha', () => {
      expect(URL.alterarSenha()).toBe('/api/v1/alterar-senha/');
    });
  });

  describe('getMeusDados', () => {
    it('faz GET e retorna os dados do usuário', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: mockMeusDados });

      const { response, abort } = getMeusDados();

      await expect(response).resolves.toEqual(mockMeusDados);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.meusDados(),
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz GET com axiosRequestConfig adicional', async () => {
      const config = { headers: { 'X-Custom': 'valor' } };
      mockAxios.get.mockResolvedValueOnce({ data: mockMeusDados });

      const { response } = getMeusDados(config);

      await expect(response).resolves.toEqual(mockMeusDados);
      expect(mockAxios.get).toHaveBeenCalledWith(
        URL.meusDados(),
        expect.objectContaining({ headers: { 'X-Custom': 'valor' } })
      );
    });
  });

  describe('postAlterarSenha', () => {
    it('faz POST e retorna o detail de sucesso', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: { detail: 'Senha alterada com sucesso' } });

      const { response, abort } = postAlterarSenha(mockAlterarSenhaPayload);

      await expect(response).resolves.toEqual({ detail: 'Senha alterada com sucesso' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.alterarSenha(),
        mockAlterarSenhaPayload,
        expect.objectContaining({ signal: expect.any(AbortSignal) })
      );
      expect(typeof abort).toBe('function');
    });

    it('faz POST com axiosRequestConfig adicional', async () => {
      const config = { headers: { 'X-Custom': 'valor' } };
      mockAxios.post.mockResolvedValueOnce({ data: { detail: 'ok' } });

      const { response } = postAlterarSenha(mockAlterarSenhaPayload, config);

      await expect(response).resolves.toEqual({ detail: 'ok' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        URL.alterarSenha(),
        mockAlterarSenhaPayload,
        expect.objectContaining({ headers: { 'X-Custom': 'valor' } })
      );
    });

    it('propaga erro quando a requisição falha', async () => {
      mockAxios.post.mockRejectedValueOnce(new Error('Network Error'));

      const { response } = postAlterarSenha(mockAlterarSenhaPayload);

      await expect(response).rejects.toThrow('Network Error');
    });
  });
});
