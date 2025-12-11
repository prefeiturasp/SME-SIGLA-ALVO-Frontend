import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Checkbox,
  Col,
  Spin,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { DefaultOptionType } from "antd/es/select";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import StreetviewIcon from "@mui/icons-material/Streetview";
import AccessibleIcon from "@mui/icons-material/Accessible";
import { SearchOutlined } from "@ant-design/icons";

import BaseTela, { type TitleItem } from "../Base/BaseTela";
import EmptyStateIllustration from "../../assets/tela-inicial-escolha-cand.png";
import { useGetProcessosConvocacaoOptions } from "./hooks/useGetProcessosConvocacaoOptions";
import { useGetAgendasPorProcessoConvocacao } from "./hooks/useGetAgendasPorProcessoConvocacao";
import { useGetCargosPorProcessoConvocacao } from "./hooks/useGetCargosPorProcessoConvocacao";
import { useGetCandidatosPorUuid } from "./hooks/useGetCandidatosPorUuid";
import { useGetEscolhasPorCandidatos } from "./hooks/useGetEscolhasPorCandidatos";
import { useGetCandidatosUuidsPorProcessoAgenda } from "./hooks/useGetCandidatosUuidsPorProcessoAgenda";
import type { IAgenda } from "../../services/resources/agenda/IAgenda";
import {
  StyledCardAmpla,
  StyledCardNNA,
  StyledCardPCD,
  commonStyles as selecaoCommonStyles,
  GlobalStyles as SelecaoGlobalStyles,
} from "../CriarEditarConvocacao/SelecaoCargos/styles";
import {
  FilterSelect,
  FilterButton,
  ContentWrapper,
  FiltersRow,
  FiltersCard,
  FilterLabel,
  ButtonCol,
  EmptyStateCard,
  EmptyStateContent,
  EmptyStateImage,
  EmptyStateTitle,
  EmptyStateDescription,
  ResultsCard,
  ResultsContent,
  CardsWrapper,
  SituacaoFiltersRow,
  SituacaoCheckboxWrapper,
  ButtonActionsWrapper,
} from "./styles";
import {
  FieldLabel as ConvocacaoFieldLabel,
  SearchButton as ConvocacaoSearchButton,
  ClearButton as ConvocacaoClearButton,
} from "../Processos/ConvocacaoCandidatos/style";
import type {
  IEscolhaCandidato,
  SituacaoEscolha,
  TipoVagaEscolha,
} from "../../services/resources/escolhas/IEscolhas";
import type {
  NormalizedCandidato,
  CandidatoTabela,
  ModalEscolhaContext,
} from "./hooks/types";
import EscolhaCandidatosModal from "./components/EscolhaCandidatosModal";
import EscolhaCandidatosTabela from "./components/EscolhaCandidatosTabela";

const formatAgendaOptionLabel = (agenda: IAgenda): string => {
  const dataEscolha = agenda.escolha_em || agenda.data_escolha;
  const formattedDate = dataEscolha
    ? dayjs(dataEscolha).isValid()
      ? dayjs(dataEscolha).format("DD/MM/YY")
      : dataEscolha
    : "Data não informada";

  const normalizeTime = (value?: string | null, fallback?: string) => {
    if (typeof value === "string" && value.length >= 5) {
      return value.slice(0, 5);
    }
    if (typeof fallback === "string" && fallback.length >= 5) {
      return fallback;
    }
    return "00:00";
  };

  const gerarRangeSessao = (sessao?: string | number | null) => {
    if (!sessao) return undefined;
    const numeroSessao = Number(sessao);
    if (!Number.isFinite(numeroSessao) || numeroSessao < 1) {
      return undefined;
    }
    const base = dayjs(agenda.escolha_em || agenda.data_escolha || undefined).startOf(
      "day"
    );
    if (!base.isValid()) {
      return undefined;
    }
    const inicio = base.add(numeroSessao - 1, "hour");
    const fim = inicio.add(1, "hour");
    return [inicio.format("HH:mm"), fim.format("HH:mm")] as const;
  };

  const sessaoFallback = gerarRangeSessao(agenda.sessao);
  const horaInicio = normalizeTime(
    agenda.hora_convocacao_inicio,
    sessaoFallback?.[0]
  );
  const horaFim = normalizeTime(
    agenda.hora_convocacao_fim,
    sessaoFallback?.[1]
  );

  const cargoNome = agenda.cargo_nome || "Cargo não informado";

  return `${formattedDate} - ${horaInicio} às ${horaFim} - ${cargoNome}`;
};

const filterOptionByLabel = (input: string, option?: DefaultOptionType) => {
  const label = option?.label;

  if (typeof label === "string") {
    return label.toLowerCase().includes(input.toLowerCase());
  }

  if (Array.isArray(label)) {
    return label.join(" ").toLowerCase().includes(input.toLowerCase());
  }

  if (label && typeof label === "object" && "props" in label) {
    const children = (label as { props?: { children?: unknown } }).props?.children;
    if (typeof children === "string") {
      return children.toLowerCase().includes(input.toLowerCase());
    }
  }

  if (typeof option?.value === "string") {
    return option.value.toLowerCase().includes(input.toLowerCase());
  }

  return false;
};

const normalizeCodigo = (value: unknown): string | number | undefined =>
  typeof value === "string" || typeof value === "number" ? value : undefined;

const parsePositiveNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/\D+/g, "");
    if (!normalized) {
      return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
};

const parseNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^\d-]/g, "");
    if (!normalized) {
      return 0;
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const formatClassification = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "—";
};

const formatVacancyValue = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "0";
};

const formatSituacaoLabel = (value: string): string => {
  switch (value) {
    case "escolha":
      return "Escolha";
    case "reconvocacao":
      return "Reconvocação";
    case "nao-escolha":
      return "Não escolha";
    case "pendente":
      return "Pendente";
    default:
      return value.charAt(0).toUpperCase() + value.slice(1);
  }
};

const formatTipoVagaLabel = (value: string | undefined): string => {
  if (!value) {
    return "—";
  }
  if (value === "precaria") {
    return "Precária";
  }
  if (value === "definitiva") {
    return "Definitiva";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const isSituacaoEscolha = (value: unknown): value is SituacaoEscolha =>
  value === "escolha" || value === "reconvocacao" || value === "nao-escolha";

const isTipoVagaEscolha = (value: unknown): value is TipoVagaEscolha =>
  value === "precaria" || value === "definitiva";

const EscolhaCandidatosTela: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProcesso, setSelectedProcesso] = useState<string>();
  const [selectedAgenda, setSelectedAgenda] = useState<string>();
  const [hasSearched, setHasSearched] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [situacaoFiltro, setSituacaoFiltro] = useState<{
    pendente: boolean;
    escolha: boolean;
    reconvocacao: boolean;
    naoEscolha: boolean;
  }>({
    pendente: false,
    escolha: false,
    reconvocacao: false,
    naoEscolha: false,
  });
  const [modalEscolhaVisible, setModalEscolhaVisible] = useState(false);
  const [modalEscolhaContext, setModalEscolhaContext] =
    useState<ModalEscolhaContext | null>(null);

  const situacoesSelecionadas = useMemo(() => {
    const list: string[] = [];
    if (situacaoFiltro.pendente) list.push("pendente");
    if (situacaoFiltro.escolha) list.push("escolha");
    if (situacaoFiltro.reconvocacao) list.push("reconvocacao");
    if (situacaoFiltro.naoEscolha) list.push("nao-escolha");
    return list;
  }, [situacaoFiltro]);

  const situacaoTodosChecked = useMemo(
    () =>
      situacaoFiltro.pendente &&
      situacaoFiltro.escolha &&
      situacaoFiltro.reconvocacao &&
      situacaoFiltro.naoEscolha,
    [situacaoFiltro]
  );


  const resetPaginationOnly = useCallback(() => {
    setPagination((prev) => ({
      current: 1,
      pageSize: prev.pageSize,
    }));
  }, []);

  const handleSituacaoTodosChange = useCallback(
    (checked: boolean) => {
      setSituacaoFiltro({
        pendente: checked,
        escolha: checked,
        reconvocacao: checked,
        naoEscolha: checked,
      });
      resetPaginationOnly();
    },
    [resetPaginationOnly]
  );

  const handleSituacaoCheckboxChange = useCallback(
    (
      event: CheckboxChangeEvent,
      key: "pendente" | "escolha" | "reconvocacao" | "naoEscolha"
    ) => {
      const { checked } = event.target;
      setSituacaoFiltro((prev) => ({
        ...prev,
        [key]: checked,
      }));
      resetPaginationOnly();
    },
    [resetPaginationOnly]
  );

  const { processosConvocacaoOptions, processosConvocacaoOptionsIsLoading } =
    useGetProcessosConvocacaoOptions();

  const {
    agendasList,
    agendasIsLoading,
    agendasError,
  } = useGetAgendasPorProcessoConvocacao({
    processoUuid: selectedProcesso,
    enabled: Boolean(selectedProcesso),
  });

  const {
    cargosList,
    cargoCodigoPorUuid,
    cargosIsLoading,
    cargosError,
  } = useGetCargosPorProcessoConvocacao(selectedProcesso, Boolean(selectedProcesso));

  const selectedAgendaData = useMemo(
    () => agendasList.find((agenda) => agenda.uuid === selectedAgenda),
    [agendasList, selectedAgenda]
  );

  const cargoCodigo = useMemo(() => {
    if (!selectedAgendaData) {
      return undefined;
    }

    const agendaAsAny = selectedAgendaData as unknown as Record<string, unknown>;
    const possibleCodigo =
      normalizeCodigo(agendaAsAny.cargo_codigo) ??
      normalizeCodigo(agendaAsAny.codigo_cargo) ??
      normalizeCodigo(agendaAsAny.cargoCodigo) ??
      normalizeCodigo(agendaAsAny.codigo) ??
      (agendaAsAny.cargo && typeof agendaAsAny.cargo === "object"
        ? normalizeCodigo((agendaAsAny.cargo as { codigo?: unknown }).codigo)
        : undefined);

    if (possibleCodigo !== undefined && possibleCodigo !== null) {
      return possibleCodigo;
    }

    const cargosArray = Array.isArray(cargosList)
      ? (cargosList as Array<Record<string, unknown>>)
      : [];

    const matchedCargo = cargosArray.find((cargo) => {
      const cargoUuidCandidates = [
        cargo.cargo_uuid,
        cargo.uuid,
        (cargo.cargo as Record<string, unknown> | undefined)?.uuid,
      ].filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

      const agendaUuidCandidates = [
        selectedAgendaData.cargo_uuid,
        (agendaAsAny.cargo as Record<string, unknown> | undefined)?.uuid,
      ].filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

      return cargoUuidCandidates.some((uuid) =>
        agendaUuidCandidates.includes(uuid)
      );
    });

    if (matchedCargo) {
      const matchedCodigo =
        normalizeCodigo(matchedCargo.cargo_codigo) ??
        normalizeCodigo(matchedCargo.codigo_cargo) ??
        normalizeCodigo(matchedCargo.codigo) ??
        (typeof matchedCargo.cargo === "object" && matchedCargo.cargo !== null
          ? normalizeCodigo(
              (matchedCargo.cargo as Record<string, unknown>).codigo
            ) ??
            normalizeCodigo(
              (matchedCargo.cargo as Record<string, unknown>).codigo_cargo
            )
          : undefined);

      if (matchedCodigo !== undefined && matchedCodigo !== null) {
        return matchedCodigo;
      }
    }

    if (selectedAgendaData.cargo_uuid) {
      return (
        cargoCodigoPorUuid[selectedAgendaData.cargo_uuid] ??
        normalizeCodigo(selectedAgendaData.cargo_uuid)
      );
    }

    return undefined;
  }, [cargoCodigoPorUuid, selectedAgendaData, cargosList]);

  const processosOptions = useMemo(
    () =>
      (processosConvocacaoOptions || [])
        .filter((option) => option?.value && option?.label)
        .map((option) => ({
          value: option.value,
          label: option.label,
        })),
    [processosConvocacaoOptions]
  );

  const agendasOptions = useMemo(
    () =>
      agendasList
        .filter((agenda) => Boolean(agenda.uuid))
        .map((agenda) => ({
          value: agenda.uuid,
          label: formatAgendaOptionLabel(agenda),
        })),
    [agendasList]
  );

  // Obter UUIDs dos candidatos diretamente da agenda quando disponível
  const candidatosUuidsFromAgenda = useMemo(() => {
    if (!selectedAgendaData?.candidatos_uuids) {
      return [];
    }
    // Garantir que é um array de strings válidas
    const uuids = Array.isArray(selectedAgendaData.candidatos_uuids)
      ? selectedAgendaData.candidatos_uuids
      : [];
    return uuids.filter(
      (uuid): uuid is string =>
        typeof uuid === "string" && uuid.trim().length > 0
    );
  }, [selectedAgendaData?.candidatos_uuids]);

  // Busca inicial para obter UUIDs APENAS se não vierem da agenda
  const temUuidsNaAgenda = candidatosUuidsFromAgenda.length > 0;

  const {
    candidatosIniciaisData,
    candidatosIniciaisIsLoading,
  } = useGetCandidatosUuidsPorProcessoAgenda(
    {
      processoUuid: selectedProcesso,
      agendaUuid: selectedAgenda,
      cargoCodigo: cargoCodigo,
      cargoUuid: selectedAgendaData?.cargo_uuid,
      refreshToken,
    },
    {
      enabled: hasSearched && !temUuidsNaAgenda,
    }
  );

  // Extrair UUIDs da busca inicial se necessário (só se não tiver UUIDs na agenda)
  const candidatosUuidsFromSearch = useMemo(() => {
    // Prioridade: usar UUIDs da agenda se disponíveis
    if (temUuidsNaAgenda) {
      return candidatosUuidsFromAgenda;
    }
    
    // Fallback: extrair UUIDs da busca inicial
    if (!candidatosIniciaisData) {
      return [];
    }
    const results = Array.isArray(candidatosIniciaisData)
      ? candidatosIniciaisData
      : (candidatosIniciaisData as any)?.results ?? [];
    return results
      .map((item: any) => {
        return (
          item?.uuid ??
          item?.candidato_uuid ??
          item?.candidato?.uuid ??
          item?.id
        );
      })
      .filter(
        (uuid: any): uuid is string =>
          typeof uuid === "string" && uuid.trim().length > 0
      );
  }, [candidatosUuidsFromAgenda, candidatosIniciaisData, temUuidsNaAgenda]);

  // Buscar dados completos usando postBuscarPorUuids
  const {
    candidatosData,
    candidatosIsLoading,
    candidatosIsFetching,
    candidatosError,
  } = useGetCandidatosPorUuid(
    {
      uuids: candidatosUuidsFromSearch,
      refreshToken,
    },
    { enabled: hasSearched && candidatosUuidsFromSearch.length > 0 }
  );

  const candidatosList = useMemo(
    () => {
      if (!hasSearched || !candidatosData) {
        return [];
      }

      // postBuscarPorUuids retorna { results: ICandidato[], ... }
      if (candidatosData.results && Array.isArray(candidatosData.results)) {
        return candidatosData.results as Array<Record<string, any>>;
      }

      return [];
    },
    [candidatosData, hasSearched]
  );

  const cargoCodigoNumerico = useMemo(() => {
    const extractNumericCode = (value: unknown): number | undefined => {
      if (value === null || value === undefined) {
        return undefined;
      }
      if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return value;
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed.includes("-")) {
          return undefined;
        }
        const num = Number(trimmed);
        if (Number.isFinite(num) && num > 0) {
          return num;
        }
      }
      return undefined;
    };

    // PRIORIDADE 1: Pegar codigo_cargo diretamente da agenda selecionada
    if (selectedAgendaData) {
      const agendaAsAny = selectedAgendaData as unknown as Record<string, unknown>;
      const codigoCargoFromAgenda = agendaAsAny.codigo_cargo;
      const numCode = extractNumericCode(codigoCargoFromAgenda);
      if (numCode !== undefined) {
        return numCode;
      }
    }

    // FALLBACKS TEMPORÁRIOS (serão removidos quando o backend estiver pronto):
    // Tentar extrair de outras fontes caso codigo_cargo ainda não esteja na agenda

    if (cargoCodigo !== undefined && cargoCodigo !== null) {
      const numCode = extractNumericCode(cargoCodigo);
      if (numCode !== undefined) {
        return numCode;
      }
    }

    if (hasSearched && candidatosList.length > 0) {
      for (const item of candidatosList) {
        const raw = item as Record<string, any>;
        const candidate = (typeof raw?.candidato === "object" && raw.candidato !== null
          ? (raw.candidato as Record<string, any>)
          : raw) as Record<string, any>;

        const candidates = [
          raw?.codigo_cargo,
          raw?.cargo_codigo,
          candidate?.codigo_cargo,
          candidate?.cargo_codigo,
          raw?.cargo?.codigo_cargo,
          raw?.cargo?.codigo,
          candidate?.cargo?.codigo_cargo,
          candidate?.cargo?.codigo,
        ];

        if (Array.isArray(raw?.concursos)) {
          for (const concurso of raw.concursos as Array<Record<string, any>>) {
            candidates.push(
              concurso?.codigo_cargo,
              concurso?.cargo_codigo,
              concurso?.codigo,
              concurso?.cargo?.codigo_cargo,
              concurso?.cargo?.codigo
            );
          }
        }

        if (Array.isArray(candidate?.concursos)) {
          for (const concurso of candidate.concursos as Array<Record<string, any>>) {
            candidates.push(
              concurso?.codigo_cargo,
              concurso?.cargo_codigo,
              concurso?.codigo,
              concurso?.cargo?.codigo_cargo,
              concurso?.cargo?.codigo
            );
          }
        }

        for (const candidateValue of candidates) {
          const numCode = extractNumericCode(candidateValue);
          if (numCode !== undefined) {
            return numCode;
          }
        }
      }
    }

    if (cargosList && Array.isArray(cargosList)) {
      for (const cargo of cargosList as Array<Record<string, unknown>>) {
        const cargoCandidates = [
          cargo.cargo_codigo,
          cargo.codigo_cargo,
          cargo.codigo,
          (cargo.cargo as Record<string, unknown> | undefined)?.codigo,
          (cargo.cargo as Record<string, unknown> | undefined)?.codigo_cargo,
        ];

        for (const candidateValue of cargoCandidates) {
          const numCode = extractNumericCode(candidateValue);
          if (numCode !== undefined) {
            return numCode;
          }
        }
      }
    }

    return undefined;
  }, [candidatosList, hasSearched, cargoCodigo, selectedAgendaData, cargosList]);

  const cargoCodigoNumericoParam = useMemo(
    () =>
      cargoCodigoNumerico !== undefined && cargoCodigoNumerico !== null
        ? String(cargoCodigoNumerico)
        : undefined,
    [cargoCodigoNumerico]
  );

  const normalizedCandidatos = useMemo<NormalizedCandidato[]>(() => {
    if (!hasSearched || candidatosList.length === 0) {
      return [];
    }

    const seen = new Set<string>();
    const result: NormalizedCandidato[] = [];

    const rawList = candidatosList as unknown as Array<Record<string, unknown>>;

    rawList.forEach((raw) => {
      const candidate = (typeof raw?.candidato === "object" && raw.candidato !== null
        ? (raw.candidato as Record<string, unknown>)
        : raw) as Record<string, unknown>;

      const possibleValues: Array<unknown> = [
        raw?.candidato_uuid,
        raw?.candidatoUuid,
        raw?.uuid,
        raw?.candidato_id,
        raw?.id,
        candidate?.uuid,
        candidate?.id,
      ];

      const found = possibleValues.find(
        (value) => typeof value === "string" && value.trim().length > 0
      ) as string | undefined;

      if (found && !seen.has(found)) {
        seen.add(found);
        result.push({
          uuid: found,
          raw,
          candidate,
        });
      }
    });

    return result;
  }, [candidatosList, hasSearched]);

  const candidatosUuids = useMemo(
    () => normalizedCandidatos.map((item) => item.uuid),
    [normalizedCandidatos]
  );

  const escolhasQuery = useGetEscolhasPorCandidatos({
    candidatoUuids: candidatosUuids,
    enabled: hasSearched,
    refreshToken,
  });

  const {
    escolhasList,
    escolhasIsLoading,
    escolhasIsFetching,
    escolhasError,
  } = escolhasQuery;


  const escolhaPorCandidato = useMemo(() => {
    const map = new Map<string, IEscolhaCandidato>();
    escolhasList.forEach((escolha) => {
      if (
        typeof escolha?.candidato_uuid === "string" &&
        escolha.candidato_uuid.trim().length > 0 &&
        !map.has(escolha.candidato_uuid)
      ) {
        map.set(escolha.candidato_uuid, escolha);
      }
    });
    return map;
  }, [escolhasList]);

  const candidatosTableData = useMemo<CandidatoTabela[]>(() => {
    if (!hasSearched || normalizedCandidatos.length === 0) {
      return [];
    }

    return normalizedCandidatos.map(({ uuid, raw, candidate }) => {
      const escolha = escolhaPorCandidato.get(uuid);
      const rawAny = raw as Record<string, any>;
      const candidateAny = candidate as Record<string, any>;

      const nome =
        (candidateAny?.nome as string | undefined) ??
        (rawAny?.nome_candidato as string | undefined) ??
        (rawAny?.nome as string | undefined) ??
        "—";

      const situacaoCodigo: "pendente" | SituacaoEscolha = isSituacaoEscolha(
        escolha?.situacao
      )
        ? escolha!.situacao
        : "pendente";
      const situacaoLabel = formatSituacaoLabel(situacaoCodigo);

      const concursosLista = Array.isArray(rawAny?.concursos)
        ? (rawAny.concursos as Array<Record<string, unknown>>)
        : Array.isArray(candidateAny?.concursos)
          ? (candidateAny.concursos as Array<Record<string, unknown>>)
          : [];

      const cargoCodigoAsString =
        cargoCodigo !== undefined && cargoCodigo !== null
          ? String(cargoCodigo)
          : undefined;

      const concursoCorrespondente =
        concursosLista.find((concurso) => {
          if (!cargoCodigoAsString) {
            return false;
          }

          const possiveisCodigos = [
            concurso?.codigo_cargo,
            concurso?.cargo_codigo,
            concurso?.codigo,
            (concurso?.cargo as Record<string, unknown> | undefined)?.codigo,
          ];

          return possiveisCodigos.some((codigo) => {
            if (codigo === undefined || codigo === null) {
              return false;
            }
            return String(codigo) === cargoCodigoAsString;
          });
        }) ?? concursosLista[0];

      const classificacaoRaw =
        candidateAny?.classificacao_atual ??
        candidateAny?.classificacao ??
        candidateAny?.classificacao_geral ??
        candidateAny?.classificacao_pcd ??
        candidateAny?.classificacao_especial ??
        candidateAny?.classificacao_nna ??
        rawAny?.classificacao_atual ??
        rawAny?.classificacao ??
        rawAny?.classificacao_geral ??
        rawAny?.classificacao_pcd ??
        rawAny?.classificacao_especial ??
        rawAny?.classificacao_nna ??
        concursoCorrespondente?.classificacao_atual ??
        concursoCorrespondente?.classificacao ??
        concursoCorrespondente?.classificacao_geral ??
        concursoCorrespondente?.classificacao_pcd ??
        concursoCorrespondente?.classificacao_especial ??
        concursoCorrespondente?.classificacao_nna;
      const classificacaoGeral = formatClassification(classificacaoRaw);

      const cargoNome =
        (rawAny?.cargo_nome as string | undefined) ??
        ((candidateAny?.cargo as Record<string, unknown> | undefined)?.nome as
          string | undefined) ??
        (candidateAny?.cargo_nome as string | undefined) ??
        selectedAgendaData?.cargo_nome ??
        "—";

      const vagasDefinitivasValue =
        (rawAny?.vagas_definitivas as unknown) ??
        (rawAny?.vagasDefinitivas as unknown) ??
        (rawAny?.vagas_def as unknown) ??
        (rawAny?.vagasDef as unknown) ??
        0;

      const vagasPrecariasValue =
        (rawAny?.vagas_precarias as unknown) ??
        (rawAny?.vagasPrecarias as unknown) ??
        (rawAny?.vagas_prec as unknown) ??
        (rawAny?.vagasPrec as unknown) ??
        0;

      const vagasTotaisValue =
        (rawAny?.vagas as unknown) ??
        (rawAny?.total_vagas as unknown) ??
        (rawAny?.vagasTotais as unknown) ??
        vagasDefinitivasValue ??
        0;

      const tipoVagaCodigo =
        (isTipoVagaEscolha(escolha?.tipo_vaga) && escolha?.tipo_vaga) ||
        (isTipoVagaEscolha(candidateAny?.tipo_vaga) && candidateAny?.tipo_vaga) ||
        (isTipoVagaEscolha(rawAny?.tipo_vaga) && rawAny?.tipo_vaga) ||
        undefined;
      const escolhaDescricaoFromVaga =
        typeof rawAny?.vaga_escola_nome === "string" &&
        rawAny.vaga_escola_nome.trim().length > 0
          ? rawAny.vaga_escola_nome.trim()
          : undefined;
      const escolhaDescricao =
        tipoVagaCodigo !== undefined
          ? formatTipoVagaLabel(tipoVagaCodigo)
          : escolhaDescricaoFromVaga ?? "—";

      const rawDre = rawAny?.dre as Record<string, any> | undefined;
      const candidateDre = candidateAny?.dre as Record<string, any> | undefined;

      const dreUuid =
        (typeof rawAny?.dre_uuid === "string" && rawAny.dre_uuid) ||
        (typeof rawAny?.dreUuid === "string" && rawAny.dreUuid) ||
        (typeof candidateAny?.dre_uuid === "string" && candidateAny.dre_uuid) ||
        (typeof candidateAny?.dreUuid === "string" && candidateAny.dreUuid) ||
        (typeof rawDre?.uuid === "string" && rawDre.uuid) ||
        (typeof candidateDre?.uuid === "string" && candidateDre.uuid) ||
        undefined;

      const dreCodigo =
        (typeof rawAny?.dre_codigo === "string" && rawAny.dre_codigo) ||
        (typeof rawAny?.dreCodigo === "string" && rawAny.dreCodigo) ||
        (typeof candidateAny?.dre_codigo === "string" && candidateAny.dre_codigo) ||
        (typeof candidateAny?.dreCodigo === "string" && candidateAny.dreCodigo) ||
        (typeof rawDre?.codigo === "string" && rawDre.codigo) ||
        (typeof candidateDre?.codigo === "string" && candidateDre.codigo) ||
        undefined;

      const vagaEscolaUuid =
        (typeof escolha?.vaga_escola_uuid === "string" && escolha.vaga_escola_uuid) ||
        (typeof rawAny?.vaga_escola_uuid === "string" && rawAny.vaga_escola_uuid) ||
        undefined;

      const retardatario =
        typeof escolha?.e_retardatario === "boolean"
          ? escolha.e_retardatario
          : Boolean(candidateAny?.e_retardatario ?? rawAny?.e_retardatario);

      return {
        uuid,
        nome,
        cargo: cargoNome,
        classificacao: classificacaoGeral,
        situacao: situacaoLabel,
        situacaoCodigo,
        escolha: escolhaDescricao,
        tipoVagaCodigo: tipoVagaCodigo ?? undefined,
        retardatario,
        vagaEscolaUuid,
        escolhaUuid: escolha?.uuid,
        dreUuid,
        dreCodigo,
        vagasDefinitivas: formatVacancyValue(vagasDefinitivasValue),
        vagasPrecarias: formatVacancyValue(vagasPrecariasValue),
        vagas: formatVacancyValue(vagasTotaisValue),
      };
    })
    .filter((candidato) => {
      if (situacoesSelecionadas.length === 0) {
        return true;
      }
      return situacoesSelecionadas.includes(candidato.situacaoCodigo);
    });
  }, [
    escolhaPorCandidato,
    hasSearched,
    normalizedCandidatos,
    cargoCodigo,
    selectedAgendaData,
    situacoesSelecionadas,
  ]);

  const isFetchingCandidatos =
    candidatosIniciaisIsLoading || candidatosIsLoading || candidatosIsFetching;

  // Rastrear erros já exibidos para evitar mensagens duplicadas
  const previousErrorsRef = useRef<{
    agendasError: unknown;
    cargosError: unknown;
    candidatosError: unknown;
    escolhasError: unknown;
  }>({
    agendasError: undefined,
    cargosError: undefined,
    candidatosError: undefined,
    escolhasError: undefined,
  });

  // Tratamento de erros - executado durante render quando detecta mudança
  if (agendasError && previousErrorsRef.current.agendasError !== agendasError) {
    previousErrorsRef.current.agendasError = agendasError;
    message.error("Não foi possível carregar as agendas do processo selecionado.");
  }

  if (cargosError && previousErrorsRef.current.cargosError !== cargosError) {
    previousErrorsRef.current.cargosError = cargosError;
    message.error("Não foi possível carregar os cargos do processo selecionado.");
  }

  if (candidatosError && previousErrorsRef.current.candidatosError !== candidatosError) {
    previousErrorsRef.current.candidatosError = candidatosError;
    message.error("Não foi possível carregar os candidatos.");
  }

  if (escolhasError && previousErrorsRef.current.escolhasError !== escolhasError) {
    previousErrorsRef.current.escolhasError = escolhasError;
    message.error("Não foi possível carregar as escolhas dos candidatos.");
  }

  const cargoTotals = useMemo(() => {
    if (!selectedAgendaData || !cargosList) {
      return undefined;
    }

    const cargosArray = Array.isArray(cargosList)
      ? (cargosList as Array<Record<string, unknown>>)
      : [];

    const match = cargosArray.find((cargo) => {
      const possibleIds = [
        cargo.cargo_uuid,
        cargo.uuid,
        (cargo.cargo as Record<string, unknown> | undefined)?.uuid,
      ].filter(
        (value): value is string =>
          typeof value === "string" && value.trim().length > 0
      );

      return possibleIds.includes(selectedAgendaData.cargo_uuid);
    });

    if (!match) {
      return undefined;
    }

    return {
      totalAmpla: parseNumber(
        match.candidatos_geral ??
          match.geral ??
          match.total_ampla ??
          match.totalGeral ??
          0
      ),
      totalPcd: parseNumber(
        match.candidatos_pcd ??
          match.pcd ??
          match.def ??
          match.total_pcd ??
          match.totalPcd ??
          0
      ),
      totalNna: parseNumber(
        match.candidatos_nna ??
          match.nna ??
          match.total_nna ??
          match.totalNna ??
          0
      ),
    };
  }, [cargosList, selectedAgendaData]);

  const candidateTotals = useMemo(() => {
    if (!hasSearched || normalizedCandidatos.length === 0) {
      return { totalAmpla: 0, totalPcd: 0, totalNna: 0 };
    }

    let geral = 0;
    let pcd = 0;
    let nna = 0;

    normalizedCandidatos.forEach(({ raw }) => {
      // Buscar categoria_efetiva diretamente do objeto raw (que vem do backend)
      // Mesma lógica do BuscarCandidatosModal
      const categoria = (raw as any)?.categoria_efetiva;
      
      if (categoria === 'GERAL' || !categoria) {
        geral++;
      } else if (categoria === 'NNA') {
        nna++;
      } else if (categoria === 'PCD') {
        pcd++;
      }
    });

    return {
      totalAmpla: geral,
      totalPcd: pcd,
      totalNna: nna,
    };
  }, [hasSearched, normalizedCandidatos]);

  // Priorizar candidateTotals quando houver candidatos carregados (já filtrados pela agenda selecionada)
  // Usar cargoTotals apenas como fallback quando não houver candidatos carregados
  const { totalAmpla, totalPcd, totalNna } =
    (hasSearched && normalizedCandidatos.length > 0) ? candidateTotals : (cargoTotals ?? candidateTotals);

  const isFetchingEscolhas = escolhasIsLoading || escolhasIsFetching;
  const isCardsLoading = isFetchingCandidatos || isFetchingEscolhas;
  const cardsShouldRender =
    hasSearched && (isCardsLoading || normalizedCandidatos.length > 0);

  const handleOpenModalEscolha = useCallback(
    (record: CandidatoTabela) => {
      setModalEscolhaContext({
        candidatoUuid: record.uuid,
        nome: record.nome,
        cargo: record.cargo,
        classificacao: record.classificacao,
        situacaoCodigo: record.situacaoCodigo,
        situacaoLabel: record.situacao,
        escolhaLabel: record.escolha,
        vagasDefinitivas: record.vagasDefinitivas,
        vagasPrecarias: record.vagasPrecarias,
        vagas: record.vagas,
        vagaEscolaUuid: record.vagaEscolaUuid,
        tipoVagaCodigo: record.tipoVagaCodigo,
        retardatario: record.retardatario,
        escolhaUuid: record.escolhaUuid,
        dreUuid: record.dreUuid,
        dreCodigo: record.dreCodigo,
      });
      setModalEscolhaVisible(true);
    },
    []
  );

  const handleCloseModalEscolha = useCallback(() => {
    setModalEscolhaVisible(false);
    setModalEscolhaContext(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setRefreshToken((prev) => prev + 1);
  }, []);

  const tableLoading =
    isFetchingCandidatos || escolhasIsLoading || escolhasIsFetching;

  const handleProcessoChange = useCallback((value?: string) => {
    setSelectedProcesso(value);
    setSelectedAgenda(undefined);
    setHasSearched(false);
    setRefreshToken(0);
    setPagination((prev) => ({
      current: 1,
      pageSize: prev.pageSize,
    }));
  }, []);

  const handleAgendaChange = useCallback((value?: string) => {
    setSelectedAgenda(value);
    setHasSearched(false);
    setRefreshToken(0);
    setPagination((prev) => ({
      current: 1,
      pageSize: prev.pageSize,
    }));
  }, []);

  const handleLoadCandidatos = useCallback(() => {
    if (!selectedProcesso) {
      message.warning("Selecione um processo de convocação para continuar.");
      return;
    }

    if (!selectedAgenda) {
      message.warning("Selecione um período da agenda para continuar.");
      return;
    }

    if (cargoCodigo === undefined) {
      message.error("Não foi possível identificar o código do cargo da agenda selecionada.");
      return;
    }

    setPagination((prev) => ({
      current: 1,
      pageSize: prev.pageSize,
    }));
    setHasSearched(true);
    setRefreshToken((prev) => prev + 1);
  }, [cargoCodigo, selectedAgenda, selectedProcesso]);

  const handleLimparSituacao = useCallback(() => {
    setSituacaoFiltro({
      pendente: false,
      escolha: false,
      reconvocacao: false,
      naoEscolha: false,
    });
    resetPaginationOnly();
  }, [resetPaginationOnly]);

  const handleBuscarSituacao = useCallback(() => {
    resetPaginationOnly();
  }, [resetPaginationOnly]);


  const handleTableChange = useCallback(
    (
      tablePagination: any,
      _filters: unknown,
      _sorter: unknown,
      extra: { action?: string } | undefined
    ) => {
      if (extra?.action === "paginate") {
        setPagination((prev) => ({
          current: tablePagination?.current ?? prev.current,
          pageSize: tablePagination?.pageSize ?? prev.pageSize,
        }));
      }
    },
    []
  );

  const isCarregarDisabled =
    !selectedProcesso ||
    !selectedAgenda ||
    cargoCodigo === undefined ||
    processosConvocacaoOptionsIsLoading ||
    agendasIsLoading ||
    cargosIsLoading;

  const breadcrumbItems: TitleItem[] = [
    {
      title: (
        <Typography.Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </Typography.Text>
      ),
    },
    {
      title: (
        <Typography.Text
          strong
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/processos")}
        >
          Processos
        </Typography.Text>
      ),
    },
    { title: "Escolha de Candidatos" },
  ];

  return (
    <>
      <SelecaoGlobalStyles />
      <BaseTela breadcrumbItems={breadcrumbItems} title="Escolha de Candidato">
      <ContentWrapper>
        <FiltersCard>
          <FiltersRow gutter={[24, 16]} align="bottom">
            <Col xs={24} sm={12} md={11} lg={11} xl={11}>
              <FilterLabel>Processo</FilterLabel>
              <FilterSelect
                value={selectedProcesso}
                placeholder="Selecione um processo"
                allowClear
                loading={processosConvocacaoOptionsIsLoading}
                onChange={(value) => handleProcessoChange(value as string | undefined)}
                onClear={() => handleProcessoChange(undefined)}
                options={processosOptions}
                showSearch
                optionFilterProp="label"
                filterOption={filterOptionByLabel}
              />
            </Col>
            <Col xs={24} sm={12} md={10} lg={10} xl={10}>
              <FilterLabel>Período da agenda</FilterLabel>
              <FilterSelect
                value={selectedAgenda}
                placeholder="Selecione um período"
                allowClear
                loading={agendasIsLoading}
                disabled={!selectedProcesso || agendasList.length === 0}
                onChange={(value) => handleAgendaChange(value as string | undefined)}
                onClear={() => handleAgendaChange(undefined)}
                options={agendasOptions}
                showSearch
                optionFilterProp="label"
                filterOption={filterOptionByLabel}
              />
            </Col>
            <ButtonCol xs={24} sm={24} md={3} lg={3} xl={3}>
              <FilterButton
                type="primary"
                size="large"
                onClick={handleLoadCandidatos}
                loading={isFetchingCandidatos && hasSearched}
                disabled={isCarregarDisabled}
              >
                Carregar processo
              </FilterButton>
            </ButtonCol>
          </FiltersRow>
        </FiltersCard>

        {cardsShouldRender && (
          <CardsWrapper>
            <StyledCardAmpla styles={{ body: { padding: 0 } }}>
              <div style={selecaoCommonStyles.cardContainer}>
                <Diversity3Icon style={selecaoCommonStyles.cardIcon} />
                <div style={selecaoCommonStyles.cardNumber}>
                  {isCardsLoading ? <Spin size="small" /> : totalAmpla}
                </div>
                <div style={selecaoCommonStyles.cardLabel}>Ampla</div>
              </div>
            </StyledCardAmpla>

            <StyledCardNNA styles={{ body: { padding: 0 } }}>
              <div style={selecaoCommonStyles.cardContainer}>
                <StreetviewIcon style={selecaoCommonStyles.cardIcon} />
                <div style={selecaoCommonStyles.cardNumber}>
                  {isCardsLoading ? <Spin size="small" /> : totalNna}
                </div>
                <div style={selecaoCommonStyles.cardLabel}>NNA</div>
              </div>
            </StyledCardNNA>

            <StyledCardPCD styles={{ body: { padding: 0 } }}>
              <div style={selecaoCommonStyles.cardContainer}>
                <AccessibleIcon style={selecaoCommonStyles.cardIcon} />
                <div style={selecaoCommonStyles.cardNumber}>
                  {isCardsLoading ? <Spin size="small" /> : totalPcd}
                </div>
                <div style={selecaoCommonStyles.cardLabel}>PcD</div>
              </div>
            </StyledCardPCD>
          </CardsWrapper>
        )}

        {!hasSearched ? (
          <EmptyStateCard>
            <EmptyStateContent>
              <EmptyStateImage
                src={EmptyStateIllustration}
                alt="Ilustração de estado vazio"
              />
              <EmptyStateTitle>
                Ops! Ainda não há nenhum processo selecionado
              </EmptyStateTitle>
              <EmptyStateDescription>
                Selecione um processo para carregar as informações.
              </EmptyStateDescription>
            </EmptyStateContent>
          </EmptyStateCard>
        ) : (
          <ResultsCard>
            <ResultsContent>
              <SituacaoFiltersRow align="middle" justify="space-between">
                <Col flex="auto">
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <ConvocacaoFieldLabel>Situação</ConvocacaoFieldLabel>
                    <SituacaoCheckboxWrapper>
                    <Checkbox
                      checked={situacaoTodosChecked}
                      onChange={(event) =>
                        handleSituacaoTodosChange(event.target.checked)
                      }
                    >
                      Todos
                    </Checkbox>
                    <Checkbox
                      checked={situacaoFiltro.pendente}
                      onChange={(event) =>
                        handleSituacaoCheckboxChange(event, "pendente")
                      }
                    >
                      Pendente
                    </Checkbox>
                    <Checkbox
                      checked={situacaoFiltro.escolha}
                      onChange={(event) =>
                        handleSituacaoCheckboxChange(event, "escolha")
                      }
                    >
                      Escolha
                    </Checkbox>
                    <Checkbox
                      checked={situacaoFiltro.reconvocacao}
                      onChange={(event) =>
                        handleSituacaoCheckboxChange(event, "reconvocacao")
                      }
                    >
                      Reconvocação
                    </Checkbox>
                    <Checkbox
                      checked={situacaoFiltro.naoEscolha}
                      onChange={(event) =>
                        handleSituacaoCheckboxChange(event, "naoEscolha")
                      }
                    >
                      Não escolha
                    </Checkbox>
                  </SituacaoCheckboxWrapper>
                  </div>
                </Col>
                <ButtonActionsWrapper>
                  <ConvocacaoClearButton size="large" onClick={handleLimparSituacao}>
                    Limpar filtros
                  </ConvocacaoClearButton>
                  <ConvocacaoSearchButton
                    size="large"
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={handleBuscarSituacao}
                  >
                    Buscar
                  </ConvocacaoSearchButton>
                </ButtonActionsWrapper>
              </SituacaoFiltersRow>

              <EscolhaCandidatosTabela
                candidatosTableData={candidatosTableData}
                loading={tableLoading}
                hasSearched={hasSearched}
                isFetchingCandidatos={isFetchingCandidatos}
                candidatosError={candidatosError}
                pagination={pagination}
                cargoCodigo={cargoCodigo}
                selectedAgendaData={selectedAgendaData}
                onTableChange={handleTableChange}
                onOpenModal={handleOpenModalEscolha}
              />
            </ResultsContent>
          </ResultsCard>
        )}
      </ContentWrapper>
    </BaseTela>

    <EscolhaCandidatosModal
      visible={modalEscolhaVisible}
      context={modalEscolhaContext}
      selectedProcesso={selectedProcesso}
      selectedAgendaData={selectedAgendaData}
      cargoCodigoNumericoParam={cargoCodigoNumericoParam}
      onClose={handleCloseModalEscolha}
      onSuccess={handleModalSuccess}
    />
    </>
  );
};

export default EscolhaCandidatosTela;