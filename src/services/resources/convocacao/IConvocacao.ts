export interface IProcessoConvocacao {
  nome: string;
  data_convocacao: string;
  status: string; 
}


export interface ISample extends IProcessoConvocacao {
  id : number|undefined;
}


export interface IFiltroProcessos {
  concurso?: string;
  cargo?: string;
  data_inicial?: string;
  data_final?: string;
}

  


export interface IOptions {
  value: string;
  label: string;   
}

 
 

 

