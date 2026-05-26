import React, { useMemo, useState } from "react";
import { Row, Col, Typography, Tooltip, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import {
  TabContentContainer,
  SectionCard,
  StyledTable,
    ActionButtonsContainer,
} from "../../../components/EstilosCompartilhados";
import useHistoricoEnvioEmail from "./hooks/useGetHistoricoEnvioEmail";
import DetalheEnvioEmailModal from "./components/DetalheEnvioEmailModal";
import type { IHistoricoEnvioEmail } from "../../../services/resources/convocacao/IConvocacao";

const { Text } = Typography;

const HistoricoEnvioEmailsTela: React.FC = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRegistro, setSelectedRegistro] = useState<IHistoricoEnvioEmail | null>(null);

  const { historicoData, historicoIsLoading } = useHistoricoEnvioEmail();
  console.log(historicoData);
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
            onClick={() => navigate("/gerenciar/disparo-emails")}
          >
            Disparo de E-mails
          </Text>
        ),
      },
      { title: "Histórico" },
    ] as TitleItem[],
    [navigate]
  );

  const handleOpenDetalhe = (record: IHistoricoEnvioEmail) => {
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

  const columns: ColumnsType<IHistoricoEnvioEmail> = [
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
      align: "center",
      render: (val: "CONVOCACAO" | "VAGAS" | "RESULTADOS") => val === "CONVOCACAO" ? "Convocação" : val === "VAGAS" ? "Vagas" : "Resultados",
    },
    {
      title: "Processo",
      dataIndex: "processo_nome",
      key: "processo_nome",
      align: "center",
      render: (val: string) => val ?? "—",
    },
    {
      title: "Qtd candidatos",
      dataIndex: "quantidade_candidatos",
      key: "quantidade_candidatos",
      align: "center",
      render: (val: number) => (val != null ? val : "—"),
    },
    {
      title: "Data do envio",
      dataIndex: "criado_em",
      key: "criado_em",
      align: "center",
      render: (val: string) => val ? dayjs(val).format("DD/MM/YYYY HH:mm") : "—",
    },    
    {
      title: "Ações",
      key: "acoes",
      align: "center",
      render: (_, record) => (
        <Tooltip title="Visualizar detalhes">
          <EyeOutlined
            style={{ cursor: "pointer", fontSize: "18px", color: "#0F59C8" }}
            onClick={() => handleOpenDetalhe(record)}
          />
        </Tooltip>
      ),
    },
  ];

  console.log(historicoData);

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Histórico de envio de e-mails"
    >
      <TabContentContainer>
        <SectionCard>
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <Text style={{ display: "block", marginBottom: 30}}>
              Aqui você confere todos os e-mails enviados de convocação, resultado e vagas. 
              </Text>
            </Col>
          </Row>
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <StyledTable
                columns={columns}
                dataSource={historicoData ?? []}
                rowKey="uuid"
                loading={historicoIsLoading}
                bordered
                pagination={{
                  total: historicoData?.length ?? 0,
                  showSizeChanger: true,
                  showTotal: (total, range) => (
                    <Text style={{ paddingLeft: 16, fontWeight: 700 }}>
                      Mostrando {range[0]}-{range[1]} de {total} registro(s)
                    </Text>
                  ),
                }}
              />
            </Col>
          </Row>
        </SectionCard>

        <ActionButtonsContainer>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <Button type="primary" ghost onClick={() => navigate("/gerenciar/disparo-emails")}>
              Voltar
            </Button>
          </div>
        </ActionButtonsContainer>
      </TabContentContainer>

      <DetalheEnvioEmailModal
        open={modalOpen}
        onClose={handleCloseDetalhe}
        registro={selectedRegistro}
      />
    </BaseTela>
  );
};

export default HistoricoEnvioEmailsTela;
