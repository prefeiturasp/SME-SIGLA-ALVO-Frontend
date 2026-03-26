import React, { useState } from "react";
import { Row, Col, Typography, Space, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { WarningOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import {
  TabContentContainer,
  SectionCard,
  ActionButtonsContainer,
  SecondaryButton,
  StyledTable,
} from "../../../components/EstilosCompartilhados";

import { CustomTitle } from "../Vagas/components/style";
import { useImportacaoDados } from "./hooks/useImportacaoDadosHabilitados";
import ErroModal from "./components/ErroModal";
import { useGetDownloadError, TipoImportacao } from "../hooks/useGetDownloadError";

const { Text } = Typography;

const HistoricoHabilitadosTela: React.FC = () => {
  const breadcrumbItems = [
    { title: <Link to="/"><Text strong>Home</Text></Link> },
    { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
    { title: <Link to="/processos/importacao-dados"><Text strong>Importação de dados</Text></Link> },
    { title: "Histórico de importação de Habilitados" },
  ] as TitleItem[];

  const navigate = useNavigate();

  const {
    importacoesArquivos,
    importacoesArquivosIsLoading,
    listRequest,
    onAntTableChange,
  } = useImportacaoDados();

  const [isErrosModalOpen, setIsErrosModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  const { handleDownload, isDownloading } = useGetDownloadError(TipoImportacao.HABILITADOS);

  const handleOpenErrosModal = (record: any) => {
    setSelectedRecord(record);
    setIsErrosModalOpen(true);
  };

  const handleCloseErrosModal = () => {
    setIsErrosModalOpen(false);
    setSelectedRecord(null);
  };

  const handleDownloadClick = () => {
    if (selectedRecord?.uuid) {
      handleDownload(selectedRecord.uuid);
    }
  };

  const importacaoErro = selectedRecord?.erros?.[0] || null;

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
                onClick={() => handleOpenErrosModal(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Importação de dados - Habilitados"
    >
      <TabContentContainer>
        <SectionCard>
          <Row gutter={[0, 16]}>
            <Col xs={24} sm={24}>
              <CustomTitle level={4} style={{ margin: "1rem 0" }}>
                {"Últimas importações"}
              </CustomTitle>
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
              />
            </Col>
          </Row>
        </SectionCard>

        <ActionButtonsContainer>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "flex-end",
              gap: "1rem",
            }}
          >
            <SecondaryButton size="large" onClick={() => navigate('/processos/importacao-dados', { state: { tipo: 'HABILITADOS' } })}>
              Voltar
            </SecondaryButton>
          </div>
        </ActionButtonsContainer>

        <ErroModal
          open={isErrosModalOpen}
          onClose={handleCloseErrosModal}
          isLoading={false}
          importacaoErro={importacaoErro}
          onDownload={handleDownloadClick}
          isDownloading={isDownloading}
        />
      </TabContentContainer>
    </BaseTela>
  );
};

export default HistoricoHabilitadosTela;

