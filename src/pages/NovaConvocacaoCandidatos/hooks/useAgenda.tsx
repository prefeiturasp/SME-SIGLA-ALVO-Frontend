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
    classificacaoInicio: null,
    classificacaoFim: null,
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

  // Função para verificar se todos os campos da agenda estão preenchidos
  const isAgendaComplete = () => {
    return watchedFields.tipoEscolha && 
           watchedFields.cargoAgenda && 
           watchedFields.escolhaEm && 
           watchedFields.nomeacaoEm && 
           watchedFields.classificacaoInicio && 
           watchedFields.classificacaoFim && 
           watchedFields.horaInicio && 
           watchedFields.horaFim;
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
    
    // Determinar o nome da sessão
    let nomeSessao;
    if (isRetardatario) {
      nomeSessao = "Retardatário";
    } else {
      nomeSessao = `Sessão ${contadorSessao}`;
      setContadorSessao(prev => prev + 1); // Incrementar contador para próxima sessão normal
    }
    
    const novoPeriodo = {
      id: Date.now(), // ID único baseado no timestamp
      cargo: nomeCargo, // Usar o nome do cargo em vez do ID
      convocacao: "Alternância e proporcionalidade",
      dataEscolha: watchedFields.escolhaEm?.format('DD/MM/YYYY'),
      dataEscolhaOriginal: watchedFields.escolhaEm, // Manter a data original para ordenação
      sessao: nomeSessao,
      isRetardatario: isRetardatario, // Flag para identificar se é retardatário
      numeroSessao: isRetardatario ? null : contadorSessao, // Número da sessão para reordenação
      horario: `${watchedFields.horaInicio?.format('HH:mm')} às ${watchedFields.horaFim?.format('HH:mm')}`,
      horaInicioOriginal: watchedFields.horaInicio, // Manter hora original para ordenação
    };
    
    setPeriodosList(prev => {
      const novaLista = [...prev, novoPeriodo];
      
      // Ordenar cronologicamente por data e depois por horário
      const periodosOrdenados = novaLista.sort((a, b) => {
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

      // Após ordenação cronológica, reordenar as sessões normais na ordem cronológica
      let contadorSessaoAtual = 1;
      return periodosOrdenados.map(periodo => {
        if (!periodo.isRetardatario) {
          const periodoAtualizado = {
            ...periodo,
            numeroSessao: contadorSessaoAtual,
            sessao: `Sessão ${contadorSessaoAtual}`
          };
          contadorSessaoAtual++;
          return periodoAtualizado;
        }
        return periodo;
      });
    });
    
    // Limpar campos após adicionar
    handleReset();
    setIsRetardatario(false);
  };

  // Função para remover período da tabela e reordenar sessões
  const handleRemoverPeriodo = (id: number) => {
    setPeriodosList(prev => {
      // Filtrar o período removido
      const periodosRestantes = prev.filter(periodo => periodo.id !== id);
      
      // Separar sessões normais e retardatários
      const sessoesNormais = periodosRestantes.filter(p => !p.isRetardatario);
      const retardatarios = periodosRestantes.filter(p => p.isRetardatario);
      
      // Reordenar apenas as sessões normais
      const sessoesNormaisReordenadas = sessoesNormais.map((periodo, index) => ({
        ...periodo,
        numeroSessao: index + 1,
        sessao: `Sessão ${index + 1}`
      }));
      
      // Combinar novamente (sessões normais reordenadas + retardatários)
      const periodosComSessaoReordenada = [...sessoesNormaisReordenadas, ...retardatarios];
      
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

      // Após ordenação cronológica, reordenar as sessões normais na ordem cronológica
      let contadorSessaoAtual = 1;
      const periodosComSessaoCronologica = periodosOrdenados.map(periodo => {
        if (!periodo.isRetardatario) {
          const periodoAtualizado = {
            ...periodo,
            numeroSessao: contadorSessaoAtual,
            sessao: `Sessão ${contadorSessaoAtual}`
          };
          contadorSessaoAtual++;
          return periodoAtualizado;
        }
        return periodo;
      });
      
      // Atualizar o contador de sessão para o próximo número
      setContadorSessao(contadorSessaoAtual);
      
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
  };
};
