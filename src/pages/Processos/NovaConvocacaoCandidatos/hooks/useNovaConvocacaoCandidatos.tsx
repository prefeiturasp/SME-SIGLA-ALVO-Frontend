import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useConcursos } from "../../../../hooks/useConcursos";
import { usePostProcessoConvocacao } from "./usePostProcessoConvocacao";
import type { IPostProcessoConvocacaoPayload } from "../../../../services/resources/convocacao/IConvocacao";

type ConcursoOption = {
  value: string;
  label: string;
  cargos?: { value: string; label: string }[];
};

type FormFields = {
  concurso: string;
  tipo_escolha: string;
  descricao: string;
  cargo: string;
  data_convocacao: string;
  data_corte_vagas: string;
};

export const useNovaConvocacaoCandidatos = () => {
  const { concursosData, concursosOptionsIsLoading } = useConcursos();

  const defaultValues = {
    concurso: undefined,
    tipo_escolha: undefined,
    descricao: undefined,
    cargo: "",
    data_convocacao: "",
    data_corte_vagas: "",
  };

  const { control, reset, handleSubmit } = useForm<FormFields>({
    defaultValues,
  });

  // Mutation para post de processo de convocação (hook centralizado)
  const postProcessoConvocacaoMutation = usePostProcessoConvocacao();

  const watchFields = useWatch({ control });

  const isCargoLiberado = watchFields.concurso;
  const [cargosDisponiveis, setCargosDisponiveis] = useState<
    { value: string; label: string }[]
  >([]);
  const [cardData, setCardData] = useState({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  });
  const [cargoSelecionado, setCargoSelecionado] = useState<
    string | undefined
  >();
  const [podeVisualizarVagas, setPodeVisualizarVagas] = useState(false);

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

    setCargoSelecionado(undefined);
    setPodeVisualizarVagas(false);

    setCardData({
      vagas: 0,
      autorizacoes: 0,
      reservas: 0,
      convocar: 0,
    });
  };

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
    buscarCargosDoConcurso,
    handleSub,
    handleReset,
    setCardData,
    setCargoSelecionado,
    setPodeVisualizarVagas,
    
    // Mutation state
    postProcessoConvocacaoMutation,
  };
};
