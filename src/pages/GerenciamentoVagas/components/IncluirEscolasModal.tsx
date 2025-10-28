import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, Spin, Divider, Select, Input, Row, Col, Checkbox, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { 
  ModalTitle, 
  ButtonContainer
} from '../../Processos/NovaConvocacaoCandidatos/styles';
import { modalStyles, modalInlineStyles, GlobalStyles } from '../../CriarEditarConvocacao/SelecaoCargos/styles';
import { Table } from 'antd';
import { useGetDREs } from '../hooks/useGetDREs';
import { useGetEscolasPorDre } from '../hooks/useGetEscolasPorDre';
import type { IEscola } from '../../../services/resources/escolhas/IEscolhas';

const { Title, Text } = Typography;

interface EscolaSelecionada {
  data_fechamento_modulo: string;
  cargo_codigo: number;
  cargo_descricao: string;
  codigo_eol: string;
  vagas_precarias: number;
  vagas_definitivas: number;
  status: string;
}

interface PayloadEscolas {
  processo_uuid: string;
  processo_nome: string;
  vagas: EscolaSelecionada[];
}

interface IncluirEscolasModalProps {
  visible: boolean;
  onClose: () => void;
  processo?: string;
  cargo?: string;
  cargoCodigo?: string;
  cargoNome?: string;
  processoNome?: string;
  processoUuid?: string;
  dadosVagasImportadas?: any; // Dados das vagas já importadas
  onEscolasSelecionadas?: (payload: PayloadEscolas) => void;
}

