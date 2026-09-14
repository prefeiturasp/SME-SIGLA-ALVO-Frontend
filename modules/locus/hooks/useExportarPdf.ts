import { useCallback, useState } from "react";
import type { RefObject } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const A4_LARGURA_MM = 210;
const A4_ALTURA_MM = 297;
const MARGEM_MM = 10;
const CONTEUDO_LARGURA_MM = A4_LARGURA_MM - MARGEM_MM * 2;
const CONTEUDO_ALTURA_MM = A4_ALTURA_MM - MARGEM_MM * 2;

const FORMATO_IMAGEM = "JPEG";
const QUALIDADE_JPEG = 0.8;
const ESCALA_CAPTURA = 1.5;

/** Captura um elemento DOM e baixa um PDF A4 (retrato), fatiando se necessario. */
export function useExportarPdf() {
  const [exportando, setExportando] = useState(false);

  const exportarPdf = useCallback(
    async (
      containerRef: RefObject<HTMLElement | null>,
      nomeArquivo = "relatorio",
    ) => {
      const container = containerRef.current;
      if (!container || exportando) return;

      setExportando(true);

      try {
        const canvas = await html2canvas(container, {
          scale: ESCALA_CAPTURA,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        const dataUrl = canvas.toDataURL("image/jpeg", QUALIDADE_JPEG);
        const larguraPx = canvas.width;
        const alturaPx = canvas.height;
        const alturaMm = (alturaPx * CONTEUDO_LARGURA_MM) / larguraPx;

        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        if (alturaMm <= CONTEUDO_ALTURA_MM) {
          doc.addImage(
            dataUrl,
            FORMATO_IMAGEM,
            MARGEM_MM,
            MARGEM_MM,
            CONTEUDO_LARGURA_MM,
            alturaMm,
            undefined,
            "FAST",
          );
        } else {
          const escala = CONTEUDO_LARGURA_MM / larguraPx;
          const paginaAlturaPx = CONTEUDO_ALTURA_MM / escala;
          let offsetPx = 0;

          while (offsetPx < alturaPx) {
            const fatiaAlturaPx = Math.min(paginaAlturaPx, alturaPx - offsetPx);
            const fatiaCanvas = document.createElement("canvas");
            fatiaCanvas.width = larguraPx;
            fatiaCanvas.height = fatiaAlturaPx;
            const ctx = fatiaCanvas.getContext("2d");

            if (ctx) {
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, larguraPx, fatiaAlturaPx);

              const img = new Image();
              img.src = dataUrl;
              await new Promise<void>((resolve) => {
                img.onload = () => resolve();
              });
              ctx.drawImage(
                img,
                0,
                offsetPx,
                larguraPx,
                fatiaAlturaPx,
                0,
                0,
                larguraPx,
                fatiaAlturaPx,
              );
            }

            doc.addImage(
              fatiaCanvas.toDataURL("image/jpeg", QUALIDADE_JPEG),
              FORMATO_IMAGEM,
              MARGEM_MM,
              MARGEM_MM,
              CONTEUDO_LARGURA_MM,
              fatiaAlturaPx * escala,
              undefined,
              "FAST",
            );

            offsetPx += fatiaAlturaPx;
            if (offsetPx < alturaPx) doc.addPage();
          }
        }

        const hoje = new Date().toISOString().slice(0, 10);
        doc.save(`${nomeArquivo}-${hoje}.pdf`);
      } finally {
        setExportando(false);
      }
    },
    [exportando],
  );

  return { exportarPdf, exportando };
}

export default useExportarPdf;
