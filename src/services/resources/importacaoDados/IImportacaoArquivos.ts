export interface IImportacaoFundacao {
  uuid: string;
  arquivo: string;
  concurso: string;
}
export interface IErroImportacao {
  mensagem: string;
  erros: string;
  criado_em: string;
}

export interface IErroImportacaoResposta {
  mensagem: string;
  erros: string;
  concurso_uuid: string | null;
  processo_uuid: string | null;
}

export interface IUltimasImportacoesVagas {
  uuid: string;
  nome_arquivo: string;
  processo_nome: string;
  criado_em: string;
  status: string;
  erros?: IErroImportacao[] | null;
}


export interface IGetLayout {    
      atualizado_em: string,
      estrutura:ILayout[],
}
export interface ILayout {
      key: string,
      ordem: number,
      campo: string,
      tipoDado: string,
      tamanho: number,
      regrasValidacao: string,
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

export interface IImportacaoEscolhasPayload {
  processo_uuid: string;
  processo_id?: number; // Opcional - backend buscará automaticamente se não fornecido
  concurso_uuid: string;
}

export interface IImportacaoEscolhasResponse {
  uuid: string;
  processo_uuid: string;
  processo_id: number | null;
  concurso_uuid: string;
  dados_prodam: any | null;
  status: string;
  criado_em: string;
  atualizado_em: string;
  erros?: IErroImportacao[] | null;
}

export interface IUltimasImportacoesEscolhas {
  uuid: string;
  processo_uuid: string;
  processo_nome?: string; // Será buscado no frontend se não vier do backend
  criado_em: string;
  status: string;
  erros?: IErroImportacao[] | null;
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
 // }

// export interface IImportacaoResponse {
//   id: string;
//   message: string;
//   status: string;
//   total_linhas: number;
// }
