export interface IMeusDadosResponse {
  rf: string;
  nome_completo: string;
  email: string;
  perfil_acesso: string[];
}

export interface IAlterarSenhaRequest {
  senha_atual: string;
  nova_senha: string;
  confirmacao_nova_senha: string;
}

export interface IBuscarUsuarioEolRequest {
  rf: string;
}

export interface IBuscarUsuarioEolResponse {
  username: string;
  nome: string;
  email: string;
}

export interface ICriarUsuarioRequest {
  username: string;
  nome: string;
  email: string;
}
