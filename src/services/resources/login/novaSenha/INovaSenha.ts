export interface INovaSenhaRequest {
  uid: string;
  token: string;
  nova_senha: string;
  confirmar_senha: string;
}

export interface INovaSenhaResponse {
  success: boolean;
  message: string;
  timestamp?: string;
}

