import React, { useState } from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

import { CustomTitle } from "./style";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import type { IUltimasImportacoesVagas } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";
import ErroModal from "./ErroModal";
import { useGetDownloadError, TipoImportacao } from "../../hooks/useGetDownloadError";

interface UltimasImportacoesDeVagasTableProps extends TableProps<IUltimasImportacoesVagas> {
  data: IUltimasImportacoesVagas[];
}
const UltimasImportacoesDeVagasTable: React.FC<UltimasImportacoesDeVagasTableProps> = ({ data, ...rest }) => {
  const [isErrosModalOpen, setIsErrosModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IUltimasImportacoesVagas | null>(null);

  const { handleDownload: handleDownloadError, isDownloading } =
    useGetDownloadError(TipoImportacao.VAGAS);

  const handleOpenErrosModal = (record: IUltimasImportacoesVagas) => {
    setSelectedRecord(record);
    setIsErrosModalOpen(true);
  };

  const handleCloseErrosModal = () => {
    setIsErrosModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDownload = () => {
    if (selectedRecord?.uuid) {
      handleDownloadError(selectedRecord.uuid);
    }
  };

  const importacaoErro = selectedRecord?.erros?.[0] || null;

  const columns: ColumnsType<IUltimasImportacoesVagas> = [
    {
      title: "Nome do arquivo",
      dataIndex: "nome_arquivo",
      key: "nome_arquivo",
      align: "center",
      render: (nome: string) => nome || "-",
    },
    {
      title: "Processo",
      dataIndex: "processo_nome",
      key: "processo_nome",
      align: "center",
      render: (processo: string) => processo || "-",
    },
    {
      title: "Data da importação",
      dataIndex: "criado_em",
      key: "criado_em",
      align: "center",
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status: string) => status || "-",
    },
    {
      title: "Ações",
      key: "acoes",
      align: "center",
      render: (_, record) => (
        record.status === "ERRO" && (
          <Tooltip title="Importação com erro, clique para visualizar">
            <WarningOutlined 
              style={{ cursor: "pointer", fontSize: "18px", color: "#ff4d4f" }} 
              onClick={() => handleOpenErrosModal(record)}
            />
          </Tooltip>
        )
      ),
    },
  ];

  return (
    <>

      <CustomTitle level={4} style={{ margin: "1rem 0" }}>
        {"Últimas importações"}
      </CustomTitle>

      <StyledTable
        columns={columns}
        dataSource={data}
        rowKey={(record) => `${record.uuid}`}
        bordered
        rowClassName={(_, index) =>
          index % 2 === 0 ? "row-white" : "row-gray"
        }
        {...rest}
      />

      <ErroModal
        open={isErrosModalOpen}
        onClose={handleCloseErrosModal}
        importacaoErro={importacaoErro}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </>
  );
};

export default UltimasImportacoesDeVagasTable;
