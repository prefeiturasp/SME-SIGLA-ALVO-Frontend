import { Typography, Row, Col, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import ConvocacaoTable from "./components/ConvocacaoTable";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { useNavigate } from "react-router-dom";
import { AppButton, BuscaProcessosTitle } from '@/components/ui';
import { mainCardStyle, paginationTextStyle } from "@/components/ui";

const { Text } = Typography;

const breadcrumbItems = [
  {
    title: (
      <a href="/">
        <Text strong>Home</Text>
      </a>
    ),
  },
  {
    title: (
      <a href="/processos">
        <Text strong>Processos</Text>
      </a>
    ),
  },
  { title: "Consulta de candidatos" },
] as TitleItem[];

const ConvocacaoCandidatos: React.FC = () => {
  const navigate = useNavigate();
  const {
    concursosOptions,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
  } = useProcessosConvocacao();

  return (
    <BaseTela
      breadcrumbItems={breadcrumbItems}
      title="Convocação de candidatos"
    >
      <Card style={mainCardStyle}>
        <Row align="top" justify="space-between">
          <BuscaProcessosTitle>Busca processos</BuscaProcessosTitle>
          <AppButton
            variant="primary"
            size="large"
            icon={<PlusOutlined />}
            disabled={!concursosOptions}
            onClick={() => navigate("/processos/convocacao/criar",{state:concursosOptions})}
          >
            Nova convocação
          </AppButton>
        </Row>

        <Row>
          <Col xs={24}>
            <ConvocacaoTable
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData?.results || []}
              pagination={{
                current: listRequest.pagination.page,
                pageSize: listRequest.pagination.page_size,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: processosConvocacaoData?.count,
                showTotal: (total, range) => (
                  <span style={paginationTextStyle}>
                    {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
                  </span>
                ),
              }}
              onChange={onAntTableChange}
            />
          </Col>
        </Row>
      </Card>
    </BaseTela>
  );
};

export default ConvocacaoCandidatos;
