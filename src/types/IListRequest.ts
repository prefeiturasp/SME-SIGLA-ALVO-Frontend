
 
export interface IFullListRequest<FilterT = {}> {
  filters?: FilterT;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IListRequest<FilterT = {}> extends IFullListRequest<FilterT> {
  pagination: { pageNumber: number; pageSize?: number };
}






export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}