import type { AxiosRequestConfig } from "axios";
import { appAxiosAgenda } from "../../axios";
import type { PaginatedResponse } from "../../../types/IListRequest";
import queryParamsSerializer from "../../../utils/queryParamsSerializer";
import type { IAgenda, ICandidatosClassificados } from "./IAgenda";

export const URL = {
    getAgenda: (processoUuid: string) => `/api/v1/agendas/?processo_uuid=${processoUuid}`,
};


  

// TODO adicionar JWT no header Authorization
export const getAgenda = (
  processoUuid: string,
  axiosRequestConfig?: AxiosRequestConfig
) => {
  const { signal, abort } = new AbortController();

  const response = appAxiosAgenda
    .get<ICandidatosClassificados[]>(URL.getAgenda(processoUuid), {
      paramsSerializer: queryParamsSerializer,
      signal,
      ...axiosRequestConfig,
    })
    .then((response) => response.data);

   const test: ICandidatosClassificados[] = [
      {
      uuid: "1",
      qtd_candidatos: 2,
      classificacao: "1a até 2a",
      data_escolha: "07/10/2025",
      sessao: "2",      
      horario: "03:00 às 21:00",
      cargo_nome: "Cargo abc",
      cargo_uuid: "uuid",
      processo_uuid: "uuid"
    },
    {
      uuid: "1",
      qtd_candidatos: 1,
      classificacao: "9a",
      data_escolha: "07/10/2025",
      sessao: "4",
      horario: "03:00 às 21:00",
      cargo_nome: "Cargo abc",
      cargo_uuid: "uuid",
      processo_uuid: "uuid"
    }]
  return {    
    response: test,    
    abort,
  };
};