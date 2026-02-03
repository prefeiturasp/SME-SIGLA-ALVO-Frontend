export interface IAutorizacaoPublicada {
    uuid: string;
    cargo: string;
    codigo: string;
    autorizacoes: number;
    autorizacoes_sem_efeito: number;
    data_autorizacao_mais_recente: string;
    observacao: string;
}
