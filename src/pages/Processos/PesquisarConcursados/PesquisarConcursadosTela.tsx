import React, { useMemo, useState } from "react";
import { Card, Row, Col, Typography, Input, Table, Button, notification, Tooltip } from "antd";
import { BarsOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import {
  PrimaryButton,
  SecondaryButton,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import { CustomFormItem } from "../../../components/FormStyle";
import type { ColumnsType } from "antd/es/table";
import {
  getBuscarCandidatos,
  type CandidatoConcursoItem,
  type ReclassificacaoItem,
  type EliminacaoItem,
} from "../../../services/resources/escolhas";
import AlterarCandidatoModal from "./components/AlterarCandidatoModal";
import HistoricoCandidatoModal from "./components/HistoricoCandidatoModal";

const { Text } = Typography;

/** Formata telefone para exibição: (XX) X XXXX-XXXX. Se for "—" ou vazio, retorna "—". */
function formatarTelefoneExibicao(value: string | undefined): string {
  if (value === "—" || !value?.trim()) return "—";
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "—";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 3) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}

type FiltrosForm = {
  nome?: string;
  rf?: string;
  rg?: string;
  cpf?: string;
};

export type RowConcursado = {
  key: string;
  concurso: string;
  cargo: string;
  candidato: string;
  rf: string;
  rg: string;
  cpf: string;
  telefone: string;
  classificacaoGeral: number | string;
  classificacaoNNA: number | string;
  classificacaoDeficiente: number | string;
  concursoUuid?: string;
  concursoCandidatoUuid?: string;
  candidatoUuid?: string;
  codigoCargo?: string;
  reclassificacoes?: ReclassificacaoItem[];
  eliminacao?: EliminacaoItem | null;
  /** Tipo de classificação atual (categoria_efetiva): GERAL, PCD, NNA — usado no histórico para exibir o novo tipo após reclassificação. */
  categoriaEfetiva?: string | null;
};

function mapResponseToRows(data: CandidatoConcursoItem[]): RowConcursado[] {
  const rows: RowConcursado[] = [];
  data.forEach((item, idxItem) => {
    const nome = item.nome ?? "—";
    const rf = item.registro_funcional ?? "—";
    const rg = item.rg ?? "—";
    const cpf = item.cpf ?? "—";
    const telefone = item.celular?.trim() || "—";
    const concursos = item.concursos && item.concursos.length > 0 ? item.concursos : [{}];
    concursos.forEach((cc, idxConc) => {
      rows.push({
        key: `${item.uuid ?? idxItem}-${cc?.concurso_candidato_uuid ?? idxConc}`,
        concurso: cc?.concurso_nome ?? cc?.concurso_uuid ?? "—",
        cargo: cc?.descricao_cargo ?? "—",
        candidato: nome,
        rf,
        rg,
        cpf,
        telefone,
        classificacaoGeral: cc?.classificacao ?? "—",
        classificacaoNNA: cc?.classificacao_nna ?? "—",
        classificacaoDeficiente: cc?.classificacao_pcd ?? "—",
        concursoUuid: cc?.concurso_uuid,
        concursoCandidatoUuid: cc?.concurso_candidato_uuid,
        candidatoUuid: item.uuid,
        codigoCargo: cc?.codigo_cargo,
        reclassificacoes: cc?.reclassificacoes ?? [],
        eliminacao:
          cc && cc.eliminado
            ? {
                eliminado: true,
                eliminado_em: cc.eliminado_em,
                eliminado_motivo: cc.eliminado_motivo ?? "",
                eliminado_por: cc.eliminado_por ?? "",
              }
            : undefined,
        categoriaEfetiva: cc?.categoria_efetiva,
      });
    });
  });
  return rows;
}

const PesquisarConcursadosTela: React.FC = () => {
  const navigate = useNavigate();

  const [filtros, setFiltros] = useState<FiltrosForm>({
    nome: "",
    rf: "",
    rg: "",
    cpf: "",
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [rows, setRows] = useState<RowConcursado[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalAlterarOpen, setModalAlterarOpen] = useState(false);
  const [candidatoSelecionado, setCandidatoSelecionado] = useState<RowConcursado | null>(null);
  const [modalHistoricoOpen, setModalHistoricoOpen] = useState(false);
  const [candidatoHistorico, setCandidatoHistorico] = useState<RowConcursado | null>(null);

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Home
          </Text>
        ),
      },
      {
        title: (
          <Link to="/processos/convocacao">
            <Text strong>Processos</Text>
          </Link>
        ),
      },
      { title: "Pesquisar Concursados" },
    ] as TitleItem[],
    [navigate]
  );

  const temFiltro = Boolean(
    (filtros.nome ?? "").trim() ||
      (filtros.rf ?? "").trim() ||
      (filtros.rg ?? "").trim() ||
      (filtros.cpf ?? "").trim()
  );

  const handleLimpar = () => {
    setFiltros({
      nome: "",
      rf: "",
      rg: "",
      cpf: "",
    });
    setPagination({ current: 1, pageSize: 10 });
    setRows([]);
  };

  /** Busca candidatos com os filtros atuais e preenche a tabela. Reutilizada em handleFiltrar e após salvar no modal. */
  const refetchCandidatos = async () => {
    setLoading(true);
    try {
      const { response } = getBuscarCandidatos({
        nome: (filtros.nome ?? "").trim() || undefined,
        registro_funcional: (filtros.rf ?? "").trim() || undefined,
        rg: (filtros.rg ?? "").trim() || undefined,
        cpf: (filtros.cpf ?? "").trim() || undefined,
      });
      const data = await response;
      setRows(mapResponseToRows(Array.isArray(data) ? data : []));
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
        (err as Error)?.message ??
        "Erro ao buscar candidatos.";
      notification.error({
        message: "Erro ao buscar candidatos",
        description: String(detail),
        placement: "top",
        duration: 3.5,
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrar = async () => {
    if (!temFiltro) {
      notification.warning({
        message: "Informe pelo menos um parâmetro: nome, RF, RG ou CPF.",
        placement: "top",
        duration: 3.5,
      });
      return;
    }
    setPagination((prev) => ({ ...prev, current: 1 }));
    await refetchCandidatos();
  };

  const columns: ColumnsType<RowConcursado> = useMemo(
    () => [
      { title: "Concurso", dataIndex: "concurso", key: "concurso" },
      { title: "Cargo", dataIndex: "cargo", key: "cargo" },
      { title: "Candidato", dataIndex: "candidato", key: "candidato" },
      {
        title: "RF",
        dataIndex: "rf",
        key: "rf",
        align: "center",
      },
      { title: "RG", dataIndex: "rg", key: "rg", align: "center" },
      { title: "CPF", dataIndex: "cpf", key: "cpf", align: "center" },
      {
        title: "Telefone",
        dataIndex: "telefone",
        key: "telefone",
        align: "center",
        render: (_: unknown, record: RowConcursado) =>
          formatarTelefoneExibicao(record.telefone),
      },
      {
        title: "Class. Geral",
        dataIndex: "classificacaoGeral",
        key: "classificacaoGeral",
        align: "center",
      },
      {
        title: "Class. NNA",
        dataIndex: "classificacaoNNA",
        key: "classificacaoNNA",
        align: "center",
      },
      {
        title: "Class Def.",
        dataIndex: "classificacaoDeficiente",
        key: "classificacaoDeficiente",
        align: "center",
      },
      {
        title: "Alterar",
        key: "alterar",
        align: "center",
        render: (_: unknown, record: RowConcursado) => (
          <Tooltip title="Alterar">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setCandidatoSelecionado(record);
                setModalAlterarOpen(true);
              }}
            />
          </Tooltip>
        ),
      },
      {
        title: "Histórico",
        key: "historico",
        align: "center",
        render: (_: unknown, record: RowConcursado) => (
          <Tooltip title="Histórico">
            <Button
              type="link"
              size="small"
              icon={<BarsOutlined />}
              onClick={() => {
                setCandidatoHistorico(record);
                setModalHistoricoOpen(true);
              }}
            />
          </Tooltip>
        ),
      },
    ],
    []
  );

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Pesquisar Concursados"
    >
      <Card style={{ marginTop: "1.25rem" }} variant="borderless">
        <Row gutter={[24, 16]} style={{ textAlign: "left" }}>
          <Col xs={24} sm={12} md={6}>
            <CustomFormItem label="Nome" labelCol={{ span: 24 }}>
              <Input
                value={filtros.nome}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, nome: e.target.value }))
                }
                style={{ marginTop: 6 }}
                placeholder="Digite o nome"
              />
            </CustomFormItem>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <CustomFormItem label="RF" labelCol={{ span: 24 }}>
              <Input
                value={filtros.rf}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, rf: e.target.value }))
                }
                style={{ marginTop: 6 }}
                placeholder="Digite o RF"
              />
            </CustomFormItem>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <CustomFormItem label="RG" labelCol={{ span: 24 }}>
              <Input
                value={filtros.rg}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, rg: e.target.value }))
                }
                style={{ marginTop: 6 }}
                placeholder="Digite o RG"
              />
            </CustomFormItem>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <CustomFormItem label="CPF" labelCol={{ span: 24 }}>
              <Input
                value={filtros.cpf}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, cpf: e.target.value }))
                }
                style={{ marginTop: 6 }}
                placeholder="Digite o CPF"
              />
            </CustomFormItem>
          </Col>

          <Col
            xs={24}
            md={24}
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <ActionButtonsContainer
              style={{ justifyContent: "flex-end", width: "100%" }}
            >
              <SecondaryButton onClick={handleLimpar}>Limpar</SecondaryButton>
              <PrimaryButton onClick={handleFiltrar} disabled={!temFiltro}>
                Filtrar
              </PrimaryButton>
            </ActionButtonsContainer>
          </Col>
        </Row>
      </Card>

      <Card style={{ marginTop: "1.25rem" }} variant="borderless">
        <Table
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            onChange: (page, pageSize) =>
              setPagination({ current: page, pageSize: pageSize ?? 10 }),
            showSizeChanger: true,
            showTotal: (total, range) => (
              <span style={{ marginLeft: 16 }}>
                {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
              </span>
            ),
          }}
          rowKey="key"
        />
      </Card>

      <AlterarCandidatoModal
        open={modalAlterarOpen}
        candidatoUuid={candidatoSelecionado?.candidatoUuid}
        concurso={candidatoSelecionado?.concurso}
        cargo={candidatoSelecionado?.cargo}
        nomeCandidato={candidatoSelecionado?.candidato}
        onClose={() => {
          setModalAlterarOpen(false);
          setCandidatoSelecionado(null);
        }}
        onSave={() => {
          setModalAlterarOpen(false);
          setCandidatoSelecionado(null);
          if (temFiltro) refetchCandidatos();
        }}
      />

      <HistoricoCandidatoModal
        open={modalHistoricoOpen}
        nomeCandidato={candidatoHistorico?.candidato}
        concurso={candidatoHistorico?.concurso}
        cargo={candidatoHistorico?.cargo}
        reclassificacoes={candidatoHistorico?.reclassificacoes}
        eliminacao={candidatoHistorico?.eliminacao}
        categoriaEfetiva={candidatoHistorico?.categoriaEfetiva}
        concursoCandidatoUuid={candidatoHistorico?.concursoCandidatoUuid}
        concursoUuid={candidatoHistorico?.concursoUuid}
        codigoCargo={candidatoHistorico?.codigoCargo}
        onClose={() => {
          setModalHistoricoOpen(false);
          setCandidatoHistorico(null);
        }}
      />
    </BaseTela>
  );
};

export default PesquisarConcursadosTela;
