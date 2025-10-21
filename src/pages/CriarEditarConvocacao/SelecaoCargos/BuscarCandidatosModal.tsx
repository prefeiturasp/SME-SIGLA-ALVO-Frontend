import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, message, Spin, Radio, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { 
  ModalTitle, 
  ButtonContainer
} from '../../Processos/NovaConvocacaoCandidatos/styles';
import { Table } from 'antd';
import { useCandidatos } from './hooks/useCandidatos';
import { useGetVagasPorProcessoECargo } from './hooks/useGetVagasPorProcessoECargo';

const { Title, Text } = Typography;

// Estilos reutilizáveis
const modalStyles = {
  // Estilos dos cabeçalhos da tabela
  tableHeader: {
    fontFamily: 'Open Sans',
    fontWeight: 700,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '22px',
    letterSpacing: '0%',
    verticalAlign: 'middle' as const,
    color: '#515151E0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center' as const
  },
  // Estilos dos inputs de autorização
  inputField: {
    width: '60px',
    height: '32px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    padding: '0 8px',
    fontSize: '14px',
    textAlign: 'center' as const,
    backgroundColor: '#fff'
  },
  inputLabel: {
    color: '#333',
    fontSize: '14px'
  },
  // Estilos das seções de informação
  infoSectionLabel: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    marginBottom: '0.25rem'
  },
  infoSectionValue: {
    color: '#666',
    fontSize: '14px'
  },
  // Estilos dos botões de ação
  actionButtonContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  // Estilos do total de vagas
  totalVagasStyle: {
    color: '#0F59C8',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '4px 8px',
    backgroundColor: '#E6F7FF',
    borderRadius: '4px',
    border: '1px solid #91D5FF'
  },
  // Estilos do loading
  loadingContainer: {
    textAlign: 'center' as const,
    padding: '2rem'
  },
  loadingText: {
    marginTop: '1rem'
  },
  // Estilos de texto da lista
  listTitle: {
    fontFamily: "Open Sans",
    fontWeight: 700,
    fontStyle: "normal",
    fontSize: "14px",
    lineHeight: "22px",
    letterSpacing: "0%",
    color: "#515151",
    marginBottom: '0.5rem',
    display: 'block'
  },
  // Estilos de estado vazio
  emptyState: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#666',
    backgroundColor: '#f5f5f5',
    border: '1px solid #d9d9d9',
    borderRadius: '6px'
  },
  // Estilos de mensagem de erro
  errorMessage: {
    color: '#ff4d4f',
    fontSize: '12px',
    marginTop: '4px',
    fontFamily: 'Open Sans',
    fontWeight: 400
  }
};

interface BuscarCandidatosModalProps {
  visible: boolean;
  onClose: () => void;
  concurso?: string;
  concursoValue?: string;
  cargo?: string;
  cargoCodigo?: string;
  processoUuid?: string;
  cargoEmEdicao?: { geral: number; pcd: number; nna: number } | null;
  onCandidatosSelecionados?: (quantidade: number, quantidadesIndividuais: { geral: number; pcd: number; nna: number }, vagas: number) => void;
}

