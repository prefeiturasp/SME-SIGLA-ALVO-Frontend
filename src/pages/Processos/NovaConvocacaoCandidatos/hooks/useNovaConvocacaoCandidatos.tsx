import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useConcursos } from "../../../../hooks/useConcursos";
import { usePostProcessoConvocacao } from "./usePostProcessoConvocacao";
import type { IPostProcessoConvocacaoPayload, IProcessoConvocacao } from "../../../../services/resources/convocacao/IConvocacao";
import { useLocation } from "react-router-dom";
import { API } from "../../../../services";
import { useQuery } from "@tanstack/react-query";
import useListRequest from "../../../../hooks/useListRequest";
import type { IEscolhasFiltro } from "../../../../services/resources/escolhas/IEscolhas";
import type { ICardData } from "../components/Cargo";

type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};

type FormFields = {
  concurso: string | undefined;
  tipo_escolha: string| undefined;
  descricao: string;
  cargo: string | undefined;
  data_convocacao: string;
  data_corte_vagas: string;
};

export const useNovaConvocacaoCandidatos = () => {

  const location = useLocation();
  const editData = location.state.editData as IProcessoConvocacao; 
  const isEdit = !!editData
   
  const initialDefaults = React.useMemo(() => {
    if (!isEdit) return undefined;
    return {      
      concurso: editData.concurso_uuid,
      tipo_escolha: editData.tipo_escolha,
      descricao: editData.descricao,
      data_convocacao: editData.data_convocacao || "",
      data_corte_vagas: editData?.data_corte_vagas || "",
    };
  }, [isEdit, editData]);


  const { concursosData, concursosOptionsIsLoading } = useConcursos();

  const defaultValues = {
    concurso: undefined,
    tipo_escolha: undefined,
    descricao: "",
    cargo: "",
    data_convocacao: "",
    data_corte_vagas: "",
  } as FormFields;

  const { control, reset, handleSubmit } = useForm<FormFields>({
    defaultValues: { ...defaultValues, ...(initialDefaults || {}) },
  });
  useEffect(() => {
    if (initialDefaults ) {//&& initialDefaults?.concurso
      buscarCargosDoConcurso(initialDefaults.concurso);  
     }
  }, [initialDefaults, reset]);

  // Mutation para post de processo de convocação (hook centralizado)
  const postProcessoConvocacaoMutation = usePostProcessoConvocacao();

  const watchFields = useWatch({ control });

  const isCargoLiberado = watchFields.concurso;
  const [cargosDisponiveis, setCargosDisponiveis] = useState<
    { value: string; label: string }[]
  >([]);
  const [cardData, setCardData] = useState<ICardData>({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  } );
  const [cargoSelecionado, setCargoSelecionado] = useState<
    string | undefined
  >();
  const [podeVisualizarVagas, setPodeVisualizarVagas] = useState(isEdit);




  const buscarCargosDoConcurso = (concursoValue: string) => {
    if (!concursoValue) {
      setCargosDisponiveis([]);
      return;
    }

    const concursoSelecionado = ((concursosData as unknown as ConcursoOption[]) || []).find(
      (c: ConcursoOption) => c.value === concursoValue,
    );

    if (concursoSelecionado && concursoSelecionado.cargos) {
      setCargosDisponiveis(concursoSelecionado.cargos);
    }
    
    setCardData({
      vagas: dadosVagasNasEscolasPorCargo?.total_vagas || 0,
      autorizacoes: 0,
      reservas: 0,
      convocar: 0,
    }); 
  }

  
  const buscarCargosDoConcursoDesabilitarCargoVagas = (concursoValue: string) => {
    buscarCargosDoConcurso(concursoValue);     
    setCargoSelecionado(undefined);
    setPodeVisualizarVagas(false);
  }

  const handleSub = async (data: FormFields) => {
    if (!data.concurso || !data.tipo_escolha || !data.descricao || !data.data_convocacao || !data.data_corte_vagas) {
      console.error("Todos os campos são obrigatórios");
      return;
    }

    // Buscar dados do concurso selecionado
    const concursosArray = Array.isArray(concursosData) ? concursosData : concursosData?.results || [];
    const concursoSelecionado = concursosArray.find((concurso: any) => concurso.value === data.concurso);

    if (!concursoSelecionado) {
      console.error("Concurso selecionado não encontrado");
      return;
    }

    const payload: IPostProcessoConvocacaoPayload = {
      concurso_nome: concursoSelecionado.label,
      concurso_uuid: concursoSelecionado.value,
      tipo_escolha: data.tipo_escolha,
      descricao: data.descricao,
      data_convocacao: data.data_convocacao,
      data_corte_vagas: data.data_corte_vagas,
    };

    try {
      const result = await postProcessoConvocacaoMutation.mutateAsync(payload);
      console.log("Processo de convocação criado com sucesso:", result);
      reset(defaultValues);
    } catch (error) {
      console.error("Erro ao criar processo de convocação:", error);
    }
  };

  const handleReset = () => {
    reset({
      concurso: "",
      tipo_escolha: "",
      descricao: "",
      cargo: "",
      data_convocacao: "",
      data_corte_vagas: "",
    });
    setCargoSelecionado(undefined);
    setCargosDisponiveis([]);
    setPodeVisualizarVagas(false);
  };

  // Labels selecionados para concurso e cargo
  const selectedConcursoLabel =
    ((concursosData as unknown as ConcursoOption[]) || []).find(
      (opt) => opt.value === watchFields.concurso,
    )?.label || "";

  const selectedCargoLabel =
    (cargosDisponiveis || []).find((opt) => opt.value === watchFields.cargo)?.label || "";


  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IEscolhasFiltro>({
      pagination: { page: 1, page_size: 10 },
    });

  const { data: dadosVagasNasEscolasPorCargo, refetch:buscarVagasNasEscolasPorCargo, isLoading } = useQuery({
    queryKey: ["getDadosVagasNasEscolasPorCargo",listRequest],
    queryFn: ({ signal }) =>
      API.Escolhas.getVagasEscolas({ concurso_uuid:editData?.uuid,cargo_codigo: '2020'},listRequest,{ signal }).response, //watchFields.cargo!
    enabled: !!editData?.uuid && !!watchFields.cargo,
    staleTime: 0,
    retry: 0,
  });
 

  return {
    // Form controls
    control,
    reset,
    handleSubmit,
    watchFields,
    
    // Data
    concursosData: (concursosData as unknown as ConcursoOption[]) || [],
    concursosOptionsIsLoading,
    cargosDisponiveis,
    cardData,
    cargoSelecionado,
    podeVisualizarVagas,
    
    // Computed values
    isCargoLiberado,
    selectedConcursoLabel,
    selectedCargoLabel,
    
    // Actions
    buscarCargosDoConcursoDesabilitarCargoVagas,
    handleSub,
    handleReset,
    setCardData,
    setCargoSelecionado,
    setPodeVisualizarVagas,
    
    // Mutation editData
    postProcessoConvocacaoMutation,
    dadosVagasNasEscolasPorCargo,
    buscarVagasNasEscolasPorCargo
  };
};
