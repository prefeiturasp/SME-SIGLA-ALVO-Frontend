export interface ILoginRequest {
  usuario: number;
  senha: string;
}

export interface ILoginResponse {
  token: string;
  usuario: {
    id: string;
    nome: string;
    email: string;
  };
}
