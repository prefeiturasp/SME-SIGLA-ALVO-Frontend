export interface IEsqueceuSenhaRequest {
  rf: string;
}

export interface IEsqueceuSenhaResponse {
  success: boolean;
  message: string;
  email?: string;
  usuario?: string;
  timestamp?: string;
}
