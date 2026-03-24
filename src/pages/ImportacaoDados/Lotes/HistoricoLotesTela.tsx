import React, { useState } from "react";
import { Row, Col, Typography, Space, Tooltip, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { WarningOutlined, EyeOutlined } from "@ant-design/icons";
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
import { useImportacaoDadosLotes } from "./hooks/useImportacaoDadosLotes";
import ErroLotesModal from "./components/ErroLotesModal";
import DetalhesLotesModal from "./components/DetalhesLotesModal";
import type { IImportacaoLotesResponse, IDetalheLoteAtualizado } from "./hooks/types";

const { Text } = Typography;

const statusColor: Record<string, string> = {
  CONCLUIDO: "success",
  PENDENTE: "processing",
  ERRO: "error",
};

const HistoricoLotesTela: React.FC = () => {
  const breadcrumbItems = [
    { title: <Link to="/"><Text strong>Home</Text></Link> },
    { title: <Link to="/processos"><Text strong>Processos</Text></Link> },
    { title: <Link to="/processos/importacao-dados"><Text strong>Importação de dados</Text></Link> },
    { title: "Histórico de importação de Lotes" },
  ] as TitleItem[];

  const navigate = useNavigate();

  const { importacaoLotes, importacaoLotesIsLoading, listRequest, onAntTableChange } =
    useImportacaoDadosLotes();

  const [isErroModalOpen, setIsErroModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IImportacaoLotesResponse | null>(null);

  const [isDetalhesModalOpen, setIsDetalhesModalOpen] = useState(false);
  const [selectedDetalhes, setSelectedDetalhes] = useState<IDetalheLoteAtualizado[] | null>(null);

  const handleOpenErroModal = (record: IImportacaoLotesResponse) => {
    setSelectedRecord(record);
    setIsErroModalOpen(true);
  };

  const handleCloseErroModal = () => {
    setIsErroModalOpen(false);
    setSelectedRecord(null);
  };

  const handleOpenDetalhesModal = (record: IImportacaoLotesResponse) => {
    setSelectedDetalhes(record.detalhes);
    setIsDetalhesModalOpen(true);
  };

  const handleCloseDetalhesModal = () => {
    setIsDetalhesModalOpen(false);
    setSelectedDetalhes(null);
  };

  const columns: ColumnsType<IImportacaoLotesResponse> = [
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
      render: (value: string) => value || "-",
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
      render: (status: string) => (
        <Tag color={statusColor[status] || "default"}>{status || "-"}</Tag>
      ),
    },
    {
      title: "Atualizados",
      dataIndex: "total_atualizados",
      key: "total_atualizados",
      align: "center",
      render: (value: number | null) => (value !== null && value !== undefined ? value : "-"),
    },
    {
      width: "10%",
      title: "Ações",
      key: "acoes",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {record.status === "CONCLUIDO" && (
            <Tooltip title="Visualizar detalhes da importação">
              <EyeOutlined
                style={{ cursor: "pointer", fontSize: "18px", color: "#1890ff" }}
                onClick={() => handleOpenDetalhesModal(record)}
              />
            </Tooltip>
          )}
          {record.status === "ERRO" && (
            <Tooltip title="Importação com erro, clique para visualizar">
              <WarningOutlined
                style={{ cursor: "pointer", fontSize: "18px", color: "#ff4d4f" }}
                onClick={() => handleOpenErroModal(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <BaseTela breadcrumbItems={breadcrumbItems} title="Importação de dados - Lotes SIGPEC">
      <TabContentContainer>
        <SectionCard>
          <Row gutter={[0, 16]}>
            <Col xs={24} sm={24}>
              <CustomTitle level={4} style={{ margin: "1rem 0" }}>
                Últimas importações
              </CustomTitle>
              <StyledTable<IImportacaoLotesResponse>
                columns={columns}
                dataSource={(importacaoLotes as any)?.results || []}
                rowKey="uuid"
                bordered
                rowClassName={(_: any, index: number) =>
                  index % 2 === 0 ? "row-white" : "row-gray"
                }
                className="historico-table"
                loading={importacaoLotesIsLoading}
                pagination={{
                  current: listRequest.pagination.page,
                  pageSize: 10,
                  defaultPageSize: 10,
                  position: ["bottomLeft"],
                  total: (importacaoLotes as any)?.count,
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
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <SecondaryButton size="large" onClick={() => navigate('/processos/importacao-dados', { state: { tipo: 'LOTES' } })}>
              Voltar
            </SecondaryButton>
          </div>
        </ActionButtonsContainer>

        <ErroLotesModal
          open={isErroModalOpen}
          onClose={handleCloseErroModal}
          erroTexto={selectedRecord?.erros || null}
        />

        <DetalhesLotesModal
          open={isDetalhesModalOpen}
          onClose={handleCloseDetalhesModal}
          detalhes={selectedDetalhes}
        />
      </TabContentContainer>
    </BaseTela>
  );
};

export default HistoricoLotesTela;
