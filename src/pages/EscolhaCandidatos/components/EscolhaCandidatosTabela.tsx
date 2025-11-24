import React, { useCallback, useMemo } from "react";
import { Alert, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import type {
  CandidatoTabela,
  EscolhaCandidatosTabelaProps,
} from "../hooks/types";
import type { SituacaoEscolha, TipoVagaEscolha } from "../../../services/resources/escolhas/IEscolhas";
import { StyledCandidatosTable } from "../styles";

const formatClassification = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return "—";
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

const formatVacancyValue = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }
  return "0";
};

const isSituacaoEscolha = (value: unknown): value is SituacaoEscolha =>
  value === "escolha" || value === "reconvocacao" || value === "nao-escolha";

const isTipoVagaEscolha = (value: unknown): value is TipoVagaEscolha =>
  value === "precaria" || value === "definitiva";

const EscolhaCandidatosTabela: React.FC<EscolhaCandidatosTabelaProps> = ({
  candidatosTableData,
  loading,
  hasSearched,
  isFetchingCandidatos,
  candidatosError,
  pagination,
  cargoCodigo,
  selectedAgendaData,
  onTableChange,
  onOpenModal,
}) => {
  const candidatosColumns = useMemo<ColumnsType<CandidatoTabela>>(
    () => [
      {
        title: "Candidato",
        dataIndex: "nome",
        key: "nome",
      },
      {
        title: "Cargo",
        dataIndex: "cargo",
        key: "cargo",
      },
      {
        title: "Classificação",
        dataIndex: "classificacao",
        key: "classificacao",
        align: "center",
        width: 160,
      },
      {
        title: "Situação",
        dataIndex: "situacao",
        key: "situacao",
      },
      {
        title: "Escolha",
        dataIndex: "escolha",
        key: "escolha",
        render: (_value: string, record: CandidatoTabela) => {
          const descricao =
            typeof record.escolha === "string" ? record.escolha.trim() : "";
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
              title={descricao || "Efetuar escolha"}
              onClick={() => onOpenModal(record)}
            >
              <EditOutlined style={{ color: "#05409A" }} />
            </div>
          );
        },
        align: "center",
      },
    ],
    [onOpenModal]
  );

  const renderRowKey = useCallback(
    (record: any, index?: number) => {
      if (record?.uuid) return record.uuid;
      if (record?.key) return record.key;
      return (
        record?.candidato_uuid ??
        record?.candidato?.uuid ??
        record?.id ??
        record?.nome_candidato ??
        record?.nome ??
        String(index ?? 0)
      );
    },
    []
  );

  const renderColumns =
    candidatosTableData.length > 0 ? candidatosColumns : ([
    {
      title: "Candidato",
      dataIndex: "nome_candidato",
      key: "candidato",
      render: (_: unknown, record: Record<string, any>) =>
        record.nome_candidato ??
        record.nome ??
        record.candidato?.nome ??
        "—",
    },
    {
      title: "Cargo",
      dataIndex: "cargo_nome",
      key: "cargo_nome",
      render: (_: unknown, record: Record<string, any>) =>
        record.cargo_nome ?? record.cargo?.nome ?? selectedAgendaData?.cargo_nome ?? "—",
    },
    {
      title: "Classificação",
      dataIndex: "classificacao",
      key: "classificacao",
      render: (_: unknown, record: Record<string, any>) => {
        const concursosLista = Array.isArray(record.concursos)
          ? record.concursos
          : Array.isArray(record.candidato?.concursos)
            ? record.candidato.concursos
            : [];

        const cargoCodigoAsString =
          cargoCodigo !== undefined && cargoCodigo !== null
            ? String(cargoCodigo)
            : undefined;

        const concursoCorrespondente =
          concursosLista.find((concurso: Record<string, any>) => {
            if (!cargoCodigoAsString) {
              return false;
            }

            const possiveisCodigos = [
              concurso?.codigo_cargo,
              concurso?.cargo_codigo,
              concurso?.codigo,
              concurso?.cargo?.codigo,
            ];

            return possiveisCodigos.some((codigo) => {
              if (codigo === undefined || codigo === null) {
                return false;
              }
              return String(codigo) === cargoCodigoAsString;
            });
          }) ?? concursosLista[0];

        const valores = [
          record.classificacao,
          record.classificacao_atual,
          record.classificacao_geral,
          record.classificacao_pcd,
          record.classificacao_especial,
          record.classificacao_nna,
          record.classificacaoGeral,
          record.candidato?.classificacao,
          record.candidato?.classificacao_atual,
          record.candidato?.classificacao_geral,
          record.candidato?.classificacao_pcd,
          record.candidato?.classificacao_especial,
          record.candidato?.classificacao_nna,
          concursoCorrespondente?.classificacao_atual,
          concursoCorrespondente?.classificacao,
          concursoCorrespondente?.classificacao_geral,
          concursoCorrespondente?.classificacao_pcd,
          concursoCorrespondente?.classificacao_especial,
          concursoCorrespondente?.classificacao_nna,
        ];

        const valorEncontrado = valores.find(
          (valor) =>
            (typeof valor === "number" && Number.isFinite(valor)) ||
            (typeof valor === "string" && valor.trim().length > 0)
        );

        return formatClassification(valorEncontrado);
      },
      align: "center",
      width: 160,
    },
    {
      title: "Situação",
      dataIndex: "situacao",
      key: "situacao",
      render: (_: unknown, record: Record<string, any>) =>
        record.situacao ?? record.status ?? "—",
    },
    {
      title: "Escolha",
      dataIndex: "tipo_vaga",
      key: "tipo_vaga",
      render: (_: unknown, record: Record<string, any>) => {
        const valor =
          record.tipo_vaga ?? record.vaga_escola_nome ?? record.escolha;
        const texto = (() => {
          if (typeof valor !== "string") {
            return "";
          }
          const trimmed = valor.trim();
          if (!trimmed || trimmed === "—") {
            return "";
          }
          return trimmed;
        })();
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              cursor: "pointer",
            }}
            title={texto || "Efetuar escolha"}
            onClick={() => {
              const candidatoUuidRaw =
                record.candidato_uuid ??
                record.candidatoUuid ??
                record.uuid ??
                record.candidato?.uuid ??
                record.id;
              const candidatoUuid =
                typeof candidatoUuidRaw === "string"
                  ? candidatoUuidRaw
                  : candidatoUuidRaw
                    ? String(candidatoUuidRaw)
                    : "";
              const situacaoCodigo = isSituacaoEscolha(record.situacao)
                ? record.situacao
                : isSituacaoEscolha(record.status)
                  ? record.status
                  : ("pendente" as const);
              const cargoNomeFallback =
                record.cargo_nome ??
                record.cargo?.nome ??
                selectedAgendaData?.cargo_nome ??
                "—";
              const classificacaoValor = formatClassification(
                record.classificacao ??
                  record.classificacao_atual ??
                  record.classificacao_geral ??
                  record.classificacao_pcd ??
                  record.classificacao_especial ??
                  record.classificacao_nna ??
                  record.classificacaoGeral ??
                  record.candidato?.classificacao ??
                  record.candidato?.classificacao_atual ??
                  record.candidato?.classificacao_geral ??
                  record.candidato?.classificacao_pcd ??
                  record.candidato?.classificacao_especial ??
                  record.candidato?.classificacao_nna
              );
              const tipoVagaCodigo =
                (isTipoVagaEscolha(record.tipo_vaga) && record.tipo_vaga) ||
                undefined;
              const vagaEscolaUuid =
                typeof record.vaga_escola_uuid === "string"
                  ? record.vaga_escola_uuid
                  : undefined;
              const dreUuid =
                (typeof record.dre_uuid === "string" && record.dre_uuid) ||
                (typeof record.dre?.uuid === "string" && record.dre.uuid) ||
                undefined;
              const dreCodigo =
                (typeof record.dre_codigo === "string" && record.dre_codigo) ||
                (typeof record.dre?.codigo === "string" && record.dre.codigo) ||
                undefined;

              onOpenModal({
                uuid: candidatoUuid,
                nome:
                  record.nome_candidato ??
                  record.nome ??
                  record.candidato?.nome ??
                  "—",
                cargo: cargoNomeFallback,
                classificacao: classificacaoValor,
                situacao: formatSituacaoLabel(situacaoCodigo),
                situacaoCodigo,
                escolha: texto,
                tipoVagaCodigo,
                retardatario: Boolean(record.e_retardatario),
                vagaEscolaUuid,
                escolhaUuid:
                  typeof record.uuid === "string" ? record.uuid : undefined,
                dreUuid,
                dreCodigo,
                vagasDefinitivas: formatVacancyValue(record.vagas_definitivas),
                vagasPrecarias: formatVacancyValue(record.vagas_precarias),
                vagas: formatVacancyValue(record.vagas),
              });
            }}
          >
            <EditOutlined style={{ color: "#05409A" }} />
            <span>{texto}</span>
          </div>
        );
      },
    },
  ] as ColumnsType<Record<string, any>>);

  const tablePaginationTotal = candidatosTableData.length;
  const dataSource = candidatosTableData;

  if (candidatosError) {
    return (
      <Alert
        type="error"
        message="Não foi possível carregar os candidatos."
        description="Tente novamente em instantes ou verifique os filtros selecionados."
        showIcon
      />
    );
  }

  return (
    <StyledCandidatosTable
      rowKey={renderRowKey}
      loading={loading}
      columns={renderColumns}
      dataSource={dataSource as any[]}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: tablePaginationTotal,
        showTotal: (total, range) =>
          `Mostrando ${range[0]}-${range[1]} de ${total} candidato(s)`,
      }}
      onChange={onTableChange}
      locale={{
        emptyText:
          hasSearched && !isFetchingCandidatos
            ? "Nenhum candidato encontrado para os filtros selecionados."
            : <Empty description="Carregando..." />,
      }}
      scroll={{ x: true }}
    />
  );
};

export default EscolhaCandidatosTabela;

