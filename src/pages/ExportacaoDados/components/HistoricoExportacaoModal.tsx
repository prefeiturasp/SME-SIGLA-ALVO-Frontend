import React from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Modal, Typography, Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { StyledTable } from "../../../components/EstilosCompartilhados";
import { useExportacaoVagas } from "../hooks/useExportacaoVagas";
import type { ExportacaoTipo } from "../../../services/resources/exportacaoDados/types";
import type { IExportacaoVagasListItem } from "../../../services/resources/exportacaoDados/types";

const TITULOS: Record<ExportacaoTipo, string> = {
  "vagas-processo": "Histórico de exportações - Vagas Processo",
  "vagas-sigpec": "Histórico de exportações - Vagas SIGPEC",
};

interface HistoricoExportacaoModalProps {
  open: boolean;
  onClose: () => void;
  tipo: ExportacaoTipo;
}

const HistoricoExportacaoModal: React.FC<HistoricoExportacaoModalProps> = ({
  open,
  onClose,
  tipo,
}) => {
  const {
    listData,
    listLoading,
    listRequest,
    onAntTableChange,
    handleDownload,
  } = useExportacaoVagas(tipo);

  const total = listData?.count ?? 0;
  const results = listData?.results ?? [];

  const columns: ColumnsType<IExportacaoVagasListItem> = [
    {
      title: "Data",
      dataIndex: "criado_em",
      key: "criado_em",
      align: "center",
      render: (text: string) =>
        text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "Processo",
      dataIndex: "processo_nome",
      key: "processo_nome",
      align: "center",
      render: (nome: string | null | undefined) => nome ?? "—",
    },
    {
      title: "Concurso",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
      align: "center",
      render: (nome: string | null | undefined) => nome ?? "—",
    },
    {
      title: "Cargo",
      dataIndex: "cargo_nome",
      key: "cargo_nome",
      align: "center",
      render: (nome: string | null | undefined) => nome ?? "—",
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
          {TITULOS[tipo]}
        </Typography.Text>
      }
    >
      <StyledTable<IExportacaoVagasListItem>
        columns={columns}
        dataSource={results}
        rowKey="uuid"
        bordered
        rowClassName={(_: IExportacaoVagasListItem, index: number) =>
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

export default HistoricoExportacaoModal;
