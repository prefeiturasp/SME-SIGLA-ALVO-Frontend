import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { API } from "../../../services";

export enum TipoImportacao {
  VAGAS = "VAGAS",
  HABILITADOS = "HABILITADOS",
}

interface UseGetDownloadErrorReturn {
  handleDownload: (uuid: string) => void;
  isDownloading: boolean;
}

export const useGetDownloadError = (
  tipo: TipoImportacao
): UseGetDownloadErrorReturn => {
  const downloadMutation = useMutation({
    mutationFn: async (uuid: string) => {
      const blob =
        tipo === TipoImportacao.VAGAS
          ? await API.ImportacaoDados.getErrosVagasDownload(uuid).response
          : await API.ImportacaoDados.getErrosHabilitadosDownload(uuid).response;
      return blob;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const fileNamePrefix =
        tipo === TipoImportacao.VAGAS ? "vagas_erros_" : "habilitados_erros_";
      a.download = `${fileNamePrefix}${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5)}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      message.success("Arquivo baixado com sucesso!");
    },
    onError: () => {
      message.error("Erro ao baixar arquivo");
    },
  });

  const handleDownload = (uuid: string) => {
    downloadMutation.mutate(uuid);
  };

  return {
    handleDownload,
    isDownloading: downloadMutation.isPending,
  };
};

