export interface ICargoProcessoConvocacao {
  uuid: string;
  cargo_nome: string;
  cargo_uuid: string;
  cargo_codigo: string;
  processo: string;
  criado_em?: string;
  atualizado_em?: string;
}

export interface IProcessoConvocacaoDetalhe {
  uuid: string;
  concurso_uuid: string;
  concurso_nome: string;
  descricao: string;
  tipo_escolha: string;
  status: string;
  data_convocacao: string;
  data_corte_vagas: string;
  cargos_processo: ICargoProcessoConvocacao[];
}

export interface IProcessoConvocacao {
concurso_nome : string;
concurso_uuid : string;
criado_em : string;
data_convocacao : string;
data_corte_vagas : string;
descricao : string;
numero_convocados : number
quantidade_cargos : number
status : string;
tipo_escolha : string;
uuid : string;
}
export interface IProcessoConvocacaoResumo {

  uuid: string;
  concurso_uuid: string;
  concurso_nome: string;
  descricao: string;
  tipo_escolha: string;
  status: string;
  data_convocacao: string;
  data_corte_vagas: string;
  criado_em: string;
  atualizado_em: string;
  numero_convocacao: string;
}
export interface IPostProcessoConvocacaoPayload {
  status?: string;
  concurso_nome: string;
  concurso_uuid: string;
  tipo_escolha: string;
  descricao: string;
  data_convocacao: string;
  data_corte_vagas: string;
}


export interface ISample extends IProcessoConvocacao {
  id : number|undefined;
}


export interface IFiltroProcessos {
  concurso_uuid?: string;
  cargo_uuid?: string;
  data_convocacao_inicio?: string;
  data_convocacao_fim?: string;
  status?: string;
}

  


export interface IOptions {
  value: string;
  label: string;   
}

 
 
export interface IUnidadeEscolar {
  uuid:string;
  codigo_eol: string;
  dre: string;
  tipo: string; 
  nome_oficial: string; 
  vagas_definitivas: number; 
  vagas_precarias: number; 
  editable?:boolean;
  dres: IOptions[];
}




 
 
export interface IDre {
  uuid: string;
  codigo: string;
  nome: string;
}

export interface IEscola {
  codigo_eol: string;
  nome_oficial: string;
  dre: IDre;
}

export interface IVaga {
  checked?: boolean;
  uuid: string;
  lote_uuid: string;
  data_fechamento_modulo: string; // ISO date string
  cargo_codigo: number;
  cargo_descricao: string;
  vagas_precarias: number;
  vagas_definitivas: number;
  vagas_precarias_utilizadas: number;
  vagas_definitivas_utilizadas: number;
  vagas_precarias_restantes?: number;
  vagas_definitivas_restantes?: number;
  status: string;
  escola: IEscola;
  criado_em: string; // ISO date string
  atualizado_em: string; // ISO date string
}

export interface IVagasResponse {
  vagas: IVaga[];
  total_vagas: number;
  dres: IDre[];
}



export interface IConvocacaoModal {
    id : number|undefined;

  dre: string;
  escola: string;
  stock: number;
  price: number;
  is_active:boolean;
}

export interface IConvocacaoFiltros {
    

  dre: string;
  escola: string;
  
}

export interface ICargoProcesso {
  uuid?: string;
  nome: string;
  cargo_uuid: string;
  vagas: number;
  geral: number;
  pcd: number;
  nna: number;
  total_candidatos: number;
}

export interface ICartaConvocacaoPayload {
  processo_uuid: string;
  processo_nome: string;
  data: string; 
}

export interface ICartaConvocacaoResponse {
  detail: string;
  historico_uuid: string;
  processo_uuid: string;
  processo_nome: string;
  data: string;
  quantidade_candidatos: number;
}

export interface IHistoricoCartaConvocacao {
  uuid: string;
  processo_nome: string;
  processo_uuid: string;
  data: string;
  criado_em?: string;
  quantidade_convocados: number;
}

export interface ICandidatoCartaConvocacao {
  nome: string;
  rf: string;
  email: string;
  status: string;
  conteudo: string;
}

export interface IHistoricoCartaConvocacaoDetalhe extends IHistoricoCartaConvocacao {
  candidatos: ICandidatoCartaConvocacao[];
}