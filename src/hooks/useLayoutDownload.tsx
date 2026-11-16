import { useMutation } from "@tanstack/react-query";
import { API } from "../services";

export const useLayoutDownload = () => {
  const mutation = useMutation({
    mutationKey: ["layout-download"],
    mutationFn: async (tipo: string) => {
      const { response } = await API.ImportacaoDados.getLayoutDownload({ tipo });
      return response; // Blob retornado pelo backend
    },
    onError: (error) => {
      console.error("Erro ao baixar layout:", error);
    },
  });

  const handleBaixarArquivo = async (tipo: string) => {
    try {
      const response = await mutation.mutateAsync(tipo);
      
      if (!response) return;

      const url = window.URL.createObjectURL(response);
      const a = document.createElement("a");
      a.href = url;
      a.download = `layout_${tipo}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Falha ao salvar arquivo:", error);
    }
  };

  return {
    handleBaixarArquivo,
    isDownloading: mutation.isPending,
  };
};
