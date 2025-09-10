export interface IImportacaoFundacao {
  uuid: string;
  arquivo: string;
  concurso: string;
  data_importacao: string;
}
export interface IUltimasImportacoesVagas {
  uuid: string;
  metodo_de_importacao: string;
  data_de_fechamento_do_modulo: string;
  cargo: string;
  opcoes_de_importacao: string;
  data_importacao: string;  
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
