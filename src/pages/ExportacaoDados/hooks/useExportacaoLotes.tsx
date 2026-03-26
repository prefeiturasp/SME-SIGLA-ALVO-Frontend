import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import dayjs from "dayjs";
import { useConcursos } from "../../../hooks/useConcursos";
import useListRequest from "../../../hooks/useListRequest";
import { API } from "../../../services";
import type {
  IExportacaoLoteListFilters,
  IExportacaoLotePayload,
} from "../../../services/resources/exportacaoDados/types";

export interface IExportacaoLotesForm {
  concurso_uuid: string | undefined;
  lote_uuid: string | undefined;
}

const schema = yup.object({
  concurso_uuid: yup.string().required("Concurso é obrigatório"),
  lote_uuid: yup.string().required("Lote é obrigatório"),
});

export function useExportacaoLotes() {
  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  const defaultValues: IExportacaoLotesForm = {
    concurso_uuid: undefined,
    lote_uuid: undefined,
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors: formErrors },
  } = useForm<IExportacaoLotesForm>({
    defaultValues,
    resolver: yupResolver(schema) as unknown as Resolver<IExportacaoLotesForm>,
    mode: "onChange",
  });

  const concursoUuid = watch("concurso_uuid");

  const { listRequest, onAntTableChange } = useListRequest<IExportacaoLoteListFilters>({
    pagination: { page: 1, page_size: 10 },
  });

  const { concursosData, concursosOptionsIsLoading } = useConcursos();

  const concursosOptions = useMemo(() => {
    const list = Array.isArray(concursosData)
      ? concursosData
      : (concursosData as any)?.results ?? [];
    return list.map((c: { value: string; label: string }) => ({
      value: c.value,
      label: c.label,
    }));
  }, [concursosData]);

  const { data: lotesData, isLoading: lotesLoading } = useQuery({
    queryKey: ["getLotes", concursoUuid],
    queryFn: ({ signal }) =>
      concursoUuid
        ? API.Candidatos.getLotes(concursoUuid, { signal }).response
        : Promise.resolve([]),
    enabled: !!concursoUuid,
    staleTime: 0,
  });

  const lotesOptions = useMemo(() => {
    if (!Array.isArray(lotesData)) return [];
    return lotesData.map((l) => ({
      value: l.uuid,
      label: dayjs(l.criado_em).format("DD/MM/YYYY HH:mm"),
    }));
  }, [lotesData]);

  const { data: listData, isLoading: listLoading, refetch: listRefetch } = useQuery({
    queryKey: ["exportacaoLoteList", listRequest],
    queryFn: ({ signal }) =>
      API.ExportacaoDados.getListExportacaoLote(listRequest, { signal }).response,
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
    mutationFn: (payload: IExportacaoLotePayload) =>
      API.ExportacaoDados.postCreateExportacaoLote(payload).response,
    onSuccess: ({ blob, filename, status }) => {
      triggerDownload(blob, filename);
      if (status === 422) {
        notification.info({
          message: "Exportação incompleta",
          description:
            "Alguns candidatos não realizaram escolha. Verifique o arquivo baixado com a lista de pendências.",
          placement: "top",
          duration: 5,
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["exportacaoLoteList"] });
        listRefetch();
        notification.success({
          message: "Exportação criada",
          description: "O arquivo está sendo baixado.",
          placement: "top",
          duration: 3.5,
        });
        reset(defaultValues);
        setValue("lote_uuid", undefined);
      }
    },
    onError: (error: { response?: { status?: number; data?: Blob | { detail?: string } } }) => {
      const status = error?.response?.status;
      let description = "Ocorreu um erro ao criar a exportação. Tente novamente.";
      if (status === 404) {
        description = "Lote ou concurso não encontrado.";
      } else if (status === 502) {
        description = "Serviço temporariamente indisponível. Tente novamente mais tarde.";
      } else if (error?.response?.data instanceof Blob) {
        // tratado de forma assíncrona abaixo
      } else if (
        error?.response?.data &&
        typeof error.response.data === "object" &&
        "detail" in error.response.data
      ) {
        const d = (error.response.data as { detail?: string }).detail;
        if (d) description = typeof d === "string" ? d : JSON.stringify(d);
      }
      notification.error({
        message: "Erro na exportação",
        description,
        placement: "top",
        duration: 4,
      });
    },
  });

  const handleExportar = (data: IExportacaoLotesForm) => {
    if (!data.concurso_uuid || !data.lote_uuid) return;
    const concursoSelecionado = concursosOptions.find((c) => c.value === data.concurso_uuid);
    const payload: IExportacaoLotePayload = {
      concurso_uuid: data.concurso_uuid,
      lote_uuid: data.lote_uuid,
      ...(concursoSelecionado?.label && { concurso_nome: concursoSelecionado.label }),
    };
    createMutation.mutate(payload);
  };

  const handleConcursoChange = (value: string | undefined) => {
    setValue("concurso_uuid", value);
    setValue("lote_uuid", undefined);
  };

  const handleDownload = async (uuid: string) => {
    try {
      const { blob, filename } = await API.ExportacaoDados.downloadExportacaoLote(uuid).response;
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
    concursosOptions,
    concursosOptionsLoading: concursosOptionsIsLoading,
    lotesOptions,
    lotesOptionsLoading: lotesLoading,
    concursoUuid,
    handleConcursoChange,
    handleExportar,
    handleDownload,
    isCreating: createMutation.isPending,
    listData,
    listLoading,
    listRequest,
    onAntTableChange,
  };
}
