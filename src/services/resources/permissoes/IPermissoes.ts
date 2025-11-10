export interface IUsuarioPermissoesRequest {
  usuario: string;
  model?: string;
}



export interface IUsuarioPermissoesItem {
  id: number;
  codename: string;
  name: string;
  app_label: string;
  model: string;
}

export interface IUsuarioPermissoes {
  usuario: string;
  permissoes: IUsuarioPermissoesItem[];
}