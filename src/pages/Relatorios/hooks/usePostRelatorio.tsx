import { useMutation } from "@tanstack/react-query";
import { API } from "../../../services";
import type { FormatoRelatorio, IRelatorioPayload } from "../../../services/resources/relatorios/IRelatorios";

type MutationVars = {
  payload: IRelatorioPayload;
  formato?: FormatoRelatorio;
};

export const usePostRelatorio = () => {
  const mutation = useMutation<unknown, unknown, MutationVars>({
    mutationFn: async ({ payload, formato }) => {
      const fmt = typeof formato === "string" ? formato.toLowerCase() : undefined;
      const shouldBeBlob =
        fmt === "pdf" || fmt === "xls" || fmt === "xlsx" || fmt === "csv" || fmt === "docx" || fmt === "doc";
      const axiosConfig = shouldBeBlob ? ({ responseType: "blob" } as const) : undefined;
      return await API.Relatorios.postRelatorio(payload, formato, axiosConfig).response;
    },
  });

  return {
    postRelatorio: async (payload: IRelatorioPayload, formato?: FormatoRelatorio) =>
      await mutation.mutateAsync({ payload, formato }),
    isPostingRelatorio: mutation.isPending,
    postRelatorioError: mutation.error,
  };
};


