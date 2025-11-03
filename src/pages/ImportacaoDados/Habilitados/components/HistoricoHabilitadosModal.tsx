import React, { useState } from "react";
import { DeleteOutlined, WarningOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { Button, Modal, Space, Typography, Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import { useImportacaoDados } from "../hooks/useImportacaoDadosHabilitados";
import { deleteIcon } from "../../../../components/EstilosCompartilhados";
import { API } from "../../../../services";
import { useGetDownloadErro } from "../hooks/useGetDownloadErro";
import ErroModal from "./ErroModal";

interface HistoricoProps extends TableProps<any> {
  data?: any[];
  onVoltar?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoricoHabilitadosModal: React.FC<HistoricoProps> = ({
  data,
  onVoltar,
  isOpen,
  onClose,
  ...rest
}) => {
  const {
    importacoesArquivos,
    importacoesArquivosIsLoading,
    listRequest,
    onAntTableChange,
  } = useImportacaoDados();

  const [isErrosModalOpen, setIsErrosModalOpen] = useState(false);
  const [selectedImportacaoUuid, setSelectedImportacaoUuid] = useState<string | null>(null);

  const { data: errosData, isLoading: errosIsLoading } = useQuery({
    queryKey: ["erros-habilitados", selectedImportacaoUuid],
    queryFn: ({ signal }) => {
      if (!selectedImportacaoUuid) return null;
      return API.ImportacaoDados.getErrosHabilitados(selectedImportacaoUuid, undefined, { signal }).response;
    },
    enabled: !!selectedImportacaoUuid && isErrosModalOpen,
  });

  const { handleDownload, isDownloading } = useGetDownloadErro();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      console.log("Voltar");
    }
  };

  const handleDelete = (uuid: string) => {
    console.log("Delete", uuid);
  };

  const handleOpenErrosModal = (uuid: string) => {
    setSelectedImportacaoUuid(uuid);
    setIsErrosModalOpen(true);
  };

  const handleCloseErrosModal = () => {
    setIsErrosModalOpen(false);
    setSelectedImportacaoUuid(null);
  };

  const handleDownloadClick = () => {
    if (selectedImportacaoUuid) {
      handleDownload(selectedImportacaoUuid);
    }
  };

  const primeiroErro = errosData?.results?.[0] || null;

  const columns: ColumnsType<any> = [
    {
      title: "Data",
      dataIndex: "criado_em",
      key: "criado_em",
      align: "center",
      render: (text: string) => (text ? dayjs(text).format("DD/MM/YYYY") : "-"),
    },
    {
      title: "Concurso",
      dataIndex: "concurso_nome",
      key: "concurso_nome",
      align: "center",
      render: (concurso: string) => concurso || "-",
    },
    {
      title: "Arquivo",
      dataIndex: "nome_arquivo",
      key: "nome_arquivo",
      align: "center",
      render: (text: string) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => status || "-",
    },
    {
      width: "12%",
      title: "Ações",
      dataIndex: "",
      key: "x",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {record.status === "ERRO" && (
            <Tooltip title="Importação com erro, clique para visualizar">
              <WarningOutlined 
                style={{ cursor: "pointer", fontSize: "18px", color: "#ff4d4f" }} 
                onClick={() => handleOpenErrosModal(record.uuid)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={"53.75rem"}
      centered
      title={
        <Typography.Text style={{ fontSize: 16 }}>
          Histórico de Importações da Fundação
        </Typography.Text>
      }
    >
      <StyledTable<any>
        columns={columns}
        dataSource={importacoesArquivos?.results || []}
        rowKey="id"
        bordered
        rowClassName={(_: any, index: number) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        className="historico-table"
        loading={importacoesArquivosIsLoading}
        pagination={{
          current: listRequest.pagination.page,
          pageSize: 10,
          defaultPageSize: 10,
          position: ["bottomLeft"],
          total: importacoesArquivos?.count,
          showTotal: (total: number, range: [number, number]) => (
            <span style={{ marginLeft: 16 }}>
              {`Mostrando ${range?.[0] ?? 0}-${range?.[1] ?? 0} de ${total ?? 0} registro(s)`}
            </span>
          ),
        }}
        onChange={onAntTableChange}
        {...rest}
      />
      
      <ErroModal
        open={isErrosModalOpen}
        onClose={handleCloseErrosModal}
        isLoading={errosIsLoading}
        importacaoErro={primeiroErro}
        onDownload={handleDownloadClick}
        isDownloading={isDownloading}
      />
    </Modal>
  );
};

export default HistoricoHabilitadosModal;
