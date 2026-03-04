import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  getListaEscolhas,
  type EscolhaListItem,
  type ReclassificacaoItem,
  type EliminacaoItem,
} from "../../../../services/resources/escolhas";

type AlteracaoItem = {
  key: string;
  data: string;
  statusAnterior: string;
  statusNovo: string;
  motivo: string;
};

/** Linha da tabela de histórico de situações (um item por HistoricoEscolha). */
type HistoricoSituacaoItem = {
  key: string;
  data: string;
  escolha: string;
  detalhes: string;
  criadoEm: string;
};

type HistoricoCandidatoModalProps = {
  open: boolean;
  nomeCandidato?: string;
  concurso?: string;
  cargo?: string;
  alteracoes?: AlteracaoItem[];
  /** Reclassificações e eliminação vindas da linha (getBuscarCandidatos). Preenchem a tabela "Histórico de reclassificação/eliminação". */
  reclassificacoes?: ReclassificacaoItem[];
  eliminacao?: EliminacaoItem | null;
  /** Tipo de classificação atual (categoria_efetiva): usado para exibir o novo tipo na coluna Status novo após reclassificação (ex.: Categoria geral, PCD, NNA). */
  categoriaEfetiva?: string | null;
  /** UUID do concurso_candidato (enviado como candidato_uuid na API de escolhas). */
  concursoCandidatoUuid?: string;
  concursoUuid?: string;
  /** Código do cargo (enviado como vaga_escola__cargo_codigo na API de escolhas). */
  codigoCargo?: string;
  onClose: () => void;
};

function formatarDataISO(data: string | undefined): string {
  if (!data) return "—";
  try {
    const d = new Date(data);
    if (Number.isNaN(d.getTime())) return data;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return data;
  }
}

/** Status novo para reclassificação: mesma lógica da listagem em EliminacaoReclassificacaoCandidatoTela (tipoClassificacao = categoria_efetiva em maiúsculo). */
function statusNovoReclassificado(categoriaEfetiva: string | undefined | null): string {
  const t = (categoriaEfetiva ?? "").trim().toUpperCase();
  return t || "Reclassificado";
}

/** Monta linhas da tabela "Histórico de reclassificação/eliminação" a partir de reclassificacoes e eliminacao. Ordena por data decrescente. */
function buildAlteracoesFromReclassificacao(
  reclassificacoes: ReclassificacaoItem[] | undefined,
  eliminacao: EliminacaoItem | null | undefined,
  categoriaEfetiva: string | null | undefined
): AlteracaoItem[] {
  const comData: { item: AlteracaoItem; dateRaw: string }[] = [];
  const statusNovo = statusNovoReclassificado(categoriaEfetiva);
  (reclassificacoes ?? []).forEach((r, i) => {
    const de = (r.desclassificado_de ?? "").trim().toUpperCase();
    comData.push({
      dateRaw: r.criado_em ?? "",
      item: {
        key: r.uuid ?? `recl-${i}`,
        data: formatarDataISO(r.criado_em ?? undefined),
        statusAnterior: de || "—",
        statusNovo: r.nova_classificacao ?? "—",
        motivo: r.motivo ?? "—",
      },
    });
  });
  if (eliminacao?.eliminado) {
    const motivoEliminacao =
      eliminacao.eliminado_motivo?.trim() ||
      eliminacao.motivo_historico?.trim() ||
      "—";
    comData.push({
      dateRaw: eliminacao.eliminado_em ?? "",
      item: {
        key: "eliminacao",
        data: formatarDataISO(eliminacao.eliminado_em ?? undefined),
        statusAnterior: "Ativo",
        statusNovo: "Eliminado",
        motivo: motivoEliminacao,
      },
    });
  }
  comData.sort((a, b) => (b.dateRaw || "").localeCompare(a.dateRaw || ""));
  return comData.map((x) => x.item);
}

type HistoricoEntry = {
  uuid?: string;
  situacao_anterior?: string;
  situacao_nova?: string;
  criado_em?: string;
};

/** Label de exibição na coluna Escolha (nao-escolha → "Não Escolha", reconvocacao → "Reconvocação", etc.). */
function labelEscolha(s: string | undefined): string {
  if (!s?.trim()) return "—";
  const v = s.trim().toLowerCase();
  if (v === "nao-escolha") return "Não Escolha";
  if (v === "reconvocacao") return "Reconvocação";
  if (v === "escolha") return "Escolha";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

/**
 * Detalhes da coluna conforme a situação (escolha):
 * - Escolha: tipo (precária/definitiva), nome DRE, nome Escola.
 * - Não escolha ou Reconvocação: sem texto.
 */
function buildDetalhes(situacaoNova: string | undefined, escolha: EscolhaListItem): string {
  const situacao = (situacaoNova ?? "").toLowerCase();
  if (situacao !== "escolha") return "";
  const tipoRaw = (escolha.tipo_vaga ?? "").toString().toLowerCase();
  const tipo = tipoRaw === "definitiva" ? "Definitiva" : tipoRaw === "precaria" ? "Precária" : "";
  const nomeDre = escolha.vaga_escola?.escola?.dre?.nome ?? "";
  const nomeEscola = escolha.vaga_escola?.escola?.nome_oficial ?? escolha.vaga_escola?.escola?.codigo_eol ?? "";
  const partes = [tipo, nomeDre, nomeEscola].filter(Boolean);
  return partes.join(" — ");
}

/** FlatMap: para cada escolha, para cada item em historico, gera uma linha. Ordena por criado_em decrescente. */
function buildHistoricoSituacoes(results: EscolhaListItem[]): HistoricoSituacaoItem[] {
  const linhas: HistoricoSituacaoItem[] = [];
  let idx = 0;
  for (const escolha of results) {
    const historico = (escolha.historico ?? []) as HistoricoEntry[];
    for (const h of historico) {
      const situacaoNova = h.situacao_nova ?? "—";
      linhas.push({
        key: h.uuid ?? `hist-${idx}`,
        data: formatarDataISO(h.criado_em),
        escolha: labelEscolha(situacaoNova === "—" ? undefined : situacaoNova),
        detalhes: buildDetalhes(h.situacao_nova, escolha),
        criadoEm: h.criado_em ?? "",
      });
      idx += 1;
    }
  }
  linhas.sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));
  return linhas;
}

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 16,
};

