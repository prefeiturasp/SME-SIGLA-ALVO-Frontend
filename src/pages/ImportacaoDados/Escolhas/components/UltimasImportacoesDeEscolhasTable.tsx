import React, { useState, useMemo } from "react";
import type { ColumnsType, TableProps } from "antd/es/table";
import dayjs from "dayjs";
import { WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useQuery } from "@tanstack/react-query";
import { API } from "../../../../services";

import { CustomTitle } from "../../Vagas/components/style";
import { StyledTable } from "../../../../components/EstilosCompartilhados";
import type { IImportacaoEscolhasResponse } from "../../../../services/resources/importacaoDados/IImportacaoArquivos";
import ErroModal from "./ErroModal";

interface IImportacaoEscolhasResponseComNome extends IImportacaoEscolhasResponse {
  processo_nome?: string;
}

interface UltimasImportacoesDeEscolhasTableProps extends TableProps<IImportacaoEscolhasResponseComNome> {
  data: IImportacaoEscolhasResponse[];
}

const UltimasImportacoesDeEscolhasTable: React.FC<UltimasImportacoesDeEscolhasTableProps> = ({ data, ...rest }) => {
  const [isErrosModalOpen, setIsErrosModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IImportacaoEscolhasResponseComNome | null>(null);

  // Buscar nomes dos processos para os registros que não têm
  const processosUuids = useMemo(() => {
    return data
      .filter(item => item.processo_uuid && !item.processo_nome)
      .map(item => item.processo_uuid);
  }, [data]);

  // Query para buscar processos (se necessário)
  const { data: processosData } = useQuery({
    queryKey: ["processosConvocacao", processosUuids],
    queryFn: async () => {
      if (processosUuids.length === 0) return {};
      
      const processos: Record<string, string> = {};
      await Promise.all(
        processosUuids.map(async (uuid) => {
          try {
            const processo = await API.Convocacao.getProcessoConvocacaoPorUUID(uuid).response;
            processos[uuid] = processo.descricao || processo.nome || "-";
          } catch {
            processos[uuid] = "-";
          }
        })
      );
      return processos;
    },
    enabled: processosUuids.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  // Enriquecer dados com nomes dos processos
  const dadosEnriquecidos = useMemo(() => {
    return data.map(item => ({
      ...item,
      processo_nome: item.processo_nome || processosData?.[item.processo_uuid] || "-",
    }));
  }, [data, processosData]);

  const handleOpenErrosModal = (record: IImportacaoEscolhasResponseComNome) => {
    setSelectedRecord(record);
    setIsErrosModalOpen(true);
  };

  const handleCloseErrosModal = () => {
    setIsErrosModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDownload = async () => {
    if (selectedRecord?.uuid) {
      try {
        const blob = await API.ImportacaoDados.getErrosEscolhasDownload(selectedRecord.uuid).response;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `erros_importacao_escolhas_${selectedRecord.uuid}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao baixar arquivo:", error);
      }
    }
  };

  const importacaoErro = selectedRecord?.erros?.[0] || null;

  const columns: ColumnsType<IImportacaoEscolhasResponseComNome> = [
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
      render: (text: string) => text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "-",
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
        dataSource={dadosEnriquecidos}
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
        isDownloading={false}
      />
    </>
  );
};

export default UltimasImportacoesDeEscolhasTable;

