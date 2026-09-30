export type ContagemGrupo = {
  total: number;
  geral: number;
  pcd: number;
  nna: number;
};

export type LinhaHistoricoCandidatos = {
  key: string;
  descricao: string;
  data: string;
  convocados: ContagemGrupo;
  escolhas: ContagemGrupo;
  naoEscolhas: ContagemGrupo;
  reconvocacao: ContagemGrupo;
};
