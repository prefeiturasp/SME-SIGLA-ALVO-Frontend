import type { AxiosRequestConfig } from "axios";
import { appAxios, appAxiosServico1 } from "../../axios";
import type { IProduct, IProcessoConvocacao, IConcursoOptions } from "./IConvocacao";
import type { IListRequest, PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getProcessosConvocacao: () => `/api/processos-convocacao`,
  getConcursos: () => `/api/concursos`,
  createProduct: () => `api/products/create`,
  editProduct: (id:number) => `api/products/update/${id}/`,
  deleteProduct: (id:number) => `api/products/delete/${id}/`,
};


  

// TODO adicionar JWT no header Authorization
export const getProcessosConvocacao = (
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const { signal, abort } = new AbortController();

  const response = appAxios
    .get<PaginatedResponse<IProcessoConvocacao>>(URL.getProcessosConvocacao(), {
      params: { ...pagination, ...filters, ...rest },
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data.results);

  return {
    response,
    abort,
  };
};

 

export const createProduct = (
  NewProduct: IProcessoConvocacao,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxios
    .post<IProcessoConvocacao>(URL.createProduct(), NewProduct, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};


export const editProduct = (
  NewProduct: IProduct,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxios
    .put<IProduct>(URL.editProduct(NewProduct.id!), NewProduct, {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};



export const deleteProduct = (
  id: number,
  axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxiosServico1
    .delete(URL.deleteProduct(id),  {
      signal: axiosRequestConfig?.signal || signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};

// TODO adicionar JWT no header Authorization
export const getConcursosOptions = (
   axiosRequestConfig?: AxiosRequestConfig
) => {
   const { signal, abort } = new AbortController();

  const response = appAxios
    .get<IConcursoOptions[]>(URL.getConcursos(), {
       signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

  return {
    response,
    abort,
  };
};
