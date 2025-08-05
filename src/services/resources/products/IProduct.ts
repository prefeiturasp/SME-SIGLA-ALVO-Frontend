export interface INewProductForm {
  concurso: string;
  cargo: string;
   data_inicial: string;
  data_final: string;
  is_active: boolean;
}


export interface IProduct extends INewProductForm {
  id : number|undefined;
}


 

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}