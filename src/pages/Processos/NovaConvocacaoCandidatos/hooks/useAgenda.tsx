import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import dayjs from "dayjs";
import useAgendaSchema, { type IAgendaFields } from "../useAgendaSchema";

export type Option = { value: string; label: string };

export const useAgenda = (cargosDisponiveis: Option[]) => {
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

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IAgendaFields>({
    defaultValues,
    resolver: yupResolver(useAgendaSchema()) as Resolver<IAgendaFields>,
    reValidateMode: "onChange",
    mode: "all",
    shouldFocusError: false,
  });

  // Estados para controlar os períodos e sessões
  const [isRetardatario, setIsRetardatario] = useState(false);
  const [periodosList, setPeriodosList] = useState<any[]>([]);
  const [contadorSessao, setContadorSessao] = useState(1);

  // Observar valores dos campos
  const watchedFields = watch();

  // Helper function para obter mensagem de erro
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return 'Erro de validação';
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

  // Função para verificar se todos os campos da agenda estão preenchidos
  const isAgendaComplete = () => {
    const camposObrigatorios = watchedFields.tipoEscolha && 
           watchedFields.cargoAgenda && 
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

  // Função para adicionar período à tabela
  const handleAdicionarPeriodo = async () => {
    // Verificar se há erros de validação
    const hasErrors = Object.keys(formErrors).length > 0;
    
    if (hasErrors) {
      return;
    }
    
    // Encontrar o nome do cargo baseado no ID selecionado
    const cargoSelecionado = cargosDisponiveis.find(cargo => cargo.value === watchedFields.cargoAgenda);
    const nomeCargo = cargoSelecionado ? cargoSelecionado.label : watchedFields.cargoAgenda;
    
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
    const novosPeriodos: any[] = [];
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

      const novoPeriodo = {
        id: Date.now() + i, // ID único baseado no timestamp + índice
        cargo: nomeCargo,
        classificacao: quantidadeClassificados, // Agora é um número inteiro
        dataEscolha: dataEscolhaFormatada,
        dataEscolhaOriginal: dataEscolhaOriginal,
        sessao: nomeSessao,
        isRetardatario: isRetardatario,
        numeroSessao: isRetardatario ? null : numeroSessaoAtual,
        horario: horario,
        horaInicioOriginal: watchedFields.horaInicio,
        horaInicio: watchedFields.horaInicio,
        horaFim: watchedFields.horaFim, 
        tipoEscolha: watchedFields.tipoEscolha,
      };
      console.log(novoPeriodo);
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
      }, {} as Record<string, any[]>);

      // Ordenar cada grupo cronologicamente
      Object.keys(periodosAgrupados).forEach(cargo => {
        periodosAgrupados[cargo].sort((a: any, b: any) => {
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
        periodosAgrupados[cargo] = periodosAgrupados[cargo].map((periodo: any) => {
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
      const periodosFinais: any[] = [];
      Object.keys(periodosAgrupados).forEach(cargo => {
        periodosFinais.push(...periodosAgrupados[cargo]);
      });
      console.log("periodosFinais", periodosFinais);
      return periodosFinais;
    });
    
    // Incrementar contador de sessão apenas se não for retardatário
    if (!isRetardatario) {
      setContadorSessao(prev => prev + numeroSessoes);
    }
    
    // Limpar campos após adicionar
    handleReset();
    setIsRetardatario(false);
  };

  // Função para atualizar período na tabela
  const handleUpdatePeriodo = (id: number, updates: Partial<any>) => {
    setPeriodosList(prev => {
      // Encontrar o período que está sendo atualizado
      const periodoAtual = prev.find(p => p.id === id);
      console.log("1");
      if (!periodoAtual) return prev;

      // Se não há mudança na classificação, apenas atualizar normalmente
      console.log("2");
      console.log("updates", updates);
      console.log("periodoAtual", periodoAtual);
      if (!updates.classificacao || updates.classificacao === periodoAtual.classificacao) {
        return prev.map(periodo => {
          console.log("3");
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
      console.log("4");
      if (diferenca <= 0) {
        return prev.map(periodo => {
          console.log("5");
          if (periodo.id === id) {
            return { ...periodo, ...updates };
          } else if (periodo.id === proximoPeriodo.id) {
            console.log("Proximo periodo", proximoPeriodo);
            console.log("Nova classificação do próximo:", novaClassificacaoProximo);
            // Atualizar o próximo período com a classificação ajustada
            return { 
              ...periodo, 
              classificacao: parseInt(novaClassificacaoProximo) 
            };
          }
          return periodo;
        });
      }

      

      console.log("Ajuste automático:");
      console.log("Período atual:", periodoAtual.cargo, "Sessão:", periodoAtual.sessao);
      console.log("Classificação anterior:", periodoAtual.classificacao);
      console.log("Nova classificação:", updates.classificacao);
      console.log("Diferença:", diferenca);
      console.log("Próximo período:", proximoPeriodo.cargo, "Sessão:", proximoPeriodo.sessao);
      console.log("Classificação anterior do próximo:", proximoPeriodo.classificacao);
      console.log("Nova classificação do próximo:", novaClassificacaoProximo);
      console.log("proximoPeriodo", proximoPeriodo);
      // Atualizar ambos os períodos
      return prev.map(periodo => {
        if (periodo.id === id) {
          // Atualizar o período atual
          return { ...periodo, ...updates };
        } else if (periodo.id === proximoPeriodo.id) {
          console.log("Proximo periodo", proximoPeriodo);
          console.log("Nova classificação do próximo:", novaClassificacaoProximo);
          // Atualizar o próximo período com a classificação ajustada
          return { 
            ...periodo, 
            classificacao: parseInt(novaClassificacaoProximo) 
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
      
      return periodosComSessaoCronologica;
    });
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const handleSubmitAgenda = async (data: IAgendaFields) => {
    // Aqui você pode adicionar a lógica para processar os dados da agenda
    console.log("Dados da agenda:", data);
    return data;
  };

  return {
    control,
    handleSubmit: handleSubmit(handleSubmitAgenda),
    handleReset,
    formErrors,
    watch,
    setValue,
    dayjs,
    // Estados e funções específicas da agenda
    isRetardatario,
    setIsRetardatario,
    periodosList,
    setPeriodosList,
    contadorSessao,
    watchedFields,
    getErrorMessage,
    isAgendaComplete,
    handleAdicionarPeriodo,
    handleRemoverPeriodo,
    handleUpdatePeriodo,
  };
};
