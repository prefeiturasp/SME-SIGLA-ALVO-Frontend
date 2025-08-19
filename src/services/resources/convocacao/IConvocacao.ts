export interface IProcessoConvocacao {
  concurso_nome: string;
  data_convocacao: string;
  status: string; 
  uuid: string; 
}


export interface ISample extends IProcessoConvocacao {
  id : number|undefined;
}


export interface IFiltroProcessos {
  concurso_uuid?: string;
  cargo_uuid?: string;
  data_convocacao_inicio?: string;
  data_convocacao_fim?: string;
}

  


export interface IOptions {
  value: string;
  label: string;   
}

 
 

 