const valueStyle: React.CSSProperties = {
  fontWeight: 550,
  fontSize: 16,
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Open Sans",
  fontWeight: 700,
  fontSize: 16,
  marginTop: 24,
  marginBottom: 12,
};

const columnsAlteracoes: ColumnsType<AlteracaoItem> = [
  { title: "Data", dataIndex: "data", key: "data", width: 180 },
  { title: "Status anterior", dataIndex: "statusAnterior", key: "statusAnterior" },
  { title: "Status novo", dataIndex: "statusNovo", key: "statusNovo" },
  { title: "Motivo", dataIndex: "motivo", key: "motivo" },
];

const columnsHistoricoSituacoes: ColumnsType<HistoricoSituacaoItem> = [
  { title: "Data", dataIndex: "data", key: "data", width: 180 },
  { title: "Escolha", dataIndex: "escolha", key: "escolha" },
  {
    title: "Detalhes",
    dataIndex: "detalhes",
    key: "detalhes",
    render: (text: string) => text || "—",
  },
];

const HistoricoCandidatoModal: React.FC<HistoricoCandidatoModalProps> = ({
  open,
  nomeCandidato = "",
  concurso = "",
  cargo = "",
  alteracoes = [],
  reclassificacoes,
  eliminacao,
  categoriaEfetiva,
  concursoCandidatoUuid,
  concursoUuid,
  onClose,
}) => {
  const [historicoLinhas, setHistoricoLinhas] = useState<HistoricoSituacaoItem[]>([]);
  const [loadingEscolhas, setLoadingEscolhas] = useState(false);

  const alteracoesDataSource: AlteracaoItem[] =
    reclassificacoes?.length || eliminacao?.eliminado
      ? buildAlteracoesFromReclassificacao(reclassificacoes, eliminacao, categoriaEfetiva)
      : alteracoes;

  useEffect(() => {
    if (!open || !concursoCandidatoUuid || !concursoUuid) {
      setHistoricoLinhas([]);
      return;
    }
    setLoadingEscolhas(true);
    // Não envia vaga_escola__cargo_codigo para trazer todas as escolhas do candidato no concurso
    // (incluindo "nao-escolha" e "reconvocacao", que em geral não têm vaga_escola e seriam excluídas pelo filtro).
    const params = {
      candidato_uuid: concursoCandidatoUuid,
      concurso_uuid: concursoUuid,
    };
    getListaEscolhas(params)
      .response.then((data) => {
        const results = data?.results ?? [];
        setHistoricoLinhas(buildHistoricoSituacoes(results));
      })
      .catch(() => setHistoricoLinhas([]))
      .finally(() => setLoadingEscolhas(false));
  }, [open, concursoCandidatoUuid, concursoUuid]);

  return (
    <Modal
      open={open}
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          Histórico de alterações
        </Typography.Title>
      }
      onCancel={onClose}
      footer={
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="large"
            type="primary"
            style={{ height: 48, minWidth: 120 }}
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      }
      width={1100}
      centered
      styles={{
        header: { padding: "24px 24px 16px 24px" },
        body: { padding: "24px" },
        footer: { padding: "20px 24px" },
      }}
    >
      <Row gutter={[32, 24]} style={{ marginTop: 8, marginBottom: 24 }}>
        <Col span={6}>
          <div style={labelStyle}>Candidato:</div>
          <div style={{ ...valueStyle, marginTop: 12 }}>{nomeCandidato || "—"}</div>
        </Col>
        <Col span={10}>
          <div style={labelStyle}>Concurso:</div>
          <div style={{ ...valueStyle, marginTop: 12 }}>{concurso || "—"}</div>
        </Col>
        <Col span={8}>
          <div style={labelStyle}>Cargo:</div>
          <div style={{ ...valueStyle, marginTop: 12 }}>{cargo || "—"}</div>
        </Col>
      </Row>

      <div style={sectionTitleStyle}>Histórico de reclassificação/eliminação</div>
      <Table<AlteracaoItem>
        columns={columnsAlteracoes}
        dataSource={alteracoesDataSource}
        pagination={false}
        size="small"
        locale={{ emptyText: "Nenhuma alteração registrada" }}
        style={{ marginBottom: 8 }}
      />

      <div style={sectionTitleStyle}>Histórico de escolhas</div>

      <Spin spinning={loadingEscolhas}>
        <Table<HistoricoSituacaoItem>
          columns={columnsHistoricoSituacoes}
          dataSource={historicoLinhas}
          pagination={false}
          size="small"
          locale={{ emptyText: loadingEscolhas ? "Carregando..." : "Nenhum histórico registrado" }}
        />
      </Spin>
    </Modal>
  );
};

export default HistoricoCandidatoModal;
export type { HistoricoCandidatoModalProps, AlteracaoItem, HistoricoSituacaoItem };
