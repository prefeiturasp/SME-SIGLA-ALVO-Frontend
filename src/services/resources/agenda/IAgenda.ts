  


  export interface ICandidatosClassificados {
    uuid: string;
    qtd_candidatos: number;
    classificacao: string;
    data_escolha: string;  
    sessao: string;  
    horario: string;
    cargo_nome: string;
    cargo_uuid: string;
    processo_uuid: string;
  }
 
  export interface IAgenda {
    
    cargo_nome: string;
    candidatos_classificados: ICandidatosClassificados[];
  }
 