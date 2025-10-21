import React from "react";
import {
  Button,
  Card,
  Steps,
  theme,
  Typography,
  Row,
  Col,
  Select,
  Divider,
  Table,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import StreetviewIcon from '@mui/icons-material/Streetview';
import AccessibleIcon from '@mui/icons-material/Accessible';
import BaseTela, { type TitleItem } from "../../Base/BaseTela";
import { useNavigate } from "react-router-dom";

import {
  UserSwitchOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { StepActions } from "../components/StepActions";
import { items, steps } from "../components/StepsNames";
import BuscarCandidatosModal from "./BuscarCandidatosModal";
import { useSelecaoCargo } from "./hooks/useSelecaoCargo";
import { 
  StyledCardAmpla, 
  StyledCardNNA, 
  StyledCardPCD, 
  commonStyles,
  inlineStyles,
  GlobalStyles,
  processInfoStyles
} from "./styles";
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;


const SelecaoCargos: React.FC = () => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const {
    processoConvocacaoData,
    cargoSelecionado,
    cargosDisponiveis,
    concursoIsLoading,
    handleCargoChange,
    modalSelecionarCandidatosVisible,
    handleBuscarCandidatos,
    handleCloseModalSelecionarCandidatos,
    handleCandidatosSelecionados,
    cargosAdicionados,
    ultimoCargoSelecionado,
    vagasInfo,
    handleEditarCargo,
    handleExcluirCargo,
  } = useSelecaoCargo();


  const isEdit = false;
  const breadcrumbItems = [
    {
      title: (
        <Text
          strong
          style={inlineStyles.breadcrumbItem}
          onClick={() => navigate("/")}
        >
          Home
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={inlineStyles.breadcrumbItem}
          onClick={() => navigate("/processos")}
        >
          Processos
        </Text>
      ),
    },
    {
      title: (
        <Text
          strong
          style={inlineStyles.breadcrumbItem}
          onClick={() => navigate("/processos/convocacao")}
        >
          Convocação de candidatos
        </Text>
      ),
    },
    {
      title: isEdit ? "Editar Convocação" : "Nova Convocação",
    },
  ] as TitleItem[];

  const current=1;
  const next = () => {
    navigate('/processos/convocacao/nova/agenda')
    
  };

  const prev = () => {
    navigate('/processos/convocacao/nova/dados-processo')    
  };

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = dayjs(value);
    return d.isValid() ? d.format('DD/MM/YYYY') : '—';
  };

  const formatTipoEscolha = (value?: string) => {
    if (!value) return '—';
    const map: Record<string, string> = {
      NOVA_AUTORIZACAO: 'Nova Autorização',
      ESCOLHA: 'Escolha',
    };
    if (map[value]) return map[value];
    // Fallback: transforma ENUM em Título
    return value
      .toLowerCase()
      .split('_')
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join(' ');
  };

  const contentStyle: React.CSSProperties = {
    lineHeight: "normal",
    textAlign: "left",

    borderRadius: token.borderRadiusLG,

    marginTop: 20,
  };

  return (
    <>
      <GlobalStyles />
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title={
          <Text style={inlineStyles.titleCombinedStyles}>
            Nova Convocação
          </Text>
        }
        buttons={
          <Button
            className="gerenciamento-vagas-btn"
            icon={<UserSwitchOutlined />}
            onClick={() => navigate('/processos/gerenciamento-vagas')}
          >
            Gerenciamento de vagas
          </Button>
        }
      >
        <Card 
          title={
            <Text style={inlineStyles.titleTextWithFont}>
              Processo de convocação de candidatos
            </Text>
          }
          styles={inlineStyles.cardHeaderStyles}
          variant="borderless"
        >
          <Steps current={current} items={items} />
        </Card>

        <Card
          style={inlineStyles.marginTop}
          title={
            <Text style={inlineStyles.cardTitleWithFont}>
              Dados do Processo
            </Text>
          }
          styles={inlineStyles.cardHeaderStylesSimple}
          variant="borderless"
        >
          <div style={{ ...contentStyle, ...inlineStyles.containerWithMarginTop }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Concurso:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.concurso_nome || 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Data da convocação:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.data_convocacao ? formatDate(processoConvocacaoData.data_convocacao) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Tipo de Escolha:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.tipo_escolha ? formatTipoEscolha(processoConvocacaoData.tipo_escolha) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Data corte de vagas:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.data_corte_vagas ? formatDate(processoConvocacaoData.data_corte_vagas) : 'Carregando...'}
                  </Text>
                </div>
              </Col>
              <Col span={16}>
                <div style={processInfoStyles.container}>
                  <Text strong style={processInfoStyles.label}>
                    Descrição:
                  </Text>
                  <Text style={processInfoStyles.value}>
                    {processoConvocacaoData?.descricao || 'Carregando...'}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        <Card
          style={inlineStyles.marginTop}
          styles={{ body: { paddingTop: 8 }, header: { borderBottom: 'none' } }}
          title={
            <Text style={inlineStyles.tableTitleWithFont}>
              Seleção e configuração de candidatos
            </Text>
          }
          variant="borderless"
        >
          <div style={{ ...contentStyle, ...inlineStyles.containerWithMarginTop }}>
            <div style={processInfoStyles.container}>
              <Text strong style={processInfoStyles.label}>
                Cargo:
              </Text>
              <div style={inlineStyles.selectContainer}>
                <Select
                  placeholder={concursoIsLoading ? "Carregando cargos..." : "Selecione o cargo"}
                  onChange={handleCargoChange}
                  className="cargo-select"
                  style={inlineStyles.selectWidth}
                  loading={concursoIsLoading}
                  disabled={concursoIsLoading}
                >
                  {cargosDisponiveis.map((cargo) => (
                    <Option key={cargo.value} value={cargo.value}>
                      {cargo.label}
                    </Option>
                  ))}
                </Select>
                <Button 
                  type="primary" 
                  className="buscar-candidatos-btn"
                  icon={<SearchOutlined />}
                  onClick={handleBuscarCandidatos}
                  disabled={!cargoSelecionado && cargosAdicionados.length === 0}
                  style={{
                    ...inlineStyles.buscarButton,
                    ...inlineStyles.buscarButtonAdditional,
                    ...inlineStyles.buttonInlineStyles,
                    paddingLeft: token.padding,
                    paddingRight: token.padding
                  }}
                >
                  Buscar candidatos
                </Button>
              </div>
            </div>
          </div>

          {/* Cards dinâmicos - aparecem apenas após adicionar cargos */}
          {cargosAdicionados.length > 0 && (
            <>
              
              <Row gutter={0} justify="start" align="top">
                <Col style={inlineStyles.colNoPadding}>
                  <Row gutter={0} justify="start">
                    <Col style={inlineStyles.colNoPadding}>
                      <div style={inlineStyles.cardsContainer}>
                        <StyledCardAmpla styles={{ body: { padding: 0 } }}>
                          <div style={commonStyles.cardContainer}>
                            <Diversity3Icon style={commonStyles.cardIcon} />
                            <div style={commonStyles.cardNumber}>
                              {vagasInfo.totalGeral}
                            </div>
                            <div style={commonStyles.cardLabel}>Ampla</div>
                          </div>
                        </StyledCardAmpla>
                        <StyledCardNNA styles={{ body: { padding: 0 } }}>
                          <div style={commonStyles.cardContainer}>
                            <StreetviewIcon style={commonStyles.cardIcon} />
                            <div style={commonStyles.cardNumber}>
                              {vagasInfo.totalNna}
                            </div>
                            <div style={commonStyles.cardLabel}>NNA</div>
                          </div>
                        </StyledCardNNA>
                        <StyledCardPCD styles={{ body: { padding: 0 } }}>
                          <div style={commonStyles.cardContainer}>
                            <AccessibleIcon style={commonStyles.cardIcon} />
                            <div style={commonStyles.cardNumber}>
                              {vagasInfo.totalPcd}
                            </div>
                            <div style={commonStyles.cardLabel}>PcD</div>
                          </div>
                        </StyledCardPCD>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>

              {/* Tabela de resumo */}
              <Divider style={inlineStyles.dividerMargin} />
              <Table
                dataSource={cargosAdicionados.map((cargo, index) => ({
                  key: index,
                  cargo: cargo.nome,
                  quantidadeVagas: cargo.vagas,
                  autorizacoes: 0,
                  candidatos: cargo.totalCandidatos,
                  uuid: cargo.uuid,
                  cargoData: cargo,
                }))}
                columns={[
                  {
                    title: <span style={commonStyles.tableHeader}>Cargo</span>,
                    dataIndex: 'cargo',
                    key: 'cargo',
                    align: 'center' as const,
                  },
                  {
                    title: <span style={commonStyles.tableHeader}>Vagas</span>,
                    dataIndex: 'quantidadeVagas',
                    key: 'quantidadeVagas',
                    align: 'center' as const,
                    sorter: (a: any, b: any) => a.quantidadeVagas - b.quantidadeVagas,
                  },
                  {
                    title: <span style={commonStyles.tableHeader}>Autorizações</span>,
                    dataIndex: 'autorizacoes',
                    key: 'autorizacoes',
                    align: 'center' as const,
                    sorter: (a: any, b: any) => a.autorizacoes - b.autorizacoes,
                  },
                  {
                    title: <span style={commonStyles.tableHeader}>Candidatos</span>,
                    dataIndex: 'candidatos',
                    key: 'candidatos',
                    align: 'center' as const,
                    sorter: (a: any, b: any) => a.candidatos - b.candidatos,
                  },
                  {
                    title: <span style={commonStyles.tableHeader}>Ações</span>,
                    key: 'acoes',
                    width: 120,
                    align: 'center' as const,
                    render: (_: any, record: any) => (
                      <div style={inlineStyles.tableActions}>
                        <Tooltip title="Editar">
                          <Button
                            type="link"
                            icon={<EditOutlined style={commonStyles.actionIcon} />}
                            onClick={() => handleEditarCargo(record.cargoData)}
                          />
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <Button
                            type="link"
                            icon={<DeleteOutlined style={commonStyles.deleteIcon} />}
                            onClick={() => handleExcluirCargo(record.uuid)}
                          />
                        </Tooltip>
                      </div>
                    ),
                  },
                ]}
                pagination={false}
                size="middle"
                bordered
                rowClassName={(_, index?: number) =>
                  (index || 0) % 2 === 0 ? "row-white" : "row-gray"
                }
                components={{
                  header: {
                    cell: (props: any) => (
                      <th {...props} style={{ 
                        ...props.style, 
                        ...inlineStyles.tableHeaderCell
                      }} />
                    ),
                  },
                }}
              />
            </>
          )}

          <Divider style={inlineStyles.dividerBottomMargin} />
          
          <StepActions
            current={current}
            steps={steps}
            next={next}
            prev={prev}
            onCancel={() => console.log("cancelado!")}
          />
        </Card>

        {cargoSelecionado && (
          <BuscarCandidatosModal
            visible={modalSelecionarCandidatosVisible}
            onClose={handleCloseModalSelecionarCandidatos}
            concurso={processoConvocacaoData?.concurso_nome || "Carregando..."}
            concursoValue={processoConvocacaoData?.concurso_uuid || ""}
            cargo={cargosDisponiveis.find(c => c.value === cargoSelecionado)?.label || "Cargo"}
            cargoCodigo={cargosDisponiveis.find(c => c.value === cargoSelecionado)?.codigo}
            processoUuid={processoConvocacaoData?.uuid}
            cargoEmEdicao={ultimoCargoSelecionado ? {
              geral: ultimoCargoSelecionado.geral,
              pcd: ultimoCargoSelecionado.pcd,
              nna: ultimoCargoSelecionado.nna
            } : null}
            onCandidatosSelecionados={handleCandidatosSelecionados}
          />
        )}
      </BaseTela>
    </>
  );
};

export default SelecaoCargos;
