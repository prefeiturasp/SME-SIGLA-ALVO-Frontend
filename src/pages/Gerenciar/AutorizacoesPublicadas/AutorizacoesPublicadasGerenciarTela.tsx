import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Table, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import AdicionarAutorizacaoModal from "./components/AdicionarAutorizacaoModal";
import ConfirmarExclusaoModal from "./components/ConfirmarExclusaoModal";
import { useGetAutorizacoesPublicadasPorCargo } from "./hooks/useGetCargos";
import { useDeleteAutorizacaoPublicada } from "./hooks/useDeleteAutorizacaoPublicada";

type ItemRow = {
  key: string;
  uuid?: string;
  autorizacoes: number;
  dataCadastro: string;
  observacao: string;
  dataISO?: string | null;
};

const { Text } = Typography;

const AutorizacoesPublicadasGerenciarTela: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cargoUuid = searchParams.get("cargoUuid") || undefined;
  const cargoCodigo = searchParams.get("cargoCodigo") || undefined;
  const cargo = searchParams.get("cargo") || undefined;

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [addOpen, setAddOpen] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [autorizacaoParaExcluir, setAutorizacaoParaExcluir] = useState<string | undefined>(undefined);
  const [editContext, setEditContext] = useState<{
    mode: "create" | "edit";
    autorizacaoUuid?: string;
    quantidade?: number;
    dataAutorizacao?: string | null;
    observacao?: string;
  } | null>(null);

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
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/autorizacoes-publicadas")}
          >
            Gestão de Autorizações publicadas
          </Text>
        ),
      },
      {
        title: (
          <Text strong>
            Gerenciar - Cargo: {cargoCodigo ?? "—"} - {cargo ?? "—"}
          </Text>
        ),
      },
    ] as TitleItem[],
    [navigate, cargoCodigo, cargo]
  );

  useEffect(() => {
    if (!cargoUuid) {
      setItems([]);
      return;
    }
    const ctrl = new AbortController();
    const formatDate = (iso?: string | null): string => {
      if (!iso) return "—";
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return "—";
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    };
    const run = async () => {
      setLoading(true);
      const result = await useGetAutorizacoesPublicadasPorCargo(cargoUuid, ctrl.signal);
      if ((result as any)?.message) {
        setItems([]);
      } else {
        const data = result as { results?: Array<any> };
        const rows: ItemRow[] = (data.results || []).map((row: any, idx: number) => ({
          key: String(row?.uuid || idx),
          uuid: typeof row?.uuid === "string" ? row.uuid : undefined,
          autorizacoes: Number(row?.autorizacoes) || 0,
          dataCadastro: formatDate(row?.data_autorizacao),
          observacao: String(row?.observacao || "—"),
          dataISO: (typeof row?.data_autorizacao === "string" ? row.data_autorizacao : null) as string | null,
        }));
        setItems(rows);
      }
      setLoading(false);
    };
    void run();
    return () => ctrl.abort();
  }, [cargoUuid, refreshToken]);

  const columns = useMemo(
    () => [
      {
        title: "Autorizações",
        dataIndex: "autorizacoes",
        key: "autorizacoes",
        align: "center" as const,
        width: 160,
        ellipsis: true,
        render: (value: number) => <span style={{ whiteSpace: "nowrap" }}>{value}</span>,
      },
      {
        title: "Data de cadastro",
        dataIndex: "dataCadastro",
        key: "dataCadastro",
        align: "center" as const,
        width: 200,
        ellipsis: true,
        render: (value: string) => <span style={{ whiteSpace: "nowrap" }}>{value}</span>,
      },
      {
        title: "Observação",
        dataIndex: "observacao",
        key: "observacao",
        width: 280,
        render: (text: string) => (
          <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</span>
        ),
      },
      {
        title: "Ações",
        key: "acoes",
        align: "center" as const,
        width: 140,
        render: (_: any, record: ItemRow) => {
          return (
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <EditOutlined
                data-testid="edit-btn"
                style={{ fontSize: 16, color: "#0F59C8", cursor: "pointer" }}
                title="Editar"
                onClick={() => {
                  setEditContext({
                    mode: "edit",
                    autorizacaoUuid: record?.uuid,
                    quantidade: record?.autorizacoes,
                    dataAutorizacao: record?.dataISO || null,
                    observacao: record?.observacao || "",
                  });
                  setAddOpen(true);
                }}
              />
              <DeleteOutlined
                data-testid="delete-btn"
                style={{ fontSize: 16, color: "#C41D7F", cursor: "pointer" }}
                title="Excluir"
                onClick={() => {
                  if (!record?.uuid) return;
                  setAutorizacaoParaExcluir(record.uuid);
                  setDeleteModalOpen(true);
                }}
              />
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title={`Gerenciar - Cargo: ${cargoCodigo ?? "—"} - ${cargo ?? "—"}`}
    >
      <Card style={{ border: "none", borderRadius: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Table
            rowKey="key"
            dataSource={items}
            columns={columns as any}
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: items.length,
              showSizeChanger: true,
            }}
            onChange={(pg) =>
              setPagination({
                current: Number(pg.current) || 1,
                pageSize: Number(pg.pageSize) || 10,
              })
            }
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              onClick={() => {
                navigate("/autorizacoes-publicadas");
              }}
            >
              Voltar
            </Button>
            <Button
              type="primary"
              onClick={() => {
                setEditContext({ mode: "create" });
                setAddOpen(true);
              }}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Card>
      <AdicionarAutorizacaoModal
        open={addOpen}
        cargo={cargo}
        cargoUuid={cargoUuid}
        mode={editContext?.mode || "create"}
        autorizacaoUuid={editContext?.autorizacaoUuid}
        initialValues={{
          quantidade: editContext?.quantidade,
          dataAutorizacao: editContext?.dataAutorizacao || undefined,
          observacao: editContext?.observacao,
        }}
        onCancel={() => setAddOpen(false)}
        onAdd={(_payload) => {
          setAddOpen(false);
          setRefreshToken((prev) => prev + 1);
        }}
      />
      <ConfirmarExclusaoModal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setAutorizacaoParaExcluir(undefined);
        }}
        onConfirm={async () => {
          if (!autorizacaoParaExcluir) return;
          const ctrl = new AbortController();
          await useDeleteAutorizacaoPublicada(autorizacaoParaExcluir, ctrl.signal);
          setDeleteModalOpen(false);
          setAutorizacaoParaExcluir(undefined);
          setRefreshToken((prev) => prev + 1);
        }}
      />
    </BaseTela>
  );
};

export default AutorizacoesPublicadasGerenciarTela;

