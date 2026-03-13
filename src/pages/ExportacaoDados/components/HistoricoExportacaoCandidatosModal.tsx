import React from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { Modal, Typography, Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import { StyledTable } from "../../../components/EstilosCompartilhados";
import { useExportacaoCandidatos } from "../hooks/useExportacaoCandidatos";
import type { IExportacaoCandidatosListItem } from "../../../services/resources/exportacaoDados/types";

interface HistoricoExportacaoCandidatosModalProps {
  open: boolean;
  onClose: () => void;
}

const HistoricoExportacaoCandidatosModal: React.FC<HistoricoExportacaoCandidatosModalProps> = ({
  open,
  onClose,
}) => {
  const {
    listData,
    listLoading,
    listRequest,
    onAntTableChange,
    handleDownload,
  } = useExportacaoCandidatos();

  const total = listData?.count ?? 0;
  const results = listData?.results ?? [];

  const columns: ColumnsType<IExportacaoCandidatosListItem> = [
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
          Histórico de exportações - Candidatos Processo
        </Typography.Text>
      }
    >
      <StyledTable<IExportacaoCandidatosListItem>
        columns={columns}
        dataSource={results}
        rowKey="uuid"
        bordered
        rowClassName={(_: IExportacaoCandidatosListItem, index: number) =>
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

export default HistoricoExportacaoCandidatosModal;
