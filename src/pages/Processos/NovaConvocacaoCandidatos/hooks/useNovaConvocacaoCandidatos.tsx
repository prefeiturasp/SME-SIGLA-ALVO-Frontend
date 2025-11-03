import { useMemo, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { useConcursos } from "../../../../hooks/useConcursos";
import { usePostProcessoConvocacao } from "./usePostProcessoConvocacao";
import type {
  IPostProcessoConvocacaoPayload,
  IProcessoConvocacao,
  IVagasResponse,
} from "../../../../services/resources/convocacao/IConvocacao";
import { useLocation, useParams } from "react-router-dom";
import { API } from "../../../../services";
import { useQuery } from "@tanstack/react-query";
import useListRequest from "../../../../hooks/useListRequest";
import type { IEscolhasFiltro } from "../../../../services/resources/escolhas/IEscolhas";
import type { ICardData } from "../components/Cargo";
import { yupResolver } from "@hookform/resolvers/yup";
import useConvocacaoCandidatosSchema from "./useConvocacaoCandidatosSchema";
import { useGetProcessosConvocacaoPorUUID } from "../../../CriarEditarConvocacao/SelecaoCargos/hooks/useGetProcessosConvocacaoPorUUID";
import { usePatchProcessoConvocacao } from "./usePatchProcessoConvocacao";

export type CargosDisponiveisOption = {
  value: string;
  label: string;
  codigo: string;
};

type ConcursoOption = {
  value: string;
  label: string;
  cargos?: CargosDisponiveisOption[];
};

export type FormFields = {
  concurso: string | undefined;
  tipo_escolha: string | undefined;
  descricao: string;
  cargo?: string;
  data_convocacao: string;
  data_corte_vagas: string;
};

export const useNovaConvocacaoCandidatos = () => {
  const location = useLocation();
  const editData = location.state?.editData as IProcessoConvocacao;
  const isViewMode = !!location.state?.isViewMode as boolean;
  const isEdit = !!editData;

  const { uuid } = useParams<{ uuid: string;}>();

  const defaultValues = {
    concurso: editData?.concurso_uuid || undefined,
    tipo_escolha: editData?.tipo_escolha || undefined,
    descricao: editData?.descricao || "",
    data_convocacao: editData?.data_convocacao || "",
    data_corte_vagas: editData?.data_corte_vagas || "",
  };

  const { processoConvocacaoData, processoConvocacaoIsLoading } = useGetProcessosConvocacaoPorUUID(uuid!);
  const { concursosData, concursosOptionsIsLoading } = useConcursos();

  const formValues = useMemo<FormFields>(() => ({
    concurso: processoConvocacaoData?.concurso_uuid ?? defaultValues.concurso,
    tipo_escolha: processoConvocacaoData?.tipo_escolha ?? defaultValues.tipo_escolha,
    descricao: processoConvocacaoData?.descricao ?? defaultValues.descricao,
    data_convocacao: processoConvocacaoData?.data_convocacao ?? defaultValues.data_convocacao,
    data_corte_vagas: processoConvocacaoData?.data_corte_vagas ?? defaultValues.data_corte_vagas,
  }), [processoConvocacaoData, defaultValues.concurso, defaultValues.tipo_escolha, defaultValues.descricao, defaultValues.data_convocacao, defaultValues.data_corte_vagas]);

  const { control, reset, handleSubmit, formState: { errors: formErrors } } = useForm<FormFields>({
    defaultValues: { ...defaultValues },
    values: formValues,
    resolver: yupResolver(useConvocacaoCandidatosSchema()) as Resolver<FormFields>,
  });

  const selectedConcursoValueForCargos = (useWatch({ control }).concurso ?? formValues.concurso);
  const derivedCargosDisponiveis = useMemo<CargosDisponiveisOption[]>(() => {
    const concursosArray = (concursosData as unknown as ConcursoOption[]) || [];
    const concursoSel = concursosArray.find((c) => c.value === selectedConcursoValueForCargos);
    return (concursoSel?.cargos as CargosDisponiveisOption[] | undefined) || [];
  }, [concursosData, selectedConcursoValueForCargos]);

  const postProcessoConvocacaoMutation = usePostProcessoConvocacao();

  const watchFields = useWatch({ control });

  const isCargoLiberado = watchFields.concurso;
  const [cargosDisponiveis, setCargosDisponiveis] = useState<
    CargosDisponiveisOption[]
  >([]);
  const [cardData, setCardData] = useState<ICardData>({
    vagas: 0,
    autorizacoes: 0,
    reservas: 0,
    convocar: 0,
  });
  const [cargoSelecionado, setCargoSelecionado] = useState<
    string | undefined
  >();
  const [podeVisualizarVagas, setPodeVisualizarVagas] = useState(isEdit);

  const popularSelectDeCargos = (concursoValue: string) => {

    const concursoSelecionado = (
      (concursosData as unknown as ConcursoOption[]) || []
    ).find((c: ConcursoOption) => c.value === concursoValue);

    if (concursoSelecionado && concursoSelecionado.cargos) {
      setCargosDisponiveis(concursoSelecionado.cargos);
    }

    setCardData({
      vagas: 0,
      autorizacoes: 0,
      reservas: 0,
      convocar: 0,
    });
 
    setCargoSelecionado(undefined);
    setPodeVisualizarVagas(false);
  };

  const handleSub = async (data: FormFields): Promise<IProcessoConvocacao|boolean> => {
    console.log("Processo de convocação ssss");

    if (
      !data.concurso ||
      !data.tipo_escolha ||
      !data.descricao ||
      !data.data_convocacao ||
      !data.data_corte_vagas
    ) {
      console.error("Todos os campos são obrigatórios");
      return false;
    }

    // Buscar dados do concurso selecionado
    const concursosArray = Array.isArray(concursosData)
      ? concursosData
      : concursosData?.results || [];
    const concursoSelecionado = concursosArray.find(
      (concurso: any) => concurso.value === data.concurso
    );

    if (!concursoSelecionado) {
      console.error("Concurso selecionado não encontrado");
      return false;
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
      return result;
    } catch (error) {
      console.error("Erro ao criar processo de convocação:", error);
      return false;
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
      (opt) => opt.value === watchFields.concurso
    )?.label || "";

  const selectedConcursoValue =
    ((concursosData as unknown as ConcursoOption[]) || []).find(
      (opt) => opt.value === watchFields.concurso
    )?.value || "";

  const selectedCargoLabel =
    (cargosDisponiveis || []).find((opt) => opt.value === watchFields.cargo)
      ?.label || "";

  const selectedCargoCodigo =
    (cargosDisponiveis || []).find((opt) => opt.value === watchFields.cargo)
      ?.codigo || "";

  // Verifica se houve edição em relação ao processo carregado
  const hasEdits = Boolean(processoConvocacaoData) && (
    (watchFields.concurso || "") !== (processoConvocacaoData?.concurso_uuid || "") ||
    (watchFields.tipo_escolha || "") !== (processoConvocacaoData?.tipo_escolha || "") ||
    (watchFields.descricao || "") !== (processoConvocacaoData?.descricao || "") ||
    (watchFields.data_convocacao || "") !== (processoConvocacaoData?.data_convocacao || "") ||
    (watchFields.data_corte_vagas || "") !== (processoConvocacaoData?.data_corte_vagas || "")
  );

  const { listRequest, setListRequest, onAntTableChange } =
    useListRequest<IEscolhasFiltro>({
      pagination: { page: 1, page_size: 10 },
    });

  const {
    data: dadosVagasNasEscolasPorCargo,
    refetch: dadosVagasNasEscolasPorCargoRefetch,
    isLoading,
  } = useQuery({
    queryKey: ["getDadosVagasNasEscolasPorCargo", listRequest],
    queryFn: ({ signal }) =>
      API.Escolhas.getVagasEscolas(
        { processo_uuid: editData?.uuid, cargo_codigo: selectedCargoCodigo },
        listRequest,
        { signal }
      ).response, //watchFields.cargo!
    enabled: false,
    staleTime: 0,
    retry: 0,
    select: (data: IVagasResponse) => ({
      ...data,
      vagas: (data?.vagas || []).map((vaga) => ({
        ...vaga,
        checked: true,
      })),
    }),
  });

  const buscarVagasNasEscolasPorCargo = () => {
    dadosVagasNasEscolasPorCargoRefetch().then((res) => {
      const { data } = res;
      setCardData((prev) => ({
        ...prev,
        vagas: data?.total_vagas || 0,
      }));
      setPodeVisualizarVagas((data?.total_vagas || 0) > 0);
    });
  };

  // Patch mutation para atualizar processo de convocação
  const patchProcessoConvocacaoMutation = usePatchProcessoConvocacao();

  // Atualiza o processo com os dados do formulário
  const patchProcessoFromForm = async (formData: FormFields) => {
    const concursosArray = Array.isArray(concursosData)
      ? (concursosData as unknown as ConcursoOption[])
      : ((concursosData as any)?.results || []) as ConcursoOption[];
    const concursoSel = concursosArray.find((c: any) => c.value === formData.concurso);
    const payload: Partial<IPostProcessoConvocacaoPayload> = {
      concurso_nome: (concursoSel as any)?.label,
      concurso_uuid: (concursoSel as any)?.value,
      tipo_escolha: formData.tipo_escolha,
      descricao: formData.descricao,
      data_convocacao: formData.data_convocacao,
      data_corte_vagas: formData.data_corte_vagas,
    };
    await patchProcessoConvocacaoMutation.mutateAsync({ uuid: (uuid || editData?.uuid)!, payload });
  };

  return {
    // Form controls
    control,
    reset,
    handleSubmit,
    watchFields,

    // Data
    concursosData: (concursosData as unknown as ConcursoOption[]) || [],
    concursosOptionsIsLoading,
    cargosDisponiveis: cargosDisponiveis.length ? cargosDisponiveis : derivedCargosDisponiveis,
    cardData,
    cargoSelecionado,
    podeVisualizarVagas,

    // Computed values
    isCargoLiberado,
    selectedConcursoLabel,
    selectedConcursoValue,
    selectedCargoLabel,

    // Actions
    popularSelectDeCargos,
    handleSub,
    handleReset,
    setCardData,
    setCargoSelecionado,
    setPodeVisualizarVagas,

    // Mutation editData
    postProcessoConvocacaoMutation,
    dadosVagasNasEscolasPorCargo,
    buscarVagasNasEscolasPorCargo,
    isEdit,
    isViewMode,
    formErrors,
    editData,
    uuid,
    processoConvocacaoData,
    hasEdits,
    patchProcessoConvocacaoMutation,
    patchProcessoFromForm
  };
};
