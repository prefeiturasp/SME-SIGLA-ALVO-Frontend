import { Typography, Row, Col } from "antd";
import { UsergroupAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import ConvocacaoTable from "./components/ConvocacaoTable";
import ConvocacaoFiltros from "./components/ConvocacaoFiltros";
import { useProcessosConvocacao } from "./hooks/useProcessosConvocacao";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  ActionButton,
  NovaConvocacaoButton,
  ConteudoPagina,
  TituloPagina,
  TableContainer,
  ButtonGroup,
  HeaderContainer,
  TitleContainer,
  OrangeAccentBar,
  PageTitle
} from "./style";

const { Text } = Typography;

const ConvocacaoCandidatosTela: React.FC = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      title: (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text strong style={{ cursor: 'pointer' }} onClick={() => navigate('/processos')}>
          Processos
        </Text>
      ),
    },
    { title: "Lista de Convocações" },
  ] as TitleItem[];

  const {
    control,
    handleSubmit,
    formErrors,
    concursosOptions,
    concursosOptionsIsLoading,
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    listRequest,
    onAntTableChange,
    handleSub,
    handleReset,
    dayjs,
  } = useProcessosConvocacao();

  return (
    <PageContainer>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title={
          <HeaderContainer>
            <TitleContainer>
              <OrangeAccentBar />
              <PageTitle>Lista de Convocações</PageTitle>
            </TitleContainer>
            <ButtonGroup>
              <ActionButton
                type="primary"
                size="large"
                ghost={true}
                icon={<UserSwitchOutlined />}
                onClick={() => navigate("/processos/gerenciamento-vagas")}
              >
                Gerenciamento de vagas
              </ActionButton>
              <NovaConvocacaoButton
                type="primary"
                size="large"
                icon={<UsergroupAddOutlined />}
                disabled={!concursosOptions}
                onClick={() => navigate("/processos/convocacao/dados-processo/criar",{state:concursosOptions})}
              >
                Nova convocação
              </NovaConvocacaoButton>
            </ButtonGroup>
          </HeaderContainer>
        }
      >
        <ConteudoPagina>
        <TituloPagina level={4}>
          Busca processos
        </TituloPagina>

        <ConvocacaoFiltros
          control={control}
          formErrors={formErrors}
          concursosOptions={concursosOptions}
          concursosOptionsIsLoading={concursosOptionsIsLoading}
          handleSubmit={handleSubmit}
          handleSub={handleSub as any}
          handleReset={handleReset}
          dayjs={dayjs}
        />
        </ConteudoPagina>

        <Row>
        <Col xs={24}>
          <TableContainer>
            <ConvocacaoTable
              loading={processosConvocacaoIsLoading}
              data={processosConvocacaoData?.results || []}
              pagination={{
                current: listRequest.pagination.page,
                pageSize: 10,
                defaultPageSize: 10,
                position: ["bottomLeft"],
                total: processosConvocacaoData?.count,
                showTotal: (total, range) => (
                  <span style={{ marginLeft: 16 }}>
                    {`Mostrando ${(range?.[0] ?? 0)}-${(range?.[1] ?? 0)} de ${(total ?? 0)} registro(s)`}
                  </span>
                ),
              }}
              onChange={onAntTableChange}
            />
          </TableContainer>
        </Col>
        </Row>
      </BaseTela>
    </PageContainer>
  );
};

export default ConvocacaoCandidatosTela;
