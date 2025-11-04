import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {useGetProcessosConvocacaoPorUUID} from "./useGetProcessosConvocacaoPorUUID";
import { useGetConcursoByUuid } from "./useGetConcursosPorUuid";

export type CargosDisponiveisOption = {
  value: string;
  label: string;
  codigo: string;
};

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

export const useSelecaoCargo = () => {
  const { uuid } = useParams<{ uuid: string }>();
  
  const [cargoSelecionado, setCargoSelecionado] = useState<string | undefined>();
  const [cargosDisponiveis, setCargosDisponiveis] = useState<CargosDisponiveisOption[]>([]);
  const [modalSelecionarCandidatosVisible, setModalSelecionarCandidatosVisible] = useState(false);
  const [cargosAdicionados, setCargosAdicionados] = useState<CargoAdicionado[]>([]);
  const [ultimoCargoSelecionado, setUltimoCargoSelecionado] = useState<CargoAdicionado | null>(null);
  const [vagasInfo, setVagasInfo] = useState<VagasInfo>({
    totalGeral: 0,
    totalPcd: 0,
    totalNna: 0,
  });
  const { processoConvocacaoData, processoConvocacaoIsLoading } = useGetProcessosConvocacaoPorUUID(uuid!);
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(processoConvocacaoData?.concurso_uuid || '');

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

  // Função para calcular informações de vagas
  const calcularVagasInfo = (cargos: CargoAdicionado[]) => {
    // Totais por categoria
    const totalGeral = cargos.reduce((acc, cargo) => acc + cargo.geral, 0);
    const totalPcd = cargos.reduce((acc, cargo) => acc + cargo.pcd, 0);
    const totalNna = cargos.reduce((acc, cargo) => acc + cargo.nna, 0);

    return {
      totalGeral,
      totalPcd,
      totalNna,
    };
  };

  const handleCandidatosSelecionados = (quantidade: number, quantidadesIndividuais: { geral: number; pcd: number; nna: number }, vagas: number) => {
    if (cargoSelecionado) {
      const cargoInfo = cargosDisponiveis.find(c => c.value === cargoSelecionado);
      if (cargoInfo) {
        const novoCargo: CargoAdicionado = {
          uuid: cargoSelecionado,
          nome: cargoInfo.label,
          vagas: vagas,
          geral: quantidadesIndividuais.geral,
          pcd: quantidadesIndividuais.pcd,
          nna: quantidadesIndividuais.nna,
          totalCandidatos: quantidade
        };
        
        // Verificar se o cargo já existe e atualizar ou adicionar
        setCargosAdicionados(prev => {
          const existeIndex = prev.findIndex(c => c.uuid === cargoSelecionado);
          let updated;
          if (existeIndex >= 0) {
            // Atualizar cargo existente
            updated = [...prev];
            updated[existeIndex] = novoCargo;
          } else {
            // Adicionar novo cargo
            updated = [...prev, novoCargo];
          }
          
          // Atualizar informações de vagas
          const novasVagasInfo = calcularVagasInfo(updated);
          setVagasInfo(novasVagasInfo);
          
          // Atualizar último cargo selecionado
          setUltimoCargoSelecionado(novoCargo);
          
          return updated;
        });
      }
    }
    
    // Limpar seleção e fechar modal
    setCargoSelecionado(undefined);
    setModalSelecionarCandidatosVisible(false);
  };

  const handleEditarCargo = (cargo: CargoAdicionado) => {
    // Definir o cargo para edição
    setCargoSelecionado(cargo.uuid);
    // Definir o último cargo selecionado como o cargo sendo editado
    setUltimoCargoSelecionado(cargo);
    setModalSelecionarCandidatosVisible(true);
  };

  const handleExcluirCargo = (cargoUuid: string) => {
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
    uuid
  };
};
