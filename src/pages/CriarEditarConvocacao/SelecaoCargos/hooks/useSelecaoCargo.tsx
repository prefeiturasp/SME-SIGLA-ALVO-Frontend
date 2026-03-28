import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useGetProcessosConvocacaoPorUUID } from "./useGetProcessosConvocacaoPorUUID";
import { useGetConcursoByUuid } from "./useGetConcursosPorUuid";
import { useGetCargo } from "./useGetCargo";
import { useDeleteCargoProcesso } from "./useDeleteCargoProcesso";
import { usePatchConvocarCandidatosHabilitados, usePatchDesconvocarCandidatosHabilitados } from "./usePatchConvocarCandidatosHabilitados";
import { usePostCargo } from "./usePostCargo";

export type CargosDisponiveisOption = {
  value: string;
  label: string;
  codigo: string;
};

export type CargoAdicionado = {
  cargo_uuid: string;
  uuid?: string;
  cargo_nome: string;
  cargo_codigo?: string;
  vagas: number;
  candidatos_geral: number;
  candidatos_pcd: number;
  candidatos_nna: number;
  totalCandidatos: number;
  candidatos_uuids?: string[];
};

export type VagasInfo = {
  totalGeral: number;
  totalPcd: number;
  totalNna: number;
};

export const useSelecaoCargo = () => {
  const { uuid } = useParams<{ uuid: string }>();
  
  const [cargoSelecionado, setCargoSelecionado] = useState<string | undefined>();
  const [cargosDisponiveis, setCargosDisponiveis] = useState<CargosDisponiveisOption[]>([]);
  const [modalSelecionarCandidatosVisible, setModalSelecionarCandidatosVisible] = useState(false);
  const [ultimoCargoSelecionado, setUltimoCargoSelecionado] = useState<CargoAdicionado | null>(null);
  
  const { processoConvocacaoData, processoConvocacaoIsLoading } = useGetProcessosConvocacaoPorUUID(uuid!);
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(processoConvocacaoData?.concurso_uuid || '');
  
  // Hooks para gerenciar cargos
  const { cargosData, carregarCargos } = useGetCargo(
    uuid,
    !!uuid && !!processoConvocacaoData && !processoConvocacaoIsLoading
  );
  const postCargoMutation = usePostCargo();
  const deleteCargoMutation = useDeleteCargoProcesso();
  const patchCandidatosHabilitadosConvocadosMutation = usePatchConvocarCandidatosHabilitados();
  const patchCandidatosHabilitadosDesconvocadosMutation = usePatchDesconvocarCandidatosHabilitados();

  // Função para calcular informações de vagas
  const calcularVagasInfo = (cargos: CargoAdicionado[]) => {
    // Totais por categoria
    const totalGeral = cargos.reduce((acc, cargo) => acc + cargo.candidatos_geral, 0);
    const totalPcd = cargos.reduce((acc, cargo) => acc + cargo.candidatos_pcd, 0);
    const totalNna = cargos.reduce((acc, cargo) => acc + cargo.candidatos_nna, 0);

    return {
      totalGeral,
      totalPcd,
      totalNna,
    };
  };

  // Calcular valores iniciais baseados em cargosData usando useMemo (substitui useEffect)
  const cargosIniciais = useMemo(() => {
    if (cargosData && cargosData.length > 0) {
      return cargosData.map((cargo: any) => ({
        cargo_uuid: cargo.cargo_uuid,
        uuid: cargo.uuid,
        cargo_nome: cargo.cargo_nome,
        vagas: cargo.vagas || 0,
        candidatos_geral: cargo.candidatos_geral || 0,
        candidatos_pcd: cargo.candidatos_pcd || 0,
        candidatos_nna: cargo.candidatos_nna || 0,
        totalCandidatos: cargo.total_candidatos || 0,
        candidatos_uuids: cargo.candidatos_uuids || [],
      }));
    } else if (cargosData && cargosData.length === 0) {
      return [];
    }
    return [];
  }, [cargosData]);

  const vagasInfoInicial = useMemo(() => {
    if (cargosIniciais.length > 0) {
      return calcularVagasInfo(cargosIniciais);
    }
    return { totalGeral: 0, totalPcd: 0, totalNna: 0 };
  }, [cargosIniciais]);

  // Inicializar estados com valores calculados via useMemo
  const cargosIniciaisRef = useRef(cargosIniciais);
  const [cargosAdicionados, setCargosAdicionados] = useState<CargoAdicionado[]>(cargosIniciais);
  const [vagasInfo, setVagasInfo] = useState<VagasInfo>(vagasInfoInicial);

  // Atualizar estados quando cargosIniciais mudar (usando useEffect para evitar loops)
  useEffect(() => {
    if (cargosIniciaisRef.current !== cargosIniciais) {
      cargosIniciaisRef.current = cargosIniciais;
      setCargosAdicionados(cargosIniciais);
      setVagasInfo(vagasInfoInicial);
    }
  }, [cargosIniciais, vagasInfoInicial]);

  // Popular select de cargos quando os dados forem carregados
  useEffect(() => {
    if (concursoData?.cargos) {
      setCargosDisponiveis(concursoData.cargos.map((cargo: any) => ({
        value: cargo.uuid,
        label: cargo.nome,
        codigo: cargo.codigo,
      })));
    }
  }, [concursoData]);

  const handleCargoChange = (value: string) => {
    setCargoSelecionado(value);
  };

  const handleBuscarCandidatos = () => {
    if (cargoSelecionado) {
      if (!ultimoCargoSelecionado || ultimoCargoSelecionado.uuid !== cargoSelecionado) {
        setUltimoCargoSelecionado(null);
      }
      setModalSelecionarCandidatosVisible(true);
    }
  };

  const handleCloseModalSelecionarCandidatos = () => {
    setModalSelecionarCandidatosVisible(false);
  };

  const handleCandidatosSelecionados = (quantidade: number, quantidadesIndividuais: { geral: number; pcd: number; nna: number }, vagas: number, candidatosUuids: string[] = []) => {
    if (cargoSelecionado) {
      const cargoInfo = cargosDisponiveis.find(c => c.value === cargoSelecionado);
      if (cargoInfo) {
        // Verificar se o cargo já existe e atualizar ou adicionar
        setCargosAdicionados(prev => {
          const existeIndex = prev.findIndex(c => c.cargo_uuid === cargoSelecionado);
          const cargoExistente = existeIndex >= 0 ? prev[existeIndex] : null;
          
          
          const novoCargo: CargoAdicionado = {
            cargo_uuid: cargoSelecionado,
            cargo_nome: cargoInfo.label,
            cargo_codigo: cargoInfo.codigo,
            vagas: vagas,
            candidatos_geral: quantidadesIndividuais.geral,
            candidatos_pcd: quantidadesIndividuais.pcd,
            candidatos_nna: quantidadesIndividuais.nna,
            totalCandidatos: quantidade,
            // Usar os UUIDs passados ou preservar os existentes
            candidatos_uuids: candidatosUuids.length > 0 ? candidatosUuids : (cargoExistente?.candidatos_uuids || [])
          };
          
          let updated;
          if (existeIndex >= 0) {
            // Atualizar cargo existente, mantendo uuid e usando os UUIDs passados ou preservando os existentes
            updated = [...prev];
            updated[existeIndex] = {
              ...novoCargo,
              uuid: prev[existeIndex].uuid,
              // Usar os UUIDs passados se houver, senão preservar os existentes
              candidatos_uuids: candidatosUuids.length > 0 ? candidatosUuids : (prev[existeIndex].candidatos_uuids || [])
            };
          } else {
            // Adicionar novo cargo
            updated = [...prev, novoCargo];
          }
          
          
          // Atualizar informações de vagas
          const novasVagasInfo = calcularVagasInfo(updated);
          setVagasInfo(novasVagasInfo);
          
          // Atualizar último cargo selecionado
          setUltimoCargoSelecionado(updated[existeIndex >= 0 ? existeIndex : updated.length - 1]);
          
          return updated;
        });
      }
    }
    
    // Limpar seleção e fechar modal
    setCargoSelecionado(undefined);
    setModalSelecionarCandidatosVisible(false);
  };

  // Função para atualizar UUIDs de candidatos para um cargo específico
  const handleCandidatosUuidsChange = useCallback((cargoUuid: string, uuids: string[]) => {
    console.log(uuids)
    setCargosAdicionados(prev => {
      // Verificar se realmente precisa atualizar (evitar atualizações desnecessárias)
      const cargoAtual = prev.find(c => c.cargo_uuid === cargoUuid);
      if (cargoAtual && JSON.stringify(cargoAtual.candidatos_uuids) === JSON.stringify(uuids)) {
        console.log('UUIDs são os mesmos, não atualizando');
        console.log(prev);
        return prev; // Não há mudança, retornar o mesmo array
      }
      
      const updated = prev.map(cargo => {
        if (cargo.cargo_uuid === cargoUuid) {
          console.log('Atualizando UUIDs do cargo:', cargo.cargo_nome, 'de', cargo.candidatos_uuids, 'para', uuids);
          return {
            ...cargo,
            candidatos_uuids: uuids
          };
        }
        return cargo;
      });
      
      return updated;
    });
  }, []);

  const handleEditarCargo = (cargo: CargoAdicionado) => {
    setCargoSelecionado(cargo.cargo_uuid);
    setUltimoCargoSelecionado(cargo);
    setModalSelecionarCandidatosVisible(true);
  };

  const handleExcluirCargo = (cargoUuid: string, _candidatoUuids?: string[], cargoDataUuid?: string) => {
    setCargosAdicionados(prev => {
      const updated = prev.filter(c => c.uuid !== cargoUuid);
      
      // Atualizar informações de vagas
      const novasVagasInfo = calcularVagasInfo(updated);
      setVagasInfo(novasVagasInfo);
      
      // Se o cargo excluído era o último selecionado, atualizar
      if (ultimoCargoSelecionado?.uuid === cargoUuid) {
        const ultimoCargo = updated[updated.length - 1] || null;
        setUltimoCargoSelecionado(ultimoCargo);
      }
      
      return updated;
    });

    // Chamar DELETE no backend quando houver uuid de registro
    if (uuid && cargoUuid) {
      deleteCargoMutation.mutate({ processoUuid: uuid, cargoUuid });
    }

    const cargoInfo = cargosDisponiveis.find(c => c.value === cargoDataUuid);
    patchCandidatosHabilitadosDesconvocadosMutation.mutateAsync({
      codigo_cargo: cargoInfo?.codigo || "",
      processo_uuid: uuid || processoConvocacaoData?.uuid || "",
    });
  };
// Função para salvar cargos no backend
  const salvarCargosNoBackend = async (): Promise<boolean> => {
    if (!uuid || cargosAdicionados.length === 0) {
      return true;
    }

    try {
      // Verificar se houve alteração ou inclusão de novos cargos
      const houveMudanca = cargosAdicionados.some((cargoAtual) => {
        // Novo cargo (sem uuid do registro no backend)
        if (!cargoAtual.uuid) return true;
        // Buscar original pelo uuid (registro do backend)
        const original = cargosIniciaisRef.current.find((c) => c.uuid === cargoAtual.uuid);
        if (!original) return true;
        // Comparar campos relevantes
        return (
          original.cargo_uuid !== cargoAtual.cargo_uuid ||
          original.cargo_nome !== cargoAtual.cargo_nome ||
          original.vagas !== cargoAtual.vagas ||
          original.candidatos_geral !== cargoAtual.candidatos_geral ||
          original.candidatos_pcd !== cargoAtual.candidatos_pcd ||
          original.candidatos_nna !== cargoAtual.candidatos_nna ||
          original.totalCandidatos !== cargoAtual.totalCandidatos
        );
      });

      if (!houveMudanca) {
        return true;
      }

      const payload = cargosAdicionados.map(cargo => ({
        ...(cargo.uuid ? { uuid: cargo.uuid } : {}),
        cargo_nome: cargo.cargo_nome,
        cargo_uuid: cargo.cargo_uuid,
        cargo_codigo: cargo.cargo_codigo || (cargosDisponiveis.find(cd => cd.value === cargo.cargo_uuid)?.codigo) || undefined,
        vagas: cargo.vagas,
        candidatos_geral: cargo.candidatos_geral,
        candidatos_pcd: cargo.candidatos_pcd,
        candidatos_nna: cargo.candidatos_nna,
        total_candidatos: cargo.totalCandidatos,
        ...(cargo.candidatos_uuids && cargo.candidatos_uuids.length > 0 ? { candidatos_uuids: cargo.candidatos_uuids } : {}),
      })); 

      // TODO: Descomentar quando a API estiver pronta
      await postCargoMutation.mutateAsync({ processoUuid: uuid, payload: payload as any });
      return true;
    } catch (error: any) {
      console.error('Erro ao salvar cargos:', error);
      return false;
    }
  };

  // Convocar candidatos habilitados (bulk patch)
    const convocarCandidatosHabilitados = async (candidatoUuids?: string[], foiConvocado: boolean = true): Promise<boolean> => {
      try {
        console.log(candidatoUuids)
        const concursoUuid = processoConvocacaoData?.concurso_uuid || "";
        const processoUuid = uuid || processoConvocacaoData?.uuid || "";
        if (!concursoUuid || (candidatoUuids && candidatoUuids.length === 0)) return true;
        await patchCandidatosHabilitadosConvocadosMutation.mutateAsync({
          concurso_uuid: concursoUuid,
          processo_uuid: processoUuid,
          foi_convocado: foiConvocado,
          candidatos: candidatoUuids || [],
        });
        return true;
      } catch (error) {
        console.error('Erro ao convocar candidatos habilitados:', error);
        return false;
      }
    };


  return {
    processoConvocacaoData,
    processoConvocacaoIsLoading,
    concursoData,
    concursoIsLoading,
    cargosDisponiveis,
    handleCargoChange,
    modalSelecionarCandidatosVisible,
    handleBuscarCandidatos,
    handleCloseModalSelecionarCandidatos,
    handleCandidatosSelecionados,
    cargoSelecionado,
    cargosAdicionados,
    ultimoCargoSelecionado,
    vagasInfo,
    handleEditarCargo,
    handleExcluirCargo,
    salvarCargosNoBackend,
    convocarCandidatosHabilitados,
    handleCandidatosUuidsChange,
    salvandoCargos: postCargoMutation.isPending,
    carregarCargos,
    uuid
  };
};