const BuscarCandidatosModal: React.FC<BuscarCandidatosModalProps> = ({
  visible,
  onClose,
  concurso,
  concursoValue,
  cargo,
  cargoCodigo,
  processoUuid,
  cargoEmEdicao = null,
  onCandidatosSelecionados
}) => {
  const [tipoConvocacao, setTipoConvocacao] = useState<'calculada' | 'digitadas'>('digitadas');
  const [autorizacoesDigitadas, setAutorizacoesDigitadas] = useState({
    geral: 0,
    def: 0,
    nna: 0
  });
  const [mostrarTabelaCandidatos, setMostrarTabelaCandidatos] = useState(false);
  const [parametrosBusca, setParametrosBusca] = useState<{ geral: number; pcd: number; nna: number; concurso_uuid: string } | undefined>(undefined);

  // Hook para buscar vagas dinamicamente
  const { vagasIsLoading, totalVagas } = useGetVagasPorProcessoECargo(
    processoUuid,
    cargoCodigo,
    visible && !!processoUuid && !!cargoCodigo
  );


  // Reset do estado quando o modal for fechado ou preencher quando editando
  useEffect(() => {
    if (!visible) {
      setAutorizacoesDigitadas({
        geral: 0,
        def: 0,
        nna: 0
      });
      setMostrarTabelaCandidatos(false);
      setParametrosBusca(undefined);
    } else if (cargoEmEdicao) {
      // Preencher campos quando estiver editando
      setAutorizacoesDigitadas({
        geral: cargoEmEdicao.geral,
        def: cargoEmEdicao.pcd,
        nna: cargoEmEdicao.nna
      });
    } else {
      // Zerar campos quando for um novo cargo (não está editando)
      setAutorizacoesDigitadas({
        geral: 0,
        def: 0,
        nna: 0
      });
      setMostrarTabelaCandidatos(false);
      setParametrosBusca(undefined);
    }
  }, [visible, cargoEmEdicao]);

  const { candidatosData, candidatosIsLoading } = useCandidatos(mostrarTabelaCandidatos, parametrosBusca);

  const candidatos = mostrarTabelaCandidatos && candidatosData ? 
    (Array.isArray(candidatosData) ? candidatosData : candidatosData.results) : [];

  const totalAutorizacoes = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
  const isTotalValido = totalAutorizacoes > 0;
  const isTotalExcedido = totalAutorizacoes > totalVagas && totalVagas > 0;
  const isAdicionarDisabilitado = !isTotalValido || isTotalExcedido;
  

  // Configuração das colunas da tabela
  const columns: ColumnsType<any> = [
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Convocado Por
        </div>
      ),
      dataIndex: 'convocado_por',
      key: 'convocado_por',
      width: '20%',
      sorter: (a: any, b: any) => (a.convocado_por || 'COGEP').localeCompare(b.convocado_por || 'COGEP'),
      render: () => 'COGEP',
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Candidato
        </div>
      ),
      dataIndex: ['candidato', 'nome'],
      key: 'nome',
      width: '20%',
      sorter: (a: any, b: any) => (a.candidato?.nome || '').localeCompare(b.candidato?.nome || ''),
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Geral
        </div>
      ),
      dataIndex: 'classificacao',
      key: 'classificacao',
      width: '20%',
      sorter: (a: any, b: any) => {
        const aVal = a.classificacao || '';
        const bVal = b.classificacao || '';
        return String(aVal).localeCompare(String(bVal));
      },
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          PCD
        </div>
      ),
      dataIndex: 'classificacao_pcd',
      key: 'classificacao_pcd',
      width: '20%',
      sorter: (a: any, b: any) => {
        const aVal = a.classificacao_pcd || '';
        const bVal = b.classificacao_pcd || '';
        return String(aVal).localeCompare(String(bVal));
      },
    },
    {
      title: (
        <div style={modalStyles.tableHeader}>
          NNA
        </div>
      ),
      dataIndex: 'classificacao_nna',
      key: 'classificacao_nna',
      width: '20%',
      sorter: (a: any, b: any) => {
        const aVal = a.classificacao_nna || '';
        const bVal = b.classificacao_nna || '';
        return String(aVal).localeCompare(String(bVal));
      },
    },
  ];

  const handleNumericInput = (value: string, setter: (value: number) => void) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      setter(0);
    } else {
      const numValue = parseInt(numericValue, 10);
      if (!isNaN(numValue)) {
        setter(numValue);
      }
    }
  };

  const validateNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (!allowedKeys.includes(key) && !/^[0-9]$/.test(key)) {
      e.preventDefault();
      message.warning('Digite apenas números');
    }
  };

  const handleAutorizacaoChange = (tipo: 'geral' | 'def' | 'nna', value: number) => {
    setAutorizacoesDigitadas(prev => ({
      ...prev,
      [tipo]: value
    }));
  };

  const handleBuscar = () => {
    const somatorio = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    if (somatorio === 0) {
      message.error('Preencha pelo menos um campo de autorização');
      return;
    }

    if (somatorio > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }

    setParametrosBusca({
      geral: autorizacoesDigitadas.geral,
      pcd: autorizacoesDigitadas.def,
      nna: autorizacoesDigitadas.nna,
      concurso_uuid: concursoValue || ""
    });
    console.log("concursoValue", concursoValue);
    setMostrarTabelaCandidatos(true);
  };

  const handleSelecionar = () => {
    const quantidadeCandidatos = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    if (quantidadeCandidatos > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }
    
    const quantidadesIndividuais = {
      geral: autorizacoesDigitadas.geral,
      pcd: autorizacoesDigitadas.def,
      nna: autorizacoesDigitadas.nna
    };
    
    if (onCandidatosSelecionados) {
      onCandidatosSelecionados(quantidadeCandidatos, quantidadesIndividuais, totalVagas);
    }
    
    onClose();
  };

  return (
    <>
      <style>{`
        /* Tamanho padrão dos botões do modal */
        .modal-action-btn {
          width: 111px !important;
          height: 40px !important;
          gap: 8px !important;
          opacity: 1 !important;
          border-radius: 8px !important; /* borderRadiusLG */
          border-width: 1px !important;
          padding-right: 16px !important; /* padding */
          padding-left: 16px !important;  /* padding */
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          min-width: 111px !important;
        }

        /* Botão Buscar do modal - igual ao Buscar da Lista de Convocações */
        .modal-buscar-btn {
          box-sizing: border-box;
          border: 1px solid #0F59C8;
          background-color: #FFFFFF;
          font-family: 'Open Sans';
          font-weight: 600;
          font-size: 1rem;
          line-height: 1.5rem;
          letter-spacing: 0%;
          vertical-align: middle;
          color: #0F59C8;
          box-shadow: none;
        }

        .modal-buscar-btn .anticon {
          color: #0F59C8;
        }

        .modal-buscar-btn:hover,
        .modal-buscar-btn:focus {
          background-color: #0F59C8 !important;
          border-color: #0F59C8 !important;
          color: #FFFFFF !important;
        }

        .modal-buscar-btn:hover .anticon,
        .modal-buscar-btn:focus .anticon {
          color: #FFFFFF !important;
        }

        .modal-buscar-btn.ant-btn-disabled,
        .modal-buscar-btn[disabled] {
          background-color: #f5f5f5 !important;
          border-color: #d9d9d9 !important;
          color: rgba(0, 0, 0, 0.25) !important;
        }

        .modal-buscar-btn.ant-btn-disabled .anticon,
        .modal-buscar-btn[disabled] .anticon {
          color: rgba(0, 0, 0, 0.25) !important;
        }

        /* Hover do Cancel igual ao Buscar */
        .modal-cancel-btn:hover,
        .modal-cancel-btn:focus {
          background-color: #0F59C8 !important;
          border-color: #0F59C8 !important;
          color: #FFFFFF !important;
        }

        /* Tamanho específico do botão Cancelar */
        .modal-cancel-btn {
          width: 77px !important;
          height: 45px !important;
          min-width: 77px !important; /* sobrescreve .ant-btn-lg */
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }

        /* Label do botão Cancelar */
        .modal-cancel-label {
          width: 45px;
          height: 22px;
          opacity: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: 'Open Sans';
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0%;
          text-align: center;
        }

        /* Botão Adicionar ao cargo - medidas e cores específicas */
        .modal-adicionar-btn {
          width: 158px !important;
          height: 45px !important;
          opacity: 0.8 !important;
          border-radius: 8px !important;
          border-width: 1px !important;
          padding: 4px 15px !important; /* top/bottom 4, left/right 15 */
          gap: 8px !important;
          background: var(--Primary-colorPrimaryText, #002C8C) !important;
          border: 1px solid var(--colorLinkActive, #0958D9) !important;
          color: #FFFFFF !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .modal-adicionar-btn .anticon {
          color: #FFFFFF !important;
        }

        /* Estado desabilitado do botão Adicionar ao cargo: todo cinza */
        .modal-adicionar-btn.ant-btn-disabled,
        .modal-adicionar-btn[disabled],
        .modal-adicionar-btn.ant-btn-disabled:hover,
        .modal-adicionar-btn.ant-btn-disabled:focus {
          background-color: #f5f5f5 !important;
          border-color: #d9d9d9 !important;
          color: rgba(0, 0, 0, 0.25) !important;
          opacity: 1 !important;
        }
        .modal-adicionar-btn.ant-btn-disabled .anticon,
        .modal-adicionar-btn[disabled] .anticon {
          color: rgba(0, 0, 0, 0.25) !important;
        }
        .modal-adicionar-btn.ant-btn-disabled .modal-adicionar-label,
        .modal-adicionar-btn[disabled] .modal-adicionar-label {
          color: rgba(0, 0, 0, 0.25) !important;
        }

        /* Label do botão Adicionar ao cargo */
        .modal-adicionar-label {
          width: 126px;
          height: 22px;
          opacity: 1;
          display: inline-block;
          font-family: 'Open Sans';
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0%;
          text-align: center;
          color: #FFFF; /* garante contraste sobre background branco */
        }

        /* Labels dos radios Calculada e Digitadas */
        .modal-radio-label {
          width: 61px;
          height: 22px;
          opacity: 1;
          font-family: 'Open Sans';
          font-weight: 400;
          font-style: normal;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0%;
          color: var(--Text-neutral-color-text, #000000E0);
        }

        /* Labels Autorizações Digitadas e Candidatos Convocados */
        .modal-section-label {
          width: 166px;
          height: 22px;
          opacity: 1;
          font-family: 'Inter';
          font-weight: 600;
          font-style: normal;
          font-size: 14px;
          line-height: 22px;
          letter-spacing: 0%;
          vertical-align: middle;
          color: #515151;
        }
      `}</style>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden
        style={{ 
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        <div style={{ padding: '1rem 0.5rem 0.5rem 0.5rem', width: '100%', height: 'auto', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <ModalTitle>
          <Title level={3} style={{ marginTop: '-0.1rem', textAlign: 'left' }}>
            Buscar candidatos
          </Title>
        </ModalTitle>

        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '6px',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ flex: 1 }}>
              <div style={modalStyles.infoSectionLabel}>
                Concurso
              </div>
              <div style={modalStyles.infoSectionValue}>
                {concurso}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={modalStyles.infoSectionLabel}>
                Cargo
              </div>
              <div style={modalStyles.infoSectionValue}>
                {cargo}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={modalStyles.infoSectionLabel}>
                Vagas
              </div>
              <div style={modalStyles.infoSectionValue}>
                {vagasIsLoading ? 'Carregando...' : totalVagas}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          <Text strong style={{ display: 'block', marginBottom: '0.5rem', fontSize: '14px' }}>
            Tipo de convocação
          </Text>
          <Radio.Group 
            onChange={(e) => setTipoConvocacao(e.target.value)} 
            value={tipoConvocacao}
          >
            <Radio value="calculada"><span className="modal-radio-label">Calculada</span></Radio>
            <Radio value="digitadas"><span className="modal-radio-label">Digitadas</span></Radio>
          </Radio.Group>
        </div>

        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '1rem', 
          borderRadius: '6px',
          marginBottom: '1.5rem'
        }}>
          {/* Primeira linha - Autorizações Digitadas */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '1rem'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              color: '#333', 
              fontSize: '14px',
              marginRight: '2rem',
              minWidth: '150px'
            }}>
              <span className="modal-section-label">Autorizações Digitadas:</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={modalStyles.actionButtonContainer}>
                <input
                  type="text"
                  value={autorizacoesDigitadas.geral || ''}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('geral', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="00"
                  style={modalStyles.inputField}
                />
                <span style={modalStyles.inputLabel}>
                  {autorizacoesDigitadas.geral} (Geral)
                </span>
              </div>
              <div style={modalStyles.actionButtonContainer}>
                <input
                  type="text"
                  value={autorizacoesDigitadas.def || ''}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('def', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="00"
                  style={modalStyles.inputField}
                />
                <span style={modalStyles.inputLabel}>
                  {autorizacoesDigitadas.def} (Def.)
                </span>
              </div>
              <div style={modalStyles.actionButtonContainer}>
                <input
                  type="text"
                  value={autorizacoesDigitadas.nna || ''}
                  onChange={(e) =>
                    handleNumericInput(e.target.value, (value) =>
                      handleAutorizacaoChange('nna', value)
                    )
                  }
                  onKeyDown={validateNumericInput}
                  placeholder="00"
                  style={modalStyles.inputField}
                />
                <span style={modalStyles.inputLabel}>
                  {autorizacoesDigitadas.nna} (NNA)
                </span>
              </div>
            </div>
          </div>

          {/* Segunda linha - Vagas utilizadas */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center'
          }}>
            <div style={{ 
              fontWeight: 'bold', 
              color: '#333', 
              fontSize: '14px',
              marginRight: '2rem',
              minWidth: '150px'
            }}>
              <span className="modal-section-label">Vagas utilizadas:</span>
            </div>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <span style={modalStyles.totalVagasStyle}>
                {totalAutorizacoes} de {vagasIsLoading ? '...' : totalVagas} vagas
              </span>
            </div>
          </div>
          
          {/* Mensagem de erro se total exceder vagas disponíveis */}
          {isTotalExcedido && (
            <div style={{ marginTop: '8px', marginLeft: '150px' }}>
              <span style={modalStyles.errorMessage}>
                Total de vagas excedido.
              </span>
            </div>
          )}
        </div>


        <ButtonContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '1rem'}}>
            <Button
              className="modal-buscar-btn modal-action-btn"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleBuscar}
            >
              Buscar
            </Button>
          </div>

          {mostrarTabelaCandidatos && (
            <div style={{ marginTop: '0rem', marginBottom: '1rem', width: '100%' }}>
              <Text strong style={modalStyles.listTitle}>
                Lista de Convocados por autorizações {tipoConvocacao === 'calculada' ? 'calculadas' : 'digitadas'}
              </Text>
              
              {candidatosIsLoading && (
                <div style={modalStyles.loadingContainer}>
                  <Spin size="large" />
                  <div style={modalStyles.loadingText}>Buscando candidatos...</div>
                </div>
              )}
              
              {!candidatosIsLoading && candidatos.length > 0 && (
                <Table
                  columns={columns}
                  dataSource={candidatos}
                  rowKey={(_, index?: number) => index?.toString() || '0'}
                  bordered
                  rowClassName={(_, index?: number) =>
                    (index || 0) % 2 === 0 ? "row-white" : "row-gray"
                  }
                  className="candidatos-table"
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
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: false,
                    showQuickJumper: false,
                    showTotal: (total, range) => 
                      `${range[0]}-${range[1]} de ${total} candidatos`,
                    position: ['bottomLeft', 'bottomRight'],

                  }}
                  locale={{
                    emptyText: (
                      <div style={{ ...modalStyles.emptyState, color: '#8C8C8C' }}>
                        Nenhum candidato encontrado
                      </div>
                    )
                  }}
                />
              )}
              
              {!candidatosIsLoading && candidatos.length === 0 && (
                <div style={modalStyles.emptyState}>
                  Nenhum candidato encontrado.
                </div>
              )}
            </div>
          )}
          
          <Divider style={{ 
            margin: "75px 0 0px 0",
            width: "100%",
            height: "0px",
            opacity: 1,
            borderWidth: "1px",
            border: "1px solid #F0F0F0"
          }} />

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', width: '100%', marginTop: '0.5rem' }}>
            <Button
              onClick={onClose}
              size="large"
              className="modal-action-btn modal-cancel-btn"
              style={{
                borderColor: '#05409A',
                color: '#05409A'
              }}
            >
              <span className="modal-cancel-label">Cancelar</span>
            </Button>
            <Button
              type="primary"
              size="large"
              className="modal-action-btn modal-adicionar-btn"
              onClick={handleSelecionar}
              disabled={isAdicionarDisabilitado}
            >
              <span className="modal-adicionar-label">Adicionar ao cargo</span>
            </Button>
          </div>
        </ButtonContainer>
              </div>
    </Modal>
    </>
  );
};

export default BuscarCandidatosModal;
