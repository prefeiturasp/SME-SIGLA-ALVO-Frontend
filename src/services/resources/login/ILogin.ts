export interface ILoginRequest {
  usuario: string;
  senha: string;
}

export interface ILoginResponse {
  token: string;
  codigoRf: string;
  usuario: {
    id: string;
    // Alguns backends retornam `nome`, outros `first_name`
    nome?: string;
    first_name?: string;
    email?: string;
  };
}
