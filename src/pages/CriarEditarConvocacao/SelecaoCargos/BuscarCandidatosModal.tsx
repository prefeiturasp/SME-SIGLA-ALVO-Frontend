import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Modal, Typography, message, Spin, Radio, Divider } from 'antd';
import { AppButton, AppIconButton, AppInput, DeleteActionIcon } from '@/components/ui';
import type { ColumnsType } from 'antd/es/table';
import { SearchOutlined } from '@ant-design/icons';
import { ModalTitle } from "@/components/ui";
import { modalStyles, modalInlineStyles, BuscarCandidatosGlobalStyles } from "@/components/ui";
import { Table } from 'antd';
import { useGetCandidatos } from './hooks/useGetCandidatos';
import { useGetCandidatosReposicao } from './hooks/useGetCandidatosReposicao';
import { useGetCandidatosReconvocacao } from './hooks/useGetCandidatosReconvocacao';
import { useGetCandidatosCalculados } from './hooks/useGetCandidatosCalculados';
import { useGetCandidatosMandadoJudicial } from './hooks/useGetCandidatosMandadoJudicial';
import { useGetVagasPorProcessoECargo } from './hooks/useGetVagasPorProcessoECargo';

const { Title, Text } = Typography;


interface BuscarCandidatosModalProps {
  visible: boolean;
  onClose: () => void;
  concurso?: string;
  concursoValue?: string;
  cargo?: string;
  cargoCodigo?: string;
  cargoUuid?: string;
  processoUuid?: string;
  tipoEscolha?: string;
  cargoEmEdicao?: { geral: number; pcd: number; nna: number } | null;
  onCandidatosSelecionados?: (
    quantidade: number,
    quantidadesIndividuais: { geral: number; pcd: number; nna: number },
    vagas: number,
    candidatosUuids: string[],
    porcentagem_nna?: number,
    porcentagem_pcd?: number
  ) => void;
  onCandidatosUuidsChange?: (cargoUuid: string, uuids: string[]) => void;
}

