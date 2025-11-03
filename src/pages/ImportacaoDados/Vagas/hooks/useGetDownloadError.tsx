import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { API } from "../../../../services";

export const useGetDownloadError = () => {
  return useMutation({
    mutationFn: async (uuid: string) => {
      const blob = await API.ImportacaoDados.getErrosVagasDownload(uuid).response;
      return blob;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vagas_erros_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)}.txt`;
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
};

