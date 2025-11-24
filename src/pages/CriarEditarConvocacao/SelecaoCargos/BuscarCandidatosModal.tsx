import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, message, Spin, Radio, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { 
  ModalTitle
} from '../../Processos/NovaConvocacaoCandidatos/styles';
import { modalStyles, modalInlineStyles, GlobalStyles } from './styles';
import { Table } from 'antd';
import { useGetCandidatos } from './hooks/useGetCandidatos';
import { useGetVagasPorProcessoECargo } from './hooks/useGetVagasPorProcessoECargo';

const { Title, Text } = Typography;


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
  onCandidatosUuidsChange?: (uuids: string[]) => void;
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
  onCandidatosSelecionados,
  onCandidatosUuidsChange
}) => {
  const [tipoConvocacao, setTipoConvocacao] = useState<'calculada' | 'digitadas'>('digitadas');
  const [autorizacoesDigitadas, setAutorizacoesDigitadas] = useState({
    geral: 0,
    def: 0,
    nna: 0
  });
  const [mostrarTabelaCandidatos, setMostrarTabelaCandidatos] = useState(false);
  const [parametrosBusca, setParametrosBusca] = useState<{ geral: number; pcd: number; nna: number; concurso_uuid: string; codigo_cargo: string } | undefined>(undefined);

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

  const { candidatosData, candidatosIsLoading, fetchCandidatosNow } = useGetCandidatos(mostrarTabelaCandidatos, parametrosBusca);

  const candidatos = mostrarTabelaCandidatos && candidatosData ? 
    (Array.isArray(candidatosData) ? candidatosData : candidatosData.results) : [];

  const totalAutorizacoes = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
  const isTotalValido = totalAutorizacoes > 0;
  const isTotalExcedido = totalAutorizacoes > totalVagas && totalVagas > 0;
  const hasResultadosBusca = mostrarTabelaCandidatos && !candidatosIsLoading && candidatos.length > 0;
  const isAdicionarDisabilitado = !isTotalValido || isTotalExcedido || !hasResultadosBusca;
  
  // UUIDs notificados via onSuccess do hook useGetCandidatos

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

  const handleBuscar = async () => {
    const somatorio = autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    if (somatorio === 0) {
      message.error('Preencha pelo menos um campo de autorização');
      return;
    }

    if (somatorio > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }

    const novosParametros = {
      geral: autorizacoesDigitadas.geral,
      pcd: autorizacoesDigitadas.def,
      nna: autorizacoesDigitadas.nna,
      concurso_uuid: concursoValue || "",
      codigo_cargo: cargoCodigo || ""
    };
    setParametrosBusca(novosParametros);
    setMostrarTabelaCandidatos(true);
    try {
      const data = await fetchCandidatosNow({
        geral: novosParametros.geral,
        pcd: novosParametros.pcd,
        nna: novosParametros.nna,
        concurso_uuid: novosParametros.concurso_uuid
      });
      const list = Array.isArray(data) ? data : (data?.results || []);
      const uuids = list
        .map((item: any) => item?.candidato?.uuid || item?.uuid)
        .filter((id: any) => typeof id === 'string');
      if (onCandidatosUuidsChange) onCandidatosUuidsChange(uuids);
    } catch (e) {
      // ignore
    }
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
      <GlobalStyles />
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        centered
        destroyOnHidden
        style={modalInlineStyles.modalMaxSize}
      >
        <div style={modalInlineStyles.mainContainer}>
        <ModalTitle>
          <Title level={3} style={modalInlineStyles.titleStyle}>
            Buscar candidatos
          </Title>
        </ModalTitle>

        <div style={modalInlineStyles.infoSection}>
          <div style={modalInlineStyles.infoContainer}>
            <div style={modalInlineStyles.infoItem}>
              <div style={modalStyles.infoSectionLabel}>
                Concurso
              </div>
              <div style={modalStyles.infoSectionValue}>
                {concurso}
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

        <div style={modalInlineStyles.convocacaoSection}>
          <Text strong style={modalInlineStyles.convocacaoLabel}>
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

        <div style={modalInlineStyles.infoSection}>
          {/* Primeira linha - Autorizações Digitadas */}
          <div style={modalInlineStyles.inputsRow}>
            <div style={modalInlineStyles.inputsLabel}>
              <span className="modal-section-label">Autorizações Digitadas:</span>
            </div>
            <div style={modalInlineStyles.inputsContainer}>
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
          <div style={modalInlineStyles.vagasRow}>
            <div style={modalInlineStyles.inputsLabel}>
              <span className="modal-section-label">Vagas utilizadas:</span>
            </div>
            <div style={modalInlineStyles.inputsContainer}>
              <span style={modalStyles.totalVagasStyle}>
                {totalAutorizacoes} de {vagasIsLoading ? '...' : totalVagas} vagas
              </span>
            </div>
          </div>
          
          {/* Mensagem de erro se total exceder vagas disponíveis */}
          {isTotalExcedido && (
            <div style={modalInlineStyles.errorContainer}>
              <span style={modalStyles.errorMessage}>
                Total de vagas excedido.
              </span>
            </div>
          )}
        </div>


        {/* <ButtonContainer> */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <Button
            // className="modal-buscar-btn modal-action-btn"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleBuscar}
            variant="outlined"
            style={{ width: 'fit-content' }}
          >
            Buscar
          </Button>
        </div>

          {mostrarTabelaCandidatos && (
            <div style={modalInlineStyles.tableContainer}>
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
                      `${range[0]}-${range[1]} de ${total} candidatos`,
                    position: ['bottomRight'],

                  }}
                  locale={{
                    emptyText: (
                      <div style={{ ...modalStyles.emptyState, ...modalInlineStyles.emptyStateCustom }}>
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
          
          <Divider
            style={{
              ...modalInlineStyles.finalDivider,
              ...(mostrarTabelaCandidatos ? {} : { marginTop: 12 }),
            }}
          />

          <div style={modalInlineStyles.finalButtonsContainer}>
            <Button
              onClick={onClose}
              size="large"
              variant="outlined"
              style={{ width: 'fit-content' }}
            >Cancelar
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSelecionar}
              disabled={isAdicionarDisabilitado}
              variant="outlined"
              style={{ width: 'fit-content' }}
            >Adicionar ao cargo
            </Button>
          </div>
        {/* </ButtonContainer> */}
              </div>
    </Modal>
    </>
  );
};

export default BuscarCandidatosModal;
