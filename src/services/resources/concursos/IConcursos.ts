export interface ICargos {
  label: string;
  value: string;
}

export interface IConcurso {
    label: string;
    value: string;
    cargos: ICargos[]; 
  }


