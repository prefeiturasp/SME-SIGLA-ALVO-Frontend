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
import styled from 'styled-components';
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
import dayjs from "dayjs";

const { Text } = Typography;
const { Option } = Select;

// Estilos dos cards com layout específico
const BaseStyledCard = styled(Card)`
  width: 200px;
  height: 80px;
  min-width: 200px;
  opacity: 1;
  padding: 8px 16px;
  gap: 4px;
  border-radius: 15px;
  border: none;
  margin: 0;
`;

const StyledCardAmpla = styled(BaseStyledCard)`
  background-color: #FFF1B8;
`;

const StyledCardNNA = styled(BaseStyledCard)`
  background-color: #EDEEFC;
`;

const StyledCardPCD = styled(BaseStyledCard)`
  background-color: #F9F0FF;
`;


// Estilos reutilizáveis
const commonStyles = {
  // Estilos dos cards
  cardContainer: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    minHeight: "65px"
  },
  cardIcon: {
    color: "#000000E0",
    fontSize: "20px",
    width: "40px",
    height: "20px",
    opacity: 1
  },
  cardNumber: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "35px",
    lineHeight: "20px",
    color: "#000000E0"
  },
  cardLabel: {
    fontFamily: "Open Sans",
    fontWeight: 400,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#000000E0",
    textAlign: "right" as const
  },
  // Estilos da tabela
  tableHeader: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    verticalAlign: "middle" as const,
    color: "#000000E0",
    textAlign: "center" as const
  },
  actionIcon: {
    width: '0.9765625rem',
    height: '0.9765625rem',
    color: '#838383',
    fontSize: '0.9765625rem'
  },
  deleteIcon: {
    width: '1.07125rem',
    height: '1.11625rem',
    color: '#838383',
    fontSize: '1.07125rem'
  }
};

