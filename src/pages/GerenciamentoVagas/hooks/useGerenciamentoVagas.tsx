import { useEffect, useState } from "react";
// import { useProcessosConvocacaoOptions } from "../../Processos/ConvocacaoCandidatos/hooks/useProcessosConvocacaoOptions";
import useConvocacao from "../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import { useGetVagasEscolas } from "./useGetVagasEscolas";
import { useForm } from "react-hook-form";
import useListRequest from "../../../hooks/useListRequest";
import useGetImportacaoArquivosVagas from "./useGetImportacaoArquivosVagas";
import { usePostImportacaoArquivosVagas } from "./usePostImportacaoArquivosVagas";
import type { IImportacaoVagasForm, IImportacaoVagasPayload } from "./types";
import { useGetConcursoByUuid } from "./useGetConcursoPorUuid";
import type { IVaga } from "../../../services/resources/convocacao/IConvocacao";
import { usePatchVagasEscolasUtilizadas } from "./usePatchVagasEscolasUtilizadas";


export const useGerenciamentoVagas = () => {
  const defaultValues = {
    processo_convocacao: undefined,
    arquivo: null,
  };
  const [processoSelecionado, setProcessoSelecionado] = useState<string | undefined>();
  const [podeBuscarVagas, setPodeBuscarVagas] = useState<boolean>(false);
  const [uploadConcluido, setUploadConcluido] = useState<boolean>(false);
  const [cargoSelecionado, setCargoSelecionado] = useState<string | undefined>();
  const [concursoUuid, setConcursoUuid] = useState<string | undefined>();
  const [vagasEscolasData, setVagasEscolasData] = useState<IVaga[]>([]);
  const [vagasEditadas, setVagasEditadas] = useState<Record<string, { vagas_definitivas_extra?: number|string; vagas_precarias_extra?: number|string }>>({});
  const [selecionadas, setSelecionadas] = useState<IVaga[]>([]);
  const [selecionadasKeys, setSelecionadasKeys] = useState<string[]>([]);
  const { listRequest: paramsProcessosConvocacao } =
    useListRequest<{}>({
      pagination: { page: 1, page_size: 100 },
    });
  const {
    processosConvocacaoData,
    processosConvocacaoIsLoading
  } = useConvocacao(paramsProcessosConvocacao);
  const { concursoData, concursoIsLoading } = useGetConcursoByUuid(concursoUuid || "");
  const cargoCodigo = (concursoData?.cargos || []).find((c: any) => c.uuid === cargoSelecionado)?.codigo as string | undefined;
  const { 
    dadosVagasNasEscolas,
    dadosVagasNasEscolasRefetch,
    isLoadingVagasEscolas,
    isFetchingVagasEscolas,
  } = useGetVagasEscolas(processoSelecionado, podeBuscarVagas, cargoCodigo);
  const { listRequest,  onAntTableChange } =
    useListRequest({
      pagination: { page: 1, page_size: 10 },
    });
  const { importacoesArquivosData, importacoesArquivosIsLoading, importacoesArquivosRefetch } = useGetImportacaoArquivosVagas(listRequest);
  const postImportacaoArquivosVagasMutation = usePostImportacaoArquivosVagas({
    onSuccess: () => importacoesArquivosRefetch(),
  });
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<IImportacaoVagasForm>({
    defaultValues,
  });
  const optionsDres = dadosVagasNasEscolas?.dres.map((dre) => ({ value: dre.uuid, label: dre.nome }));
  const patchVagasEscolasUtilizadasMutation = usePatchVagasEscolasUtilizadas();
  
  // Atualiza tabela quando um novo GET completar
  useEffect(() => {
    if (!isFetchingVagasEscolas && Array.isArray(dadosVagasNasEscolas?.vagas)) {
      setVagasEscolasData(dadosVagasNasEscolas!.vagas as any);
    }
  }, [isFetchingVagasEscolas, dadosVagasNasEscolas]);
  
  const handleEnviarForm = async (data: IImportacaoVagasForm) => {
    const uuid = data.processo_convocacao!;
    const optionsArray: Array<{ value: string; label: string }> = Array.isArray(processosConvocacaoData) ? (processosConvocacaoData as any) : [];
    const label = optionsArray.find((o) => o?.value === uuid)?.label;

    const payload: IImportacaoVagasPayload = {
      processo_nome: label,
      processo_uuid: uuid,
      arquivo: data.arquivo!,
    };
    try {
      const result = await postImportacaoArquivosVagasMutation.mutateAsync(payload);
      console.log("Importação criada com sucesso:", result);
      setUploadConcluido(true);
      setValue("arquivo", null, { shouldValidate: true });
    } catch (error) {
      console.error("Erro ao criar importação:", error);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const handleSelectProcessoConvocacao = (value: string | undefined) => {
    setProcessoSelecionado(value);
    setPodeBuscarVagas(Boolean(value));
    const results = (processosConvocacaoData?.results ?? []) as any[];
    const found = results.find((item) => item?.uuid === value);
    setConcursoUuid(found?.concurso_uuid);
  }

  const handleFileUpload = (file: File) => {
    setValue("arquivo", file, { shouldValidate: true });
    clearErrors("arquivo");
  };

  const handleSelectCargo = (value: string | undefined) => {
    setCargoSelecionado(value);
  };

  const handleBuscarVagas = () => {
    if (!processoSelecionado) return;
    setPodeBuscarVagas(true);
    try {
      dadosVagasNasEscolasRefetch?.();
    } catch {}
    setVagasEscolasData(dadosVagasNasEscolas?.vagas || []);
  };

  const handleSalvar = () => {
    const currentById = new Map<string, IVaga>(
      vagasEscolasData.map((item) => [item.uuid, item]) as any
    );
    const selecionadasSet = new Set<string>(selecionadasKeys.length ? selecionadasKeys : selecionadas.map((s) => s.uuid));

    const vagasUtilizadas = vagasEscolasData.map((row) => {
      const current: any = currentById.get(row.uuid) || row;
      const isSelecionada = selecionadasSet.has(row.uuid);
      if (isSelecionada) {
        const precariasUtil = current.vagas_precarias_extra !== undefined && current.vagas_precarias_extra !== ""
          ? Number(current.vagas_precarias_extra)
          : Number(current.vagas_precarias_utilizadas || current.vagas_precarias || 0);
        const definitivasUtil = current.vagas_definitivas_extra !== undefined && current.vagas_definitivas_extra !== ""
          ? Number(current.vagas_definitivas_extra)
          : Number(current.vagas_definitivas_utilizadas || current.vagas_definitivas  || 0);
        return {
          uuid: current.uuid,
          foi_utilizada: true,
          vagas_precarias_utilizadas: precariasUtil,
          vagas_definitivas_utilizadas: definitivasUtil,
        };
      }
      return {
        uuid: row.uuid,
        foi_utilizada: false,
      };
    });
    patchVagasEscolasUtilizadasMutation.mutate(vagasUtilizadas);
  };

  // Form com os filtros da tabela
  const {
    control: controlFiltrar,
    reset: resetFiltrar,
    getValues: getValuesFiltrar,
    formState: { errors: formErrorsFiltrar },
  } = useForm({ defaultValues: { dre: "", escola: "" } });

  const handleFiltrar = () => {
    const { dre, escola } = getValuesFiltrar();
    const selectedDre = optionsDres?.find((opt) => opt.value === dre);
    const selectedDreLabel = selectedDre?.label || "";
    const escolaQuery = (escola || "").toString().trim().toLowerCase();
  
    const next = vagasEscolasData.filter((item) => {
      const matchDre = dre
        ? item.escola?.dre?.uuid === dre || item.escola?.dre?.nome === selectedDreLabel
        : true;
      const matchEscola = escolaQuery ? (item.escola.nome_oficial || "").toLowerCase().includes(escolaQuery) : true;
      return matchDre && matchEscola;
    });
  
    setVagasEscolasData(next);
  };
  

  const handleLimparFiltros = () => {
    resetFiltrar({ dre: "", escola: "" } as any);
    setVagasEscolasData(dadosVagasNasEscolas?.vagas || []);
  };

  return {
    processosConvocacaoData,
    processosConvocacaoIsLoading,
    processoSelecionado,
    podeBuscarVagas,
    dadosVagasNasEscolas,
    dadosVagasNasEscolasRefetch,
    isLoadingVagasEscolas,
    isFetchingVagasEscolas,
    handleSelectProcessoConvocacao: handleSelectProcessoConvocacao,
    handleEnviarForm,
    handleReset,
    handleFileUpload,
    handleSelectCargo,
    watch,
    importacoesArquivosData,
    importacoesArquivosIsLoading,
    onAntTableChange,
    control,
    handleSubmit,
    formErrors,
    uploadConcluido,
    concursoUuid,
    concursoData,
    concursoIsLoading,
    cargoSelecionado,
    optionsDres,
    vagasEscolasData,
    setVagasEscolasData,
    handleBuscarVagas,
    vagasEditadas,
    setVagasEditadas,
    selecionadas,
    setSelecionadas,
    selecionadasKeys,
    setSelecionadasKeys,
    handleSalvar,
    controlFiltrar,
    formErrorsFiltrar,
    handleFiltrar,
    handleLimparFiltros,
    // Lista com uuid e valores utilizados (extras ou base) para as linhas selecionadas
    vagasUtilizadas: selecionadas.map((row) => {
      const current: any = vagasEscolasData.find((x) => x.uuid === row.uuid) || row as any;
      const precariasUtil = current.vagas_precarias_extra !== undefined && current.vagas_precarias_extra !== ""
        ? Number(current.vagas_precarias_extra)
        : Number(current.vagas_precarias || 0);
      const definitivasUtil = current.vagas_definitivas_extra !== undefined && current.vagas_definitivas_extra !== ""
        ? Number(current.vagas_definitivas_extra)
        : Number(current.vagas_definitivas || 0);
      return {
        uuid: current.uuid,
        vagas_precarias_utilizadas: precariasUtil,
        vagas_definitivas_utilizadas: definitivasUtil,
      };
    }),
  };
};