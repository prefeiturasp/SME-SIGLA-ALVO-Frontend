import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import { useGetProcessosConvocacaoPorUUID } from "../../SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID";
import { useGetConcursoByUuid } from "../../SelecaoCargos/hooks/useGetConcursosPorUuid";
import useAgendaSchema, { type IAgendaFields } from "./useAgendaSchema";

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
  cargo: string;
  classificacao: number;
  dataEscolha: string;
  sessao: string;
  horario: string;
  horaInicio?: string;
  horaFim?: string;
  isRetardatario?: boolean;
  tipoEscolha?: string;
  numeroSessao?: number;
  dataEscolhaOriginal?: any;
  horaInicioOriginal?: any;
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

  const { processoConvocacaoData, processoConvocacaoIsLoading } = useGetProcessosConvocacaoPorUUID(uuid!);
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(processoConvocacaoData?.concurso_uuid || '');

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
    
    // Calcular diferença em horas
    const diffHoras = horaFim.diff(horaInicio, 'hour');
    
    // Calcular início da sessão atual (sessão 1 = 0 horas de diferença, sessão 2 = diffHoras horas, etc.)
    const inicioSessao = horaInicio.add((numeroSessao - 1) * diffHoras, 'hour');
    const fimSessao = inicioSessao.add(diffHoras, 'hour');
    
    return `${inicioSessao.format('HH:mm')} às ${fimSessao.format('HH:mm')}`;
  };

  // Função para verificar se a quantidade de classificados está dentro do limite
  const isQuantidadeValida = () => {
    if (!agendaAberto || isRetardatario) return true;
    
    const quantidadeClassificados = watchedFields.quantidadeClassificados;
    const maxCandidatos = getMaxCandidatosDisponiveis();
    
    if (maxCandidatos && quantidadeClassificados && quantidadeClassificados > maxCandidatos) {
      return false; // Quantidade inválida - ultrapassa o limite
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

  // Função para adicionar período à tabela
  const handleAdicionarPeriodo = async () => {
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
      // Para Online, usar o range de datas
      const [dataInicio, dataFim] = watchedFields.escolhaEm;
      dataEscolhaFormatada = `${dataInicio?.format('DD/MM/YYYY')} a ${dataFim?.format('DD/MM/YYYY')}`;
      dataEscolhaOriginal = dataInicio; // Usar data de início para ordenação
    } else {
      // Para Presencial, usar data única
      dataEscolhaFormatada = watchedFields.escolhaEm?.format('DD/MM/YYYY');
      dataEscolhaOriginal = watchedFields.escolhaEm;
    }

    // Criar múltiplas entradas baseado no número de sessões
    const novosPeriodos: PeriodoItem[] = [];
    const numeroSessoes = watchedFields.sessao || 1;

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
        quantidadeClassificados = 0; // Retardatário não tem classificação
      } else {
        quantidadeClassificados = quantidadesPorSessao[i];
      }
      
      // Calcular horário baseado no tipo e número da sessão
      let horario: string;
      if (watchedFields.tipoEscolha === "Presencial") {
        if (numeroSessaoAtual === 1) {
          // Primeira sessão usa o horário original
          horario = `${watchedFields.horaInicio?.format('HH:mm')} às ${watchedFields.horaFim?.format('HH:mm')}`;
        } else {
          // Sessões subsequentes calculam automaticamente
          horario = calcularHorariosSessoes(watchedFields.horaInicio, watchedFields.horaFim, numeroSessaoAtual);
        }
      } else {
        // Para Online, não há horário específico
        horario = "Online";
      }

      const novoPeriodo: PeriodoItem = {
        id: Date.now() + i, // ID único baseado no timestamp + índice
        cargo: nomeCargo,
        classificacao: quantidadeClassificados,
        dataEscolha: dataEscolhaFormatada,
        dataEscolhaOriginal: dataEscolhaOriginal,
        sessao: nomeSessao,
        isRetardatario: isRetardatario,
        numeroSessao: isRetardatario ? undefined : numeroSessaoAtual,
        horario: horario,
        horaInicioOriginal: watchedFields.horaInicio,
        horaInicio: watchedFields.horaInicio?.format('HH:mm'),
        horaFim: watchedFields.horaFim?.format('HH:mm'), 
        tipoEscolha: watchedFields.tipoEscolha,
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
          // Primeiro ordena por data
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
  const handleRemoverPeriodo = (id: number) => {
    setPeriodosList(prev => {
      // Filtrar o período removido
      const periodosRestantes = prev.filter(periodo => periodo.id !== id);
      
      // Separar sessões normais, retardatários e online
      const sessoesPresenciais = periodosRestantes.filter(p => !p.isRetardatario && p.tipoEscolha === "Presencial");
      const sessoesOnline = periodosRestantes.filter(p => !p.isRetardatario && p.tipoEscolha === "Online");
      const retardatarios = periodosRestantes.filter(p => p.isRetardatario);
      
      // Reordenar as sessões presenciais
      const sessoesPresenciaisReordenadas = sessoesPresenciais.map((periodo, index) => ({
        ...periodo,
        numeroSessao: index + 1,
        sessao: `Sessão ${index + 1}`
      }));
      
      // Reordenar as sessões online
      const sessoesOnlineReordenadas = sessoesOnline.map((periodo, index) => ({
        ...periodo,
        numeroSessao: index + 1,
        sessao: `Sessão ${index + 1}`
      }));
      
      // Combinar novamente (sessões presenciais reordenadas + sessões online reordenadas + retardatários)
      const periodosComSessaoReordenada = [...sessoesPresenciaisReordenadas, ...sessoesOnlineReordenadas, ...retardatarios];
      
      // Ordenar cronologicamente após reordenação das sessões
      const periodosOrdenados = periodosComSessaoReordenada.sort((a, b) => {
        // Primeiro ordena por data
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

      // Após ordenação cronológica, reordenar as sessões na ordem cronológica
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
      
      // Atualizar o contador de sessão para o próximo número
      setContadorSessao(Math.max(contadorSessaoPresencial, contadorSessaoOnline));
      
      // Revalidar o formulário após remoção para atualizar os limites
      setTimeout(() => {
        // Trigger revalidation do campo quantidadeClassificados
        setValue('quantidadeClassificados', watchedFields.quantidadeClassificados);
      }, 0);
      
      return periodosComSessaoCronologica;
    });
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  // Função para limpar o estado de expansão
  const limparExpansao = () => {
    setCargoParaExpandir(null);
  };

  // Função para calcular o intervalo de classificação para um período específico
  const calcularIntervaloClassificacao = (periodo: PeriodoItem): string => {
    if (periodo.isRetardatario) {
      return "-";
    }
    
    // Encontrar todos os períodos do mesmo cargo que vêm antes do período atual
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

  // Função para salvar edição
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
      
      // Atualizar o período
      handleUpdatePeriodo(key, { 
        horaInicio: values.horaInicio,
        horaFim: values.horaFim,
        classificacao: parseInt(values.classificacao)
      });
      
      setEditingKey(null);
      return { success: true };
    }
    return { success: false, message: 'Classificação é obrigatória.' };
  };

  const handleSubmitAgenda = async (data: IAgendaFields) => {
    // Aqui você pode adicionar a lógica para processar os dados da agenda
    return data;
  };

  // Função para carregar dados do step anterior
  const carregarDadosDoStepAnterior = () => {
    // Por enquanto, manteremos dados simulados até implementar o store global
    const dadosSimulados: CargoAdicionado[] = [
      {
        uuid: "cargo-1",
        nome: "Professor de Matemática",
        vagas: 10,
        geral: 8,
        pcd: 1,
        nna: 1,
        totalCandidatos: 25
      },
      {
        uuid: "cargo-2", 
        nome: "Professor de Português",
        vagas: 5,
        geral: 4,
        pcd: 0,
        nna: 1,
        totalCandidatos: 15
      }
    ];

    setCargosAdicionados(dadosSimulados);
    const novasVagasInfo = calcularVagasInfo(dadosSimulados);
    setVagasInfo(novasVagasInfo);
  };

  // Carregar dados quando o componente montar
  useEffect(() => {
    carregarDadosDoStepAnterior();
  }, []);

  // Limpar agenda aberto quando cargo é excluído
  useEffect(() => {
    if (agendaAberto && !cargosAdicionados.find(c => c.uuid === agendaAberto.cargoUuid)) {
      setAgendaAberto(null);
    }
  }, [cargosAdicionados, agendaAberto]);

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
    uuid,
  };
};
