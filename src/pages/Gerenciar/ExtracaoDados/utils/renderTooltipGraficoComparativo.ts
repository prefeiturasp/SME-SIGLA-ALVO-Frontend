import type { DreComparativoResumo } from "./mapGraficosDre";
import {
  formatValorNumerico,
  formatValorPercentual,
  formatVariacaoTooltipGrafico,
} from "./formatValorIndicador";

type RenderTooltipGraficoComparativoParams = {
  dre?: string;
  resumo: DreComparativoResumo;
  tooltipLabel: string;
  variacao: number | null;
  valorAnoAntigo: number;
  valorAnoRecente: number;
  corAnoAntigo: string;
  corAnoRecente: string;
  estiloPrototipo?: boolean;
  exibirTituloDre?: boolean;
};

const renderMarcadorCircular = (cor: string) =>
  `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${cor};flex-shrink:0;"></span>`;

const renderPillVariacao = (variacao: number | null, estiloPrototipo: boolean) => {
  if (variacao === null) {
    return "";
  }

  const texto = estiloPrototipo
    ? formatVariacaoTooltipGrafico(variacao)
    : formatValorPercentual(variacao);
  const positivo = variacao >= 0;

  if (!estiloPrototipo && variacao === 0) {
    return "";
  }

  return `<div style="margin-top:${estiloPrototipo ? "4px" : "8px"};"><span style="display:inline-block;padding:${estiloPrototipo ? "4px 10px" : "2px 8px"};border-radius:999px;font-size:${estiloPrototipo ? "12px" : "11px"};font-weight:700;color:${positivo ? "#1e7e34" : "#c41e3a"};background:${positivo ? "#e6f4ea" : "#fce8e8"};">${texto}</span></div>`;
};

export const renderTooltipGraficoComparativo = ({
  dre,
  resumo,
  tooltipLabel,
  variacao,
  valorAnoAntigo,
  valorAnoRecente,
  corAnoAntigo,
  corAnoRecente,
  estiloPrototipo = false,
  exibirTituloDre = false,
}: RenderTooltipGraficoComparativoParams): string => {
  const marcadorAntigo = estiloPrototipo
    ? renderMarcadorCircular(corAnoAntigo)
    : `<span style="color:${corAnoAntigo}">●</span>`;
  const marcadorRecente = estiloPrototipo
    ? renderMarcadorCircular(corAnoRecente)
    : `<span style="color:${corAnoRecente}">●</span>`;
  const containerStyle = estiloPrototipo
    ? "padding:12px 16px;font-size:13px;color:#1c1d22;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.12);"
    : "padding:8px 12px;font-size:12px;color:#1c1d22;";
  const tituloDre =
    dre && exibirTituloDre
      ? `<div style="font-weight:600;margin-bottom:8px;color:#6b6f76;">${dre}:</div>`
      : "";
  const gapLinha = estiloPrototipo ? "8px" : "6px";
  const margemLinha = estiloPrototipo ? "margin-bottom:8px;" : "margin-bottom:4px;";

  return `<div style="${containerStyle}">
    ${tituloDre}
    <div style="display:flex;align-items:center;gap:${gapLinha};${margemLinha}">
      ${marcadorAntigo}
      <span>${resumo.anoAntigo}: <strong>${formatValorNumerico(valorAnoAntigo)} ${tooltipLabel}</strong></span>
    </div>
    <div style="display:flex;align-items:center;gap:${gapLinha};${estiloPrototipo ? "margin-bottom:4px;" : ""}">
      ${marcadorRecente}
      <span>${resumo.anoRecente}: <strong>${formatValorNumerico(valorAnoRecente)} ${tooltipLabel}</strong></span>
    </div>
    ${renderPillVariacao(variacao, estiloPrototipo)}
  </div>`;
};
