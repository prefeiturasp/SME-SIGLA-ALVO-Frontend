import type {
  SituacaoEscolha,
  TipoVagaEscolha,
} from "../../../services/resources/escolhas/IEscolhas";
import type { IAgenda } from "../../../services/resources/agenda/IAgenda";

export type NormalizedCandidato = {
  uuid: string;
  raw: Record<string, unknown>;
  candidate: Record<string, unknown>;
};

export type CandidatoTabela = {
  uuid: string;
  nome: string;
  cargo: string;
  classificacao: string;
  situacao: string;
  situacaoCodigo: "pendente" | SituacaoEscolha;
  escolha: string;
  tipoVagaCodigo?: TipoVagaEscolha;
  retardatario?: boolean;
  vagaEscolaUuid?: string;
  escolhaUuid?: string;
  dreUuid?: string;
  dreCodigo?: string;
  vagasDefinitivas?: string;
  vagasPrecarias?: string;
  vagas?: string;
};

export type ModalEscolhaContext = {
  candidatoUuid: string;
  nome: string;
  cargo: string;
  classificacao: string;
  situacaoCodigo: "pendente" | SituacaoEscolha;
  situacaoLabel: string;
  escolhaLabel: string;
  vagasDefinitivas?: string;
  vagasPrecarias?: string;
  vagas?: string;
  vagaEscolaUuid?: string;
  tipoVagaCodigo?: TipoVagaEscolha;
  retardatario?: boolean;
  escolhaUuid?: string;
  dreUuid?: string;
  dreCodigo?: string;
};

export interface EscolhaCandidatosModalProps {
  visible: boolean;
  context: ModalEscolhaContext | null;
  selectedProcesso?: string;
  selectedProcessoStatus?: string;
  selectedConcursoUuid?: string;
  selectedAgendaData?: IAgenda;
  cargoCodigoNumericoParam?: string;
  onClose: () => void;
  onSuccess: () => void;
  canViewEscolha: boolean;
  canAddEscolha: boolean;
}

export interface EscolhaCandidatosTabelaProps {
  candidatosTableData: CandidatoTabela[];
  loading: boolean;
  hasSearched: boolean;
  isFetchingCandidatos: boolean;
  candidatosError: unknown;
  pagination: { current: number; pageSize: number };
  cargoCodigo?: string | number;
  selectedAgendaData?: IAgenda;
  onTableChange: (
    tablePagination: any,
    _filters: unknown,
    _sorter: unknown,
    extra: { action?: string } | undefined
  ) => void;
  onOpenModal: (record: CandidatoTabela) => void;
}

export type UseGetAgendasPorProcessoConvocacaoParams = {
  processoUuid?: string;
  enabled?: boolean;
};

export type UseGetCandidatosPorUuidParams = {
  uuids: string[];
  refreshToken?: number;
};

export type UseGetCandidatosPorUuidOptions = {
  enabled?: boolean;
};

export type UseGetCandidatosUuidsPorProcessoAgendaParams = {
  processoUuid?: string;
  agendaUuid?: string;
  cargoCodigo?: string | number;
  cargoUuid?: string;
  refreshToken?: number;
};

export type UseGetCandidatosUuidsPorProcessoAgendaOptions = {
  enabled?: boolean;
};

export type CargoProcesso = Record<string, unknown> & {
  cargo_uuid?: string;
  uuid?: string;
  codigo_cargo?: string | number;
  codigo?: string | number;
  id?: string | number;
  cargo?: {
    uuid?: string;
    id?: string;
    codigo?: string | number;
    codigo_cargo?: string | number;
  };
};

export type UseGetEscolhasPorCandidatosParams = {
  candidatoUuids: string[];
  enabled?: boolean;
  refreshToken?: number;
};

