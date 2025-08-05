import type { AxiosRequestConfig } from "axios";
import { appAxios, appAxiosServico1 } from "../../axios";
import type { IProduct, INewProductForm, PaginatedResponse } from "./IProduct";
import type { IListRequest } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";

export const URL = {
  getProductsData: () => `api/products`,
  createProduct: () => `api/products/create`,
  editProduct: (id:number) => `api/products/update/${id}/`,
  deleteProduct: (id:number) => `api/products/delete/${id}/`,
};


//TODO add o token no request de cada verbo  
 

export const getProductsData = (
  listRequest: IListRequest,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { pagination, filters, ...rest } = listRequest;
  const { signal, abort } = new AbortController();
  const response = appAxios
    .get<PaginatedResponse<IProduct>>(URL.getProductsData(), {
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
  NewProduct: INewProductForm,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxios
    .post<INewProductForm>(URL.createProduct(), NewProduct, {
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
    .put<IProduct>(URL.editProduct(NewProduct.id), NewProduct, {
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