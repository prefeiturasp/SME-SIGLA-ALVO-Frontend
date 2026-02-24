import React, { useMemo, useState } from "react";
import { Row, Col, Typography, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import {
  TabContentContainer,
  SectionCard,
  StyledTable,
  SecondaryButton,
  ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import useListRequest from "../../../hooks/useListRequest";
import useHistoricoCartaConvocacao from "./hooks/useHistoricoCartaConvocacao";
import DetalheCartaConvocacaoModal from "./components/DetalheCartaConvocacaoModal";
import type { IHistoricoCartaConvocacao } from "../../../services/resources/convocacao/IConvocacao";

const { Text } = Typography;

const HistoricoCartaConvocacaoTela: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<IHistoricoCartaConvocacao | null>(null);

  const { listRequest, onAntTableChange } = useListRequest<Record<string, never>>({
    pagination: { page: 1, page_size: 10 },
  });

  const { historicoData, historicoIsLoading } = useHistoricoCartaConvocacao(listRequest);
  const { results, count } = historicoData;

  const breadcrumbItems = useMemo(
    () => [
      {
        title: (
          <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Home
          </Text>
        ),
      },
      {
        title: (
          <Text strong style={{ cursor: "pointer" }} onClick={() => navigate("/gerenciar")}>
            Gerenciar
          </Text>
        ),
      },
      {
        title: (
          <Text
            strong
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/gerenciar/carta-convocacao")}
          >
            Carta de Convocação
          </Text>
        ),
      },
      { title: "Histórico" },
    ] as TitleItem[],
    [navigate]
  );

  const handleOpenDetalhe = (record: IHistoricoCartaConvocacao) => {
    setSelectedRegistro(record);
    setModalOpen(true);
  };

  const handleCloseDetalhe = () => {
    setModalOpen(false);
    setSelectedRegistro(null);
  };

  const formatData = (data: string) => {
    if (!data) return "—";
    const parsed = dayjs(data, ["DD-MM-YYYY", "YYYY-MM-DD"], true);
    return parsed.isValid() ? parsed.format("DD/MM/YYYY") : data;
  };

  const columns: ColumnsType<IHistoricoCartaConvocacao> = [
    {
      title: "Processo",
      dataIndex: "processo_nome",
      key: "processo_nome",
      align: "center",
      render: (val: string) => val ?? "—",
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      align: "center",
      render: (val: string) => formatData(val),
    },
    {
      title: "Qtd candidatos",
      dataIndex: "quantidade_convocados",
      key: "quantidade_convocados",
      align: "center",
      render: (val: number) => (val != null ? val : "—"),
    },
    {
      title: "Ações",
      key: "acoes",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Visualizar detalhes">
          <EyeOutlined
            style={{ cursor: "pointer", fontSize: "18px", color: "#032B68" }}
            onClick={() => handleOpenDetalhe(record)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Histórico - Carta de Convocação"
    >
      <TabContentContainer>
        <SectionCard>
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <StyledTable
                columns={columns}
                dataSource={results}
                rowKey="uuid"
                loading={historicoIsLoading}
                bordered
                pagination={{
                  current: listRequest.pagination.page,
                  pageSize: listRequest.pagination.page_size ?? 10,
                  total: count,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} de ${total} registro(s)`,
                }}
                onChange={onAntTableChange}
              />
            </Col>
          </Row>
        </SectionCard>

        <ActionButtonsContainer>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <SecondaryButton size="large" onClick={() => navigate("/gerenciar/carta-convocacao")}>
              Voltar
            </SecondaryButton>
          </div>
        </ActionButtonsContainer>
      </TabContentContainer>

      <DetalheCartaConvocacaoModal
        open={modalOpen}
        onClose={handleCloseDetalhe}
        registro={selectedRegistro}
      />
    </BaseTela>
  );
};

export default HistoricoCartaConvocacaoTela;
