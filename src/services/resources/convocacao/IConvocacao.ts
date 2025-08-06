export interface IProcessoConvocacao {
  nome: string;
  data_convocacao: string;
  status: string; 
}


export interface IProduct extends IProcessoConvocacao {
  id : number|undefined;
}


export interface IFiltroProcessos {
  concurso: string;
  cargo: string;
  data_inicial: string;
  data_final: string;
}

 



export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}