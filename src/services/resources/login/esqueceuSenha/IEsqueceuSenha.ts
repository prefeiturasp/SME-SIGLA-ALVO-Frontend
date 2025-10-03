export interface IEsqueceuSenhaRequest {
  rf: string;
}

export interface IEsqueceuSenhaResponse {
  success: boolean;
  message: string;
  solicitacao_id?: string;
  usuario?: {
    id: string;
    nome: string;
    rf: string;
    email: string;
  };
  timestamp?: string;
}
