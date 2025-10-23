export interface IEscolhas {
  uuid: string;
  data_fechamento_modulo: string;
  cargo_codigo: number;
  cargo_descricao: string;
  vagas_precarias: number;
  vagas_definitivas: number;
  status: string;
  escola_uuid: string;
  concurso_nome: string;
  concurso_uuid: string;    
}


export interface IEscolhasFiltro {
  processo_uuid: string;
  cargo_codigo: string;
}
