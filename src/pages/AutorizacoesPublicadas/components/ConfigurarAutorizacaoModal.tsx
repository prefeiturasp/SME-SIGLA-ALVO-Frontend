import React, { useEffect, useMemo, useState } from "react";
import { Button, Modal, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AdicionarAutorizacaoModal from "./AdicionarAutorizacaoModal";
import { useGetAutorizacoesPublicadasPorCargo } from "../hooks/useGetCargos";
import { useDeleteAutorizacaoPublicada } from "../hooks/useDeleteAutorizacaoPublicada";

type ItemRow = {
  key: string;
  uuid?: string;
  autorizacoes: number;
  autorizacoesSemEfeito: number;
  dataCadastro: string;
  observacao: string;
  dataISO?: string | null;
  vagasSemEfeito?: boolean;
};

type Props = {
  open: boolean;
  onCancel: () => void;
  onAdd: () => void;
  cargoUuid?: string;
  cargoCodigo?: number;
  cargo?: string;
};

const ConfigurarAutorizacaoModal: React.FC<Props> = ({
  open,
  onCancel,
  onAdd,
  cargoUuid,
  cargoCodigo,
  cargo,
}) => {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [addOpen, setAddOpen] = useState(false);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);
  const [editContext, setEditContext] = useState<{
    mode: "create" | "edit";
    autorizacaoUuid?: string;
    quantidade?: number;
    dataAutorizacao?: string | null;
    observacao?: string;
    vagasSemEfeito?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!open || !cargoUuid) {
      if (!open) setItems([]);
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
          autorizacoesSemEfeito: Number(row?.autorizacoes_sem_efeito) || 0,
          dataCadastro: formatDate(row?.data_autorizacao),
          observacao: String(row?.observacao || "—"),
          dataISO: (typeof row?.data_autorizacao === "string" ? row.data_autorizacao : null) as string | null,
          vagasSemEfeito: typeof row?.vagas_sem_efeito === "boolean" ? row.vagas_sem_efeito : undefined,
        }));
        setItems(rows);
      }
      setLoading(false);
    };
    void run();
    return () => ctrl.abort();
  }, [open, cargoUuid, refreshToken]);

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
        title: "Autorizações sem efeito",
        dataIndex: "autorizacoesSemEfeito",
        key: "autorizacoesSemEfeito",
        align: "center" as const,
        width: 250,
        ellipsis: true,
        render: (value: number) => <span style={{ whiteSpace: "nowrap" }}>{value}</span>,
      },
      {
        title: "Data de cadastro",
        dataIndex: "dataCadastro",
        key: "dataCadastro",
        align: "center" as const,
        width: 180,
        ellipsis: true,
        render: (value: string) => <span style={{ whiteSpace: "nowrap" }}>{value}</span>,
      },
      {
        title: "Observação",
        dataIndex: "observacao",
        key: "observacao",
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
                    quantidade: record?.vagasSemEfeito ? record?.autorizacoesSemEfeito : record?.autorizacoes,
                    dataAutorizacao: record?.dataISO || null,
                    observacao: record?.observacao || "",
                    vagasSemEfeito: record?.vagasSemEfeito ?? false,
                  });
                  setAddOpen(true);
                }}
              />
              <DeleteOutlined
                data-testid="delete-btn"
                style={{ fontSize: 16, color: "#C41D7F", cursor: "pointer" }}
                title="Excluir"
                onClick={async () => {
                  if (!record?.uuid) return;
                  const ctrl = new AbortController();
                  await useDeleteAutorizacaoPublicada(record.uuid, ctrl.signal);
                  setRefreshToken((prev) => prev + 1);
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
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={`Cargo: ${cargoCodigo ?? "—"} - ${cargo ?? "—"}`}
      width={1200}
    >
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
              setRefreshToken((prev) => prev + 1);
              onCancel();
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
          vagasSemEfeito: editContext?.vagasSemEfeito,
        }}
        onCancel={() => setAddOpen(false)}
        onAdd={(_payload) => {
          setAddOpen(false);
          // Notificar o pai, se necessário
          setRefreshToken((prev) => prev + 1);
          if (onAdd) onAdd();
        }}
      />
    </Modal>
  );
};

export default ConfigurarAutorizacaoModal;

