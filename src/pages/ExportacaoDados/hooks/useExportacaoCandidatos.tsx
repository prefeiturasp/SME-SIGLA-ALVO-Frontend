import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import useConvocacao from "../../Processos/ConvocacaoCandidatos/hooks/useConvocacao";
import useListRequest from "../../../hooks/useListRequest";
import { API } from "../../../services";
import type {
  IExportacaoCandidatosListFilters,
  IExportacaoCandidatosPayload,
} from "../../../services/resources/exportacaoDados/types";

export interface IExportacaoCandidatosForm {
  processo_uuid: string | undefined;
  cargo_uuid: string | undefined;
}

const schema = yup.object({
  processo_uuid: yup.string().required("Processo de convocação é obrigatório"),
  cargo_uuid: yup.string().required("Cargo é obrigatório"),
});

export function useExportacaoCandidatos() {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  const defaultValues: IExportacaoCandidatosForm = {
    processo_uuid: undefined,
    cargo_uuid: undefined,
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IExportacaoCandidatosForm>({
    defaultValues,
    resolver: yupResolver(schema) as unknown as Resolver<IExportacaoCandidatosForm>,
    mode: "onChange",
  });

  const processoUuid = watch("processo_uuid");

  const { listRequest, onAntTableChange } = useListRequest<IExportacaoCandidatosListFilters>({
    pagination: { page: 1, page_size: 10 },
  });

  const { listRequest: paramsProcessosConvocacao } = useListRequest<Record<string, never>>({
    pagination: { page: 1, page_size: 100 },
  });

  const { processosConvocacaoData, processosConvocacaoIsLoading } =
    useConvocacao(paramsProcessosConvocacao);

  const processosOptions = useMemo(() => {
    if (!processosConvocacaoData?.results) return [];
    return processosConvocacaoData.results.map(
      (p: { uuid: string; descricao: string; concurso_uuid?: string; concurso_nome?: string }) => ({
        value: p.uuid,
        label: p.descricao,
        concurso_uuid: p.concurso_uuid,
        concurso_nome: p.concurso_nome,
      })
    );
  }, [processosConvocacaoData]);

  const { data: cargosData, isLoading: cargosLoading } = useQuery({
    queryKey: ["getCargosProcesso", processoUuid],
    queryFn: ({ signal }) =>
      processoUuid
        ? API.Convocacao.getCargosProcesso(processoUuid, { signal }).response
        : Promise.resolve([]),
    enabled: !!processoUuid,
    staleTime: 0,
  });

  const cargosOptions = useMemo(() => {
    if (!Array.isArray(cargosData)) return [];
    return cargosData.map(
      (c: { cargo_uuid: string; cargo_nome: string; cargo_codigo?: number }) => ({
        value: c.cargo_uuid,
        label: c.cargo_nome,
        cargo_codigo: c.cargo_codigo,
      })
    );
  }, [cargosData]);

  const { data: listData, isLoading: listLoading, refetch: listRefetch } = useQuery({
    queryKey: ["exportacaoCandidatosList", listRequest],
    queryFn: ({ signal }) =>
      API.ExportacaoDados.getListExportacaoCandidatosProcesso(listRequest, { signal }).response,
    staleTime: 0,
  });

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    const isTestEnv =
      typeof process !== "undefined" && process?.env?.NODE_ENV === "test";
    if (!isTestEnv) {
      a.click();
    }
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const createMutation = useMutation({
    mutationFn: (payload: IExportacaoCandidatosPayload) =>
      API.ExportacaoDados.postCreateExportacaoCandidatosProcesso(payload).response,
    onSuccess: ({ blob, filename }) => {
      queryClient.invalidateQueries({ queryKey: ["exportacaoCandidatosList"] });
      listRefetch();
      if (blob) {
        triggerDownload(blob, filename);
      }
      notification.success({
        message: "Exportação criada",
        description: "O arquivo está sendo baixado.",
        placement: "top",
        duration: 3.5,
      });
      reset(defaultValues);
      setValue("cargo_uuid", undefined);
    },
    onError: (error: { response?: { status?: number; data?: { detail?: string } } }) => {
      const status = error?.response?.status;
      let description = "Ocorreu um erro ao criar a exportação. Tente novamente.";
      if (status === 404) {
        description = "Processo ou cargo não encontrado.";
      } else if (status === 502) {
        description = "Serviço temporariamente indisponível. Tente novamente mais tarde.";
      } else if (error?.response?.data?.detail) {
        const d = error.response.data.detail;
        description = typeof d === "string" ? d : JSON.stringify(d);
      }
      notification.error({
        message: "Erro na exportação",
        description,
        placement: "top",
        duration: 4,
      });
    },
  });

  const handleExportar = (data: IExportacaoCandidatosForm) => {
    if (!data.processo_uuid || !data.cargo_uuid) return;
    const processoSelecionado = processosOptions.find((p) => p.value === data.processo_uuid);
    const processo_nome = processoSelecionado?.label;
    const concurso_uuid = processoSelecionado?.concurso_uuid;
    const concurso_nome = processoSelecionado?.concurso_nome;
    const cargoSelecionado = cargosOptions.find((c) => c.value === data.cargo_uuid);
    const cargo_nome = cargoSelecionado?.label;
    const cargo_codigo = cargoSelecionado?.cargo_codigo;
    const payload: IExportacaoCandidatosPayload = {
      processo_uuid: data.processo_uuid,
      cargo_uuid: data.cargo_uuid,
      ...(processo_nome && { processo_nome }),
      ...(cargo_nome && { cargo_nome }),
      ...(cargo_codigo != null && cargo_codigo !== undefined && { cargo_codigo }),
      ...(concurso_uuid && { concurso_uuid }),
      ...(concurso_nome && { concurso_nome }),
    };
    createMutation.mutate(payload);
  };

  const handleProcessoChange = (value: string | undefined) => {
    setValue("processo_uuid", value);
    setValue("cargo_uuid", undefined);
  };

  const handleDownload = async (uuid: string) => {
    try {
      const { blob, filename } =
        await API.ExportacaoDados.downloadExportacaoCandidatosProcesso(uuid).response;
      if (blob) triggerDownload(blob, filename);
    } catch (err: unknown) {
      const e = err as { response?: { data?: Blob | { detail?: string }; status?: number } };
      let msg = "Falha ao baixar o arquivo.";
      if (e?.response?.data instanceof Blob) {
        try {
          const text = await e.response.data.text();
          const j = JSON.parse(text) as { detail?: string };
          if (j?.detail) msg = j.detail;
        } catch {
          // ignore
        }
      } else if (
        e?.response?.data &&
        typeof e.response.data === "object" &&
        "detail" in e.response.data
      ) {
        const d = (e.response.data as { detail?: string }).detail;
        if (d) msg = d;
      }
      notification.error({
        message: "Erro no download",
        description: msg,
        placement: "top",
        duration: 4,
      });
    }
  };

  return {
    control,
    handleSubmit,
    formErrors,
    processosOptions,
    processosOptionsLoading: processosConvocacaoIsLoading,
    cargosOptions,
    cargosOptionsLoading: cargosLoading,
    processoUuid,
    handleProcessoChange,
    handleExportar,
    handleDownload,
    isCreating: createMutation.isPending,
    listData,
    listLoading,
    listRequest,
    onAntTableChange,
  };
}
