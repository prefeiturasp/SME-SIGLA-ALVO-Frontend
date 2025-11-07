import { useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useGetProcessosConvocacaoPorUUID } from "../../SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID";
import { useGetConcursoByUuid } from "../../SelecaoCargos/hooks/useGetConcursosPorUuid";
import useAgendaSchema, { type IAgendaFields } from "./useAgendaSchema";
import type { IAgenda, IAgendaCreate } from "../../../../services/resources/agenda/IAgenda";
import { usePostAgenda } from "./usePostAgenda";
import { useDeleteAgenda } from "./useDeleteAgenda";
import { useGetAgendas } from "./useGetAgendas";
import { getCargosProcesso } from "../../../../services/resources/convocacao";
import { App } from "antd";

export type CargoAdicionado = {
  uuid: string;
  nome: string;
  vagas: number;
  geral: number;
  pcd: number;
  nna: number;
  totalCandidatos: number;
};

export type VagasInfo = {
  totalGeral: number;
  totalPcd: number;
  totalNna: number;
};

export type Option = { value: string; label: string };

export type PeriodoItem = {
  id: number;
  uuid?: string;
  cargo: string;
  cargoUuid?: string;
  classificacao: number;
  dataEscolha: string;
  sessao: string;
  horario: string;
  horaInicio?: string;
  horaFim?: string;
  isRetardatario?: boolean;
  tipoEscolha?: string;
  modalidade?: 'Presencial' | 'Online' | null;
  numeroSessao?: number;
  dataEscolhaOriginal?: any;
  horaInicioOriginal?: any;
  horaFimOriginal?: any;
  processoConvocacaoUuid?: string;
  escolhaEm?: string;
  nomeacaoEm?: string;
};

