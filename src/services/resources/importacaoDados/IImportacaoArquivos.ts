export interface IImportacaoFundacao {
  uuid: string;
  arquivo: string;
  concurso: string;
  data_importacao: string;
}

export interface ILayoutCampo {
  key: string;
  campo: string;
  ordem: number;
  coluna: string;
  tamanho: number;
  tipoDado: string;
  campo_payload: string;
  regrasValidacao: string;
}

export interface ILayoutResult {
  uuid: string;
  tipo: string;
  estrutura: ILayoutCampo[];
}

export interface ILayoutPadrao {
  count: number;
  next: string | null;
  previous: string | null;
  results: ILayoutResult[];
}

// export interface IConcursoFundacao {
//   value: string;
//   label: string;
//   codigo: string;
//   descricao: string;
//   ativo: boolean;
// }

// export interface IUltimaImportacao {
//   arquivo: string;
//   concurso: string;
//   data_importacao: string;
//   status: string;
// }

// export interface IImportacaoRequest {
//   concurso: string;
//   arquivo: File;
//   ignorar_primeira_linha: boolean;
// }

// export interface IImportacaoResponse {
//   id: string;
//   message: string;
//   status: string;
//   total_linhas: number;
// }
