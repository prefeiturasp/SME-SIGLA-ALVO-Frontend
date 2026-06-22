import { useCallback, useState } from "react";
import type { RefObject } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// A4 em paisagem (landscape): largura e altura invertidas.
const A4_LARGURA_MM = 297;
const A4_ALTURA_MM = 210;
const MARGEM_MM = 10;
const CONTEUDO_LARGURA_MM = A4_LARGURA_MM - MARGEM_MM * 2;
const CONTEUDO_ALTURA_MM = A4_ALTURA_MM - MARGEM_MM * 2;

// JPEG reduz drasticamente o tamanho do PDF frente ao PNG (lossless), mantendo
// legibilidade aceitavel para um relatorio. A escala 1.5 preserva nitidez de
// impressao cortando ~44% dos pixels em relacao a 2.
const FORMATO_IMAGEM = "JPEG";
const QUALIDADE_JPEG = 0.8;
const ESCALA_CAPTURA = 1.5;

const aguardar = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Aguarda os graficos (@ant-design/charts) terminarem de desenhar no canvas.
 * Eles renderizam de forma assincrona, entao esperamos ate que todos os
 * `<canvas>` tenham dimensao valida ou um tempo limite ser atingido.
 */
const aguardarGraficosProntos = async (container: HTMLElement) => {
  const tentativasMaximas = 30;

  for (let tentativa = 0; tentativa < tentativasMaximas; tentativa += 1) {
    const canvases = Array.from(container.querySelectorAll("canvas"));
    const todosProntos =
      canvases.length > 0 &&
      canvases.every((canvas) => canvas.width > 0 && canvas.height > 0);

    if (todosProntos) {
      // Folego extra para a animacao das barras assentar antes da captura.
      await aguardar(300);
      return;
    }

    await aguardar(100);
  }
};

type ResultadoCaptura = {
  dataUrl: string;
  larguraPx: number;
  alturaPx: number;
};

/**
 * Captura um elemento como imagem. Para os cards de grafico, le o `<canvas>`
 * diretamente (toDataURL) porque o html2canvas frequentemente nao copia o
 * conteudo de canvas de terceiros, deixando a area do grafico em branco.
 */
const capturarSecao = async (
  elemento: HTMLElement
): Promise<ResultadoCaptura> => {
  const canvas = await html2canvas(elemento, {
    scale: ESCALA_CAPTURA,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  return {
    dataUrl: canvas.toDataURL("image/jpeg", QUALIDADE_JPEG),
    larguraPx: canvas.width,
    alturaPx: canvas.height,
  };
};

export const useExportarPdf = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportarPdf = useCallback(
    async (containerRef: RefObject<HTMLElement | null>) => {
      const container = containerRef.current;

      if (!container || isExporting) {
        return;
      }

      setIsExporting(true);

      try {
        await aguardarGraficosProntos(container);

        const secoes = Array.from(
          container.querySelectorAll<HTMLElement>("[data-pdf-section]")
        );

        if (secoes.length === 0) {
          return;
        }

        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        let cursorY = MARGEM_MM;

        for (const secao of secoes) {
          const { dataUrl, larguraPx, alturaPx } = await capturarSecao(secao);
          const alturaMm = (alturaPx * CONTEUDO_LARGURA_MM) / larguraPx;

          // Se a secao nao cabe no espaco restante da pagina, cria nova pagina.
          if (
            cursorY > MARGEM_MM &&
            cursorY + alturaMm > A4_ALTURA_MM - MARGEM_MM
          ) {
            doc.addPage();
            cursorY = MARGEM_MM;
          }

          // Secao mais alta que uma pagina inteira: fatia em paginas.
          if (alturaMm > CONTEUDO_ALTURA_MM) {
            const escala = CONTEUDO_LARGURA_MM / larguraPx;
            const paginaAlturaPx = CONTEUDO_ALTURA_MM / escala;
            let offsetPx = 0;

            while (offsetPx < alturaPx) {
              const fatiaAlturaPx = Math.min(
                paginaAlturaPx,
                alturaPx - offsetPx
              );

              const fatiaCanvas = document.createElement("canvas");
              fatiaCanvas.width = larguraPx;
              fatiaCanvas.height = fatiaAlturaPx;
              const ctx = fatiaCanvas.getContext("2d");

              if (ctx) {
                // JPEG nao tem transparencia: areas vazias virariam preto.
                // Preenchemos a fatia com branco antes de desenhar.
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
                  fatiaAlturaPx
                );
              }

              const fatiaAlturaMm = fatiaAlturaPx * escala;

              if (cursorY > MARGEM_MM) {
                doc.addPage();
                cursorY = MARGEM_MM;
              }

              doc.addImage(
                fatiaCanvas.toDataURL("image/jpeg", QUALIDADE_JPEG),
                FORMATO_IMAGEM,
                MARGEM_MM,
                cursorY,
                CONTEUDO_LARGURA_MM,
                fatiaAlturaMm,
                undefined,
                "FAST"
              );

              offsetPx += fatiaAlturaPx;

              if (offsetPx < alturaPx) {
                doc.addPage();
                cursorY = MARGEM_MM;
              } else {
                cursorY += fatiaAlturaMm + 6;
              }
            }

            continue;
          }

          doc.addImage(
            dataUrl,
            FORMATO_IMAGEM,
            MARGEM_MM,
            cursorY,
            CONTEUDO_LARGURA_MM,
            alturaMm,
            undefined,
            "FAST"
          );

          cursorY += alturaMm + 6;
        }

        const hoje = new Date().toISOString().slice(0, 10);
        doc.save(`extracao-dados-${hoje}.pdf`);
      } finally {
        setIsExporting(false);
      }
    },
    [isExporting]
  );

  return { exportarPdf, isExporting };
};

export default useExportarPdf;
