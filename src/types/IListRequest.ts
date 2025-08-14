
 
export interface IFullListRequest<FilterT = {}> {
  filters?: FilterT;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IListRequest<FilterT = {}> extends IFullListRequest<FilterT> {
  pagination: { page: number; page_size?: number };
}






export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  page_size: number;
  results: T[];
}




export interface IBackendOptions { 
  value: string;
  label: string;
}
export interface IBackendWithSubOptions {
    cargos: IBackendOptions[]
    concursos: IBackendOptions[]
}
