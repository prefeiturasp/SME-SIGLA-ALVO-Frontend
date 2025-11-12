export interface ILoginRequest {
  usuario: string;
  senha: string;
}

export interface ILoginResponse {
  token: string;
  codigoRf: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}