export const useAgenda = () => {
  const { uuid } = useParams<{ uuid: string }>();
  
  // Estado para armazenar os cargos selecionados do step anterior
  const [cargosAdicionados, setCargosAdicionados] = useState<CargoAdicionado[]>([]);
  const [vagasInfo, setVagasInfo] = useState<VagasInfo>({
    totalGeral: 0,
    totalPcd: 0,
    totalNna: 0,
  });

  // Estado para controlar um único card de agenda aberto
  const [agendaAberto, setAgendaAberto] = useState<{
    cargoUuid: string;
    cargo: CargoAdicionado;
  } | null>(null);

  // Estados para controlar os períodos e sessões da agenda
  const [isRetardatario, setIsRetardatario] = useState(false);
  const [periodosList, setPeriodosList] = useState<PeriodoItem[]>([]);
  const [contadorSessao, setContadorSessao] = useState(1);
  const [editingKey, setEditingKey] = useState<number | null>(null);
  
  // Estado para controlar expansão automática da tabela
  const [cargoParaExpandir, setCargoParaExpandir] = useState<string | null>(null);

  // Estados para controle de API
  const [agendasLoading, setAgendasLoading] = useState(false);
  const { notification } = App.useApp();
  
  // Hook para criar agendas
  const postAgendaMutation = usePostAgenda();
  
  // Hook para deletar agendas
  const deleteAgendaMutation = useDeleteAgenda();

  const { processoConvocacaoData, processoConvocacaoIsLoading } = useGetProcessosConvocacaoPorUUID(uuid!);
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(processoConvocacaoData?.concurso_uuid || '');

  const mapAgendaToPeriodoItem = useCallback((agenda: IAgenda): PeriodoItem => {
    const dataEscolhaOriginal = agenda.escolha_em ? dayjs(agenda.escolha_em) : null;
    const horaInicioOriginal = agenda.hora_convocacao_inicio 
      ? dayjs(`2000-01-01 ${agenda.hora_convocacao_inicio}`) 
      : null;
    const horaFimOriginal = agenda.hora_convocacao_fim 
      ? dayjs(`2000-01-01 ${agenda.hora_convocacao_fim}`) 
      : null;

    // Formatar data de escolha
    let dataEscolhaFormatada: string;
    if (agenda.escolha_em) {
      dataEscolhaFormatada = dayjs(agenda.escolha_em).format('DD/MM/YYYY');
    } else {
      dataEscolhaFormatada = dayjs(agenda.data_escolha).format('DD/MM/YYYY');
    }

    // Formatar horário
    let horario: string;
    if (agenda.modalidade === 'Presencial' && horaInicioOriginal && horaFimOriginal) {
      horario = `${horaInicioOriginal.format('HH:mm')} às ${horaFimOriginal.format('HH:mm')}`;
    } else {
      horario = agenda.modalidade === 'Online' ? 'Online' : '—';
    }

    const stableId = agenda.uuid 
      ? parseInt(agenda.uuid.replace(/-/g, '').substring(0, 15), 16) 
      : Date.now() + Math.random();

    return {
      id: stableId,
      uuid: agenda.uuid,
      cargo: agenda.cargo_nome,
      cargoUuid: agenda.cargo_uuid,
      classificacao: agenda.classificacao || 0,
      dataEscolha: dataEscolhaFormatada,
      sessao: agenda.sessao || '—',
      horario: horario,
      horaInicio: horaInicioOriginal?.format('HH:mm'),
      horaFim: horaFimOriginal?.format('HH:mm'),
      isRetardatario: agenda.retardatario || false,
      tipoEscolha: agenda.modalidade || undefined,
      modalidade: agenda.modalidade || null,
      dataEscolhaOriginal: dataEscolhaOriginal,
      horaInicioOriginal: horaInicioOriginal,
      horaFimOriginal: horaFimOriginal,
      processoConvocacaoUuid: agenda.processo_convocacao_uuid,
      escolhaEm: agenda.escolha_em || undefined,
      nomeacaoEm: agenda.nomeacao_em || undefined,
    };
  }, []);

  const mapPeriodoItemToAgendaCreate = (periodo: PeriodoItem, processoUuid: string, processoNome: string): IAgendaCreate => {
    let escolhaEm: string | null = null;
    if (periodo.dataEscolhaOriginal) {
      escolhaEm = dayjs(periodo.dataEscolhaOriginal).format('YYYY-MM-DD');
    } else if (periodo.escolhaEm) {
      escolhaEm = periodo.escolhaEm;
    }

    let nomeacaoEm: string | null = null;
    if (periodo.nomeacaoEm) {
      nomeacaoEm = periodo.nomeacaoEm;
    }

    let horaConvocacaoInicio: string | null = null;
    let horaConvocacaoFim: string | null = null;
    
    if (periodo.horaInicioOriginal) {
      horaConvocacaoInicio = dayjs(periodo.horaInicioOriginal).format('HH:mm:ss');
      if (periodo.horaFimOriginal) {
        horaConvocacaoFim = dayjs(periodo.horaFimOriginal).format('HH:mm:ss');
      }
    } else if (periodo.horaInicio && periodo.horaFim) {
      horaConvocacaoInicio = `${periodo.horaInicio}:00`;
      horaConvocacaoFim = `${periodo.horaFim}:00`;
    }

    return {
      ...(periodo.uuid && { uuid: periodo.uuid }),
      processo_convocacao_uuid: processoUuid,
      processo_convocacao_nome: processoNome,
      cargo_uuid: periodo.cargoUuid || '',
      cargo_nome: periodo.cargo,
      data_escolha: dayjs().toISOString(),
      modalidade: (periodo.tipoEscolha || periodo.modalidade) as 'Presencial' | 'Online' | null,
      escolha_em: escolhaEm,
      nomeacao_em: nomeacaoEm,
      classificacao: periodo.classificacao || null,
      sessao: periodo.sessao || null,
      retardatario: periodo.isRetardatario || false,
      hora_convocacao_inicio: horaConvocacaoInicio,
      hora_convocacao_fim: horaConvocacaoFim,
    };
  };

  // Configuração do formulário da agenda
  const defaultValues: IAgendaFields = {
    tipoEscolha: "",
    cargoAgenda: "",
    escolhaEm: null,
    nomeacaoEm: null,
    quantidadeClassificados: null,
    sessao: null,
    horaInicio: null,
    horaFim: null,
  };

  // Função para calcular candidatos já classificados para o cargo atual
  const getCandidatosJaClassificados = () => {
    if (!agendaAberto) return 0;
    return periodosList
      .filter(periodo => periodo.cargo === agendaAberto.cargo.nome)
      .reduce((total, periodo) => total + (periodo.classificacao || 0), 0);
  };

  // Função para obter o limite de candidatos disponíveis (total - já classificados)
  const getMaxCandidatosDisponiveis = () => {
    if (!agendaAberto) return undefined;
    const totalCandidatos = agendaAberto.cargo.totalCandidatos;
    const jaClassificados = getCandidatosJaClassificados();
    return totalCandidatos - jaClassificados;
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IAgendaFields>({
    defaultValues,
    resolver: yupResolver(useAgendaSchema(getMaxCandidatosDisponiveis)) as Resolver<IAgendaFields>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  // Observar valores dos campos
  const watchedFields = watch();

  // Função para calcular informações de vagas
  const calcularVagasInfo = (cargos: CargoAdicionado[]) => {
    const totalGeral = cargos.reduce((acc, cargo) => acc + cargo.geral, 0);
    const totalPcd = cargos.reduce((acc, cargo) => acc + cargo.pcd, 0);
    const totalNna = cargos.reduce((acc, cargo) => acc + cargo.nna, 0);

    return {
      totalGeral,
      totalPcd,
      totalNna,
    };
  };

  // Helper function para obter mensagem de erro
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    if (error?.type === 'required') return 'campo obrigatório';
    if (error?.type === 'typeError') return 'campo obrigatório';
    return 'campo obrigatório';
  };

  // Helper function para calcular faixas de classificação por sessão
  const calcularFaixasClassificacao = (quantidadeTotal: number, numeroSessoes: number): number[] => {
    const classificadosPorSessao = Math.floor(quantidadeTotal / numeroSessoes);
    const resto = quantidadeTotal % numeroSessoes;
    const faixas: number[] = [];
    
    for (let i = 0; i < numeroSessoes; i++) {
      const quantidadeNestaSessao = classificadosPorSessao + (i < resto ? 1 : 0);
      faixas.push(quantidadeNestaSessao);
    }
    
    return faixas;
  };

  // Helper function para calcular horários das sessões subsequentes
  const calcularHorariosSessoes = (horaInicio: any, horaFim: any, numeroSessao: number): string => {
    if (!horaInicio || !horaFim) return '';
    
    const diffMinutos = horaFim.diff(horaInicio, 'minute');
    
    const inicioSessao = horaFim.add((numeroSessao - 2) * diffMinutos, 'minute');
    const fimSessao = inicioSessao.add(diffMinutos, 'minute');
    
    return `${inicioSessao.format('HH:mm')} às ${fimSessao.format('HH:mm')}`;
  };

  // Função para verificar se a quantidade de classificados está dentro do limite
  const isQuantidadeValida = () => {
    if (!agendaAberto || isRetardatario) return true;
    
    const quantidadeClassificados = watchedFields.quantidadeClassificados;
    const maxCandidatos = getMaxCandidatosDisponiveis();
    
    if (maxCandidatos !== undefined && maxCandidatos <= 0) {
      return false;
    }
    
    // Se a quantidade excede os disponíveis
    if (maxCandidatos && quantidadeClassificados && quantidadeClassificados > maxCandidatos) {
      return false;
    }
    
    return true;
  };

  // Função para verificar se todos os campos da agenda estão preenchidos
  const isAgendaComplete = () => {
    // Verificar se há um cargo selecionado (agendaAberto)
    if (!agendaAberto) return false;
    
    // Se retardatário estiver marcado, apenas campos básicos são obrigatórios
    if (isRetardatario) {
      const camposBasicos = watchedFields.tipoEscolha && 
                           watchedFields.escolhaEm && 
                           watchedFields.nomeacaoEm;
      
      // Se for Presencial, também precisa dos horários
      if (watchedFields.tipoEscolha === "Presencial") {
        return camposBasicos && watchedFields.horaInicio && watchedFields.horaFim;
      }
      
      // Se for Online, não precisa dos horários
      return camposBasicos;
    }
    
    // Se retardatário NÃO estiver marcado, todos os campos são obrigatórios (lógica original)
    const camposObrigatorios = watchedFields.tipoEscolha && 
           watchedFields.escolhaEm && 
           watchedFields.nomeacaoEm && 
           watchedFields.quantidadeClassificados && 
           watchedFields.sessao;
    
    // Se for Presencial, também precisa dos horários
    if (watchedFields.tipoEscolha === "Presencial") {
      return camposObrigatorios && watchedFields.horaInicio && watchedFields.horaFim;
    }
    
    // Se for Online, não precisa dos horários
    return camposObrigatorios;
  };

  // Função para verificar se o botão "Adicionar período" deve estar habilitado
  const isBotaoAdicionarHabilitado = () => {
    return isAgendaComplete() && isQuantidadeValida();
  };

  // Função para adicionar período à tabela (apenas localmente)
  const handleAdicionarPeriodo = () => {
    // Verificar se há erros de validação
    const hasErrors = Object.keys(formErrors).length > 0;
    
    if (hasErrors) {
      return;
    }
    
    // Usar o cargo do agendaAberto em vez do watchedFields.cargoAgenda
    const nomeCargo = agendaAberto?.cargo.nome || '';
    
    // Calcular quantidade de classificados por sessão
    const quantidadesPorSessao = calcularFaixasClassificacao(
      watchedFields.quantidadeClassificados || 1, 
      watchedFields.sessao || 1
    );

    // Processar data de escolha baseado no tipo
    let dataEscolhaFormatada: string;
    let dataEscolhaOriginal: any;
    
    if (watchedFields.tipoEscolha === "Online" && Array.isArray(watchedFields.escolhaEm)) {
      const [dataInicio, dataFim] = watchedFields.escolhaEm;
      dataEscolhaFormatada = `${dataInicio?.format('DD/MM/YYYY')} a ${dataFim?.format('DD/MM/YYYY')}`;
      dataEscolhaOriginal = dataInicio;
    } else {
      // Para Presencial, usar data única
      dataEscolhaFormatada = watchedFields.escolhaEm?.format('DD/MM/YYYY');
      dataEscolhaOriginal = watchedFields.escolhaEm;
    }

    // Criar múltiplas entradas baseado no número de sessões
    const novosPeriodos: PeriodoItem[] = [];
    const numeroSessoes = watchedFields.sessao || 1;

    const invervaloSessao = watchedFields.horaFim.diff(watchedFields.horaInicio, 'hour');
    for (let i = 0; i < numeroSessoes; i++) {
      const numeroSessaoAtual = i + 1;
      
      // Determinar o nome da sessão
      let nomeSessao;
      if (watchedFields.tipoEscolha === "Online") {
        nomeSessao = `Sessão ${numeroSessaoAtual}`;
      } else if (isRetardatario) {
        nomeSessao = "Retardatário";
      } else {
        nomeSessao = `Sessão ${numeroSessaoAtual}`;
      }
      
      // Determinar a quantidade de classificados para esta sessão
      let quantidadeClassificados;
      if (isRetardatario) {
        quantidadeClassificados = 0;
      } else {
        quantidadeClassificados = quantidadesPorSessao[i];
      }
      
      // Calcular horário baseado no tipo e número da sessão
      let horario: string;
      if (watchedFields.tipoEscolha === "Presencial") {
        if (numeroSessaoAtual === 1) {
          horario = `${watchedFields.horaInicio?.format('HH:mm')} às ${watchedFields.horaFim?.format('HH:mm')}`;
        } else {
          horario = calcularHorariosSessoes(watchedFields.horaInicio, watchedFields.horaFim, numeroSessaoAtual);
        }
      } else {
        horario = "Online";
      }

      const novoPeriodo: PeriodoItem = {
        id: Date.now() + i,
        cargo: nomeCargo,
        cargoUuid: agendaAberto?.cargo.uuid,
        classificacao: quantidadeClassificados,
        dataEscolha: dataEscolhaFormatada,
        dataEscolhaOriginal: dataEscolhaOriginal,
        sessao: nomeSessao,
        isRetardatario: isRetardatario,
        numeroSessao: isRetardatario ? undefined : numeroSessaoAtual,
        horario: horario,
        horaInicioOriginal: watchedFields.horaInicio,
        horaFimOriginal: watchedFields.horaFim,
        horaInicio: watchedFields.horaInicio?.add(i * invervaloSessao, 'hour').format('HH:mm'),
        horaFim: watchedFields.horaFim?.add(i * invervaloSessao, 'hour').format('HH:mm'), 
        tipoEscolha: watchedFields.tipoEscolha,
        modalidade: watchedFields.tipoEscolha as 'Presencial' | 'Online' | null,
        processoConvocacaoUuid: uuid,
        escolhaEm: watchedFields.escolhaEm ? (Array.isArray(watchedFields.escolhaEm) ? watchedFields.escolhaEm[0]?.format('YYYY-MM-DD') : watchedFields.escolhaEm.format('YYYY-MM-DD')) : undefined,
        nomeacaoEm: watchedFields.nomeacaoEm ? watchedFields.nomeacaoEm.format('YYYY-MM-DD') : undefined,
      };
      novosPeriodos.push(novoPeriodo);
    }
    setPeriodosList(prev => {
      const novaLista = [...prev, ...novosPeriodos];
      
      // Agrupar por cargo e depois ordenar cronologicamente dentro de cada grupo
      const periodosAgrupados = novaLista.reduce((grupos, periodo) => {
        const cargo = periodo.cargo;
        if (!grupos[cargo]) {
          grupos[cargo] = [];
        }
        grupos[cargo].push(periodo);
        return grupos;
      }, {} as Record<string, PeriodoItem[]>);

      // Ordenar cada grupo cronologicamente
      Object.keys(periodosAgrupados).forEach(cargo => {
        periodosAgrupados[cargo].sort((a: PeriodoItem, b: PeriodoItem) => {
          const dataA = a.dataEscolhaOriginal;
          const dataB = b.dataEscolhaOriginal;
          
          if (dataA && dataB) {
            const comparacaoData = dataA.diff(dataB, 'day');
            if (comparacaoData !== 0) {
              return comparacaoData;
            }
            
            // Se as datas forem iguais, ordena por horário
            const horaA = a.horaInicioOriginal;
            const horaB = b.horaInicioOriginal;
            
            if (horaA && horaB) {
              return horaA.diff(horaB, 'minute');
            }
          }
          
          return 0;
        });
      });

      // Reordenar as sessões dentro de cada grupo
      Object.keys(periodosAgrupados).forEach(cargo => {
        let contadorSessaoPresencial = 1;
        let contadorSessaoOnline = 1;
        periodosAgrupados[cargo] = periodosAgrupados[cargo].map((periodo: PeriodoItem) => {
          if (!periodo.isRetardatario && periodo.tipoEscolha === "Presencial") {
            const periodoAtualizado = {
              ...periodo,
              numeroSessao: contadorSessaoPresencial,
              sessao: `Sessão ${contadorSessaoPresencial}`
            };
            contadorSessaoPresencial++;
            return periodoAtualizado;
          } else if (!periodo.isRetardatario && periodo.tipoEscolha === "Online") {
            const periodoAtualizado = {
              ...periodo,
              numeroSessao: contadorSessaoOnline,
              sessao: `Sessão ${contadorSessaoOnline}`
            };
            contadorSessaoOnline++;
            return periodoAtualizado;
          }
          return periodo;
        });
      });

      // Combinar todos os grupos em uma lista única
      const periodosFinais: PeriodoItem[] = [];
      Object.keys(periodosAgrupados).forEach(cargo => {
        periodosFinais.push(...periodosAgrupados[cargo]);
      });
      return periodosFinais;
    });
    
    // Incrementar contador de sessão apenas se não for retardatário
    if (!isRetardatario) {
      setContadorSessao(prev => prev + numeroSessoes);
    }
    
    // Limpar campos após adicionar
    handleReset();
    setIsRetardatario(false);
    
    // Definir qual cargo deve ser expandido na tabela
    setCargoParaExpandir(nomeCargo);
    
    // Fechar o card de agenda após adicionar período
    setAgendaAberto(null);
  };

  // Função para salvar todas as agendas no backend
  const salvarAgendasNoBackend = async (): Promise<boolean> => {
    if (!uuid || !processoConvocacaoData || periodosList.length === 0) {
      return true;
    }

    try {
      setAgendasLoading(true);
      const todasAgendas: IAgendaCreate[] = periodosList.map(periodo => 
        mapPeriodoItemToAgendaCreate(
          periodo,
          uuid,
          processoConvocacaoData.concurso_nome || 'Processo de Convocação'
        )
      );

      const resultados: IAgenda[] = await postAgendaMutation.mutateAsync(todasAgendas);
      
      // Atualizar os períodos com os UUIDs retornados do backend
      setPeriodosList(prev => {
        return prev.map((periodo, index) => {
          if (periodo.uuid) {
            const resultado = resultados.find(r => r.uuid === periodo.uuid);
            if (resultado) {
              return {
                ...periodo,
                uuid: resultado.uuid,
              };
            }
            return periodo;
          }

          if (resultados[index]) {
            return {
              ...periodo,
              uuid: resultados[index].uuid,
            };
          }
          return periodo;
        });
      });

      return true;
    } catch (error: any) {
      console.error('Erro ao salvar agendas:', error);
      notification.error({
        message: 'Erro ao Salvar Agendas',
        description: error?.message || 'Ocorreu um erro ao salvar as agendas. Tente novamente.',
        placement: 'top',
        duration: 3.5,
      });
      return false;
    } finally {
      setAgendasLoading(false);
    }
  };

  // Função para atualizar período na tabela
  const handleUpdatePeriodo = (id: number, updates: Partial<PeriodoItem>) => {
    setPeriodosList(prev => {
      // Encontrar o período que está sendo atualizado
      const periodoAtual = prev.find(p => p.id === id);
      if (!periodoAtual) return prev;

      // Se não há mudança na classificação, apenas atualizar normalmente
      if (!updates.classificacao || updates.classificacao === periodoAtual.classificacao) {
        return prev.map(periodo => {
          if (periodo.id === id) {
            return { ...periodo, ...updates };
          }
          return periodo;
        });
      }

      // Encontrar todos os períodos do mesmo cargo, ordenados por data e horário
      const periodosMesmoCargo = prev
        .filter(p => p.cargo === periodoAtual.cargo)
        .sort((a, b) => {
          // Ordenar por data e depois por horário
          if (a.dataEscolha !== b.dataEscolha) {
            return a.dataEscolha.localeCompare(b.dataEscolha);
          }
          return a.horario.localeCompare(b.horario);
        });

      // Encontrar o índice do período atual na lista ordenada
      const indiceAtual = periodosMesmoCargo.findIndex(p => p.id === id);
      
      // Se não há próximo período, apenas atualizar o atual
      if (indiceAtual === -1 || indiceAtual >= periodosMesmoCargo.length - 1) {
        return prev.map(periodo => {
          if (periodo.id === id) {
            return { ...periodo, ...updates };
          }
          return periodo;
        });
      }

      // Encontrar o próximo período do mesmo cargo
      const proximoPeriodo = periodosMesmoCargo[indiceAtual + 1];
      
      // Calcular a diferença na classificação
      const diferenca = periodoAtual.classificacao - updates.classificacao;

      // Calcular o novo valor de classificação para o próximo período
      const novaClassificacaoProximo = proximoPeriodo.classificacao + diferenca;
      
      // Se a diferença for menor ou igual a 0, apenas atualizar o período atual
      if (diferenca <= 0) {
        return prev.map(periodo => {
          if (periodo.id === id) {
            return { ...periodo, ...updates };
          } else if (periodo.id === proximoPeriodo.id) {
            // Atualizar o próximo período com a classificação ajustada
            return { 
              ...periodo, 
              classificacao: parseInt(novaClassificacaoProximo.toString()) 
            };
          }
          return periodo;
        });
      }

      // Atualizar ambos os períodos
      return prev.map(periodo => {
        if (periodo.id === id) {
          // Atualizar o período atual
          return { ...periodo, ...updates };
        } else if (periodo.id === proximoPeriodo.id) {
          // Atualizar o próximo período com a classificação ajustada
          return { 
            ...periodo, 
            classificacao: parseInt(novaClassificacaoProximo.toString()) 
          };
        }
        return periodo;
      });
    });
  };

  // Função para remover período da tabela e reordenar sessões
  const handleRemoverPeriodo = async (id: number) => {
    const periodoParaRemover = periodosList.find(p => p.id === id);
    
    // Deletar do backend se tiver UUID
    if (periodoParaRemover?.uuid) {
      try {
        setAgendasLoading(true);
        await deleteAgendaMutation.mutateAsync(periodoParaRemover.uuid);
        
      } catch (error: any) {
        console.error('Erro ao deletar agenda:', error);
        return;
      } finally {
        setAgendasLoading(false);
      }
    }

    setPeriodosList(prev => {
      const periodosRestantes = prev.filter(periodo => periodo.id !== id);
      
      const sessoesPresenciais = periodosRestantes.filter(p => !p.isRetardatario && p.tipoEscolha === "Presencial");
      const sessoesOnline = periodosRestantes.filter(p => !p.isRetardatario && p.tipoEscolha === "Online");
      const retardatarios = periodosRestantes.filter(p => p.isRetardatario);
      
      const sessoesPresenciaisReordenadas = sessoesPresenciais.map((periodo, index) => ({
        ...periodo,
        numeroSessao: index + 1,
        sessao: `Sessão ${index + 1}`
      }));
      
      const sessoesOnlineReordenadas = sessoesOnline.map((periodo, index) => ({
        ...periodo,
        numeroSessao: index + 1,
        sessao: `Sessão ${index + 1}`
      }));
      
      const periodosComSessaoReordenada = [...sessoesPresenciaisReordenadas, ...sessoesOnlineReordenadas, ...retardatarios];
      
      const periodosOrdenados = periodosComSessaoReordenada.sort((a, b) => {
        const dataA = a.dataEscolhaOriginal;
        const dataB = b.dataEscolhaOriginal;
        
        if (dataA && dataB) {
          const comparacaoData = dataA.diff(dataB, 'day');
          if (comparacaoData !== 0) {
            return comparacaoData;
          }
          
          const horaA = a.horaInicioOriginal;
          const horaB = b.horaInicioOriginal;
          
          if (horaA && horaB) {
            return horaA.diff(horaB, 'minute');
          }
        }
        
        return 0;
      });

      let contadorSessaoPresencial = 1;
      let contadorSessaoOnline = 1;
      const periodosComSessaoCronologica = periodosOrdenados.map(periodo => {
        if (!periodo.isRetardatario && periodo.tipoEscolha === "Presencial") {
          const periodoAtualizado = {
            ...periodo,
            numeroSessao: contadorSessaoPresencial,
            sessao: `Sessão ${contadorSessaoPresencial}`
          };
          contadorSessaoPresencial++;
          return periodoAtualizado;
        } else if (!periodo.isRetardatario && periodo.tipoEscolha === "Online") {
          const periodoAtualizado = {
            ...periodo,
            numeroSessao: contadorSessaoOnline,
            sessao: `Sessão ${contadorSessaoOnline}`
          };
          contadorSessaoOnline++;
          return periodoAtualizado;
        }
        return periodo;
      });
      
      setContadorSessao(Math.max(contadorSessaoPresencial, contadorSessaoOnline));
      
      setTimeout(() => {
        setValue('quantidadeClassificados', watchedFields.quantidadeClassificados);
      }, 0);
      
      return periodosComSessaoCronologica;
    });
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const limparExpansao = () => {
    setCargoParaExpandir(null);
  };

  const calcularIntervaloClassificacao = (periodo: PeriodoItem): string => {
    if (periodo.isRetardatario) {
      return "-";
    }
    
    const periodosMesmoCargo = periodosList
      .filter(p => p.cargo === periodo.cargo)
      .sort((a, b) => {
        // Ordenar por data e depois por horário
        if (a.dataEscolha !== b.dataEscolha) {
          return a.dataEscolha.localeCompare(b.dataEscolha);
        }
        return a.horario.localeCompare(b.horario);
      });
    
    // Calcular a posição do período atual na lista ordenada
    const indiceAtual = periodosMesmoCargo.findIndex(p => p.id === periodo.id);

    // Somar as quantidades dos períodos anteriores
    let somaAnterior = 0;
    for (let i = 0; i < indiceAtual; i++) {
      somaAnterior += periodosMesmoCargo[i].classificacao || 0;
    }

    const inicio = somaAnterior + 1;
    const fim = somaAnterior + (periodo.classificacao || 0);

    if (inicio === fim) {
      return `${inicio}ª`;
    } else {
      return `${inicio}ª até ${fim}ª`;
    }
  };

  // Função para verificar se o horário já existe na mesma data
  const verificarHorarioExistente = (key: number, horaInicio: string, horaFim: string): boolean => {
    const periodoAtual = periodosList.find(p => p.id === key);
    if (!periodoAtual) return false;

    return periodosList.some(periodo => {
      // Não verificar contra o próprio período
      if (periodo.id === key) return false;
      
      // Verificar se é a mesma data
      if (periodo.dataEscolha !== periodoAtual.dataEscolha) return false;
      
      // Verificar se o horário já existe
      const horarioExistente = periodo.horario;
      if (horarioExistente === "Online") return false; // Online não tem conflito de horário
      
      // Extrair horário existente
      const matchExistente = horarioExistente.match(/(\d{2}:\d{2})\s*às\s*(\d{2}:\d{2})/);
      if (!matchExistente) return false;
      
      const [, inicioExistente, fimExistente] = matchExistente;
      
      // Verificar sobreposição de horários
      const inicio1 = horaInicio;
      const fim1 = horaFim;
      const inicio2 = inicioExistente;
      const fim2 = fimExistente;
      
      // Converte para minutos para facilitar comparação
      const toMinutes = (time: string | number | undefined) => {
        if (!time || typeof time !== 'string') return 0;
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const inicio1Min = toMinutes(inicio1);
      const fim1Min = toMinutes(fim1);
      const inicio2Min = toMinutes(inicio2);
      const fim2Min = toMinutes(fim2);
      
      // Verifica se há sobreposição: um horário começa antes do outro terminar
      return (inicio1Min < fim2Min && fim1Min > inicio2Min);
    });
  };

  // Função para verificar conflito de horário em tempo real
  const verificarConflitoTempoReal = (key: number, horaInicio: string | number | undefined, horaFim: string | number | undefined): boolean => {
    if (!horaInicio || !horaFim || typeof horaInicio !== 'string' || typeof horaFim !== 'string') return false;
    return verificarHorarioExistente(key, horaInicio, horaFim);
  };

  // Função para verificar se um período está sendo editado
  const isEditing = (record: PeriodoItem) => record.id === editingKey;

  // Função para iniciar edição
  const edit = (record: PeriodoItem) => {
    setEditingKey(record.id);
  };

  // Função para cancelar edição
  const cancelEdit = () => {
    setEditingKey(null);
  };

  // Função para salvar edição (apenas em memória, sem fazer request)
  const saveEdit = (key: number, periodoDataItem: PeriodoItem, values: any) => {
    if (values.classificacao) {
      // Se for tipo Presencial, verificar horários
      if (periodoDataItem?.tipoEscolha === "Presencial") {
        if (!values.horaInicio || !values.horaFim) {
          return { success: false, message: 'Horários são obrigatórios para tipo Presencial.' };
        }
        
        // Verificar se o horário já existe na mesma data
        if (verificarHorarioExistente(key, values.horaInicio, values.horaFim)) {
          return { success: false, message: 'Este horário já existe na mesma data. Escolha outro horário.' };
        }
      }
      
      let horarioFormatado: string;
      let horaInicioOriginal: any = null;
      let horaFimOriginal: any = null;
      
      if (periodoDataItem?.tipoEscolha === "Presencial" && values.horaInicio && values.horaFim) {
        horarioFormatado = `${values.horaInicio} às ${values.horaFim}`;
        try {
          horaInicioOriginal = dayjs(`2000-01-01 ${values.horaInicio}`);
          horaFimOriginal = dayjs(`2000-01-01 ${values.horaFim}`);
        } catch (e) {
          console.error('Erro ao criar objetos dayjs:', e);
        }
      } else {
        horarioFormatado = periodoDataItem?.tipoEscolha === "Online" ? "Online" : (periodoDataItem?.horario || "—");
      }
      
      const updates = { 
        horaInicio: values.horaInicio,
        horaFim: values.horaFim,
        horario: horarioFormatado,
        horaInicioOriginal: horaInicioOriginal,
        horaFimOriginal: horaFimOriginal,
        classificacao: parseInt(values.classificacao)
      };
      handleUpdatePeriodo(key, updates);
      
      setEditingKey(null);
      return { success: true };
    }
    return { success: false, message: 'Classificação é obrigatória.' };
  };

  const handleSubmitAgenda = async (data: IAgendaFields) => {
    // Aqui você pode adicionar a lógica para processar os dados da agenda
    return data;
  };

  // Função para carregar dados do step anterior (cargos do backend)
  const carregarDadosDoStepAnterior = async () => {
    if (!uuid || !processoConvocacaoData) return;

    try {
      const cargos = await getCargosProcesso(uuid).response;

      const cargosConvertidos: CargoAdicionado[] = cargos.map((cargo: any) => ({
        uuid: cargo.cargo_uuid,
        nome: cargo.nome,
        vagas: cargo.vagas || 0,
        geral: cargo.geral || 0,
        pcd: cargo.pcd || 0,
        nna: cargo.nna || 0,
        totalCandidatos: cargo.total_candidatos || 0,
      }));

      setCargosAdicionados(cargosConvertidos);
      const novasVagasInfo = calcularVagasInfo(cargosConvertidos);
      setVagasInfo(novasVagasInfo);
    } catch (error: any) {
      console.error('Erro ao carregar cargos do step anterior:', error);
      if (error?.response?.status !== 404) {
        notification.error({
          message: 'Erro ao carregar cargos',
          description: error?.message || 'Não foi possível carregar os cargos do servidor.',
          placement: 'top',
          duration: 3.5,
        });
      }
      setCargosAdicionados([]);
      setVagasInfo({ totalGeral: 0, totalPcd: 0, totalNna: 0 });
    }
  };

  // Hook para buscar agendas do backend
  const { agendasData, agendasIsLoading } = useGetAgendas(
    uuid && processoConvocacaoData
      ? {
          pagination: { page: 1, page_size: 100 },
          filters: {
            processo_convocacao_uuid: uuid,
          },
        }
      : undefined
  );

  // Carregar dados quando o componente montar e processoConvocacaoData estiver disponível (sem useEffect)
  const carregarStepAnteriorState = useRef<{
    uuid?: string;
    processoUuid?: string;
  }>({});

  const shouldCarregarStepAnterior =
    !!uuid && !!processoConvocacaoData && !processoConvocacaoIsLoading;

  if (shouldCarregarStepAnterior) {
    const processoUuidAtual = processoConvocacaoData?.concurso_uuid || "";
    const depsMudaram =
      carregarStepAnteriorState.current.uuid !== uuid ||
      carregarStepAnteriorState.current.processoUuid !== processoUuidAtual;

    if (depsMudaram) {
      carregarStepAnteriorState.current = {
        uuid,
        processoUuid: processoUuidAtual,
      };
      Promise.resolve().then(() => {
        carregarDadosDoStepAnterior();
      });
    }
  } else if (carregarStepAnteriorState.current.uuid || carregarStepAnteriorState.current.processoUuid) {
    carregarStepAnteriorState.current = {};
  }

  const agendasUuidsString = agendasData?.results 
    ? JSON.stringify(agendasData.results.map(a => a.uuid).sort())
    : null;

  // Sincronizar periodosList com agendasData sem useEffect
  const agendasSyncState = useRef<string | null>(null);

  if (agendasUuidsString !== agendasSyncState.current) {
    agendasSyncState.current = agendasUuidsString;

    if (agendasData?.results && agendasData.results.length > 0) {
      const periodos = agendasData.results.map(mapAgendaToPeriodoItem);

      Promise.resolve().then(() => {
        setPeriodosList(prev => {
          const currentUuids = new Set(prev.filter(p => p.uuid).map(p => p.uuid));
          const newUuids = new Set(periodos.filter(p => p.uuid).map(p => p.uuid));

          if (
            currentUuids.size === newUuids.size &&
            currentUuids.size > 0 &&
            [...currentUuids].every(uuid => newUuids.has(uuid))
          ) {
            return prev;
          }

          return periodos;
        });
      });
    } else if (agendasData?.results && agendasData.results.length === 0) {
      Promise.resolve().then(() => {
        setPeriodosList(prev => {
          const hasExistingWithUuid = prev.some(p => p.uuid);
          if (hasExistingWithUuid) {
            return [];
          }
          return prev;
        });
      });
    }
  }

  // Atualizar estado de loading sem useEffect
  const agendasLoadingState = useRef(agendasIsLoading);
  if (agendasLoadingState.current !== agendasIsLoading) {
    agendasLoadingState.current = agendasIsLoading;
    Promise.resolve().then(() => {
      setAgendasLoading(agendasIsLoading);
    });
  }

  // Limpar agenda aberto quando cargo é excluído (sem useEffect)
  const limparAgendaAbertaState = useRef(false);
  if (
    agendaAberto &&
    !cargosAdicionados.find(c => c.uuid === agendaAberto.cargoUuid) &&
    !limparAgendaAbertaState.current
  ) {
    limparAgendaAbertaState.current = true;
    Promise.resolve().then(() => {
      setAgendaAberto(null);
      limparAgendaAbertaState.current = false;
    });
  }

  // Função para lidar com o clique no botão Agendar (apenas abrir card)
  const handleAgendarCargo = (cargoUuid: string) => {
    const cargo = cargosAdicionados.find(c => c.uuid === cargoUuid);
    
    if (cargo) {
      // Sempre abre o card (sobrescreve o anterior se houver)
      setAgendaAberto({
        cargoUuid,
        cargo
      });
      
      // Definir automaticamente o cargo no formulário
      setValue('cargoAgenda', cargoUuid);
    }
  };

  // Função para fechar o card de agenda
  const handleFecharAgenda = () => {
    setAgendaAberto(null);
  };


  return {
    processoConvocacaoData,
    processoConvocacaoIsLoading,
    concursoData,
    concursoIsLoading,
    cargosAdicionados,
    vagasInfo,
    handleAgendarCargo,
    agendaAberto,
    handleFecharAgenda,
    // Estados e funções específicas da agenda
    control,
    handleSubmit: handleSubmit(handleSubmitAgenda),
    handleReset,
    formErrors,
    watch,
    setValue,
    dayjs,
    isRetardatario,
    setIsRetardatario,
    periodosList,
    setPeriodosList,
    contadorSessao,
    watchedFields,
    getErrorMessage,
    isAgendaComplete,
    isBotaoAdicionarHabilitado,
    handleAdicionarPeriodo,
    handleRemoverPeriodo,
    handleUpdatePeriodo,
    // Funções de edição e cálculo
    editingKey,
    isEditing,
    edit,
    cancelEdit,
    saveEdit,
    calcularIntervaloClassificacao,
    verificarHorarioExistente,
    verificarConflitoTempoReal,
    // Estados e funções para expansão automática
    cargoParaExpandir,
    limparExpansao,
    agendasLoading,
    salvarAgendasNoBackend,
    uuid,
  };
};
