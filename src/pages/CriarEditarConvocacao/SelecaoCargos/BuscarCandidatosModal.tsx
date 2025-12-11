import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Typography, Button, message, Spin, Radio, Divider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { 
  ModalTitle
} from '../../Processos/NovaConvocacaoCandidatos/styles';
import { modalStyles, modalInlineStyles, GlobalStyles } from './styles';
import { Table } from 'antd';
import { useGetCandidatos } from './hooks/useGetCandidatos';
import { useGetCandidatosReposicao } from './hooks/useGetCandidatosReposicao';
import { useGetCandidatosReconvocacao } from './hooks/useGetCandidatosReconvocacao';
import { useGetCandidatosCalculados } from './hooks/useGetCandidatosCalculados';
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
  tipoEscolha?: string;
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
  tipoEscolha,
  cargoEmEdicao = null,
  onCandidatosSelecionados,
  onCandidatosUuidsChange
}) => {
  const isReposicao = tipoEscolha === 'REPOSICAO';
  const isReconvocacao = tipoEscolha === 'RECONVOCAO';
  const isNovaAutorizacao = tipoEscolha === 'NOVA_AUTORIZACAO';
  const [tipoConvocacao, setTipoConvocacao] = useState<'calculada' | 'digitadas'>('digitadas');
  const [autorizacoesDigitadas, setAutorizacoesDigitadas] = useState({
    geral: 0,
    def: 0,
    nna: 0
  });
  // Estado para quantidade única quando for Reposição
  const [quantidadeReposicao, setQuantidadeReposicao] = useState(0);
  // Estado para quantidade única quando for Nova Autorização
  const [quantidadeNovaAutorizacao, setQuantidadeNovaAutorizacao] = useState(0);
  const [mostrarTabelaCandidatos, setMostrarTabelaCandidatos] = useState(false);
  const [parametrosBusca, setParametrosBusca] = useState<{ geral: number; pcd: number; nna: number; concurso_uuid: string; codigo_cargo: string } | undefined>(undefined);
  // Parâmetros para busca de reposição
  const [parametrosBuscaReposicao, setParametrosBuscaReposicao] = useState<{ concurso_uuid: string; quantidade: number } | undefined>(undefined);
  // Parâmetros para busca de reconvocação
  const [parametrosBuscaReconvocacao, setParametrosBuscaReconvocacao] = useState<{ concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string } | undefined>(undefined);
  // Parâmetros para busca de candidatos calculados (Nova Autorização)
  const [parametrosBuscaCalculados, setParametrosBuscaCalculados] = useState<{ concurso_uuid: string; quantidade: number; codigo_cargo?: string } | undefined>(undefined);

  // Hook para buscar vagas dinamicamente
  const { vagasIsLoading, totalVagas } = useGetVagasPorProcessoECargo(
    processoUuid,
    cargoCodigo,
    visible && !!processoUuid && !!cargoCodigo
  );

  // Fixar tipoConvocacao como 'digitadas' quando for Reposição ou Reconvocação
  // Fixar tipoConvocacao como 'calculada' quando for Nova Autorização
  useEffect(() => {
    if (isReposicao || isReconvocacao) {
      setTipoConvocacao('digitadas');
    } else if (isNovaAutorizacao) {
      setTipoConvocacao('calculada');
    }
  }, [isReposicao, isReconvocacao, isNovaAutorizacao, visible]);

  // Reset do estado quando o modal for fechado ou preencher quando editando
  useEffect(() => {
    if (!visible) {
      setAutorizacoesDigitadas({
        geral: 0,
        def: 0,
        nna: 0
      });
      setQuantidadeReposicao(0);
      setQuantidadeNovaAutorizacao(0);
      setMostrarTabelaCandidatos(false);
      setParametrosBusca(undefined);
      setParametrosBuscaReposicao(undefined);
      setParametrosBuscaReconvocacao(undefined);
    } else if (cargoEmEdicao) {
      // Preencher campos quando estiver editando
      if (isReposicao) {
        // Para reposição, usar a soma total
        const total = cargoEmEdicao.geral + cargoEmEdicao.pcd + cargoEmEdicao.nna;
        setQuantidadeReposicao(total);
      } else if (isNovaAutorizacao) {
        // Para Nova Autorização, usar a soma total
        const total = cargoEmEdicao.geral + cargoEmEdicao.pcd + cargoEmEdicao.nna;
        setQuantidadeNovaAutorizacao(total);
      } else {
        setAutorizacoesDigitadas({
          geral: cargoEmEdicao.geral,
          def: cargoEmEdicao.pcd,
          nna: cargoEmEdicao.nna
        });
      }
    } else {
      // Zerar campos quando for um novo cargo (não está editando)
      setAutorizacoesDigitadas({
        geral: 0,
        def: 0,
        nna: 0
      });
      setQuantidadeReposicao(0);
      setQuantidadeNovaAutorizacao(0);
      setMostrarTabelaCandidatos(false);
      setParametrosBusca(undefined);
      setParametrosBuscaReposicao(undefined);
      setParametrosBuscaReconvocacao(undefined);
      setParametrosBuscaCalculados(undefined);
    }
  }, [visible, cargoEmEdicao, isReposicao, isNovaAutorizacao]);

  // Hook para buscar candidatos normais (digitadas)
  const { candidatosData, candidatosIsLoading, fetchCandidatosNow } = useGetCandidatos(
    mostrarTabelaCandidatos && !isReposicao && !isReconvocacao && !isNovaAutorizacao, 
    parametrosBusca
  );

  // Hook para buscar candidatos de reposição
  const { 
    candidatosData: candidatosReposicaoData, 
    candidatosIsLoading: candidatosReposicaoIsLoading
  } = useGetCandidatosReposicao(
    mostrarTabelaCandidatos && isReposicao,
    parametrosBuscaReposicao
  );

  // Hook para buscar candidatos de reconvocação
  const { 
    candidatosData: candidatosReconvocacaoData, 
    candidatosIsLoading: candidatosReconvocacaoIsLoading
  } = useGetCandidatosReconvocacao(
    mostrarTabelaCandidatos && isReconvocacao,
    parametrosBuscaReconvocacao
  );

  // Hook para buscar candidatos calculados (Nova Autorização)
  const { 
    candidatosData: candidatosCalculadosData, 
    candidatosIsLoading: candidatosCalculadosIsLoading
  } = useGetCandidatosCalculados(
    mostrarTabelaCandidatos && isNovaAutorizacao && tipoConvocacao === 'calculada',
    parametrosBuscaCalculados
  );

  // Determinar qual fonte de dados usar
  const candidatosIsLoadingFinal = isReposicao 
    ? candidatosReposicaoIsLoading 
    : isReconvocacao 
      ? candidatosReconvocacaoIsLoading 
      : isNovaAutorizacao && tipoConvocacao === 'calculada'
        ? candidatosCalculadosIsLoading
        : candidatosIsLoading;
  const candidatosDataFinal = isReposicao 
    ? candidatosReposicaoData 
    : isReconvocacao 
      ? candidatosReconvocacaoData 
      : isNovaAutorizacao && tipoConvocacao === 'calculada'
        ? candidatosCalculadosData
        : candidatosData;
  
  const candidatos = mostrarTabelaCandidatos && candidatosDataFinal ? 
    (Array.isArray(candidatosDataFinal) ? candidatosDataFinal : candidatosDataFinal.results) : [];

  // Calcular contagens por categoria_efetiva dos candidatos retornados
  const contagensPorCategoria = useMemo(() => {
    if (!candidatos || candidatos.length === 0) {
      return { geral: 0, pcd: 0, nna: 0 };
    }
    
    let geral = 0;
    let pcd = 0;
    let nna = 0;
    
    candidatos.forEach((candidato: any) => {
      const categoria = candidato?.categoria_efetiva;
      if (categoria === 'GERAL' || !categoria) {
        geral++;
      } else if (categoria === 'NNA') {
        nna++;
      } else if (categoria === 'PCD') {
        pcd++;
      }
    });
    
    return { geral, pcd, nna };
  }, [candidatos]);

  // Processar UUIDs quando os dados de reposição chegarem
  useEffect(() => {
    if (isReposicao && candidatosReposicaoData && !candidatosReposicaoIsLoading && onCandidatosUuidsChange) {
      const list = Array.isArray(candidatosReposicaoData) ? candidatosReposicaoData : [];
      const uuids = list
        .map((item: any) => item?.candidato?.uuid || item?.uuid)
        .filter((id: any) => typeof id === 'string');
      onCandidatosUuidsChange(uuids);
    }
  }, [isReposicao, candidatosReposicaoData, candidatosReposicaoIsLoading, onCandidatosUuidsChange]);

  // Processar UUIDs quando os dados de reconvocação chegarem
  useEffect(() => {
    if (isReconvocacao && candidatosReconvocacaoData && !candidatosReconvocacaoIsLoading && onCandidatosUuidsChange) {
      const list = Array.isArray(candidatosReconvocacaoData) ? candidatosReconvocacaoData : [];
      const uuids = list
        .map((item: any) => item?.candidato?.uuid || item?.uuid)
        .filter((id: any) => typeof id === 'string');
      onCandidatosUuidsChange(uuids);
    }
  }, [isReconvocacao, candidatosReconvocacaoData, candidatosReconvocacaoIsLoading, onCandidatosUuidsChange]);

  // Processar UUIDs quando os dados calculados chegarem
  useEffect(() => {
    if (isNovaAutorizacao && tipoConvocacao === 'calculada' && candidatosCalculadosData && !candidatosCalculadosIsLoading && onCandidatosUuidsChange) {
      const list = Array.isArray(candidatosCalculadosData.results) ? candidatosCalculadosData.results : [];
      const uuids = list
        .map((item: any) => item?.uuid)
        .filter((id: any) => typeof id === 'string');
      onCandidatosUuidsChange(uuids);
    }
  }, [isNovaAutorizacao, tipoConvocacao, candidatosCalculadosData, candidatosCalculadosIsLoading, onCandidatosUuidsChange]);

  // Calcular total baseado no tipo de escolha
  const totalAutorizacoes = isReposicao 
    ? quantidadeReposicao 
    : isNovaAutorizacao
      ? quantidadeNovaAutorizacao
      : autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
  const isTotalValido = totalAutorizacoes > 0;
  const isTotalExcedido = totalAutorizacoes > totalVagas && totalVagas > 0;
  const hasResultadosBusca = mostrarTabelaCandidatos && !candidatosIsLoadingFinal && candidatos.length > 0;
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
    // Para Reposição, usar quantidadeReposicao; para Nova Autorização, usar quantidadeNovaAutorizacao; caso contrário, usar a soma dos campos individuais
    const somatorio = isReposicao 
      ? quantidadeReposicao 
      : isNovaAutorizacao
        ? quantidadeNovaAutorizacao
        : autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
    
    if (somatorio === 0) {
      message.error('Preencha pelo menos um campo de autorização');
      return;
    }

    if (somatorio > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }

    if (isReposicao) {
      // Buscar candidatos de reposição
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      const novosParametrosReposicao = {
        concurso_uuid: concursoValue,
        quantidade: quantidadeReposicao
      };
      setParametrosBuscaReposicao(novosParametrosReposicao);
      setMostrarTabelaCandidatos(true);
      // O hook useGetCandidatosReposicao fará o request automaticamente
      // Não precisamos chamar fetchCandidatosReposicaoNow manualmente
      return;
    }

    if (isReconvocacao) {
      // Buscar candidatos de reconvocação
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      const novosParametrosReconvocacao = {
        concurso_uuid: concursoValue,
        geral: autorizacoesDigitadas.geral > 0 ? autorizacoesDigitadas.geral : undefined,
        pcd: autorizacoesDigitadas.def > 0 ? autorizacoesDigitadas.def : undefined,
        nna: autorizacoesDigitadas.nna > 0 ? autorizacoesDigitadas.nna : undefined,
        codigo_cargo: cargoCodigo || undefined
      };
      setParametrosBuscaReconvocacao(novosParametrosReconvocacao);
      setMostrarTabelaCandidatos(true);
      // O hook useGetCandidatosReconvocacao fará o request automaticamente
      return;
    }

    if (isNovaAutorizacao && tipoConvocacao === 'calculada') {
      // Buscar candidatos para Nova Autorização usando endpoint calculados
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      const novosParametrosCalculados = {
        concurso_uuid: concursoValue,
        quantidade: quantidadeNovaAutorizacao,
        codigo_cargo: cargoCodigo || undefined
      };
      setParametrosBuscaCalculados(novosParametrosCalculados);
      setMostrarTabelaCandidatos(true);
      // O hook useGetCandidatosCalculados fará o request automaticamente
      // Processamento de UUIDs será feito no useEffect
      return;
    }

    // Busca normal (não reposição, nem reconvocação, nem nova autorização)
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
    // Para Reposição, usar quantidadeReposicao; para Nova Autorização, usar quantidadeNovaAutorizacao; caso contrário, usar a soma dos campos individuais
    const quantidadeCandidatos = isReposicao 
      ? quantidadeReposicao 
      : isNovaAutorizacao
        ? quantidadeNovaAutorizacao
        : autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;

    if (quantidadeCandidatos > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }

    // Para Reposição, Reconvocação e Nova Autorização, usar as contagens reais baseadas em categoria_efetiva
    // Para outros casos (digitadas), usar os valores digitados
    const quantidadesIndividuais = isReposicao || isReconvocacao || (isNovaAutorizacao && tipoConvocacao === 'calculada')
      ? {
          geral: contagensPorCategoria.geral,
          pcd: contagensPorCategoria.pcd,
          nna: contagensPorCategoria.nna
        }
      : {
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
            onChange={(e) => !isReposicao && !isReconvocacao && !isNovaAutorizacao && setTipoConvocacao(e.target.value)} 
            value={tipoConvocacao}
          >
            <Radio value="calculada" disabled={isReposicao || isReconvocacao}>
              <span className="modal-radio-label">Calculada</span>
            </Radio>
            <Radio value="digitadas" disabled={isNovaAutorizacao}>
              <span className="modal-radio-label">Digitadas</span>
            </Radio>
          </Radio.Group>
        </div>

        <div style={modalInlineStyles.infoSection}>
          {/* Primeira linha - Autorizações Digitadas */}
          <div style={modalInlineStyles.inputsRow}>
            <div style={modalInlineStyles.inputsLabel}>
              <span className="modal-section-label">Autorizações Digitadas:</span>
            </div>
            <div style={modalInlineStyles.inputsContainer}>
              {isReposicao ? (
                // Para Reposição: apenas um campo numérico único
                <div style={modalStyles.actionButtonContainer}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantidadeReposicao || ''}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, setQuantidadeReposicao)
                    }
                    onKeyDown={validateNumericInput}
                    placeholder="00"
                    style={modalStyles.inputField}
                  />
                  <span style={modalStyles.inputLabel}>
                    {quantidadeReposicao} candidatos habilitados
                  </span>
                </div>
              ) : isNovaAutorizacao ? (
                // Para Nova Autorização: apenas um campo numérico único
                <div style={modalStyles.actionButtonContainer}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantidadeNovaAutorizacao || ''}
                    onChange={(e) =>
                      handleNumericInput(e.target.value, setQuantidadeNovaAutorizacao)
                    }
                    onKeyDown={validateNumericInput}
                    placeholder="00"
                    style={modalStyles.inputField}
                  />
                  <span style={modalStyles.inputLabel}>
                    {quantidadeNovaAutorizacao} candidatos habilitados
                  </span>
                </div>
              ) : (
                // Para outros tipos: campos individuais (Geral, Def, NNA)
                <>
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
                </>
              )}
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
              
              {candidatosIsLoadingFinal && (
                <div style={modalStyles.loadingContainer}>
                  <Spin size="large" />
                  <div style={modalStyles.loadingText}>Buscando candidatos...</div>
                </div>
              )}
              
              {!candidatosIsLoadingFinal && candidatos.length > 0 && (
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
              
              {!candidatosIsLoadingFinal && candidatos.length === 0 && (
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
