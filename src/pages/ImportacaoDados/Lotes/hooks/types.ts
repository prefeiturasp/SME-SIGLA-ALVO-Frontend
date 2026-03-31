export interface IImportacaoLotesFiltros {
  concurso: string | undefined;
  arquivo: File | null;
}

export interface IImportacaoLotesPayload {
  concurso_nome: string;
  concurso_uuid: string;
  arquivo: File;
}

export interface IDetalheLoteAtualizado {
  lote: string;
  empresa: string;
  vaga: string;
  identificacao: string;
  chave_inscrito: string;
  numfunc: string;
  numvinc: string;
}

export interface IImportacaoLotesResponse {
  uuid: string;
  nome_arquivo: string;
  arquivo: string;
  concurso_uuid: string;
  concurso_nome: string | null;
  status: 'PENDENTE' | 'CONCLUIDO' | 'ERRO';
  total_atualizados: number | null;
  erros: { mensagem: string; erros: string; criado_em: string }[] | null;
  detalhes: IDetalheLoteAtualizado[] | null;
  criado_em: string;
  atualizado_em: string;
}
