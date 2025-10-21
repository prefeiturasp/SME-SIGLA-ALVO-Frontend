export interface ICargos {
  value: string;
  label: string;
  codigo: string;
}

export interface ICargos2 {
  uuid: string;
  nome: string;
  codigo: string;
}

export interface IConcurso {
    label: string;
    value: string;
    cargos: ICargos[]; 
  }


