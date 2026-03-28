import React, { useEffect } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Modal, Typography, Button, Tag } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { StyledTable } from "../../../components/EstilosCompartilhados";
import { useExportacaoLotes } from "../hooks/useExportacaoLotes";
import type { IExportacaoLoteListItem, StatusExportacaoLote } from "../../../services/resources/exportacaoDados/types";

const STATUS_CONFIG: Record<StatusExportacaoLote, { color: string; label: string }> = {
  SUCESSO:      { color: "success", label: "Sucesso" },
  ATENCAO:      { color: "processing", label: "Atenção" },
  ERRO:         { color: "error", label: "Erro" },
  PENDENTE:     { color: "default", label: "Pendente" },
  PROCESSANDO:  { color: "default", label: "Processando" },
};

interface HistoricoExportacaoLotesModalProps {
  open: boolean;
  onClose: () => void;
}

const HistoricoExportacaoLotesModal: React.FC<HistoricoExportacaoLotesModalProps> = ({
  open,
  onClose,
}) => {
  const {
    listData,
    listLoading,
    listRequest,
    onAntTableChange,
    handleDownload,
    listRefetch,
  } = useExportacaoLotes();

  useEffect(() => {
    if (open) listRefetch();
  }, [open]);

  const total = listData?.count ?? 0;
  const results = listData?.results ?? [];

  const columns: ColumnsType<IExportacaoLoteListItem> = [
    {
      title: "Data",
      dataIndex: "criado_em",
      key: "criado_em",
      align: "center",
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Concurso",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
      align: "center",
      render: (nome: string | null | undefined) => nome ?? "—",
    },
    {
      title: "Lote",
      key: "lote",
      align: "center",
      render: (_: unknown, record: IExportacaoLoteListItem) => {
        if (record.numero_lote !== null && record.numero_lote !== undefined) {
          return `Lote ${record.numero_lote}`;
        }
        if (record.lote_uuid) {
          return `${record.lote_uuid.substring(0, 8)}...`;
        }
        return "—";
      },
    },
    {
      width: "12%",
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (statusValue: StatusExportacaoLote) => {
        const config = STATUS_CONFIG[statusValue] ?? { color: "default", label: statusValue };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      width: "12%",
      title: "Download",
      key: "download",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<CloudDownloadOutlined />}
          onClick={() => handleDownload(record.uuid)}
          aria-label="Download"
        />
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="53.75rem"
      centered
      title={
        <Typography.Text style={{ fontSize: 16 }}>
          Histórico de exportações - Lotes SIGPEC
        </Typography.Text>
      }
    >
      <StyledTable<IExportacaoLoteListItem>
        columns={columns}
        dataSource={results}
        rowKey="uuid"
        bordered
        rowClassName={(_: IExportacaoLoteListItem, index: number) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="historico-table"
        loading={listLoading}
        pagination={{
          current: listRequest.pagination.page,
          pageSize: listRequest.pagination.page_size ?? 10,
          defaultPageSize: 10,
          position: ["bottomLeft"],
          total,
          showTotal: (totalCount: number, range: [number, number]) => (
            <span style={{ marginLeft: 16 }}>
              {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${totalCount ?? 0} registro(s)`}
            </span>
          ),
        }}
        onChange={onAntTableChange}
      />
    </Modal>
  );
};

export default HistoricoExportacaoLotesModal;