const IncluirEscolasModal: React.FC<IncluirEscolasModalProps> = ({
  visible,
  onClose,
  processo,
  cargo,
  cargoCodigo,
  cargoNome,
  processoNome,
  processoUuid,
  dadosVagasImportadas,
  onEscolasSelecionadas
}) => {
  const [mostrarTabelaEscolas, setMostrarTabelaEscolas] = useState(false);
  const [dreSelecionada, setDreSelecionada] = useState<string | undefined>();
  const [dreCodigo, setDreCodigo] = useState<string | undefined>();
  const [escolaFiltro, setEscolaFiltro] = useState<string>('');
  const [escolasSelecionadas, setEscolasSelecionadas] = useState<Set<string>>(new Set());
  const [vagasEscolas, setVagasEscolas] = useState<Record<string, { definitivas: string; precarias: string }>>({});
  const [paramsBuscaEscolas, setParamsBuscaEscolas] = useState<{ dre__codigo: string; nome?: string } | undefined>();
  const [enabledBuscaEscolas, setEnabledBuscaEscolas] = useState(false);
  const [errorsPorEscola, setErrorsPorEscola] = useState<Record<string, string>>({});

  // Hooks para buscar dados
  const { dres, isLoading: dresLoading } = useGetDREs(visible);
  const { escolas, isLoading: escolasLoading } = useGetEscolasPorDre(paramsBuscaEscolas, enabledBuscaEscolas);

  // Usar dados das vagas importadas em vez do hook
  const totalVagas = dadosVagasImportadas?.total_vagas || 0;
  const vagasIsLoading = false; // Não precisa de loading pois os dados já estão carregados

  // Reset do estado quando o modal for fechado
  useEffect(() => {
    if (!visible) {
      setMostrarTabelaEscolas(false);
      setDreSelecionada(undefined);
      setDreCodigo(undefined);
      setEscolaFiltro('');
      setEscolasSelecionadas(new Set());
      setVagasEscolas({});
      setParamsBuscaEscolas(undefined);
      setEnabledBuscaEscolas(false);
      setErrorsPorEscola({});
    }
  }, [visible]);

  // Opções de DRE baseadas nos dados da API
  const opcoesDre = dres.map((dre) => ({
    value: dre.codigo,
    label: dre.nome.replace(/DIRETORIA REGIONAL DE EDUCACAO\s*/gi, '').trim()
  }));

  const handleBuscar = async () => {
    if (!dreCodigo) {
      message.error('Selecione uma DRE para buscar escolas');
      return;
    }

    const params: any = {
      dre__codigo: dreCodigo,
      page: 1, page_size: 1000,
    };
    
    // Só adiciona nome se não estiver vazio
    if (escolaFiltro && escolaFiltro.trim()) {
      params.nome = escolaFiltro;
    }
    
    // Atualizar parâmetros e habilitar busca
    setParamsBuscaEscolas(params);
    setEnabledBuscaEscolas(true);
    setMostrarTabelaEscolas(true);
  };

  // Função para buscar escolas conforme o usuário digita (apenas para sugestões)
  const handleBuscarEscolasConformeDigita = async (valor: string) => {
    if (!dreCodigo) return;
    
    if (valor.length >= 3) {
      const params: any = {
        dre__codigo: dreCodigo,
      };
      
      // Só adiciona nome se não estiver vazio
      if (valor && valor.trim()) {
        params.nome = valor;
      }
      
      setParamsBuscaEscolas(params);
      setEnabledBuscaEscolas(true);
    } else {
      setEnabledBuscaEscolas(false);
    }
  };

  // Função para selecionar/deselecionar uma linha
  const handleSelecionarLinha = (uuid: string, checked: boolean) => {
    const novasSelecionadas = new Set(escolasSelecionadas);
    if (checked) {
      novasSelecionadas.add(uuid);
    } else {
      novasSelecionadas.delete(uuid);
      // Remover também os dados de vagas se desmarcar
      const novasVagas = { ...vagasEscolas };
      delete novasVagas[uuid];
      setVagasEscolas(novasVagas);
    }
    setEscolasSelecionadas(novasSelecionadas);
  };

  // Função para selecionar/deselecionar todas as linhas
  const handleSelecionarTodas = (checked: boolean) => {
    if (checked) {
      const todasAsLinhas = new Set(escolas.map((escola) => escola.uuid));
      setEscolasSelecionadas(todasAsLinhas);
    } else {
      setEscolasSelecionadas(new Set());
      setVagasEscolas({});
    }
  };

  // Verificar se todas as linhas estão selecionadas
  const todasSelecionadas = escolas.length > 0 && escolasSelecionadas.size === escolas.length;
  
  // Verificar se algumas linhas estão selecionadas (seleção parcial)
  const selecaoParcial = escolasSelecionadas.size > 0 && escolasSelecionadas.size < escolas.length;

  const handleSalvarInclusaoEscola = () => {
    // Validar se todas as escolas selecionadas têm pelo menos uma vaga preenchida (definitiva ou precária > 0)

    const erros: Record<string, string> = {};
    
    Array.from(escolasSelecionadas).forEach(uuid => {
      const vagas = vagasEscolas[uuid];
      
      // Se não há dados de vagas, considera inválido
      if (!vagas) {
        erros[uuid] = 'Campo Obrigatório';
        return;
      }
      
      const definitivas = Number(vagas.definitivas) || 0;
      const precarias = Number(vagas.precarias) || 0;
      
      // Só é inválido se AMBOS forem 0 (uma linha é válida se tiver pelo menos UMA vaga > 0)
      if (definitivas === 0 && precarias === 0) {
        erros[uuid] = 'Campo Obrigatório';
      }
    });

    // Se houver erros, exibimos na tabela e fazemos scroll
    if (Object.keys(erros).length > 0) {
      setErrorsPorEscola(erros);
      
      // Fazer scroll para o primeiro erro após um pequeno delay para o renderizar
      setTimeout(() => {
        const primeiraLinhaErro = document.querySelector('[data-uuid-error="true"]');
        if (primeiraLinhaErro) {
          primeiraLinhaErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      
      return;
    }

    // Limpa erros se tudo estiver válido
    setErrorsPorEscola({});
    // Processar escolas selecionadas para o payload
    const payload = {
      processo_uuid: processoUuid || dadosVagasImportadas?.processo_uuid || '',
      processo_nome: processoNome || dadosVagasImportadas?.processo_nome || '',
      vagas: Array.from(escolasSelecionadas).map(uuid => {
        const escola = escolas.find(e => e.uuid === uuid);
        const vagas = vagasEscolas[uuid];
        
        return {
          data_fechamento_modulo: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
          cargo_codigo: Number(cargoCodigo) || 0,
          cargo_descricao: cargoNome || cargo || '',
          codigo_eol: escola!.codigo_eol,
          vagas_precarias: Number(vagas.precarias),
          vagas_definitivas: Number(vagas.definitivas),
          status: 'ativo'
        };
      })
    };

    if (onEscolasSelecionadas) {
      onEscolasSelecionadas(payload);
    }
    
    message.success(`${escolasSelecionadas.size} escolas adicionadas com sucesso!`);
    onClose();
  };

  // Configuração das colunas da tabela
  const columns: ColumnsType<IEscola> = [
    {
      title: (
        <Checkbox
          checked={todasSelecionadas}
          indeterminate={selecaoParcial}
          onChange={(e) => handleSelecionarTodas(e.target.checked)}
        />
      ),
      key: 'selecionar',
      width: '10%',
      align: 'center' as const,
      render: (_, record: IEscola) => (
        <Checkbox
          checked={escolasSelecionadas.has(record.uuid)}
          onChange={(e) => handleSelecionarLinha(record.uuid, e.target.checked)}
        />
      ),
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          DRE
        </div>
      ),
      dataIndex: ['dre', 'nome'],
      key: 'dre',
      width: '18%',
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Tipo da Unidade
        </div>
      ),
      dataIndex: 'tipo_ue',
      key: 'tipo_ue',
      width: '18%',
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Unidade Escolar
        </div>
      ),
      dataIndex: 'nome_oficial',
      key: 'nome_oficial',
      width: '28%',
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Definitivas
        </div>
      ),
      key: 'definitivas',
      width: '15%',
      align: 'center' as const,
      render: (_, record: IEscola) => {
        const erro = errorsPorEscola[record.uuid];
        return (
          <div {...(erro ? { 'data-uuid-error': 'true' } : {})}>
            <Input
              type="number"
              min="0"
              value={vagasEscolas[record.uuid]?.definitivas || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setVagasEscolas(prev => ({
                  ...prev,
                  [record.uuid]: {
                    ...prev[record.uuid],
                    definitivas: newValue,
                    precarias: prev[record.uuid]?.precarias || ''
                  }
                }));
                // Limpa erro quando preenche
                if (errorsPorEscola[record.uuid]) {
                  setErrorsPorEscola(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[record.uuid];
                    return newErrors;
                  });
                }
              }}
              style={{ textAlign: 'center', width: '49px' }}
              placeholder="0"
              className="centered-placeholder"
              disabled={!escolasSelecionadas.has(record.uuid)}
            />
            {erro && (
              <div style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '4px', textAlign: 'center', lineHeight: '1.2' }}>
                {erro}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Precárias
        </div>
      ),
      key: 'precarias',
      width: '15%',
      align: 'center' as const,
      render: (_, record: IEscola) => {
        const erro = errorsPorEscola[record.uuid];
        return (
          <div>
            <Input
              type="number"
              min="0"
              value={vagasEscolas[record.uuid]?.precarias || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                setVagasEscolas(prev => ({
                  ...prev,
                  [record.uuid]: {
                    ...prev[record.uuid],
                    definitivas: prev[record.uuid]?.definitivas || '',
                    precarias: newValue
                  }
                }));
                // Limpa erro quando preenche
                if (errorsPorEscola[record.uuid]) {
                  setErrorsPorEscola(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[record.uuid];
                    return newErrors;
                  });
                }
              }}
              style={{ textAlign: 'center', width: '49px' }}
              placeholder="0"
              className="centered-placeholder"
              disabled={!escolasSelecionadas.has(record.uuid)}
            />
            {erro && (
              <div style={{ color: '#ff4d4f', fontSize: '11px', marginTop: '4px', textAlign: 'center', lineHeight: '1.2' }}>
                {erro}
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <GlobalStyles />
      <style>
        {`
          .centered-placeholder::placeholder {
            text-align: center;
          }
          .ant-table-thead > tr > th {
            height: 38px !important;
          }
          .modal-adicionar-btn {
            width: 45px !important;
          }
          .ant-table-tbody > tr > td {
            font-family: 'Open Sans', sans-serif !important;
            font-weight: 400 !important;
            font-style: normal !important;
            font-size: 14px !important;
            line-height: 22px !important;
            letter-spacing: 0% !important;
            vertical-align: middle !important;
            color: #000000E0 !important;
            text-align: center !important;
          }
        `}
      </style>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width="max(1000px, min(100vw - 100px, 1200px))"
        centered
        destroyOnHidden
        style={modalInlineStyles.modalMaxSize}
      >
        <div style={modalInlineStyles.mainContainer}>
        <ModalTitle>
          <Title level={3} style={modalInlineStyles.titleStyle}>
            Incluir escolas
          </Title>
        </ModalTitle>

        <div style={modalInlineStyles.infoSection}>
          <div style={modalInlineStyles.infoContainer}>
            <div style={modalInlineStyles.infoItem}>
              <div style={modalStyles.infoSectionLabel}>
                Processo
              </div>
              <div style={modalStyles.infoSectionValue}>
                {processo}
              </div>
            </div>
            <div style={modalInlineStyles.infoItem}>
              <div style={modalStyles.infoSectionLabel}>
                Cargo
              </div>
              <div style={modalStyles.infoSectionValue}>
                {cargo}
              </div>
            </div>
            <div style={modalInlineStyles.infoItem}>
              <div style={modalStyles.infoSectionLabel}>
                Vagas
              </div>
              <div style={modalStyles.infoSectionValue}>
                {vagasIsLoading ? 'Carregando...' : totalVagas}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de filtros */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Row gutter={[16, 0]}>
            <Col span={10}>
                <div style={{ marginBottom: '0rem', marginTop: '1.5rem' }}>
                  <Text strong style={{ fontSize: '14px', color: '#515151' }}>DRE</Text>
                </div>
                <Select
                  placeholder="Selecione uma DRE"
                  value={dreSelecionada}
                  onChange={(value) => {
                    setDreSelecionada(value);
                    setDreCodigo(value as string);
                    setEscolaFiltro('');
                    setParamsBuscaEscolas(undefined);
                    setEnabledBuscaEscolas(false);
                    setMostrarTabelaEscolas(false);
                  }}
                  style={{ width: '100%', height: '45px', marginTop: '0.5rem' }}
                  allowClear
                  loading={dresLoading}
                  options={opcoesDre}
                />
            </Col>
            <Col span={10}>
               <div style={{ marginBottom: '0rem', marginTop: '1.5rem' }}>
                 <Text strong style={{ fontSize: '14px', color: '#515151' }}>Escola</Text>
               </div>
              <Input
                placeholder="Es."
                value={escolaFiltro}
                onChange={(e) => {
                  setEscolaFiltro(e.target.value);
                  handleBuscarEscolasConformeDigita(e.target.value);
                }}
                style={{ width: '100%', height: '45px', marginTop: '0.5rem' }}
              />
            </Col>
            <Col span={4}>
              <div style={{ marginTop: '3.6rem' }}>
                <Button
                  className="modal-buscar-btn modal-action-btn"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleBuscar}
                  style={{ width: '100%', height: '32px' }}
                >
                  Buscar
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <ButtonContainer>

          {mostrarTabelaEscolas && (
            <div style={modalInlineStyles.tableContainer}>
              <Text strong style={modalStyles.listTitle}>
                Lista de Escolas
              </Text>
              
              {escolasLoading && (
                <div style={modalStyles.loadingContainer}>
                  <Spin size="large" />
                  <div style={modalStyles.loadingText}>Buscando escolas...</div>
                </div>
              )}
              
              {!escolasLoading && escolas.length > 0 && (
                <Table
                  columns={columns}
                  dataSource={escolas}
                  rowKey={(record) => record.uuid}
                  bordered
                  rowClassName={(_, index?: number) =>
                    (index || 0) % 2 === 0 ? "row-white" : "row-gray"
                  }
                  className="escolas-table"
                  components={{
                    header: {
                      cell: (props: any) => (
                        <th {...props} style={{ 
                          ...props.style, 
                          ...modalInlineStyles.tableHeaderCell
                        }} />
                      ),
                    },
                  }}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: false,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} escolas`,
                    position: ['bottomLeft', 'bottomRight'],
                  }}
                  locale={{
                    emptyText: (
                      <div style={{ ...modalStyles.emptyState, ...modalInlineStyles.emptyStateCustom }}>
                        Nenhuma escola encontrada
                      </div>
                    )
                  }}
                />
              )}
              
              {!escolasLoading && escolas.length === 0 && mostrarTabelaEscolas && (
                <div style={modalStyles.emptyState}>
                  Nenhuma escola encontrada.
                </div>
              )}
            </div>
          )}
          
          <Divider style={modalInlineStyles.finalDivider} />

          <div style={modalInlineStyles.finalButtonsContainer}>
            <Button
              onClick={onClose}
              size="large"
              className="modal-action-btn modal-cancel-btn"
              style={modalInlineStyles.cancelButton}
            >
              <span className="modal-cancel-label">Cancelar</span>
            </Button>
            <Button
              type="primary"
              size="large"
              className="modal-action-btn modal-adicionar-btn"
              onClick={handleSalvarInclusaoEscola}
            >
              <span className="modal-adicionar-label">Salvar</span>
            </Button>
          </div>
        </ButtonContainer>
              </div>
    </Modal>
    </>
  );
};

export default IncluirEscolasModal;