const processInfoStyles = {
  container: {
    marginBottom: '1rem',
  },
  label: {
    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    color: '#515151CC',
    marginBottom: '2px',
    display: 'block',
  },
  value: {
    color: '#838383',
    fontFamily: 'Open Sans',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    display: 'block',
  },
};

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
          style={{ cursor: "pointer" }}
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
          style={{ cursor: "pointer" }}
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
          style={{ cursor: "pointer" }}
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
      <style>{`
        /* Estilos específicos para o Select de cargo nesta tela */
        .cargo-select .ant-select-selector {
          height: 45px !important;
          background: #FFFFFF !important;
          border: 1px solid #B1B2B7 !important;
          border-radius: 6px !important; /* Corner Radius */
          padding-left: 8px !important; /* padding-sm */
          padding-right: 8px !important; /* padding-sm */
          display: flex;
          align-items: center;
        }
        .cargo-select .ant-select-selection-item,
        .cargo-select .ant-select-selection-placeholder {
          line-height: 45px !important;
        }

        /* Hover do botão Buscar candidatos (somente quando habilitado) */
        .buscar-candidatos-btn:not(.ant-btn-disabled):hover,
        .buscar-candidatos-btn:not(.ant-btn-disabled):focus {
          background: #0F59C8 !important;
          color: #FFFFFF !important;
          border-color: #0F59C8 !important;
        }
        .buscar-candidatos-btn:not(.ant-btn-disabled):hover .ant-btn-icon,
        .buscar-candidatos-btn:not(.ant-btn-disabled):focus .ant-btn-icon {
          color: #FFFFFF !important;
        }

        /* Estado desabilitado: todo cinza (fundo, borda, texto e ícone) */
        .buscar-candidatos-btn.ant-btn-disabled,
        .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled,
        .buscar-candidatos-btn.ant-btn[disabled],
        .buscar-candidatos-btn[disabled],
        .buscar-candidatos-btn.ant-btn-disabled:hover,
        .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled:hover,
        .buscar-candidatos-btn.ant-btn-disabled:focus {
          background-color: #f5f5f5 !important;
          border-color: #d9d9d9 !important;
          color: rgba(0, 0, 0, 0.25) !important;
        }
        .buscar-candidatos-btn.ant-btn-primary.ant-btn-disabled .ant-btn-icon,
        .buscar-candidatos-btn.ant-btn[disabled] .ant-btn-icon,
        .buscar-candidatos-btn[disabled] .ant-btn-icon,
        .buscar-candidatos-btn.ant-btn-disabled .ant-btn-icon,
        .buscar-candidatos-btn.ant-btn-disabled:hover .ant-btn-icon,
        .buscar-candidatos-btn.ant-btn-disabled:focus .ant-btn-icon {
          color: rgba(0, 0, 0, 0.25) !important;
        }

        /* Botão Gerenciamento de vagas - igual ao da Lista de Convocações */
        .gerenciamento-vagas-btn {
          width: 15.5625rem;
          height: 2.8125rem;
          gap: 0.5rem;
          opacity: 1;
          border-radius: 0.5rem;
          padding-right: 1rem;
          padding-left: 1rem;
          border-width: 0.0625rem;
          border: 0.0625rem solid #0F59C8;
          background-color: transparent;
          font-family: 'Open Sans';
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.5rem;
          letter-spacing: 0%;
          vertical-align: middle;
          color: #0F59C8;
          box-shadow: none;
        }

        .gerenciamento-vagas-btn .anticon {
          width: 0.944375rem;
          height: 1.0675rem;
          opacity: 1;
          color: #0F59C8;
        }

        .gerenciamento-vagas-btn:hover,
        .gerenciamento-vagas-btn:focus {
          background-color: #0F59C8 !important;
          border-color: #0F59C8 !important;
          color: #FFFFFF !important;
        }

        .gerenciamento-vagas-btn:hover .anticon,
        .gerenciamento-vagas-btn:focus .anticon {
          color: #FFFFFF !important;
        }
      `}</style>
      <BaseTela
        breadcrumbItems={breadcrumbItems}
        title={
          <Text
            style={{
              width: 203,
              height: 33,
              opacity: 1,
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: 24,
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#515151',
            }}
          >
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
            <Text style={{
              width: 1221,
              height: 22,
              opacity: 1,
              fontFamily: 'Open Sans',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: 18,
              lineHeight: '18px',
              letterSpacing: '0%',
              color: '#515151'
            }}>
              Processo de convocação de candidatos
            </Text>
          }
          styles={{ header: { borderBottom: 'none' }, body: { paddingTop: 8 } }}
          variant="borderless"
        >
          <Steps current={current} items={items} />
        </Card>

        <Card
          style={{ marginTop: "1.25rem" }}
          title={
            <Text style={{
              width: 164,
              height: 25,
              opacity: 1,
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: 18,
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#515151'
            }}>
              Dados do Processo
            </Text>
          }
          styles={{ header: { borderBottom: 'none' } }}
          variant="borderless"
        >
          <div style={{ ...contentStyle, marginTop: 0 }}>
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
          style={{ marginTop: "1.25rem" }}
          styles={{ body: { paddingTop: 8 }, header: { borderBottom: 'none' } }}
          title={
            <Text style={{
              width: 312,
              height: 25,
              opacity: 1,
              fontFamily: 'Open Sans',
              fontWeight: 600,
              fontStyle: 'normal',
              fontSize: 18,
              lineHeight: '100%',
              letterSpacing: '0%',
              color: '#515151'
            }}>
              Seleção e configuração de candidatos
            </Text>
          }
          variant="borderless"
        >
          <div style={{ ...contentStyle, marginTop: 0 }}>
            <div style={processInfoStyles.container}>
              <Text strong style={processInfoStyles.label}>
                Cargo:
              </Text>
              <div style={{ display: 'flex', gap: '34px', alignItems: 'center' }}>
                <Select
                  placeholder={concursoIsLoading ? "Carregando cargos..." : "Selecione o cargo"}
                  onChange={handleCargoChange}
                  className="cargo-select"
                  style={{ width: 665 }}
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
                    width: 195,
                    height: 45,
                    opacity: 1,
                    borderRadius: token.borderRadiusLG,
                    border: '1px solid #0F59C8',
                    background: '#FFFFFF',
                    color: '#0F59C8',
                    paddingLeft: token.padding,
                    paddingRight: token.padding,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
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
                <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <Row gutter={0} justify="start">
                    <Col style={{ paddingLeft: 0, paddingRight: 0 }}>
                      <div style={{ display: "flex", gap: 8 }}>
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
              <Divider style={{ margin: "24px 0" }} />
              <style>
                {`
                  .ant-table-thead > tr > th .ant-table-column-sorter {
                    width: 8px !important;
                    height: 12px !important;
                    opacity: 1 !important;
                  }
                  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-up,
                  .ant-table-thead > tr > th .ant-table-column-sorter .ant-table-column-sorter-down {
                    width: 8px !important;
                    height: 12px !important;
                    opacity: 1 !important;
                    font-size: 12px !important;
                  }
                `}
              </style>
              <Table
                dataSource={cargosAdicionados.map((cargo, index) => ({
                  key: index,
                  cargo: cargo.nome,
                  quantidadeVagas: cargo.vagas,
                  autorizacoes: 0, // Como solicitado, deixar como 0 por enquanto
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
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
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
                        height: '38px',
                        padding: '8px 16px'
                      }} />
                    ),
                  },
                }}
              />
            </>
          )}

          <Divider style={{ 
            margin: "24px 0 85px 0",
            width: "100%",
            height: "0px",
            opacity: 1,
            borderWidth: "1px",
            border: "1px solid #F0F0F0"
          }} />
          
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