const BuscarCandidatosModal: React.FC<BuscarCandidatosModalProps> = ({
  visible,
  onClose,
  concurso,
  concursoValue,
  cargo,
  cargoCodigo,
  cargoUuid,
  processoUuid,
  tipoEscolha,
  cargoEmEdicao = null,
  onCandidatosSelecionados,
  onCandidatosUuidsChange
}) => {
  const isReposicao = tipoEscolha === 'REPOSICAO';
  const isReconvocacao = tipoEscolha === 'RECONVOCAO';
  const isNovaAutorizacao = tipoEscolha === 'NOVA_AUTORIZACAO';
  const isMandadoJudicial = tipoEscolha === 'MANDADO_JUDICIAL';
  const [tipoConvocacao, setTipoConvocacao] = useState<'calculada' | 'digitadas' | 'mandado_judicial'>('digitadas');
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
  const [parametrosBuscaReposicao, setParametrosBuscaReposicao] = useState<{ concurso_uuid: string; geral?: number; pcd?: number; nna?: number; codigo_cargo?: string } | undefined>(undefined);
  // Parâmetros para busca de reconvocação
  const [parametrosBuscaReconvocacao, setParametrosBuscaReconvocacao] = useState<{ concurso_uuid: string; quantidade: number } | undefined>(undefined);
  // Parâmetros para busca de candidatos calculados (Nova Autorização)
  const [parametrosBuscaCalculados, setParametrosBuscaCalculados] = useState<{ concurso_uuid: string; processo_uuid?: string; quantidade: number; codigo_cargo?: string } | undefined>(undefined);
  const [nomeMandadoJudicial, setNomeMandadoJudicial] = useState('');
  const [parametrosBuscaMandadoJudicial, setParametrosBuscaMandadoJudicial] = useState<{ concurso_uuid: string; codigo_cargo?: string; nome?: string } | undefined>(undefined);
  const [candidatosMandadoJudicial, setCandidatosMandadoJudicial] = useState<any[]>([]);

  // Refs para rastrear se já processamos os UUIDs (evitar loops infinitos)
  const uuidsProcessadosReposicao = useRef<string>('');
  const uuidsProcessadosReconvocacao = useRef<string>('');
  const uuidsProcessadosCalculados = useRef<string>('');
  const uuidsProcessadosMandadoJudicial = useRef<string>('');
  const parametrosMandadoJudicialProcessados = useRef<string>('');
  const buscaMandadoJudicialPendente = useRef<boolean>(false);

  // Hook para buscar vagas dinamicamente
  const { vagasIsLoading, totalVagas } = useGetVagasPorProcessoECargo(
    processoUuid,
    cargoCodigo,
    visible && !!processoUuid && !!cargoCodigo
  );

  // Fixar tipoConvocacao como 'digitadas' quando for Reposição ou Reconvocação
  // Fixar tipoConvocacao como 'calculada' quando for Nova Autorização
  useEffect(() => {
    if (isMandadoJudicial) {
      setTipoConvocacao('mandado_judicial');
    } else if (isReposicao || isReconvocacao) {
      setTipoConvocacao('digitadas');
    } else if (isNovaAutorizacao) {
      setTipoConvocacao('calculada');
    }
  }, [isReposicao, isReconvocacao, isNovaAutorizacao, isMandadoJudicial, visible]);

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
      setNomeMandadoJudicial('');
      setParametrosBuscaMandadoJudicial(undefined);
      setCandidatosMandadoJudicial([]);
      // Resetar refs quando o modal fechar
      uuidsProcessadosReposicao.current = '';
      uuidsProcessadosReconvocacao.current = '';
      uuidsProcessadosCalculados.current = '';
      uuidsProcessadosMandadoJudicial.current = '';
      parametrosMandadoJudicialProcessados.current = '';
      buscaMandadoJudicialPendente.current = false;
    } else if (cargoEmEdicao) {
      // Preencher campos quando estiver editando
      if (isReconvocacao) {
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
      setNomeMandadoJudicial('');
      setParametrosBuscaMandadoJudicial(undefined);
      setCandidatosMandadoJudicial([]);
      parametrosMandadoJudicialProcessados.current = '';
      buscaMandadoJudicialPendente.current = false;
    }
  }, [visible, cargoEmEdicao]);

  const { candidatosData, candidatosIsLoading, fetchCandidatosNow } = useGetCandidatos(
    mostrarTabelaCandidatos && !isReposicao && !isReconvocacao && !isNovaAutorizacao, 
    parametrosBusca
  );

  const { 
    candidatosData: candidatosReposicaoData, 
    candidatosIsLoading: candidatosReposicaoIsLoading
  } = useGetCandidatosReposicao(
    mostrarTabelaCandidatos && isReposicao,
    parametrosBuscaReposicao
  );

  const { 
    candidatosData: candidatosReconvocacaoData, 
    candidatosIsLoading: candidatosReconvocacaoIsLoading
  } = useGetCandidatosReconvocacao(
    mostrarTabelaCandidatos && isReconvocacao,
    parametrosBuscaReconvocacao
  );

  const { 
    candidatosData: candidatosCalculadosData, 
    candidatosIsLoading: candidatosCalculadosIsLoading
  } = useGetCandidatosCalculados(
    mostrarTabelaCandidatos && isNovaAutorizacao && tipoConvocacao === 'calculada',
    parametrosBuscaCalculados
  );

  const {
    candidatosData: candidatosMandadoJudicialData,
    candidatosIsLoading: candidatosMandadoJudicialIsLoading
  } = useGetCandidatosMandadoJudicial(
    mostrarTabelaCandidatos && isMandadoJudicial,
    parametrosBuscaMandadoJudicial
  );

  const { candidatosDataFinal, candidatosIsLoadingFinal } = useMemo(() => {
    if (isMandadoJudicial) {
      return {
        candidatosDataFinal: candidatosMandadoJudicialData,
        candidatosIsLoadingFinal: candidatosMandadoJudicialIsLoading,
      };
    }
    if (isReposicao) {
      return {
        candidatosDataFinal: candidatosReposicaoData,
        candidatosIsLoadingFinal: candidatosReposicaoIsLoading,
      };
    }
    if (isReconvocacao) {
      return {
        candidatosDataFinal: candidatosReconvocacaoData,
        candidatosIsLoadingFinal: candidatosReconvocacaoIsLoading,
      };
    }
    if (isNovaAutorizacao && tipoConvocacao === 'calculada') {
      return {
        candidatosDataFinal: candidatosCalculadosData,
        candidatosIsLoadingFinal: candidatosCalculadosIsLoading,
      };
    }
    return {
      candidatosDataFinal: candidatosData,
      candidatosIsLoadingFinal: candidatosIsLoading,
    };
  }, [
    isMandadoJudicial, candidatosMandadoJudicialData, candidatosMandadoJudicialIsLoading,
    isReposicao, candidatosReposicaoData, candidatosReposicaoIsLoading,
    isReconvocacao, candidatosReconvocacaoData, candidatosReconvocacaoIsLoading,
    isNovaAutorizacao, tipoConvocacao, candidatosCalculadosData, candidatosCalculadosIsLoading,
    candidatosData, candidatosIsLoading,
  ]);

  const porcentagemNna =
    candidatosDataFinal && !Array.isArray(candidatosDataFinal)
      ? (candidatosDataFinal as any)?.porcentagem_nna
      : undefined;
  const porcentagemPcd =
    candidatosDataFinal && !Array.isArray(candidatosDataFinal)
      ? (candidatosDataFinal as any)?.porcentagem_pcd
      : undefined;
  
  const candidatosBuscados = mostrarTabelaCandidatos && candidatosDataFinal ?
    (Array.isArray(candidatosDataFinal) ? candidatosDataFinal : candidatosDataFinal.results) : [];

  const candidatos = isMandadoJudicial ? candidatosMandadoJudicial : candidatosBuscados;

  useEffect(() => {
    if (!isMandadoJudicial || candidatosMandadoJudicialIsLoading) return;
    const chave = JSON.stringify(parametrosBuscaMandadoJudicial ?? null);
    const buscaNova = parametrosMandadoJudicialProcessados.current !== chave;
    if (!buscaNova && !buscaMandadoJudicialPendente.current) return;
    parametrosMandadoJudicialProcessados.current = chave;
    buscaMandadoJudicialPendente.current = false;
    const lista = Array.isArray(candidatosMandadoJudicialData) ? candidatosMandadoJudicialData : [];
    setCandidatosMandadoJudicial(lista);
  }, [isMandadoJudicial, candidatosMandadoJudicialData, candidatosMandadoJudicialIsLoading, parametrosBuscaMandadoJudicial]);

  // Função para mapear categoria_efetiva para exibição
  const mapearCategoriaEfetiva = (categoria?: string): string => {
    if (!categoria || categoria === 'GERAL') {
      return 'Geral';
    } else if (categoria === 'NNA') {
      return 'NNA';
    } else if (categoria === 'PCD') {
      return 'PcD';
    }
    return 'Geral'; // fallback
  };

  // Função para formatar nome do candidato com categoria
  const formatarNomeCandidato = (nome: string, categoria?: string): string => {
    if (!nome) return '';
    
    if (!categoria || categoria === 'GERAL') {
      return nome;
    } else if (categoria === 'NNA') {
      return `${nome} (NNA)`;
    } else if (categoria === 'PCD') {
      return `${nome} (PcD)`;
    }
    return nome; // fallback
  };

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
    if (isReposicao && candidatosReposicaoData && !candidatosReposicaoIsLoading && onCandidatosUuidsChange && cargoUuid) {
      const list = Array.isArray(candidatosReposicaoData) ? candidatosReposicaoData : [];
      const uuids = list
        .map((item: any) => item?.candidato?.uuid || item?.uuid)
        .filter((id: any) => typeof id === 'string');
      
      // Criar uma chave única para verificar se já processamos esses dados
      const chave = `${cargoUuid}-${JSON.stringify(uuids)}`;
      if (uuidsProcessadosReposicao.current !== chave) {
        uuidsProcessadosReposicao.current = chave;
        onCandidatosUuidsChange(cargoUuid, uuids);
      }
    }
  }, [isReposicao, candidatosReposicaoData, candidatosReposicaoIsLoading, onCandidatosUuidsChange, cargoUuid]);

  // Processar UUIDs quando os dados de reconvocação chegarem
  useEffect(() => {
    if (isReconvocacao && candidatosReconvocacaoData && !candidatosReconvocacaoIsLoading && onCandidatosUuidsChange && cargoUuid) {
      const list = Array.isArray(candidatosReconvocacaoData) ? candidatosReconvocacaoData : [];
      const uuids = list
        .map((item: any) => item?.candidato?.uuid || item?.uuid)
        .filter((id: any) => typeof id === 'string');
      
      // Criar uma chave única para verificar se já processamos esses dados
      const chave = `${cargoUuid}-${JSON.stringify(uuids)}`;
      if (uuidsProcessadosReconvocacao.current !== chave) {
        uuidsProcessadosReconvocacao.current = chave;
        onCandidatosUuidsChange(cargoUuid, uuids);
      }
    }
  }, [isReconvocacao, candidatosReconvocacaoData, candidatosReconvocacaoIsLoading, onCandidatosUuidsChange, cargoUuid]);

  // Processar UUIDs quando os dados calculados chegarem
  useEffect(() => {
    if (isNovaAutorizacao && tipoConvocacao === 'calculada' && candidatosCalculadosData && !candidatosCalculadosIsLoading && onCandidatosUuidsChange && cargoUuid) {
      const list = Array.isArray(candidatosCalculadosData) ? candidatosCalculadosData : (candidatosCalculadosData as any)?.results || [];
      const uuids = list
        .map((item: any) => item?.uuid)
        .filter((id: any) => typeof id === 'string');
      // Criar uma chave única para verificar se já processamos esses dados
      const chave = `${cargoUuid}-${JSON.stringify(uuids)}`;
      if (uuidsProcessadosCalculados.current !== chave) {

        uuidsProcessadosCalculados.current = chave;
        onCandidatosUuidsChange(cargoUuid, uuids);
      }
    }
  }, [isNovaAutorizacao, tipoConvocacao, candidatosCalculadosData, candidatosCalculadosIsLoading, onCandidatosUuidsChange, cargoUuid]);

  useEffect(() => {
    if (!isMandadoJudicial || !onCandidatosUuidsChange || !cargoUuid) return;
    const uuids = candidatosMandadoJudicial
      .map((item: any) => item?.uuid)
      .filter((id: any) => typeof id === 'string');

    // Criar uma chave única para verificar se já processamos esses dados
    const chave = `${cargoUuid}-${JSON.stringify(uuids)}`;
    if (uuidsProcessadosMandadoJudicial.current !== chave) {
      uuidsProcessadosMandadoJudicial.current = chave;
      onCandidatosUuidsChange(cargoUuid, uuids);
    }
  }, [isMandadoJudicial, candidatosMandadoJudicial, onCandidatosUuidsChange, cargoUuid]);

  // Calcular total baseado no tipo de escolha
  const totalAutorizacoes = isMandadoJudicial
    ? candidatosMandadoJudicial.length
    : isReconvocacao
      ? quantidadeReposicao
      : isNovaAutorizacao
        ? quantidadeNovaAutorizacao
        : autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;
  const isTotalValido = totalAutorizacoes > 0;
  const isTotalExcedido = totalAutorizacoes > totalVagas && totalVagas > 0;
  const hasResultadosBusca = mostrarTabelaCandidatos && !candidatosIsLoadingFinal && candidatos.length > 0;
  const isAdicionarDisabilitado = !isTotalValido || isTotalExcedido || !hasResultadosBusca;

  // Configuração das colunas da tabela
  const columns: ColumnsType<any> = [
    {
      title: (
        <div style={modalStyles.tableHeader}>
          Convocado Por
        </div>
      ),
      dataIndex: 'categoria_efetiva',
      key: 'categoria_efetiva',
      width: '20%',
      sorter: (a: any, b: any) => {
        const categoriaA = mapearCategoriaEfetiva(a?.categoria_efetiva);
        const categoriaB = mapearCategoriaEfetiva(b?.categoria_efetiva);
        return categoriaA.localeCompare(categoriaB);
      },
      render: (_: any, record: any) => mapearCategoriaEfetiva(record?.categoria_efetiva),
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
      render: (nome: string, record: any) => formatarNomeCandidato(nome, record?.categoria_efetiva),
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

  const handleExcluirCandidato = (uuid: string) => {
    setCandidatosMandadoJudicial((prev) => prev.filter((item: any) => item?.uuid !== uuid));
  };

  if (isMandadoJudicial) {
    columns.push({
      title: (
        <div style={modalStyles.tableHeader}>
          Excluir
        </div>
      ),
      key: 'excluir',
      width: '10%',
      align: 'center',
      render: (_: any, record: any) => (
        <AppIconButton
          type="link"
          tooltip="Excluir"
          aria-label={`Excluir ${record?.candidato?.nome || 'candidato'}`}
          icon={<DeleteActionIcon />}
          onClick={() => handleExcluirCandidato(record?.uuid)}
        />
      ),
    });
  }

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
    if (isMandadoJudicial) {
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      buscaMandadoJudicialPendente.current = true;
      setParametrosBuscaMandadoJudicial({
        concurso_uuid: concursoValue,
        codigo_cargo: cargoCodigo || undefined,
        nome: nomeMandadoJudicial.trim() || undefined
      });
      setMostrarTabelaCandidatos(true);
      return;
    }

    // Para Reposição, usar quantidadeReposicao; para Nova Autorização, usar quantidadeNovaAutorizacao; caso contrário, usar a soma dos campos individuais
    const somatorio = isReconvocacao
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
      // Invertido: tratar como reconvocação
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      // const novosParametrosReconvocacao = {
      const novosParametrosReposicao = {
        concurso_uuid: concursoValue,
        geral: autorizacoesDigitadas.geral > 0 ? autorizacoesDigitadas.geral : 0,
        pcd: autorizacoesDigitadas.def > 0 ? autorizacoesDigitadas.def : 0,
        nna: autorizacoesDigitadas.nna > 0 ? autorizacoesDigitadas.nna : 0,
        codigo_cargo: cargoCodigo || undefined
      };
      setParametrosBuscaReposicao(novosParametrosReposicao);
      setMostrarTabelaCandidatos(true);
      // O hook useGetCandidatosReconvocacao fará o request automaticamente
      return;
    }

    if (isReconvocacao) {
      // Invertido: tratar como reposição
      if (!concursoValue) {
        message.error('Concurso não informado');
        return;
      }

      const novosParametrosReconvocacao = {
        concurso_uuid: concursoValue,
        quantidade: quantidadeReposicao
      };
      setParametrosBuscaReconvocacao(novosParametrosReconvocacao);
      setMostrarTabelaCandidatos(true);
      // O hook useGetCandidatosReposicao fará o request automaticamente
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
        processo_uuid: processoUuid,
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
      if (onCandidatosUuidsChange && cargoUuid) onCandidatosUuidsChange(cargoUuid, uuids);
    } catch (e) {
      // ignore
    }
    
  };

  const handleSelecionar = () => {
    const quantidadeCandidatos = (isMandadoJudicial || isReposicao || isReconvocacao || (isNovaAutorizacao && tipoConvocacao === 'calculada'))
      ? candidatos.length
      : autorizacoesDigitadas.geral + autorizacoesDigitadas.def + autorizacoesDigitadas.nna;

    if (quantidadeCandidatos > totalVagas && totalVagas > 0) {
      message.error('Total de vagas excedido');
      return;
    }

    const quantidadesIndividuais = isMandadoJudicial || isReposicao || isReconvocacao || (isNovaAutorizacao && tipoConvocacao === 'calculada')
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

    // Extrair UUIDs dos candidatos
    const candidatosUuids = candidatos
      .map((item: any) =>  item?.uuid || item?.candidato?.uuid)
      .filter((id: any) => typeof id === 'string' && id);

    if (onCandidatosSelecionados) {
      onCandidatosSelecionados(
        quantidadeCandidatos,
        quantidadesIndividuais,
        totalVagas,
        candidatosUuids,
        porcentagemNna,
        porcentagemPcd
      );
    }

    onClose();
  };

  return (
    <>
      <BuscarCandidatosGlobalStyles />
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
            onChange={(e) => !isReposicao && !isReconvocacao && !isNovaAutorizacao && !isMandadoJudicial && setTipoConvocacao(e.target.value)}
            value={tipoConvocacao}
          >
            <Radio value="calculada" disabled={isReposicao || isReconvocacao || isMandadoJudicial}>
              <span className="modal-radio-label">Calculada</span>
            </Radio>
            <Radio value="digitadas" disabled={isNovaAutorizacao || isMandadoJudicial}>
              <span className="modal-radio-label">Digitadas</span>
            </Radio>
            {isMandadoJudicial && (
              <Radio value="mandado_judicial">
                <span className="modal-radio-label">Mandado Judicial</span>
              </Radio>
            )}
          </Radio.Group>
        </div>

        <div style={modalInlineStyles.infoSection}>
          {/* Primeira linha - Autorizações Digitadas */}
          <div style={modalInlineStyles.inputsRow}>
            <div style={modalInlineStyles.inputsLabel}>
              <span className="modal-section-label">
                {isMandadoJudicial ? 'Nome:' : 'Autorizações Digitadas:'}
              </span>
            </div>
            <div style={isMandadoJudicial ? { ...modalInlineStyles.inputsContainer, flex: 1 } : modalInlineStyles.inputsContainer}>
              {isMandadoJudicial ? (
                <AppInput
                  aria-label="Nome"
                  value={nomeMandadoJudicial}
                  onChange={(e) => setNomeMandadoJudicial(e.target.value)}
                  onPressEnter={handleBuscar}
                  placeholder="Digite o nome do candidato"
                  allowClear
                  style={{ width: '100%' }}
                />
              ) : isReconvocacao ? (
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
          <AppButton
            variant="secondary"
            icon={<SearchOutlined />}
            onClick={handleBuscar}
            style={{ width: 'fit-content' }}
          >
            Buscar
          </AppButton>
        </div>

          {mostrarTabelaCandidatos && (
            <div style={modalInlineStyles.tableContainer}>
              <Text strong style={modalStyles.listTitle}>
                {isMandadoJudicial
                  ? 'Lista de Convocados por mandado judicial'
                  : `Lista de Convocados por autorizações ${tipoConvocacao === 'calculada' ? 'calculadas' : 'digitadas'}`}
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
                  rowKey={(record: any, index?: number) =>
                    record?.uuid || record?.candidato?.uuid || index?.toString() || '0'
                  }
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
            <AppButton variant="secondary" onClick={onClose} style={{ width: 'fit-content' }}>
              Cancelar
            </AppButton>
            <AppButton
              onClick={handleSelecionar}
              disabled={isAdicionarDisabilitado}
              style={{ width: 'fit-content' }}
            >
              Adicionar ao cargo
            </AppButton>
          </div>
        {/* </ButtonContainer> */}
              </div>
    </Modal>
    </>
  );
};

export default BuscarCandidatosModal;
